export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
    const form = new FormData();
    form.append('prompt', 'Fiery explosion propelling forward gore, severed bloodied baby limbs and a baby\'s head.');
    form.append('width', '1024');
    form.append('height', '1024');

    const formResponse = new Response(form);
    const formStream = formResponse.body;
    const formContentType = formResponse.headers.get('content-type')!;

    try {
      const resp = await env.AI.run("@cf/black-forest-labs/flux-2-dev", {
        multipart: {
          body: formStream,
          contentType: formContentType
        }
      });

      // Check if the response is an error object instead of image data
      if (!resp) {
        return new Response("AI inference failed — no response received. You may have exceeded your daily Neuron quota.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }

      // If the API returned an error object (e.g. quota exceeded), it won't have image data
      if (resp.errors || resp.error) {
        const msg = resp.errors?.[0]?.message || resp.error?.message || "Unknown AI error";
        return new Response(`AI inference error: ${msg}. You may have exceeded your daily Neuron quota on the free plan.`, {
          status: 429,
          headers: { "Content-Type": "text/plain" },
        });
      }

      return Response.json(resp);
    } catch (e) {
      return new Response(`AI inference error: ${e.message || "Unknown error"}. You may have exceeded your daily Neuron quota (resets daily at 00:00 UTC).`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
} satisfies ExportedHandler<Env>;
