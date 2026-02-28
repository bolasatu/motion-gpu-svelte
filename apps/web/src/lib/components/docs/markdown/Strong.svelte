<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<strong {...rest} class={`font-normal text-foreground ${className}`.trim()}>
	{@render children?.()}
</strong>
