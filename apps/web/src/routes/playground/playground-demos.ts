export type PlaygroundDemoDefinition = {
	id: string;
	name: string;
	appSource: string;
	runtimeSource?: string;
};

const appModules = import.meta.glob('./demos/*/App.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const runtimeModules = import.meta.glob('./demos/*/runtime.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Partial<Record<string, string>>;

const toStartCase = (value: string) =>
	value
		.split('-')
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');

const getDemoIdFromAppPath = (path: string) => {
	const match = path.match(/\/demos\/([^/]+)\/App\.svelte$/);
	if (!match) return null;
	return match[1] ?? null;
};

const playgroundDemosUnsorted = Object.entries(appModules)
	.map<PlaygroundDemoDefinition | null>(([path, appSource]) => {
		const id = getDemoIdFromAppPath(path);
		if (!id) return null;
		const runtimePath = path.replace(/\/App\.svelte$/, '/runtime.svelte');
		return {
			id,
			name: toStartCase(id),
			appSource,
			runtimeSource: runtimeModules[runtimePath]
		};
	})
	.filter((entry): entry is PlaygroundDemoDefinition => entry !== null);

export const playgroundDemos = playgroundDemosUnsorted.sort((left, right) =>
	left.name.localeCompare(right.name)
);

if (playgroundDemos.length === 0) {
	throw new Error('No playground demos found in ./demos/*/App.svelte');
}

const playgroundDemosById = Object.fromEntries(
	playgroundDemos.map((demo) => [demo.id, demo])
) as Record<string, PlaygroundDemoDefinition>;

export const defaultPlaygroundDemoId = playgroundDemos[0]!.id;

export const resolvePlaygroundDemoId = (value: string | null | undefined) =>
	value && value in playgroundDemosById ? value : defaultPlaygroundDemoId;

export const getPlaygroundDemoById = (id: string) => playgroundDemosById[id] ?? null;
