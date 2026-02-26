<script lang="ts">
	import FragCanvas from '../FragCanvas.svelte';
	import FragkitProbe from './FragkitProbe.svelte';

	interface Props {
		onProbe: (value: unknown) => void;
	}

	let { onProbe }: Props = $props();

	const fragmentWgsl = `
fn frag(uv: vec2f) -> vec4f {
	return vec4f(uv.x, uv.y, 0.2, 1.0);
}
`;
</script>

<FragCanvas {fragmentWgsl}>
	<FragkitProbe {onProbe} />
</FragCanvas>
