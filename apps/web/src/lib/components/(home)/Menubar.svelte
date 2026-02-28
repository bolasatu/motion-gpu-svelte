<script lang="ts">
	import { resolve } from '$app/paths';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

	const homeRoute = '/' as const;
	const docsRoute = '/docs' as const;

	let mobileOpen = $state(false);

	function toggleMobileMenu() {
		mobileOpen = !mobileOpen;
	}

	function closeMobileMenu() {
		mobileOpen = false;
	}
</script>

<nav class="fixed top-3 left-1/2 z-60 w-full -translate-x-1/2 px-4 sm:px-8">
	<div class="bg-background-muted/70 backdrop-blur-xl">
		<div class="relative flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
			<a
				href={resolve(homeRoute)}
				class="inline-flex items-center gap-2 px-2 py-2 text-sm tracking-tight text-foreground transition-colors hover:text-foreground"
			>
				<span class="font-fono">MotionGPU</span>
			</a>

			<div
				class="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 sm:flex"
			>
				<a
					href="#home"
					class="inline-flex items-center gap-2 px-2 py-2 font-fono text-sm tracking-tight text-foreground-muted transition-colors hover:text-foreground"
				>
					Home
				</a>
				<a
					href="#about"
					class="inline-flex items-center gap-2 px-2 py-2 font-fono text-sm tracking-tight text-foreground-muted transition-colors hover:text-foreground"
				>
					About
				</a>
				<a
					href="#features"
					class="inline-flex items-center gap-2 px-2 py-2 font-fono text-sm tracking-tight text-foreground-muted transition-colors hover:text-foreground"
				>
					Features
				</a>
				<a
					href="#how-it-works"
					class="inline-flex items-center gap-2 px-2 py-2 font-fono text-sm tracking-tight text-foreground-muted transition-colors hover:text-foreground"
				>
					Pipeline
				</a>
			</div>

			<div class="hidden items-center gap-2 sm:flex">
				<a
					href={resolve(docsRoute as '/')}
					class="inline-flex items-center gap-2 bg-foreground px-5 py-2 font-fono text-sm text-background"
				>
					Docs
				</a>
				<a
					href="https://github.com/motion-core/motion-gpu"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-2 border border-foreground/35 px-5 py-2 font-fono text-sm"
				>
					GitHub
				</a>
			</div>

			<button
				type="button"
				class="grid size-10 place-items-center text-foreground transition-colors hover:bg-background sm:hidden"
				aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={mobileOpen}
				aria-controls="mobile-menubar-panel"
				onclick={toggleMobileMenu}
			>
				{#if mobileOpen}
					<Close size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>
		</div>
	</div>
</nav>

{#if mobileOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-white/15 backdrop-blur-[2px] sm:hidden"
		aria-label="Close mobile navigation overlay"
		onclick={closeMobileMenu}
		in:fade={{ duration: 180 }}
		out:fade={{ duration: 130 }}
	></button>

	<div
		id="mobile-menubar-panel"
		class="fixed top-20 left-1/2 z-50 grid w-[min(92vw,30rem)] -translate-x-1/2 gap-2 bg-background-muted/70 p-3 backdrop-blur-xl sm:hidden"
		in:fly={{ y: -12, duration: 240, easing: cubicOut }}
		out:fly={{ y: -8, duration: 170, easing: cubicOut }}
	>
		<a
			href="#home"
			onclick={closeMobileMenu}
			class="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-fono text-sm text-foreground transition-colors hover:bg-background"
		>
			Home
		</a>
		<a
			href="#about"
			onclick={closeMobileMenu}
			class="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-fono text-sm text-foreground transition-colors hover:bg-background"
		>
			About
		</a>
		<a
			href="#features"
			onclick={closeMobileMenu}
			class="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-fono text-sm text-foreground transition-colors hover:bg-background"
		>
			Features
		</a>
		<a
			href="#how-it-works"
			onclick={closeMobileMenu}
			class="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-fono text-sm text-foreground transition-colors hover:bg-background"
		>
			Pipeline
		</a>

		<div class="mt-1 grid grid-cols-2 gap-2">
			<a
				href={resolve(docsRoute as '/')}
				onclick={closeMobileMenu}
				class="inline-flex items-center justify-center gap-2 bg-foreground px-5 py-2 font-fono text-sm text-background"
			>
				Docs
			</a>
			<a
				href="https://github.com/motion-core/motion-gpu"
				target="_blank"
				rel="noreferrer"
				onclick={closeMobileMenu}
				class="inline-flex items-center justify-center gap-2 border border-foreground/35 px-5 py-2 font-fono text-sm"
			>
				GitHub
			</a>
		</div>
	</div>
{/if}
