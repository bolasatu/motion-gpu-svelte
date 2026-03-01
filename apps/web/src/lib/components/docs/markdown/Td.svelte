<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<td {...rest} class={`px-3 py-2 text-sm leading-relaxed text-foreground-muted ${className}`.trim()}>
	{@render children?.()}
</td>
