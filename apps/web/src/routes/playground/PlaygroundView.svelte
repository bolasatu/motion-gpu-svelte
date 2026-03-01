<script lang="ts">
	import Logo from '$lib/assets/motiongpu-logo.svg?raw';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Document from 'carbon-icons-svelte/lib/Document.svelte';
	import Folder from 'carbon-icons-svelte/lib/Folder.svelte';
	import LogoSvelte from 'carbon-icons-svelte/lib/LogoSvelte.svelte';
	import 'monaco-editor/min/vs/editor/editor.main.css';
	import type { PlaygroundController } from './playground-controller.svelte';

	let { controller }: { controller: PlaygroundController } = $props();

	const isSvelteFile = (path: string) => path.endsWith('.svelte');
</script>

<main class="h-dvh overflow-hidden p-2 sm:p-4 lg:p-8">
	<section class="flex h-full min-h-0 flex-col">
		<header class="flex items-center justify-between gap-3 pb-3 sm:gap-4 sm:pb-4">
			<div class="flex min-w-0 items-center gap-3 sm:gap-4">
				<span
					class="inline-flex shrink-0 items-center text-accent [&>svg]:size-7 [&>svg]:fill-current sm:[&>svg]:size-8 lg:[&>svg]:size-10"
					aria-hidden="true"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html Logo}
				</span>
				<h1 class="text-lg tracking-tight text-balance sm:text-2xl lg:text-3xl">
					Motion GPU <span class="text-accent">playground</span>
				</h1>
			</div>
		</header>

		<section
			class="mt-2 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(15rem,42dvh)] divide-y divide-border border border-border lg:mt-4 lg:grid-cols-5 lg:grid-rows-1 lg:divide-x lg:divide-y-0"
		>
			<section class="flex min-h-0 flex-col overflow-hidden bg-card lg:col-span-3">
				<div class="min-h-0 flex-1 overflow-hidden lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
					<aside
						class="flex max-h-44 min-h-0 flex-col overflow-hidden border-b border-border bg-card lg:max-h-none lg:border-r lg:border-b-0"
					>
						<div class="border-b border-border px-3 py-2">
							<p class="font-mono text-[10px] tracking-wide text-foreground-muted uppercase">
								Files
							</p>
						</div>
						<div class="min-h-0 flex-1 overflow-auto py-1">
							{#each controller.visibleFileTreeRows as row (row.path)}
								{#if row.kind === 'directory'}
									<button
										type="button"
										onclick={() => controller.toggleDirectory(row.path)}
										class="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs text-foreground-muted transition-colors hover:bg-background-muted/55 hover:text-foreground"
										style={`padding-left: ${8 + row.depth * 12}px`}
									>
										<span class="inline-flex w-3 items-center justify-center text-foreground/60">
											{#if controller.collapsedDirs[row.path]}
												<ChevronRight size={16} />
											{:else}
												<ChevronDown size={16} />
											{/if}
										</span>
										<span class="inline-flex items-center text-foreground/55">
											<Folder size={16} />
										</span>
										<span class="truncate">{row.name}</span>
									</button>
								{:else}
									<button
										type="button"
										onclick={() => controller.openFile(row.path)}
										class={`flex w-full items-center gap-2 px-2 py-1.5 text-left font-mono text-xs transition-colors ${
											controller.activeFilePath === row.path
												? 'bg-background-muted text-foreground'
												: 'text-foreground-muted hover:bg-background-muted/55 hover:text-foreground'
										}`}
										style={`padding-left: ${8 + row.depth * 12}px`}
									>
										<span class="inline-flex items-center text-foreground/55">
											{#if isSvelteFile(row.path)}
												<LogoSvelte size={16} />
											{:else}
												<Document size={16} />
											{/if}
										</span>
										<span class="truncate">{row.name}</span>
									</button>
								{/if}
							{/each}
						</div>
					</aside>

					<div class="flex min-h-0 flex-col overflow-hidden bg-card">
						<div class="h-8 border-b border-border">
							<div class="flex items-stretch overflow-x-auto">
								{#each controller.openFilePaths as filePath (filePath)}
									<div
										class={`group inline-flex shrink-0 items-center border-r border-border ${
											controller.activeFilePath === filePath ? 'bg-white' : 'bg-background'
										}`}
									>
										<button
											type="button"
											onclick={() => controller.switchToFile(filePath)}
											class={`px-2.5 py-2 text-left font-mono text-[11px] transition-colors sm:px-3 sm:text-xs ${
												controller.activeFilePath === filePath
													? 'text-foreground'
													: 'text-foreground-muted hover:text-foreground'
											}`}
										>
											{filePath.split('/').at(-1)}
										</button>
										{#if controller.openFilePaths.length > 1}
											<button
												type="button"
												onclick={(event) => {
													event.stopPropagation();
													controller.closeFile(filePath);
												}}
												class="inline-flex items-center px-3 py-2 text-foreground-muted transition-colors hover:text-foreground"
												aria-label={`Close ${filePath}`}
											>
												<Close size={16} />
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<div
							bind:this={controller.editorHost}
							class="min-h-0 flex-1 bg-white"
							aria-label="Svelte component editor"
						></div>
					</div>
				</div>

				{#if controller.syncError}
					<p
						class="border-t border-border bg-card px-3 py-2 font-mono text-xs text-red-500"
						role="alert"
					>
						{controller.syncError}
					</p>
				{/if}

				<section class="border-t border-border bg-card px-3 py-2">
					{#if controller.runtimeLog}
						<details>
							<summary class="cursor-pointer font-mono text-xs text-foreground-muted">
								Runtime log ({controller.status})
							</summary>
							<pre
								class="mt-2 max-h-32 overflow-auto font-mono text-[11px] leading-5 whitespace-pre-wrap text-foreground-muted">{controller.runtimeLogTail}</pre>
						</details>
					{:else}
						<p class="font-mono text-xs text-foreground-muted">{controller.status}</p>
					{/if}
				</section>
			</section>

			<section class="flex min-h-0 flex-col overflow-hidden bg-card lg:col-span-2">
				<div class="relative min-h-0 flex-1 bg-card">
					{#if controller.previewUrl}
						<iframe
							title="WebContainer preview"
							src={controller.previewUrl}
							class="h-full w-full border-0"
							loading="eager"
						></iframe>
					{:else}
						<div
							class="flex h-full w-full items-center justify-center p-6 text-center font-mono text-sm text-foreground-muted"
						>
							Booting runtime and waiting for preview...
						</div>
					{/if}
				</div>

				{#if controller.errorMessage}
					<p
						class="border-t border-border bg-card px-3 py-2 font-mono text-xs whitespace-pre-wrap text-red-500"
						role="alert"
					>
						{controller.errorMessage}
					</p>
				{/if}
			</section>
		</section>
	</section>
</main>

<style>
	:global(.monaco-editor, .monaco-editor .view-lines, .monaco-editor .inputarea) {
		font-family:
			'Aeonik Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
			'Courier New', monospace !important;
		font-kerning: none;
		font-variant-ligatures: none;
		font-feature-settings:
			'liga' 0,
			'calt' 0;
		text-rendering: geometricPrecision;
	}
</style>
