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
          <td style="padding:12px 0;border-bottom:1px solid #f0ece2;vertical-align:top;">
            <span style="font-size:14px;font-weight:700;color:#2a2a08;">${item.name}</span>${
          item.options && Object.keys(item.options).length > 0
            ? `<br><span style="font-size:12px;color:#aaa;margin-top:2px;display:inline-block;">${Object.values(item.options).flatMap((v: any) => Array.isArray(v) ? v : [v]).join(", ")}</span>`
            : ""
        }
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ece2;text-align:center;vertical-align:top;">
            <span style="font-size:13px;color:#999;background:#f5f3ee;padding:2px 8px;border-radius:20px;">×${item.qty}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #f0ece2;text-align:right;vertical-align:top;">
            <span style="font-size:14px;font-weight:700;color:#2a2a08;">${(parseFloat(item.price.replace("€", "").replace(",", ".")) * item.qty).toFixed(2).replace(".", ",")}€</span>
          </td>
        </tr>`
      )
      .join("");

    const dateStr = new Date(order.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

    const emailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Commande confirmée — Breakfast Time</title>
</head>
<body style="margin:0;padding:0;background-color:#f2ede4;font-family:Arial,Helvetica,sans-serif;">

  <div style="max-width:600px;margin:0 auto;padding:28px 16px 44px;">

    <!-- Card principale -->
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.07);">

      <!-- Barre dégradé top -->
      <div style="height:5px;background:linear-gradient(90deg,#3a3a0a 0%,#DFF057 100%);"></div>

      <!-- Header -->
      <div style="padding:36px 40px 28px;text-align:center;">
        <div style="display:inline-block;background:#DFF057;color:#3a3a0a;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;padding:5px 18px;border-radius:50px;margin-bottom:22px;">
          Commande confirmée
        </div>
        <div style="width:68px;height:68px;background:#3a3a0a;border-radius:50%;margin:0 auto 18px;line-height:68px;text-align:center;font-size:30px;color:#DFF057;">
          ✓
        </div>
        <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#2a2a08;line-height:1.2;">Merci ${order.prenom} !</h1>
        <p style="margin:0;font-size:15px;color:#7a7a50;line-height:1.6;">Votre commande est confirmée et en cours de préparation.</p>
      </div>

      <!-- Bloc livraison -->
      <div style="margin:0 32px 24px;">
        <div style="background:#f9f7f0;border-radius:14px;padding:20px 24px;">
          <p style="margin:0 0 14px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#aaa;font-weight:700;">Livraison prévue</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="28" valign="top" style="font-size:20px;padding-top:1px;">📅</td>
              <td style="font-size:15px;font-weight:700;color:#2a2a08;padding-bottom:10px;">${dateStr} à ${order.heure}</td>
            </tr>
            <tr>
              <td width="28" valign="top" style="font-size:18px;padding-top:2px;">📍</td>
              <td style="font-size:14px;color:#666;">${order.adresse}, ${order.codePostal} ${order.ville}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Séparateur -->
      <div style="height:1px;background:#f0ece2;margin:0 32px 24px;"></div>

      <!-- Récapitulatif -->
      <div style="margin:0 32px 8px;">
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#aaa;font-weight:700;">Votre commande</p>
      </div>
      <div style="margin:0 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${itemsHtml}
        </table>
        <!-- Frais + total -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
          <tr>
            <td style="font-size:13px;color:#bbb;padding-bottom:6px;">Frais de livraison</td>
            <td style="font-size:13px;color:#bbb;text-align:right;padding-bottom:6px;">${Number(order.fraisLivraison ?? 0).toFixed(2).replace(".", ",")}€</td>
          </tr>
          <tr>
            <td style="border-top:2px solid #f0ece2;padding-top:12px;font-size:17px;font-weight:700;color:#2a2a08;">Total</td>
            <td style="border-top:2px solid #f0ece2;padding-top:12px;font-size:17px;font-weight:700;color:#2a2a08;text-align:right;">${Number(order.total).toFixed(2).replace(".", ",")}€</td>
          </tr>
        </table>
      </div>

      ${order.note ? `
      <!-- Note -->
      <div style="margin:0 32px 20px;padding:14px 18px;border-left:4px solid #DFF057;background:#f9f7f0;border-radius:0 10px 10px 0;">
        <p style="margin:0;font-size:13px;color:#666;">📝 <strong>Note :</strong> ${order.note}</p>
      </div>` : ""}

      ${order.trackingUrl ? `
      <!-- CTA suivi -->
      <div style="text-align:center;padding:8px 32px 28px;">
        <a href="${order.trackingUrl}" style="display:inline-block;background:#DFF057;color:#2a2a08;text-decoration:none;font-weight:700;font-size:14px;padding:15px 36px;border-radius:50px;letter-spacing:0.2px;">
          🚴 Suivre ma livraison →
        </a>
      </div>` : `<div style="height:8px;"></div>`}

      <!-- Séparateur -->
      <div style="height:1px;background:#f0ece2;margin:0 32px 20px;"></div>

      <!-- Contact -->
      <div style="padding:0 40px 28px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#bbb;">
          Une question ? <a href="mailto:contact@breakfast-time.fr" style="color:#3a3a0a;font-weight:600;text-decoration:none;">contact@breakfast-time.fr</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#3a3a0a;border-radius:16px;padding:22px 32px;margin-top:14px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.3px;">© 2026 Breakfast Time — Livraison dans les Alpes-Maritimes</p>
    </div>

  </div>
</body>
</html>`;

    // Email au client + copie en BCC pour Breakfast Time
    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: order.email,
      bcc: "deborah.catalano@gmail.com",
      subject: `Commande confirmée — livraison le ${new Date(order.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à ${order.heure}`,
      html: emailHtml,
    });

    // Email interne
    // Calcul pickup et livraison estimée
    const fmt = (d: Date) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    let pickupTime: Date;
    let deliveryTime: Date;
    if (order.isMaintenant) {
      pickupTime = new Date(Date.now() + 15 * 60000);
      deliveryTime = new Date(Date.now() + 45 * 60000);
    } else {
      const [y, mo, d] = order.date.split("-").map(Number);
      const [h, mi] = order.heure.split(":").map(Number);
      deliveryTime = new Date(y, mo - 1, d, h, mi);
      pickupTime = new Date(deliveryTime.getTime() - 40 * 60000);
    }

    await resend.emails.send({
      from: "Breakfast Time <noreply@immo-score.fr>",
      to: "deborah.catalano@gmail.com",
      subject: `Nouvelle commande — ${order.prenom} ${order.nom} — ${Number(order.total).toFixed(2)}€`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3a3a0a;">Nouvelle commande reçue</h2>
          <p><strong>Client :</strong> ${order.prenom} ${order.nom}</p>
          <p><strong>Email :</strong> ${order.email}</p>
          <p><strong>Téléphone :</strong> ${order.telephone}</p>
          <p><strong>Livraison :</strong> ${new Date(order.date).toLocaleDateString("fr-FR")} à ${order.heure}</p>
          <p><strong>Adresse :</strong> ${order.adresse}, ${order.codePostal} ${order.ville}</p>
          <div style="background:#f0f7e0; border-left:4px solid #6b7c2d; padding:10px 14px; border-radius:0 8px 8px 0; margin:12px 0;">
            <p style="margin:0 0 4px 0;">🚴 <strong>Stuart récupère à :</strong> ${fmt(pickupTime)}</p>
            <p style="margin:0;">📦 <strong>Livraison estimée :</strong> ${fmt(deliveryTime)}</p>
          </div>
          ${order.note ? `<p><strong>Note :</strong> ${order.note}</p>` : ""}
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #e0e0d0;">
          <h3 style="margin: 0 0 8px 0; color: #3a3a0a;">Détail de la commande</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${itemsHtml}
          </table>
          <p style="margin-top: 12px;"><strong>Frais de livraison :</strong> ${Number(order.fraisLivraison ?? 0).toFixed(2)}€</p>
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
