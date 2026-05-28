import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { prenom, email } = await req.json();

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a0a;">
        <div style="background-color: #3a3a0a; padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
          <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #DFF057;">Breakfast Time</p>
          <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: normal;">Bienvenue chez nous 🥐</h1>
        </div>

        <div style="padding: 40px; background: #ffffff;">
          <p style="font-size: 16px; margin: 0 0 16px 0;">Bonjour <strong>${prenom}</strong>,</p>
          <p style="font-size: 15px; color: #444; margin: 0 0 16px 0; line-height: 1.6;">
            Votre compte Breakfast Time a bien été créé. Nous sommes ravis de vous accueillir !
          </p>
          <p style="font-size: 15px; color: #444; margin: 0 0 32px 0; line-height: 1.6;">
            Vous pouvez dès maintenant passer votre première commande et vous faire livrer votre petit-déjeuner directement chez vous, en 30-45 minutes.
          </p>

          <div style="text-align: center;">
            <a href="https://breakfast-bliss-reimagined-5iu9dgwwa.vercel.app/carte"
              style="display: inline-block; background-color: #DFF057; color: #3a3a0a; text-decoration: none; font-weight: bold; font-size: 15px; padding: 16px 36px; border-radius: 50px;">
              Découvrir la carte →
            </a>
          </div>
        </div>

        <div style="background-color: #3a3a0a; padding: 24px; text-align: center; border-radius: 0 0 16px 16px;">
          <p style="margin: 0 0 4px 0; font-size: 13px; color: rgba(255,255,255,0.7);">Une question ? Contactez-nous</p>
          <p style="margin: 0; font-size: 13px; color: #DFF057;">contact@breakfast-time.fr</p>
        </div>
      </div>`;

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: email,
      subject: `Bienvenue chez Breakfast Time, ${prenom} ! 🥐`,
      html: emailHtml,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Welcome email error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
