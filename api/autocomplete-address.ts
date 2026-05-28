export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const { input } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey!,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["fr"],
        languageCode: "fr",
      }),
    });

    const data: any = await res.json();

    const predictions = (data.suggestions || []).map((s: any) => ({
      description: s.placePrediction?.text?.text || "",
      place_id: s.placePrediction?.placeId || "",
    })).filter((p: any) => p.place_id);

    return new Response(JSON.stringify({ predictions, _debug: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
