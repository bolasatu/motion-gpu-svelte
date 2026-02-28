<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	import Pre from './Pre.svelte';

	interface Props {
		html: string;
		lang?: string;
		raw?: string;
	}

	let { html, lang, raw = '' }: Props = $props();
</script>

<Pre data-language={lang} code={raw} class="group/md-pre">
	<div class="md-pre-content">{@html html}</div>
</Pre>

<style>
	:global(.group\/md-pre .shiki) {
		margin: 0;
		background: transparent !important;
		font-size: 0.82rem;
		line-height: 1.6;
		overflow-x: auto;
	}

	:global(.group\/md-pre .shiki code) {
		counter-reset: line;
		display: grid;
	}

	:global(.group\/md-pre .shiki .line) {
		display: inline-block;
		min-height: 1.3em;
	}
</style>
