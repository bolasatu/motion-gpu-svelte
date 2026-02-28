<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<thead {...rest} class={`border-y border-background-muted/90 ${className}`.trim()}>
	{@render children?.()}
</thead>
