
export default {
  async fetch(request, env) {
    return new Response(
      JSON.stringify({
        hasToken: !!env.MANUAL_TOKEN
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
