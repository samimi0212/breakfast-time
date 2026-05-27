import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

interface EventFormData {
  eventType: "mariage" | "entreprise" | "groupe";
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
}

const eventTypeLabels = {
  mariage: "Brunch Mariage",
  entreprise: "Brunch Entreprise",
  groupe: "Brunch Groupe",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const data: EventFormData = await req.json();

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: "contact@breakfast-time.fr",
      subject: `Nouvelle demande de devis - ${eventTypeLabels[data.eventType]}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3a3a0a; margin-bottom: 20px;">Nouvelle demande de devis</h2>
          <p><strong>Type d'événement:</strong> ${eventTypeLabels[data.eventType]}</p>
          <p><strong>Nom:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          <p><strong>Date souhaitée:</strong> ${new Date(data.eventDate).toLocaleDateString("fr-FR")}</p>
          <p><strong>Nombre de convives:</strong> ${data.guestCount}</p>
          ${data.message ? `<p><strong>Message:</strong></p><p>${data.message.replace(/\n/g, "<br>")}</p>` : ""}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">Reçu le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: data.email,
      subject: "Votre demande de devis - Breakfast Time",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Merci ${data.name} !</h2>
          <p>Nous avons bien reçu votre demande de devis pour un <strong>${eventTypeLabels[data.eventType]}</strong>.</p>
          <ul style="color: #666;">
            <li>Nombre de convives : ${data.guestCount}</li>
            <li>Date souhaitée : ${new Date(data.eventDate).toLocaleDateString("fr-FR")}</li>
            <li>Téléphone : ${data.phone}</li>
          </ul>
          <p style="margin-top: 30px;">Nous vous recontacterons dans les 24h pour affiner votre devis.</p>
          <p style="margin-top: 30px; color: #999; font-size: 12px;">À bientôt,<br>L'équipe Breakfast Time</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
  }
}
