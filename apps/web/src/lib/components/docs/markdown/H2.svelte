<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<h2
	{...rest}
	class={`mt-10 scroll-mt-20 text-2xl leading-tight tracking-tight text-foreground ${className}`.trim()}
>
	{@render children?.()}
</h2>
