<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type ComponentProps = {
		class?: string;
		children?: Snippet;
		[prop: string]: unknown;
	};

	const { children, class: className = '', ...restProps }: ComponentProps = $props();
</script>

<strong
	{...restProps}
	class={cn('font-display text-sm font-medium text-pretty text-foreground', className)}
>
	{@render children?.()}
</strong>
