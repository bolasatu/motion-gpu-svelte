<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import DocsSidebar from './DocsSidebar.svelte';

	const homeRoute = '/' as const;
	let isOpen = $state(false);
	const pathname = $derived(page.url.pathname);

	function toggle() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}

	$effect(() => {
		void pathname;
		close();
	});
</script>

<div
	class="fixed inset-x-0 top-0 z-80 flex items-center justify-between border-b border-background-muted/90 bg-card px-4 py-2 lg:hidden"
>
	<a href={resolve(homeRoute)} class="inline-flex items-center gap-2">
		<span class="font-sans text-sm font-normal tracking-tight">MotionGPU</span>
		<span class="text-sm text-foreground-muted">Docs</span>
	</a>
	<button
		type="button"
		onclick={toggle}
		aria-label="Toggle docs menu"
		class="border border-background-muted/90 px-2 py-1 text-sm text-foreground">Menu</button
	>
</div>

{#if isOpen}
	<button
		type="button"
		class="fixed inset-0 z-84 bg-background/80 lg:hidden"
		aria-label="Close docs menu"
		onclick={close}
	></button>
{/if}

<div
	class="fixed top-0 right-0 bottom-0 z-85 w-[min(90vw,22rem)] border-l border-background-muted/90 bg-card transition-transform duration-200 lg:hidden"
	style={`transform: translateX(${isOpen ? '0' : '100%'});`}
>
	<div class="absolute top-2 right-4 flex items-center justify-end">
		<button
			type="button"
			onclick={close}
			aria-label="Close docs menu"
			class="border border-background-muted/90 px-2 py-1 text-sm text-foreground">Close</button
		>
	</div>
	<DocsSidebar />
</div>
