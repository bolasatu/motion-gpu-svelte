<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	const sectionVariants = cva('w-full border-t border-border', {
		variants: {
			variant: {
				default: '',
				muted: ''
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	interface Props extends VariantProps<typeof sectionVariants> {
		id?: string;
		class?: string;
		children?: Snippet;
	}

	let { id, variant = 'default', class: className = '', children }: Props = $props();
</script>

<section {id} class={sectionVariants({ variant })}>
	<div
		class={cn(
			'w-full',
			variant === 'muted' &&
				'grid items-stretch sm:grid-cols-[minmax(0,1fr)_minmax(0,64rem)_minmax(0,1fr)]'
		)}
	>
		{#if variant === 'muted'}
			<div class="bg-dashed hidden h-full min-h-20 items-center justify-start px-3 sm:flex"></div>
		{/if}
		<div
			class={cn(
				'relative mx-auto flex w-full max-w-5xl flex-col justify-start border-x border-border px-4 py-8 sm:px-8 sm:py-16',
				className
			)}
		>
			{@render children?.()}
		</div>
		{#if variant === 'muted'}
			<div class="bg-dashed hidden h-full min-h-20 items-center justify-start px-3 sm:flex"></div>
		{/if}
	</div>
</section>

<style>
	.bg-dashed {
		background-image: linear-gradient(
			45deg,
			var(--color-border) 12.5%,
			transparent 12.5%,
			transparent 50%,
			var(--color-border) 50%,
			var(--color-border) 62.5%,
			transparent 62.5%,
			transparent 100%
		);
		background-size: 0.25rem 0.25rem;
	}
</style>
