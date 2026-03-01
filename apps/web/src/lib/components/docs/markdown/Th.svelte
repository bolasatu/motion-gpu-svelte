<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<th
	{...rest}
	class={`px-3 py-2 text-xs font-medium tracking-wide text-foreground uppercase ${className}`.trim()}
>
	{@render children?.()}
</th>
