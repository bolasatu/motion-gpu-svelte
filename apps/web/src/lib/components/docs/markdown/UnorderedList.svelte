<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<ul
	{...rest}
	class={`max-w-[78ch] list-disc pl-5 text-sm leading-relaxed text-foreground-muted ${className}`.trim()}
>
	{@render children?.()}
</ul>
