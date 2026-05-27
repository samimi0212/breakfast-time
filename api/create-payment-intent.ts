import Stripe from "stripe";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(
      JSON.stringify({ error: "Stripe non configuré — clé secrète manquante" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Montant invalide" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // @ts-ignore
    const stripe = new Stripe(secretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      payment_method_types: ["card"],
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
