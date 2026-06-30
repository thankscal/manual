
export default {
  async fetch(request, env) {
    return new Response(JSON.stringify({
      test: env.TEST || null,
      hasToken: !!env.MANUAL_TOKEN
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
