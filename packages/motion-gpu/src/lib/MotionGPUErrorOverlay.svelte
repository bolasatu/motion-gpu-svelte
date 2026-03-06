<script lang="ts">
	import type { MotionGPUErrorReport } from './core/error-report';
	import Portal from './Portal.svelte';

	interface Props {
		report: MotionGPUErrorReport;
	}

	let { report }: Props = $props();

	const normalizeErrorText = (value: string): string => {
		return value
			.trim()
			.replace(/[.:!]+$/g, '')
			.toLowerCase();
	};

	const shouldShowErrorMessage = (value: MotionGPUErrorReport): boolean => {
		return normalizeErrorText(value.message) !== normalizeErrorText(value.title);
	};
</script>

<Portal>
	<div class="motiongpu-error-overlay" role="presentation">
		<section
			class="motiongpu-error-dialog"
			role="alertdialog"
			aria-live="assertive"
			aria-modal="true"
			data-testid="motiongpu-error"
		>
			<header class="motiongpu-error-header">
				<p class="motiongpu-error-phase">
					{report.phase}
				</p>
				<h2 class="motiongpu-error-title">{report.title}</h2>
			</header>
			<div class="motiongpu-error-body">
				{#if shouldShowErrorMessage(report)}
					<p class="motiongpu-error-message">{report.message}</p>
				{/if}
				<p class="motiongpu-error-hint">{report.hint}</p>
			</div>

			{#if report.source}
				<section class="motiongpu-error-source" aria-label="Source">
					<h3 class="motiongpu-error-source-title">Source</h3>
					<div class="motiongpu-error-source-frame" role="presentation">
						<div class="motiongpu-error-source-tabs" role="tablist" aria-label="Source files">
							<span
								class="motiongpu-error-source-tab motiongpu-error-source-tab-active"
								role="tab"
								aria-selected="true"
								>{report.source.component} (fragment line {report.source
									.line}{#if report.source.column}, col
									{report.source.column}{/if})</span
							>
							<span class="motiongpu-error-source-tab-spacer" aria-hidden="true"></span>
						</div>

						<div class="motiongpu-error-source-snippet">
							{#each report.source.snippet as snippetLine (`snippet-${snippetLine.number}`)}
								<div
									class="motiongpu-error-source-row"
									class:motiongpu-error-source-row-active={snippetLine.highlight}
								>
									<span class="motiongpu-error-source-line">{snippetLine.number}</span>
									<span class="motiongpu-error-source-code">{snippetLine.code || ' '}</span>
								</div>
							{/each}
						</div>
					</div>
				</section>
			{/if}

			<div class="motiongpu-error-sections">
				{#if report.details.length > 0}
					<details class="motiongpu-error-details" open>
						<summary>{report.source ? 'Additional diagnostics' : 'Technical details'}</summary>
						<pre>{report.details.join('\n')}</pre>
					</details>
				{/if}
				{#if report.stack.length > 0}
					<details class="motiongpu-error-details">
						<summary>Stack trace</summary>
						<pre>{report.stack.join('\n')}</pre>
					</details>
				{/if}
			</div>
		</section>
	</div>
</Portal>

<style>
	.motiongpu-error-overlay {
		--motiongpu-color-background: #f4f4f4;
		--motiongpu-color-background-muted: #fff;
		--motiongpu-color-foreground: #262626;
		--motiongpu-color-foreground-muted: #747474;
		--motiongpu-color-card: #f4f4f4;
		--motiongpu-color-accent: #ff6900;
		--motiongpu-color-border: rgba(107, 107, 107, 0.15);
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgba(24, 24, 24, 0.42);
		backdrop-filter: blur(12px);
		z-index: 2147483647;
	}

	.motiongpu-error-dialog {
		width: min(48rem, calc(100vw - 2rem));
		max-height: min(84vh, 44rem);
		overflow: auto;
		margin: 0;
		padding: 1rem;
		border: 1px solid var(--motiongpu-color-border);
		max-width: calc(100vw - 2rem);
		box-sizing: border-box;
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.45;
		background: var(--motiongpu-color-card);
		color: var(--motiongpu-color-foreground);
	}

	.motiongpu-error-header {
		display: grid;
		gap: 0.45rem;
		padding-bottom: 0.7rem;
		border-bottom: 1px solid var(--motiongpu-color-border);
	}

	.motiongpu-error-phase {
		display: inline-flex;
		align-items: center;
		margin: 0;
		font-size: 0.67rem;
		letter-spacing: 0.025em;
		line-height: 1;
		font-weight: 400;
		text-transform: uppercase;
		color: var(--motiongpu-color-foreground-muted);
	}

	.motiongpu-error-title {
		margin: 0;
		font-size: 1.12rem;
		font-weight: 400;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-wrap: balance;
		color: var(--motiongpu-color-foreground);
	}

	.motiongpu-error-body {
		display: grid;
		gap: 0.55rem;
		margin-top: 0.82rem;
	}

	.motiongpu-error-message {
		margin: 0;
		padding: 0.6rem 0.68rem;
		border: 1px solid rgba(255, 105, 0, 0.22);
		background: rgba(255, 105, 0, 0.1);
		font-size: 0.81rem;
		line-height: 1.4;
		font-weight: 400;
		color: var(--motiongpu-color-foreground);
	}

	.motiongpu-error-hint {
		margin: 0;
		font-size: 0.81rem;
		line-height: 1.45;
		font-weight: 400;
		color: var(--motiongpu-color-foreground-muted);
	}

	.motiongpu-error-sections {
		display: grid;
		gap: 0.7rem;
		margin-top: 0.85rem;
	}

	.motiongpu-error-source {
		display: grid;
		gap: 0.4rem;
		margin-top: 0.9rem;
	}

	.motiongpu-error-source-title {
		margin: 0;
		font-size: 0.86rem;
		font-weight: 400;
		line-height: 1.3;
		color: var(--motiongpu-color-foreground);
	}

	.motiongpu-error-source-frame {
		border: 1px solid var(--motiongpu-color-border);
		background: var(--motiongpu-color-background-muted);
	}

	.motiongpu-error-source-tabs {
		display: flex;
		align-items: stretch;
		border-bottom: 1px solid var(--motiongpu-color-border);
		background: var(--motiongpu-color-background);
	}

	.motiongpu-error-source-tab {
		display: inline-flex;
		align-items: center;
		padding: 0.52rem 0.7rem;
		font-size: 0.76rem;
		font-weight: 400;
		line-height: 1.2;
		color: var(--motiongpu-color-foreground-muted);
		border-right: 1px solid var(--motiongpu-color-border);
	}

	.motiongpu-error-source-tab-active {
		color: var(--motiongpu-color-foreground);
		background: var(--motiongpu-color-background-muted);
	}

	.motiongpu-error-source-tab-spacer {
		flex: 1 1 auto;
	}

	.motiongpu-error-source-snippet {
		display: grid;
		background: var(--motiongpu-color-background-muted);
	}

	.motiongpu-error-source-row {
		display: grid;
		grid-template-columns: 1.5rem minmax(0, 1fr);
		align-items: start;
		gap: 0.35rem;
		padding: 0.17rem 0.62rem;
	}

	.motiongpu-error-source-row-active {
		background: rgba(255, 105, 0, 0.1);
	}

	.motiongpu-error-source-line {
		font-size: 0.77rem;
		font-weight: 400;
		line-height: 1.3;
		border-right: 1px solid var(--motiongpu-color-border);
		color: var(--motiongpu-color-foreground-muted);
		text-align: left;
	}

	.motiongpu-error-source-code {
		font-size: 0.77rem;
		font-weight: 400;
		line-height: 1.3;
		color: var(--motiongpu-color-foreground);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.motiongpu-error-details {
		border: 1px solid var(--motiongpu-color-border);
		background: var(--motiongpu-color-background);
	}

	.motiongpu-error-details summary {
		cursor: pointer;
		padding: 0.56rem 0.68rem;
		font-size: 0.72rem;
		letter-spacing: 0.045em;
		line-height: 1.2;
		font-weight: 400;
		text-transform: uppercase;
		color: var(--motiongpu-color-foreground);
	}

	.motiongpu-error-details[open] summary {
		border-bottom: 1px solid var(--motiongpu-color-border);
	}

	.motiongpu-error-details pre {
		margin: 0;
		padding: 0.62rem 0.68rem;
		white-space: pre-wrap;
		word-break: break-word;
		overflow: auto;
		background: var(--motiongpu-color-background-muted);
		font-size: 0.74rem;
		line-height: 1.4;
		font-weight: 400;
		color: var(--motiongpu-color-foreground);
		font-family: inherit;
	}

	@media (max-width: 42rem) {
		.motiongpu-error-overlay {
			padding: 0.75rem;
		}

		.motiongpu-error-dialog {
			padding: 0.8rem;
		}

		.motiongpu-error-title {
			font-size: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.motiongpu-error-overlay {
			backdrop-filter: none;
		}
	}
</style>
