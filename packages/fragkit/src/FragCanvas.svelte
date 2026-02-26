<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { currentWritable } from './current-writable';
	import { createRenderer } from './core/renderer';
	import type { RenderMode, Renderer, UniformMap, UniformValue } from './core/types';
	import { provideFragkitContext } from './fragkit-context';
	import { resolveUniformKeys } from './core/uniforms';
	import { createFrameRegistry, provideFrameRegistry } from './frame-context';

	interface Props {
		fragmentWgsl: string;
		uniforms?: UniformMap;
		clearColor?: [number, number, number, number];
		renderMode?: RenderMode;
		autoRender?: boolean;
		dpr?: number;
		class?: string;
		style?: string;
		children?: Snippet;
	}

	const initialDpr = typeof window === 'undefined' ? 1 : (window.devicePixelRatio ?? 1);

	let {
		fragmentWgsl,
		uniforms = {},
		clearColor = [0, 0, 0, 1],
		renderMode = 'always',
		autoRender = true,
		dpr = initialDpr,
		class: className = '',
		style = '',
		children
	}: Props = $props();

	let canvas: HTMLCanvasElement | undefined;
	let errorMessage = $state<string | null>(null);

	const registry = createFrameRegistry();
	provideFrameRegistry(registry);
	const size = currentWritable({ width: 0, height: 0 });
	const dprState = currentWritable(initialDpr);
	const renderModeState = currentWritable<RenderMode>('always', registry.setRenderMode);
	const autoRenderState = currentWritable<boolean>(true, registry.setAutoRender);

	provideFragkitContext({
		get canvas() {
			return canvas;
		},
		size,
		dpr: dprState,
		renderMode: renderModeState,
		autoRender: autoRenderState,
		invalidate: registry.invalidate,
		advance: registry.advance,
		scheduler: {
			createStage: registry.createStage,
			getStage: registry.getStage
		}
	});

	$effect(() => {
		renderModeState.set(renderMode);
	});

	$effect(() => {
		autoRenderState.set(autoRender);
	});

	$effect(() => {
		dprState.set(dpr);
	});

	onMount(() => {
		if (!canvas) {
			errorMessage = 'Canvas element is not available';
			return () => registry.clear();
		}

		const canvasElement = canvas;
		let frameId = 0;
		let renderer: Renderer | null = null;
		let isDisposed = false;
		let previousTime = performance.now() / 1000;

		const runtimeUniforms: UniformMap = {};
		const uniformKeys = resolveUniformKeys(uniforms);

		const setUniform = (name: string, value: UniformValue): void => {
			if (!uniformKeys.includes(name)) {
				throw new Error(`Unknown uniform "${name}". Declare it in FragCanvas uniforms prop first.`);
			}
			runtimeUniforms[name] = value;
		};

		const setTexture = (name: string): void => {
			throw new Error(
				`Unknown texture "${name}". Declare it in FragCanvas textures prop before using setTexture.`
			);
		};

		const renderFrame = (timestamp: number): void => {
			if (isDisposed || !renderer) {
				return;
			}

			const time = timestamp / 1000;
			const delta = Math.max(0, time - previousTime);
			previousTime = time;
			const width = canvasElement.clientWidth || canvasElement.width;
			const height = canvasElement.clientHeight || canvasElement.height;
			size.set({ width, height });

			registry.run({
				time,
				delta,
				setUniform,
				setTexture,
				invalidate: registry.invalidate,
				advance: registry.advance,
				renderMode: registry.getRenderMode(),
				autoRender: registry.getAutoRender(),
				canvas: canvasElement
			});

			if (registry.shouldRender()) {
				renderer.render({
					time,
					delta,
					uniforms: {
						...uniforms,
						...runtimeUniforms
					},
					textures: {}
				});
			}

			registry.endFrame();

			frameId = requestAnimationFrame(renderFrame);
		};

		(async () => {
			try {
				renderer = await createRenderer({
					canvas: canvasElement,
					fragmentWgsl,
					uniformKeys,
					textureKeys: [],
					clearColor,
					getDpr: () => dprState.current
				});
				frameId = requestAnimationFrame(renderFrame);
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Unknown FragCanvas error';
			}
		})();

		return () => {
			isDisposed = true;
			cancelAnimationFrame(frameId);
			renderer?.destroy();
			registry.clear();
		};
	});
</script>

<div class="fragkit-canvas-wrap">
	<canvas bind:this={canvas} class={className} {style}></canvas>
	{#if errorMessage}
		<p class="fragkit-error" data-testid="fragkit-error">{errorMessage}</p>
	{/if}
	{@render children?.()}
</div>

<style>
	.fragkit-canvas-wrap {
		position: relative;
		display: grid;
		width: 100%;
		height: 100%;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.fragkit-error {
		position: absolute;
		left: 0.75rem;
		top: 0.75rem;
		margin: 0;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		line-height: 1.2;
		background: rgba(20, 20, 20, 0.75);
		color: #ffcece;
	}
</style>
