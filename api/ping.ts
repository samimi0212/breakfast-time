export default async function handler(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ ok: true, env: !!process.env.STRIPE_SECRET_KEY }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
