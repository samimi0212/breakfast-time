import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Adresse email invalide" }), { status: 400 });
    }

    // Email de bienvenue au subscriber
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: email,
      subject: "Bienvenue dans la famille Breakfast Time ☀️",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f0; font-family: 'Georgia', serif;">

          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background-color: #3a3a0a; padding: 48px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #DFF057; font-family: sans-serif;">Breakfast Time</p>
              <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: normal; line-height: 1.3;">
                Bonjour et bienvenue !
              </h1>
              <p style="margin: 16px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.6); font-family: sans-serif;">
                Votre inscription à notre newsletter est confirmée ☀️
              </p>
            </div>

            <!-- Contenu principal -->
            <div style="padding: 48px 40px;">

              <p style="font-size: 16px; color: #3a3a0a; line-height: 1.7; margin: 0 0 20px 0;">
                Merci de rejoindre la communauté Breakfast Time ! Nous sommes ravis de vous avoir parmi nos abonnés.
              </p>

              <p style="font-size: 16px; color: #3a3a0a; line-height: 1.7; margin: 0 0 32px 0;">
                Grâce à cette newsletter, vous serez les premiers informés de :
              </p>

              <!-- Liste des avantages -->
              <div style="background-color: #f9f9f4; border-radius: 16px; padding: 28px 32px; margin-bottom: 32px;">
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; font-size: 15px; color: #3a3a0a; line-height: 1.6; font-family: sans-serif;">
                    🥐 <strong>Nos nouvelles créations</strong> — viennoiseries du moment, formules inédites et éditions limitées
                  </p>
                </div>
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; font-size: 15px; color: #3a3a0a; line-height: 1.6; font-family: sans-serif;">
                    🎁 <strong>Offres exclusives</strong> — promotions et avantages réservés à nos abonnés
                  </p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 15px; color: #3a3a0a; line-height: 1.6; font-family: sans-serif;">
                    📅 <strong>Nos événements</strong> — brunchs privatisés, pop-ups et nouveautés à venir
                  </p>
                </div>
              </div>

              <!-- Citation -->
              <div style="border-left: 4px solid #DFF057; padding-left: 20px; margin-bottom: 36px;">
                <p style="margin: 0; font-size: 17px; color: #3a3a0a; line-height: 1.6; font-style: italic;">
                  "Le petit-déjeuner, c'est le repas qui donne le ton de toute une journée. Chez Breakfast Time, on le prend très au sérieux."
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin-bottom: 8px;">
                <a
                  href="https://breakfast-time.fr"
                  style="display: inline-block; background-color: #DFF057; color: #3a3a0a; text-decoration: none; font-weight: bold; font-size: 15px; padding: 16px 36px; border-radius: 50px; font-family: sans-serif; letter-spacing: 0.5px;"
                >
                  Découvrir notre carte →
                </a>
              </div>

            </div>

            <!-- Footer email -->
            <div style="background-color: #3a3a0a; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(255,255,255,0.7); font-family: sans-serif; line-height: 1.6;">
                Vous recevez cet email car vous vous êtes inscrit(e) à la newsletter Breakfast Time.
              </p>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); font-family: sans-serif;">
                © 2026 Breakfast Time · Tous droits réservés
              </p>
            </div>

          </div>

        </body>
        </html>
      `,
    });

    // Notification à l'admin
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
