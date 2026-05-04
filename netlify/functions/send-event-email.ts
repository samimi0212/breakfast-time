import { Resend } from "resend";

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

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data: EventFormData = JSON.parse(event.body);

    // Email à l'admin
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
          <p style="font-size: 12px; color: #999;">Cette demande a été reçue le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
        </div>
      `,
    });

    // Email de confirmation au client
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: data.email,
      subject: "Votre demande de devis - Breakfast Time",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DFF057;">Merci ${data.name} !</h2>

          <p>Nous avons bien reçu votre demande de devis pour un <strong>${eventTypeLabels[data.eventType]}</strong>.</p>

          <p>Voici un résumé de votre demande :</p>
          <ul style="color: #666;">
            <li>Nombre de convives : ${data.guestCount}</li>
            <li>Date souhaitée : ${new Date(data.eventDate).toLocaleDateString("fr-FR")}</li>
            <li>Téléphone : ${data.phone}</li>
          </ul>

          <p style="margin-top: 30px;">Nous vous recontacterons dans les 24h pour affiner votre devis et répondre à toutes vos questions.</p>

          <p style="margin-top: 30px; color: #999; font-size: 12px;">À bientôt,<br>L'équipe Breakfast Time</p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
