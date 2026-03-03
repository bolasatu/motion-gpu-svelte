<script lang="ts">
	import About from '$lib/components/home/About.svelte';
	import Features from '$lib/components/home/Features.svelte';
	import Footer from '$lib/components/home/Footer.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import HowItWorks from '$lib/components/home/HowItWorks.svelte';
	import Menubar from '$lib/components/home/Menubar.svelte';
</script>

<a
	href="#main-content"
	class="sr-only fixed top-3 left-3 z-100 bg-foreground px-4 py-2 text-sm text-background focus:not-sr-only focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
>
	Skip to main content
</a>

<main
	id="main-content"
	tabindex="-1"
	class="flex min-h-dvh w-full flex-col items-center justify-center"
>
	<div
		class="mx-auto h-full w-full max-w-6xl flex-col items-center justify-center gap-12 divide-y border-x border-border p-4 pt-24 sm:p-8 sm:pt-28"
	>
		<Hero />
	</div>
</main>
