<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<blockquote
	{...rest}
	class={`max-w-[78ch] border-l-2 border-accent/70 pl-3 text-sm leading-relaxed text-foreground-muted ${className}`.trim()}
>
	{@render children?.()}
</blockquote>
