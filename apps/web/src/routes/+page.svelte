<script lang="ts">
	import { FragCanvas } from 'fragkit';

	const fragmentWgsl = `
fn edge(a: vec2f, b: vec2f, p: vec2f) -> f32 {
	return (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
}

fn barycentric(p: vec2f, v0: vec2f, v1: vec2f, v2: vec2f) -> vec3f {
	let area = edge(v0, v1, v2);
	let w0 = edge(v1, v2, p) / area;
	let w1 = edge(v2, v0, p) / area;
	let w2 = edge(v0, v1, p) / area;
	return vec3f(w0, w1, w2);
}

fn frag(uv: vec2f) -> vec4f {
	let aspect = fragkitFrame.resolution.x / fragkitFrame.resolution.y;
	let p = vec2f((uv.x * 2.0 - 1.0) * aspect, uv.y * 2.0 - 1.0);

	let v0 = vec2f(0.0, 0.68);   // red
	let v1 = vec2f(-0.76, -0.58); // green
	let v2 = vec2f(0.76, -0.58);  // blue

	let b = barycentric(p, v0, v1, v2);
	let minW = min(b.x, min(b.y, b.z));

	if (minW < 0.0) {
		return vec4f(1.0, 1.0, 1.0, 1.0);
	}

	let color = vec3f(b.x, b.y, b.z);
	return vec4f(color, 1.0);
}
`;

	const demoDpr = 2;
</script>

<main
	data-testid="fragkit-demo"
	class=" flex h-dvh w-screen flex-col items-center justify-center gap-4 bg-white p-8"
>
	<header class="grid gap-2 text-center">
		<h1 class="text-4xl leading-none font-light tracking-tight text-black">FragKit Demo</h1>
		<p class="text-sm text-black/80">Classic RGB gradient triangle in WGSL.</p>
	</header>

	<div
		class="aspect-16/10 w-[64vw] overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
	>
		<FragCanvas {fragmentWgsl} dpr={demoDpr} class="h-full w-full" />
	</div>
</main>
