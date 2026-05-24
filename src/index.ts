export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
    const form = new FormData();
    form.append('prompt', '"Fiery explosing propelling forward two severed bloodied baby arms, two severed bloodied baby legs and a severed bloodied baby's head"');
    form.append('width', '1024');
    form.append('height', '1024');

    // FormData doesn't expose its serialized body or boundary. Passing it to a
    // Request (or Response) constructor serializes it and generates the Content-Type
    // header with the boundary, which is required for the server to parse the multipart fields.
    const formResponse = new Response(form);
    const formStream = formResponse.body;
    const formContentType = formResponse.headers.get('content-type')!;

    const resp = await env.AI.run("@cf/black-forest-labs/flux-2-dev", {
      multipart: {
        body: formStream,
        contentType: formContentType
      }
    });

    return Response.json(resp);
  },
} satisfies ExportedHandler<Env>;
