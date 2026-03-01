<script lang="ts">
	import { onMount } from 'svelte';
	import PlaygroundView from './PlaygroundView.svelte';
	import { createPlaygroundController } from './playground-controller.svelte';

	const controller = createPlaygroundController();

	onMount(() => controller.mount());
</script>

<PlaygroundView {controller} />
