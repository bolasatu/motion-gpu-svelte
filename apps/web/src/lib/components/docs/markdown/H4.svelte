<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<h4 {...rest} class={`mt-6 text-xl tracking-wide text-foreground uppercase ${className}`.trim()}>
	{@render children?.()}
</h4>
