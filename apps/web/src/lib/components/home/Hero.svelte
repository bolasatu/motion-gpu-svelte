<script lang="ts">
	import Logo from '$lib/assets/motiongpu-logo.svg?raw';
	import { resolve } from '$app/paths';
	import Book from 'carbon-icons-svelte/lib/Book.svelte';
	import WatsonHealth3DPrintMesh from 'carbon-icons-svelte/lib/WatsonHealth3DPrintMesh.svelte';
	import Button from '../ui/Button.svelte';
	import GlassPane from '$lib/GlassPane.svelte';
	const docsRoute = '/docs' as const;
	const playgroundRoute = '/playground' as const;
	const image = '/sample.jpg';
</script>

<section
	id="home"
	class="flex w-full flex-col items-center justify-center gap-3 p-4 py-24 sm:gap-6 sm:p-8"
>
	<span
		class="inline-flex shrink-0 items-center text-accent [&>svg]:size-16 [&>svg]:fill-current"
		aria-hidden="true"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html Logo}
	</span>
	<h1 class="max-w-2xl text-center text-4xl tracking-tight text-balance sm:text-6xl">
		A <span class="text-accent">Svelte-first</span> pipeline for modern
		<span class="text-accent">GPU visuals.</span>
	</h1>
	<p class="max-w-2xl text-center text-lg text-balance text-foreground/70">
		If you need performance, clarity, and composability in WebGPU for Svelte, this is the stack.
	</p>
	<div class="flex items-center gap-2">
		<Button variant="brand" href={resolve(playgroundRoute as '/playground')} size="md">
			<WatsonHealth3DPrintMesh size={16} />
			<span>Playground</span>
		</Button>
		<Button href={resolve(docsRoute as '/')} size="md">
			<Book size={16} />
			<span>Docs</span>
		</Button>
	</div>
	<div class="h-120 w-full overflow-hidden rounded-lg border border-border">
		<GlassPane
			{image}
			distortion={0.5}
			chromaticAberration={0.005}
			waviness={0.0}
			speed={0.5}
			rods={3}
			aria-hidden="true"
		/>
	</div>
</section>
