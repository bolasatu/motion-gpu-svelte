<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<a
	{...rest}
	class={`text-foreground underline decoration-accent/60 decoration-1 underline-offset-[3px] transition-colors duration-150 ease-out hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${className}`.trim()}
>
	{@render children?.()}
</a>
