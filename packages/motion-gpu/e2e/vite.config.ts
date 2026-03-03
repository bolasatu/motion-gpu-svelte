import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	root: path.resolve(dirname, 'harness'),
	plugins: [svelte()],
	server: {
		host: '127.0.0.1',
		port: 4175,
		strictPort: true
	},
	preview: {
		host: '127.0.0.1',
		port: 4175,
		strictPort: true
	}
});
