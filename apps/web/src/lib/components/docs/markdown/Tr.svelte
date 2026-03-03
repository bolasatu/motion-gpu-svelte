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

<tr
	{...restProps}
	class={cn(
		'text-sm transition-[background-color] duration-150 ease-out hover:bg-background data-[state=selected]:bg-background [&_code]:text-xs [&strong]:text-sm',
		className
	)}
>
	{@render children?.()}
</tr>
