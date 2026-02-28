<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<h1
	{...rest}
	class={`mt-8 text-3xl leading-tight tracking-tight text-foreground ${className}`.trim()}
>
	{@render children?.()}
</h1>
