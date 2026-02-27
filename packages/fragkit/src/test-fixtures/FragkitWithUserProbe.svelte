<script lang="ts">
	import FragCanvas from '../lib/FragCanvas.svelte';
	import { createMaterial } from '../lib/core/material';
	import FragkitUserProbe from './FragkitUserProbe.svelte';

	interface Props {
		onProbe: (value: unknown) => void;
	}

	let { onProbe }: Props = $props();

	const material = createMaterial({
		fragment: `
fn frag(uv: vec2f) -> vec4f {
	return vec4f(uv.x, uv.y, 0.35, 1.0);
}
`
	});
</script>

<FragCanvas {material}>
	<FragkitUserProbe {onProbe} />
</FragCanvas>
