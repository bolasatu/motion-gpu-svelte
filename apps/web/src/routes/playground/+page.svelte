<script lang="ts">
	import { onMount } from 'svelte';
	import PlaygroundView from './PlaygroundView.svelte';
	import { createPlaygroundController } from './playground-controller.svelte';

	const getDemoIdFromLocation = () => {
		if (typeof window === 'undefined') return null;
		return new URLSearchParams(window.location.search).get('demo');
	};
	const controller = createPlaygroundController(getDemoIdFromLocation());
	const selectDemo = (demoId: string) => {
		controller.switchDemo(demoId);
		if (typeof window === 'undefined') return;
		const nextUrl = new URL(window.location.href);
		nextUrl.searchParams.set('demo', controller.activeDemoId);
		window.history.replaceState(window.history.state, '', nextUrl);
	};

	onMount(() => {
		const dispose = controller.mount();
		const onPopState = () => {
			controller.switchDemo(getDemoIdFromLocation());
		};
		window.addEventListener('popstate', onPopState);
		return () => {
			window.removeEventListener('popstate', onPopState);
			dispose?.();
		};
	});
</script>

<PlaygroundView {controller} onSelectDemo={selectDemo} />
