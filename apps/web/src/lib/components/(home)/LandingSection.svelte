<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		class?: string;
		children?: Snippet;
	}

	let { id, class: className = '', children }: Props = $props();
	const sectionClass = $derived(
		`flex w-full flex-col items-start justify-start bg-card p-4 sm:p-8 border border-border ${className}`.trim()
	);
</script>

<section {id} class={sectionClass}>
	{@render children?.()}
</section>
