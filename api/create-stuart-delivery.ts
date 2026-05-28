export const config = { runtime: "edge" };

const STUART_AUTH_URL = "https://api.sandbox.stuart.com/oauth/token";
const STUART_API_BASE = "https://api.sandbox.stuart.com/v2";

const PICKUP_ADDRESS = "371 chemin des Prés, 06410 Biot, France";
const PICKUP_PHONE = "+33626154730";
const PICKUP_NAME = "Breakfast Time";

async function getStuartToken(): Promise<string> {
  const clientId = process.env.STUART_CLIENT_ID!;
  const clientSecret = process.env.STUART_CLIENT_SECRET!;
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch(STUART_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth Stuart échouée: ${err}`);
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

    const token = await getStuartToken();

    const dropoffAddress = `${order.adresse}, ${order.codePostal} ${order.ville}, France`;

    const payload = {
      job: {
        pickups: [
          {
            address: PICKUP_ADDRESS,
            comment: "Commande Breakfast Time — prête pour récupération",
            contact: {
              firstname: "Breakfast",
              lastname: "Time",
              phone: PICKUP_PHONE,
            },
          },
        ],
        dropoffs: [
          {
            address: dropoffAddress,
            comment: order.note || "",
            contact: {
              firstname: order.prenom,
              lastname: order.nom,
              phone: order.telephone,
            },
            package_type: "small",
            package_description: `Commande Breakfast Time — ${order.items.map((i: any) => `${i.qty}x ${i.name}`).join(", ")}`,
          },
        ],
      },
    };

    const res = await fetch(`${STUART_API_BASE}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json();

    if (!res.ok) {
      throw new Error(data.message || JSON.stringify(data));
    }

    return new Response(
      JSON.stringify({
        job_id: data.id,
        tracking_url: data.deliveries?.[0]?.tracking_url || "",
        status: data.status,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Stuart error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
