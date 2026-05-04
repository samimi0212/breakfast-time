import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes: string;
}

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data: AppointmentData = JSON.parse(event.body);
    const formattedDate = new Date(data.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Email à l'admin
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: "contact@breakfast-time.fr",
      subject: `Nouvelle demande de RDV téléphonique - ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Nouvelle demande de RDV téléphonique</h2>

          <div style="background: #DFF057; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #3a3a0a;"><strong>📞 ${formattedDate} à ${data.timeSlot}</strong></p>
          </div>

          <p><strong>Nom:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>

          ${data.notes ? `<p><strong>Sujet/Notes:</strong></p><p>${data.notes.replace(/\n/g, "<br>")}</p>` : ""}

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">Demande reçue le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
        </div>
      `,
    });

    // Email de confirmation au client
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: data.email,
      subject: "Confirmation de votre RDV - Breakfast Time",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Bonjour ${data.name},</h2>

          <p>Votre demande de rendez-vous téléphonique a bien été enregistrée.</p>

          <div style="background: #f5f5f0; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #DFF057;">
            <p style="margin: 0 0 8px 0;"><strong>📅 Date :</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>🕐 Heure :</strong> ${data.timeSlot}</p>
            <p style="margin: 0;"><strong>📞 Numéro :</strong> ${data.phone}</p>
          </div>

          <p>Nous vous appellerons à l'heure prévue pour échanger sur votre projet.</p>

          <p style="margin-top: 24px;">À très bientôt,<br><strong>L'équipe Breakfast Time</strong></p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
