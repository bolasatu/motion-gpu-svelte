<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<tr {...rest} class={`border-b border-border ${className}`.trim()}>
	{@render children?.()}
</tr>
