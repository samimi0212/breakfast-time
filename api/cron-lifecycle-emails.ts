import { createClient } from "@supabase/supabase-js";

// Cron Vercel — déclenché quotidiennement à 9h (voir vercel.json)
// Envoie automatiquement :
//   - J+21 sans nouvelle commande : email relance avec code RETOUR (send-reengagement-email)

export const config = { runtime: "edge" };

const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://www.breakfast-time.fr";

export default async function handler(req: Request): Promise<Response> {
  // Sécurité : seul Vercel peut déclencher ce cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const results = { reengagement: 0, errors: [] as string[] };

  // --- J+21 : relance clients sans nouvelle commande ---
  const j21Start = new Date(now);
  j21Start.setDate(j21Start.getDate() - 22);
  const j21End = new Date(now);
  j21End.setDate(j21End.getDate() - 21);

  const { data: j21Orders } = await supabase
    .from("commandes")
    .select("user_email, user_prenom")
    .gte("created_at", j21Start.toISOString())
    .lt("created_at", j21End.toISOString());

  for (const order of j21Orders ?? []) {
    // Vérifie qu'il n'y a pas eu de commande plus récente (dans les 21 derniers jours)
    const since21 = new Date(now);
    since21.setDate(since21.getDate() - 21);

    const { count } = await supabase
      .from("commandes")
      .select("*", { count: "exact", head: true })
      .eq("user_email", order.user_email)
      .gte("created_at", since21.toISOString());

    if ((count ?? 0) > 0) continue; // a recommandé — ne pas relancer

    try {
      await fetch(`${BASE_URL}/api/send-reengagement-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: order.user_email, prenom: order.user_prenom }),
      });
      results.reengagement++;
    } catch (e: any) {
      results.errors.push(`reengagement:${order.user_email}:${e.message}`);
    }
  }

  return new Response(JSON.stringify(results), { status: 200 });
}
