import type { LayoutLoad } from './$types';
import { getAdjacentDocs, getDocBySlug } from '$lib/docs/manifest';

function pathToSlug(pathname: string): string {
	const normalized = pathname.replace(/\/+$/, '');
	if (normalized === '/docs' || normalized === '') return '';
	return normalized.replace(/^\/docs\//, '');
}

export const load: LayoutLoad = ({ url }) => {
	const slug = pathToSlug(url.pathname);
	const currentDoc = getDocBySlug(slug);
	const { previous, next } = getAdjacentDocs(slug);

	return {
		slug,
		currentDoc,
		previousDoc: previous,
		nextDoc: next
	};
};
