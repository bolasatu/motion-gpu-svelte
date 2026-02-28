import { fileURLToPath, URL } from 'node:url';
import adapter from '@sveltejs/adapter-auto';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const markdownLayout = fileURLToPath(
	new URL('./src/lib/components/docs/MarkdownLayout.svelte', import.meta.url)
);
const theme = 'github-light';

const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['svelte', 'bash', 'json', 'typescript', 'javascript', 'css', 'wgsl', 'markdown', 'txt']
});

const LANGUAGE_ALIASES = {
	ts: 'typescript',
	js: 'javascript',
	md: 'markdown',
	text: 'txt',
	shell: 'bash',
	sh: 'bash'
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	preprocess: [
		mdsvex({
			extensions: ['.svx'],
			layout: {
				docs: markdownLayout
			},
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const resolvedLang = LANGUAGE_ALIASES[lang] ?? lang;
					const safeLang =
						resolvedLang && highlighter.getLoadedLanguages().includes(resolvedLang)
							? resolvedLang
							: 'txt';
					const lightHtml = escapeSvelte(
						highlighter.codeToHtml(code, {
							lang: safeLang,
							theme
						})
					);
					const htmlProp = JSON.stringify(lightHtml);
					const langProp = JSON.stringify(safeLang);
					const rawProp = JSON.stringify(code);
					return `<svelte:component this={Reflect.get(globalThis, "__MarkdownPre")} lang={${langProp}} html={${htmlProp}} raw={${rawProp}} />`;
				}
			}
		})
	],
	extensions: ['.svelte', '.svx']
};

export default config;
