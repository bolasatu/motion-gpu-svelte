<script lang="ts">
	import { onMount } from 'svelte';
	import { useFragkit } from '../fragkit-context';

	interface Props {
		onProbe: (value: ReturnType<typeof useFragkit>) => void;
	}

	let { onProbe }: Props = $props();
	const context = useFragkit();

	onMount(() => {
		onProbe(context);
	});
</script>
