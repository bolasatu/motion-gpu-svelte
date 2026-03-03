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

<h1
	{...restProps}
	class={cn(
		'font-display scroll-m-24 text-2xl font-medium text-foreground [&_code]:text-lg',
		className
	)}
>
	{@render children?.()}
</h1>
