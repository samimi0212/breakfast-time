import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { order } = await req.json();

    const itemsHtml = order.items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0e8;">
            <strong>${item.name}</strong>${
          item.options && Object.keys(item.options).length > 0
            ? `<br><span style="font-size:12px;color:#999;">${Object.values(item.options).flatMap((v: any) => Array.isArray(v) ? v : [v]).join(", ")}</span>`
            : ""
        }
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0e8; text-align:center;">x${item.qty}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0e8; text-align:right; font-weight:bold; color:#6b7c2d;">
            ${(parseFloat(item.price.replace("€", "").replace(",", ".")) * item.qty).toFixed(2).replace(".", ",")}€
          </td>
        </tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a0a;">
        <div style="background-color: #3a3a0a; padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
          <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #DFF057;">Breakfast Time</p>
          <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: normal;">Commande confirmée !</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.6);">Merci pour votre commande 🎉</p>
        </div>

        <div style="padding: 40px; background: #ffffff;">
          <p style="font-size: 16px; margin: 0 0 24px 0;">Bonjour <strong>${order.prenom}</strong>, votre commande a bien été reçue et est en cours de préparation.</p>

          <div style="background: #f9f9f4; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 4px 0; font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Livraison prévue</p>
            <p style="margin: 0; font-size: 16px; font-weight: bold;">📅 ${new Date(order.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${order.heure}</p>
            <p style="margin: 6px 0 0 0; font-size: 14px; color: #666;">📍 ${order.adresse}, ${order.codePostal} ${order.ville}</p>
          </div>

          <h3 style="margin: 0 0 12px 0; font-size: 15px;">Récapitulatif</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            ${itemsHtml}
          </table>

          <div style="text-align: right; padding-top: 12px; border-top: 2px solid #3a3a0a;">
            <span style="font-size: 18px; font-weight: bold; color: #3a3a0a;">Total : ${Number(order.total).toFixed(2).replace(".", ",")}€</span>
          </div>

          ${order.note ? `<div style="margin-top: 20px; padding: 14px; border-left: 4px solid #DFF057; background: #f9f9f4; border-radius: 0 8px 8px 0;"><p style="margin:0; font-size:13px; color:#666;">📝 Note : ${order.note}</p></div>` : ""}

          ${order.trackingUrl ? `
          <div style="margin-top: 24px; text-align: center;">
            <a href="${order.trackingUrl}" style="display: inline-block; background-color: #DFF057; color: #3a3a0a; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 32px; border-radius: 50px;">
              🚴 Suivre ma livraison en temps réel →
            </a>
          </div>` : ""}
        </div>

        <div style="background-color: #3a3a0a; padding: 24px; text-align: center; border-radius: 0 0 16px 16px;">
          <p style="margin: 0 0 4px 0; font-size: 13px; color: rgba(255,255,255,0.7);">Une question ? Contactez-nous</p>
          <p style="margin: 0; font-size: 13px; color: #DFF057;">contact@breakfast-time.fr</p>
        </div>
      </div>`;

    // Email au client
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: order.email,
      subject: `Commande confirmée — livraison le ${new Date(order.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à ${order.heure}`,
      html: emailHtml,
    });

    // Email interne
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: "contact@breakfast-time.fr",
      subject: `Nouvelle commande — ${order.prenom} ${order.nom} — ${Number(order.total).toFixed(2)}€`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Nouvelle commande reçue</h2>
          <p><strong>Client :</strong> ${order.prenom} ${order.nom}</p>
          <p><strong>Email :</strong> ${order.email}</p>
          <p><strong>Téléphone :</strong> ${order.telephone}</p>
          <p><strong>Livraison :</strong> ${new Date(order.date).toLocaleDateString("fr-FR")} à ${order.heure}</p>
          <p><strong>Adresse :</strong> ${order.adresse}, ${order.codePostal} ${order.ville}</p>
          ${order.note ? `<p><strong>Note :</strong> ${order.note}</p>` : ""}
          <p><strong>Total :</strong> ${Number(order.total).toFixed(2)}€</p>
          <p><strong>Stripe ID :</strong> ${order.stripeId}</p>
        </div>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Order email error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
