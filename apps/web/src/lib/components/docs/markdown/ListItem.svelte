<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<li {...rest} class={`my-1 pl-1 ${className}`.trim()}>
	{@render children?.()}
</li>
