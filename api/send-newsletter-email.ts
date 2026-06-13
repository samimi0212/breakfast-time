import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Adresse email invalide" }), { status: 400 });
    }

    // Sauvegarde en base — ignore les doublons silencieusement
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email })
      .select();

    if (dbError) {
      if (dbError.code === "23505") {
        // Email déjà inscrit
        return new Response(JSON.stringify({ error: "already_subscribed" }), { status: 409 });
      }
      console.error("DB error:", dbError);
      return new Response(JSON.stringify({ error: "Erreur base de données" }), { status: 500 });
    }

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: email,
      subject: "Bienvenue chez Breakfast Time ☀️",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f2ede4;font-family:Arial,Helvetica,sans-serif;">

  <div style="max-width:580px;margin:0 auto;padding:32px 16px 48px;">

    <!-- Logo flamme -->
    <div style="text-align:center;margin-bottom:28px;">
      <img src="data:image/png;base64,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" alt="Breakfast Time" width="52" style="display:inline-block;height:auto;" />
    </div>

    <!-- Card principale -->
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

      <!-- Bande couleur top -->
      <div style="height:5px;background:linear-gradient(90deg,#3a3a0a,#DFF057);"></div>

      <!-- Contenu -->
      <div style="padding:44px 40px 40px;">

        <!-- Badge confirmation -->
        <div style="text-align:center;margin-bottom:28px;">
          <span style="display:inline-block;background:#f2ede4;color:#3a3a0a;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;padding:7px 18px;border-radius:50px;">
            Inscription confirmée
          </span>
        </div>

        <!-- Titre -->
        <h1 style="margin:0 0 14px;text-align:center;font-size:36px;font-weight:400;font-style:italic;color:#1e1e06;line-height:1.2;font-family:'DM Serif Display',Georgia,serif;">
          Bienvenue ☀️
        </h1>
        <p style="margin:0 0 36px;text-align:center;font-size:16px;color:#6b6b4a;line-height:1.6;">
          Vous êtes en avant-première sur tout ce qu'on prépare.
        </p>

        <!-- Séparateur -->
        <div style="border-top:1px solid #eee8da;margin-bottom:32px;"></div>

        <!-- 3 avantages -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
          <tr>
            <td style="padding:10px 0;vertical-align:top;width:40px;font-size:22px;">🥐</td>
            <td style="padding:10px 0 10px 12px;vertical-align:top;border-bottom:1px solid #f5f0e8;">
              <span style="font-size:14px;font-weight:700;color:#1e1e06;">Nouveautés en avant-première</span><br/>
              <span style="font-size:13px;color:#9a9478;">Nouvelles créations, menus du moment</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;vertical-align:top;font-size:22px;">🎁</td>
            <td style="padding:10px 0 10px 12px;vertical-align:top;border-bottom:1px solid #f5f0e8;">
              <span style="font-size:14px;font-weight:700;color:#1e1e06;">Offres exclusives abonnés</span><br/>
              <span style="font-size:13px;color:#9a9478;">Promotions et surprises réservées</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;vertical-align:top;font-size:22px;">📍</td>
            <td style="padding:10px 0 10px 12px;vertical-align:top;">
              <span style="font-size:14px;font-weight:700;color:#1e1e06;">Événements & pop-ups</span><br/>
              <span style="font-size:13px;color:#9a9478;">Brunchs privatisés, collaborations</span>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <div style="text-align:center;">
          <a href="https://www.breakfast-time.fr/carte"
             style="display:inline-block;background-color:#DFF057;color:#1e1e06;text-decoration:none;font-weight:800;font-size:15px;padding:16px 40px;border-radius:50px;letter-spacing:0.2px;">
            Voir la carte →
          </a>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#b0a98a;line-height:1.7;">
        Livraison 7j/7 · 8h–15h · Alpes-Maritimes<br/>
        <span style="color:#c8c0a4;">© 2026 Breakfast Time</span>
      </p>
    </div>

  </div>
</body>
</html>`,
    });

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: "contact@breakfast-time.fr",
      subject: `Nouvelle inscription newsletter — ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Nouvelle inscription newsletter</h2>
          <p><strong>Email :</strong> ${email}</p>
          <p style="font-size: 12px; color: #999;">Inscription le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Newsletter error:", error);
    return new Response(JSON.stringify({ error: "Échec de l'inscription" }), { status: 500 });
  }
}
