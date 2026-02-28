<script lang="ts">
	import type { Snippet } from 'svelte';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		badge: string;
		description: string;
		gridClass?: string;
		titleClass?: string;
		descriptionClass?: string;
		children?: Snippet;
	}

	let {
		badge,
		description,
		gridClass = 'grid w-full grid-cols-3 gap-6',
		titleClass = 'col-span-3 max-w-2xl text-2xl tracking-tight text-balance sm:col-span-2 sm:text-5xl',
		descriptionClass = 'col-span-3 font-fono text-sm text-foreground-muted sm:col-span-1',
		children
	}: Props = $props();
</script>

<div class="flex w-full flex-col items-start justify-center gap-6">
	<Badge>{badge}</Badge>
	<div class={gridClass}>
		<h2 class={titleClass}>
			{@render children?.()}
		</h2>
		<p class={descriptionClass}>{description}</p>
	</div>
</div>
