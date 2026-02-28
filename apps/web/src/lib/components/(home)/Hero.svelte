<script lang="ts">
	import Logo from '$lib/assets/motiongpu-logo.svg?raw';
</script>

<section
	id="home"
	class="flex h-[50vh] w-full flex-col items-center justify-center gap-3 py-24 sm:gap-6"
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
	<p class="max-w-2xl text-center font-fono text-base text-balance text-foreground-muted">
		If you need performance, clarity, and composability in WebGPU for Svelte, this is the stack.
	</p>
</section>
