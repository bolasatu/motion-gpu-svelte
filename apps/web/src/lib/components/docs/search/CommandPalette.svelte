<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { searchState } from '$lib/stores/search.svelte';
	import { searchDocs } from '$lib/utils/docs-search';
	import { cn } from '$lib/utils/cn';

	let query = $state('');
	let selectedIndex = $state(0);
	let inputRef = $state<HTMLInputElement | null>(null);
	let contentHeight = $state(0);
	const results = $derived(searchDocs(query));

	function close() {
		searchState.close();
	}

	function handleGlobalShortcut(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			searchState.toggle();
		}
	}

	function selectResult(index: number) {
		const result = results[index];
		if (!result) return;
		const href = resolve(result.href as '/');
		if (result.anchor) {
			window.location.href = `${href}${result.anchor}`;
		} else {
			void goto(href);
		}
		close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!searchState.isOpen) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			close();
			return;
		}

		if (results.length === 0) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = (selectedIndex + 1) % results.length;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = (selectedIndex - 1 + results.length) % results.length;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			selectResult(selectedIndex);
		}
	}

	function highlight(text: string, search: string) {
		if (!search.trim()) return [{ text, highlighted: false }];

		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`(${escapedSearch})`, 'gi');
		const parts = text.split(regex);

		return parts
			.filter((part) => part.length > 0)
			.map((part) => ({
				text: part,
				highlighted: part.toLowerCase() === search.toLowerCase()
			}));
	}

	onMount(() => {
		window.addEventListener('keydown', handleGlobalShortcut);
		return () => {
			window.removeEventListener('keydown', handleGlobalShortcut);
		};
	});

	$effect(() => {
		if (!searchState.isOpen) return;
		selectedIndex = 0;
		requestAnimationFrame(() => inputRef?.focus());
	});

	$effect(() => {
		if (!searchState.isOpen) return;
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if searchState.isOpen}
	<div
		class="fixed inset-0 z-120 bg-background/85"
		role="presentation"
		onclick={close}
		transition:fade={{ duration: 150 }}
	></div>

	<div
		class="fixed inset-0 z-121 flex items-start justify-center p-4 pt-[10vh]"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(event) => event.target === event.currentTarget && close()}
		onkeydown={(event) => {
			if (event.key === 'Escape') close();
		}}
	>
		<div
			class="w-full max-w-3xl border border-border bg-card"
			transition:scale={{ duration: 300, start: 0.95, easing: cubicOut }}
			onoutroend={() => {
				query = '';
				contentHeight = 0;
			}}
		>
			<div class="flex items-center gap-2 border-b border-border px-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					width="20"
					height="20"
					fill="currentColor"
					viewBox="0 0 256 256"
					class="text-foreground-muted"
				>
					<path
						d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
					></path>
				</svg>
				<input
					bind:this={inputRef}
					bind:value={query}
					class="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
					placeholder="Search MotionGPU docs"
					aria-label="Search MotionGPU docs"
				/>
				<span class="border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted"
					>ESC</span
				>
			</div>

			<div
				class="overflow-hidden transition-[height] duration-300 ease-out"
				style={`height: ${contentHeight}px`}
			>
				<div bind:clientHeight={contentHeight}>
					{#if results.length > 0}
						<div class="max-h-[60vh] overflow-y-auto">
							{#each results as result, index (`${result.href}${result.anchor ?? ''}${index}`)}
								{@const isChild = result.matchType === 'heading' || result.matchType === 'content'}
								<button
									type="button"
									onclick={() => selectResult(index)}
									onmouseenter={() => (selectedIndex = index)}
									class={cn(
										'group relative w-full border-b border-border px-3 py-2 text-left transition-colors',
										isChild && 'pl-7',
										selectedIndex === index
											? 'bg-background-muted/55 text-foreground'
											: 'bg-card text-foreground hover:bg-background'
									)}
								>
									{#if isChild}
										<div
											class={cn(
												'absolute top-0 bottom-0 left-3 w-px',
												selectedIndex === index ? 'bg-accent' : 'bg-foreground/18'
											)}
										></div>
									{/if}

									{#if result.matchType !== 'content'}
										<p class="text-sm tracking-tight text-foreground">
											{#each highlight(result.matchType === 'heading' ? (result.heading ?? result.title) : result.title, query) as part, partIndex (`title-${partIndex}-${part.text}`)}
												{#if part.highlighted}
													<span class="text-accent">{part.text}</span>
												{:else}
													{part.text}
												{/if}
											{/each}
										</p>
									{/if}

									{#if result.snippet}
										<p class="mt-1 line-clamp-1 text-xs text-foreground-muted">
											{#each highlight(result.snippet, query) as part, partIndex (`snippet-${partIndex}-${part.text}`)}
												{#if part.highlighted}
													<span class="text-accent">{part.text}</span>
												{:else}
													{part.text}
												{/if}
											{/each}
										</p>
									{/if}
								</button>
							{/each}
						</div>
					{:else if query.trim()}
						<p class="px-3 py-6 text-sm text-foreground-muted">No results found.</p>
					{/if}
				</div>
			</div>

			<div class="border-t border-border px-3 py-2">
				<p class="font-mono text-xs text-foreground-muted">
					Use ↑ ↓ to navigate and Enter to open.
				</p>
			</div>
		</div>
	</div>
{/if}
