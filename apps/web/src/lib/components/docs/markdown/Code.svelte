<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<code
	{...rest}
	class={`bg-background-muted/60 px-2 py-0.5 font-mono text-sm text-foreground ${className}`.trim()}
>
	{@render children?.()}
</code>
