export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const { place_id } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=address_components&language=fr&key=${apiKey}`;

    const res = await fetch(url);
    const data: any = await res.json();

    const components = data.result?.address_components || [];
    const get = (type: string) => components.find((c: any) => c.types.includes(type))?.long_name || "";

    const streetNumber = get("street_number");
    const route = get("route");
    const city = get("locality") || get("administrative_area_level_2");
    const postalCode = get("postal_code");

    return new Response(JSON.stringify({
      adresse: `${streetNumber} ${route}`.trim(),
      ville: city,
      codePostal: postalCode,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
