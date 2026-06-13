import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { nom, email, message } = await req.json();

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: "deborah.catalano@gmail.com",
      replyTo: email,
      subject: `Message de ${nom} via le site`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <p style="background:#f9f9f4; padding:16px; border-radius:8px; border-left:4px solid #DFF057;">${message.replace(/\n/g, "<br>")}</p>
          <p style="color:#999; font-size:12px; margin-top:24px;">Répondre directement à cet email pour contacter ${nom}.</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
