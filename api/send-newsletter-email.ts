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

    if (dbError && dbError.code !== "23505") {
      // 23505 = unique_violation (déjà inscrit), on laisse passer
      console.error("DB error:", dbError);
      return new Response(JSON.stringify({ error: "Erreur base de données" }), { status: 500 });
    }

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: email,
      subject: "Bienvenue dans la famille Breakfast Time !",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3a3a0a; padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
            <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #DFF057;">Breakfast Time</p>
            <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: normal;">Bonjour et bienvenue !</h1>
            <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.6);">Votre inscription est confirmée</p>
          </div>
          <div style="padding: 40px; background: #ffffff;">
            <p style="font-size: 16px; color: #3a3a0a; line-height: 1.7; margin: 0 0 20px 0;">
              Merci de rejoindre la communauté Breakfast Time ! Vous serez parmi les premiers informés de :
            </p>
            <div style="background: #f9f9f4; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #3a3a0a;">🥐 <strong>Nos nouvelles créations</strong> — viennoiseries et formules inédites</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #3a3a0a;">🎁 <strong>Offres exclusives</strong> — promotions réservées à nos abonnés</p>
              <p style="margin: 0; font-size: 14px; color: #3a3a0a;">📅 <strong>Nos événements</strong> — brunchs privatisés et pop-ups</p>
            </div>
            <div style="border-left: 4px solid #DFF057; padding-left: 16px; margin-bottom: 32px;">
              <p style="margin: 0; font-size: 15px; color: #3a3a0a; line-height: 1.6; font-style: italic;">
                "Le petit-déjeuner, c'est le repas qui donne le ton de toute une journée. Chez Breakfast Time, on le prend très au sérieux."
              </p>
            </div>
            <div style="text-align: center;">
              <a href="https://breakfast-time.fr" style="display: inline-block; background-color: #DFF057; color: #3a3a0a; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 32px; border-radius: 50px;">
                Découvrir notre carte →
              </a>
            </div>
          </div>
          <div style="background-color: #3a3a0a; padding: 24px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">© 2026 Breakfast Time · Tous droits réservés</p>
          </div>
        </div>
      `,
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
