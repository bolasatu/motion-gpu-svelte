<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<h3
	{...rest}
	class={`mt-8 scroll-mt-20 text-xl leading-snug tracking-tight text-foreground ${className}`.trim()}
>
	{@render children?.()}
</h3>
