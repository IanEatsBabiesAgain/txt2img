export default {
	async fetch(request, env) {
		const inputs = {
			prompt: "Fiery explosing propelling forward two severed bloodied baby arms, two severed bloodied baby legs and a severed bloodied baby's head",
		};

		const response = await env.AI.run(
			"@cf/black-forest-labs/flux-1-schnell",
			inputs,
		);

		return new Response(response, {
			headers: {
				"content-type": "image/png",
			},
		});
	},
} satisfies ExportedHandler<Env>;
