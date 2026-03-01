<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<pre
	{...rest}
	data-md-pre
	class={`overflow-x-auto bg-background px-4 font-mono text-sm text-foreground ${className}`.trim()}>
	{@render children?.()}
</pre>

<style>
	:global(pre[data-md-pre] code) {
		background: transparent;
		padding: 0;
		font-size: 0.82rem;
		line-height: 1.6;
	}
</style>
