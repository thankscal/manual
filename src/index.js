
export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://thankscal.github.io",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {

      const body = await request.json();

      const githubResponse = await fetch(
        `https://api.github.com/repos/${body.owner}/${body.repo}/actions/workflows/${body.workflow_file}/dispatches`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.MANUAL_TOKEN}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "manual-proxy"
          },
          body: JSON.stringify({
            ref: body.branch,
            inputs: {
              data: JSON.stringify(body.data)
            }
          })
        }
      );

      if (!githubResponse.ok) {
        const errorText = await githubResponse.text();

        return new Response(
          JSON.stringify({
            success: false,
            error: errorText
          }),
          {
            status: githubResponse.status,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (err) {

      return new Response(
        JSON.stringify({
          success: false,
          error: err.message
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    }
  }
};
