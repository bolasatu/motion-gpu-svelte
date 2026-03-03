<script lang="ts">
	import { onMount } from 'svelte';
	import { useFrame } from '../../src/lib/frame-context';
	import { useMotionGPU } from '../../src/lib/motiongpu-context';
	import type { RenderMode } from '../../src/lib/core/types';

	export interface RuntimeControls {
		setRenderMode: (mode: RenderMode) => void;
		invalidate: () => void;
		advance: () => void;
	}

	interface Props {
		onFrame: (count: number) => void;
		onReady: (controls: RuntimeControls) => void;
	}

	let { onFrame, onReady }: Props = $props();
	const context = useMotionGPU();
	let frameCount = 0;
	let pulse = 0;

	useFrame(
		(state) => {
			frameCount += 1;
			pulse = (pulse + 0.03125) % 1;
			state.setUniform('uPulse', pulse);
			onFrame(frameCount);
		},
		{ autoInvalidate: false }
	);

	onMount(() => {
		onReady({
			setRenderMode: (mode) => context.renderMode.set(mode),
			invalidate: context.invalidate,
			advance: context.advance
		});
	});
</script>
