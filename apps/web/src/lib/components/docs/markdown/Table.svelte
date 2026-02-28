<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}

	let { children, class: className = '', ...rest }: Props = $props();
</script>

<div class="my-8 max-w-full overflow-x-auto">
	<table {...rest} class={`w-full min-w-xl border-collapse text-left ${className}`.trim()}>
		{@render children?.()}
	</table>
</div>
