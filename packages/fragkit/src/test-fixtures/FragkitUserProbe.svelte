<script lang="ts">
	import { onMount } from 'svelte';
	import { useFragkitUserContext } from '../lib/use-fragkit-user-context';

	interface Props {
		onProbe: (value: unknown) => void;
	}

	let { onProbe }: Props = $props();

	const initial = useFragkitUserContext('plugin', () => ({ mode: 'initial', enabled: true }));
	const skipped = useFragkitUserContext('plugin', () => ({ mode: 'skipped' }));
	const merged = useFragkitUserContext('plugin', () => ({ merged: true }), { existing: 'merge' });
	const replaced = useFragkitUserContext('plugin', () => ({ mode: 'replaced' }), {
		existing: 'replace'
	});
	const pluginStore = useFragkitUserContext<Record<string, unknown>>('plugin');
	const allStore = useFragkitUserContext();

	onMount(() => {
		onProbe({
			initial,
			skipped,
			merged,
			replaced,
			pluginStore,
			allStore
		});
	});
</script>
