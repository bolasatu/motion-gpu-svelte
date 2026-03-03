<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	const buttonVariants = cva(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap tracking-tight font-medium text-sm transition-colors duration-150 ease-out rounded-md disabled:pointer-events-none disabled:opacity-50',
		{
			variants: {
				variant: {
					default: 'btn-primary',
					secondary: 'btn-secondary',
					outline: 'border border-border text-foreground hover:bg-card-muted',
					link: 'h-auto p-0 text-foreground underline-offset-4 hover:underline',
					ghost: 'text-foreground hover:bg-background-inset'
				},
				size: {
					sm: 'h-7 px-2.5 text-xs',
					md: 'h-8 px-2.5',
					lg: 'h-9 px-2.5',
					none: ''
				}
			},
			defaultVariants: {
				variant: 'default',
				size: 'md'
			}
		}
	);

	type ButtonVariants = VariantProps<typeof buttonVariants>;

	interface Props extends ButtonVariants {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		href,
		type = 'button',
		disabled = false,
		variant = 'default',
		size = 'md',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const classes = $derived(cn(buttonVariants({ variant, size }), className));
</script>

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a
		href={disabled ? undefined : href}
		class={classes}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : undefined}
		{...rest}
	>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={classes} {disabled} {...rest}>
		{@render children?.()}
	</button>
{/if}

<style>
	.btn-primary,
	.btn-secondary {
		position: relative;
		appearance: none;
	}

	.btn-primary {
		overflow: hidden;
		color: var(--color-background);
		transition:
			filter 150ms ease-out,
			box-shadow 150ms ease-out;
		background:
			radial-gradient(ellipse at -20px top, rgb(255 255 255 / 0.22), rgb(255 255 255 / 0)),
			linear-gradient(180deg, var(--color-accent), var(--color-accent-secondary));
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.22),
			var(--shadow-md);

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: inherit;
			pointer-events: none;
			border: 1.5px solid transparent;
			-webkit-mask:
				linear-gradient(black, black) padding-box,
				linear-gradient(black, black);
			mask:
				linear-gradient(black, black) padding-box,
				linear-gradient(black, black);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			background: linear-gradient(
					180deg,
					rgb(255 255 255 / 0.72),
					rgb(0 0 0 / 0.24) 41%,
					rgb(0 0 0 / 0.24) 75%,
					rgb(255 255 255 / 0.28)
				)
				border-box;
			mix-blend-mode: overlay;
		}

		@media (hover: hover) {
			&:hover {
				filter: brightness(1.08) saturate(1.04);
			}
		}
	}

	.btn-secondary {
		isolation: isolate;
		overflow: hidden;
		color: var(--color-foreground);
		transition:
			filter 150ms ease-out,
			box-shadow 150ms ease-out;
		background:
			radial-gradient(
				120% 140% at 0% 0%,
				color-mix(in oklab, var(--color-background-inset) 85%, transparent),
				transparent 58%
			),
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--color-background) 94%, var(--color-background-inset) 6%),
				color-mix(in oklab, var(--color-card-muted) 90%, var(--color-background-inset) 10%)
			);
		box-shadow:
			inset 0 1px 0 color-mix(in oklab, var(--color-background-inset) 78%, transparent),
			inset 0 -1px 0 color-mix(in oklab, var(--color-border) 36%, transparent),
			var(--shadow-md);

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: inherit;
			pointer-events: none;
			border: 1.5px solid transparent;
			-webkit-mask:
				linear-gradient(black, black) padding-box,
				linear-gradient(black, black);
			mask:
				linear-gradient(black, black) padding-box,
				linear-gradient(black, black);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			background: linear-gradient(
					180deg,
					color-mix(in oklab, var(--color-background-inset) 95%, transparent),
					color-mix(in oklab, var(--color-border) 55%, transparent) 41%,
					color-mix(in oklab, var(--color-border) 44%, transparent) 75%,
					color-mix(in oklab, var(--color-background-inset) 78%, transparent)
				)
				border-box;
			opacity: 0.9;
		}

		@media (hover: hover) {
			&:hover {
				filter: brightness(1.03);
			}
		}
	}
</style>
