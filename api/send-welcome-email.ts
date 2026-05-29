import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { prenom, email } = await req.json();

    const emailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue chez Breakfast Time</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1ea; font-family: Georgia, 'Times New Roman', serif;">

  <div style="max-width:600px; margin:0 auto; padding: 24px 16px 40px;">

    <!-- Header -->
    <div style="background-color:#ffffff; border-radius:16px 16px 0 0; padding: 28px 40px 20px; text-align:center; border-bottom: 1px solid #f0ece2;">
      <img src="https://breakfast-time.fr/logo.png"
           alt="Breakfast Time"
           width="160"
           style="height:auto; display:inline-block;" />
    </div>

    <!-- Main card -->
    <div style="background:#ffffff; border-radius: 0 0 20px 20px; padding: 40px 40px 36px; box-shadow: 0 8px 40px rgba(0,0,0,0.08);">

      <!-- Badge -->
      <div style="text-align:center; margin-bottom:24px;">
        <span style="display:inline-block; background-color:rgba(223,240,87,0.25); color:#5a5a1a; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family: Arial, sans-serif; font-weight:600; padding:6px 16px; border-radius:50px;">
          Bienvenue
        </span>
      </div>

      <!-- Title -->
      <h1 style="margin:0 0 12px; font-size:30px; font-weight:700; color:#2a2a08; text-align:center; line-height:1.25;">
        Bonjour <span style="color:#7a7020; font-style:italic;">${prenom}</span> !
      </h1>
      <p style="margin:0 0 28px; font-size:16px; color:#5a5a40; text-align:center; line-height:1.7; font-family: Arial, sans-serif;">
        Votre compte est créé — Félicitations ! Dès à présent vous allez vivre vos matins autrement.
      </p>

      <!-- Divider -->
      <div style="border-top:1px solid #f0ece2; margin:0 0 28px;"></div>

      <!-- Features -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td width="33%" style="text-align:center; padding: 0 8px;">
            <div style="font-size:26px; margin-bottom:8px;">🥐</div>
            <p style="margin:0; font-size:13px; color:#3a3a0a; font-weight:700; font-family: Arial, sans-serif;">Produits frais</p>
            <p style="margin:4px 0 0; font-size:12px; color:#888; font-family: Arial, sans-serif;">Préparés le matin</p>
          </td>
          <td width="33%" style="text-align:center; padding: 0 8px; border-left:1px solid #f0ece2; border-right:1px solid #f0ece2;">
            <div style="font-size:26px; margin-bottom:8px;">⚡</div>
            <p style="margin:0; font-size:13px; color:#3a3a0a; font-weight:700; font-family: Arial, sans-serif;">Livraison rapide</p>
            <p style="margin:4px 0 0; font-size:12px; color:#888; font-family: Arial, sans-serif;">30–45 minutes</p>
          </td>
          <td width="33%" style="text-align:center; padding: 0 8px;">
            <div style="font-size:26px; margin-bottom:8px;">📅</div>
            <p style="margin:0; font-size:13px; color:#3a3a0a; font-weight:700; font-family: Arial, sans-serif;">7j/7</p>
            <p style="margin:4px 0 0; font-size:12px; color:#888; font-family: Arial, sans-serif;">De 7h à 15h</p>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <div style="text-align:center; margin-bottom:32px;">
        <a href="https://breakfast-time.fr/carte"
           style="display:inline-block; background-color:#DFF057; color:#3a3a0a; text-decoration:none; font-weight:700; font-size:15px; padding:16px 44px; border-radius:50px; font-family: Arial, sans-serif; letter-spacing:0.3px;">
          Voir la carte &amp; commander →
        </a>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid #f0ece2; margin:0 0 24px;"></div>

      <!-- Zone info -->
      <p style="margin:0; font-size:13px; color:#999; text-align:center; font-family: Arial, sans-serif; line-height:1.6;">
        📍 Livraison dans les <strong style="color:#5a5a40;">Alpes-Maritimes</strong> — Vérifiez l'éligibilité de votre adresse directement sur le site.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#3a3a0a; border-radius:20px; padding:32px 40px; margin-top:16px; text-align:center;">
      <p style="margin:0 0 6px; font-size:13px; color:rgba(255,255,255,0.6); font-family: Arial, sans-serif;">
        Une question ? Contactez-nous
      </p>
      <a href="https://breakfast-time.fr/contact"
         style="color:#DFF057; font-size:13px; text-decoration:none; font-family: Arial, sans-serif;">
        breakfast-time.fr/contact
      </a>
      <p style="margin:20px 0 0; font-size:11px; color:rgba(255,255,255,0.25); font-family: Arial, sans-serif;">
        © 2026 Breakfast Time — Alpes-Maritimes
      </p>
    </div>

  </div>
</body>
</html>`;

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
