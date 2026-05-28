export const config = { runtime: "edge" };

const UBER_AUTH_URL = "https://login.uber.com/oauth/v2/token";
const UBER_API_BASE = "https://sandbox-api.uber.com/v1/customers";

const PICKUP_ADDRESS = "371 chemin des Prés, 06410 Biot, France";
const PICKUP_NAME = "Breakfast Time";
const PICKUP_PHONE = process.env.BREAKFAST_PHONE || "+33600000000";

async function getUberToken(): Promise<string> {
  const res = await fetch(UBER_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.UBER_CLIENT_ID!,
      client_secret: process.env.UBER_CLIENT_SECRET!,
      scope: "eats.deliveries",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth Uber failed: ${err}`);
  }

  const data: any = await res.json();
  return data.access_token;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { order } = await req.json();

    const token = await getUberToken();
    const customerId = process.env.UBER_CUSTOMER_ID;

    // Calcul heure de pickup (30 min avant livraison)
    const deliveryDateTime = new Date(`${order.date}T${order.heure}:00`);
    const pickupDateTime = new Date(deliveryDateTime.getTime() - 30 * 60 * 1000);

    const dropoffAddress = `${order.adresse}, ${order.codePostal} ${order.ville}, France`;

    const manifestItems = order.items.map((item: any) => ({
      name: item.name,
      quantity: item.qty,
      size: "small",
      price: Math.round(
        parseFloat(item.price.replace("€", "").replace(",", ".")) * 100
      ),
    }));

    const payload = {
      pickup_address: PICKUP_ADDRESS,
      pickup_name: PICKUP_NAME,
      pickup_phone_number: PICKUP_PHONE,
      pickup_ready_dt: pickupDateTime.toISOString(),
      pickup_deadline_dt: deliveryDateTime.toISOString(),
      dropoff_address: dropoffAddress,
      dropoff_name: `${order.prenom} ${order.nom}`,
      dropoff_phone_number: order.telephone,
      dropoff_notes: order.note || "",
      dropoff_ready_dt: deliveryDateTime.toISOString(),
      dropoff_deadline_dt: new Date(
        deliveryDateTime.getTime() + 30 * 60 * 1000
      ).toISOString(),
      manifest_total_value: Math.round(order.total * 100),
      manifest_items: manifestItems,
    };

    const res = await fetch(`${UBER_API_BASE}/${customerId}/deliveries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json();

    if (!res.ok) {
      throw new Error(data.message || JSON.stringify(data));
    }

    return new Response(
      JSON.stringify({
        delivery_id: data.id,
        tracking_url: data.tracking_url,
        status: data.status,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Uber Direct error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
