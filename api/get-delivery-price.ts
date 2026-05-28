export const config = { runtime: "edge" };

// Coordonnées du point de pickup : 371 chemin des Prés, 06410 Biot
const PICKUP_LAT = 43.6186;
const PICKUP_LNG = 7.0897;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDeliveryPrice(distanceKm: number): number | null {
  if (distanceKm < 5) return 7.50;
  if (distanceKm < 10) return 12.50;
  if (distanceKm < 15) return 17;
  return null; // hors zone
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { address } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const res = await fetch(geocodeUrl);
    const data: any = await res.json();

    if (data.status !== "OK" || !data.results?.[0]) {
      return new Response(JSON.stringify({ error: "Adresse introuvable" }), { status: 400 });
    }

    const { lat, lng } = data.results[0].geometry.location;
    const distance = haversineDistance(PICKUP_LAT, PICKUP_LNG, lat, lng);
    const price = getDeliveryPrice(distance);

    if (price === null) {
      return new Response(JSON.stringify({
        deliverable: false,
        message: "Cette adresse est hors de notre zone de livraison (max 15 km)",
      }), { status: 200 });
    }

    return new Response(JSON.stringify({
      deliverable: true,
      price,
      distance: Math.round(distance * 10) / 10,
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
