import { docsManifest, getDocHref } from '$lib/docs/manifest';

export type DocSearchResult = {
	title: string;
	slug: string;
	href: string;
	heading?: string;
	anchor?: string;
	snippet?: string;
	matchType: 'title' | 'heading' | 'content';
	score: number;
};

const docModules = import.meta.glob<string>('/src/routes/docs/**/+page.svx', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const slugify = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

function stripMarkdown(content: string): string {
	return content
		.replace(/import\s+.*?;/g, '')
		.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
		.replace(/#{1,6}\s+/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function getSnippet(content: string, query: string, maxLength = 130): string {
	const lowerContent = content.toLowerCase();
	const lowerQuery = query.toLowerCase();
	const index = lowerContent.indexOf(lowerQuery);

	if (index === -1) return content.slice(0, maxLength);

	const start = Math.max(0, index - Math.floor(maxLength / 2));
	const end = Math.min(content.length, index + query.length + Math.floor(maxLength / 2));
	let snippet = content.slice(start, end);

	if (start > 0) snippet = `...${snippet}`;
	if (end < content.length) snippet = `${snippet}...`;

	return snippet;
}

function pathToSlug(path: string): string {
	const cleaned = path
		.replace('/src/routes/docs/', '')
		.replace('/+page.svx', '')
		.replace(/\/index$/, '')
		.trim();

	if (cleaned === '' || cleaned === '+page.svx') return '';
	return cleaned;
}

function parseDocs() {
	const index: DocSearchResult[] = [];

	for (const [path, raw] of Object.entries(docModules)) {
		const slug = pathToSlug(path);
		const href = getDocHref(slug);
		const manifestEntry = docsManifest.find((entry) => entry.slug === slug);
		const title = manifestEntry?.title ?? (slug || 'Overview');

		index.push({
			title,
			slug,
			href,
			matchType: 'title',
			score: 0
		});

		const withoutFrontmatter = raw.replace(/^---\n[\s\S]+?\n---\n/, '');
		const lines = withoutFrontmatter.split('\n');
		let currentHeading = title;
		let currentAnchor = '';
		let contentBuffer: string[] = [];
		const slugCounts = new Map<string, number>();
		let untitledSectionCount = 0;

		const flushBuffer = () => {
			if (contentBuffer.length === 0) return;
			const text = stripMarkdown(contentBuffer.join(' '));
			if (text.length > 16) {
				index.push({
					title,
					slug,
					href,
					heading: currentHeading,
					anchor: currentAnchor,
					snippet: text,
					matchType: 'content',
					score: 0
				});
			}
			contentBuffer = [];
		};

		for (const line of lines) {
			const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
			if (headingMatch) {
				flushBuffer();

				const headingText = headingMatch[2].trim();
				let baseSlug = slugify(headingText);
				if (!baseSlug) {
					untitledSectionCount += 1;
					baseSlug = `section-${untitledSectionCount}`;
				}

				const count = slugCounts.get(baseSlug);
				let uniqueSlug = baseSlug;
				if (typeof count === 'number') {
					const nextCount = count + 1;
					slugCounts.set(baseSlug, nextCount);
					uniqueSlug = `${baseSlug}-${nextCount}`;
				} else {
					slugCounts.set(baseSlug, 0);
				}

				currentHeading = headingText;
				currentAnchor = `#${uniqueSlug}`;

				index.push({
					title,
					slug,
					href,
					heading: headingText,
					anchor: currentAnchor,
					matchType: 'heading',
					score: 0
				});
				continue;
			}

			if (line.trim() && !line.trim().startsWith('import') && !line.trim().startsWith('---')) {
				contentBuffer.push(line);
			}
		}

		flushBuffer();
	}

	return index;
}

const searchIndex = parseDocs();

export function searchDocs(query: string): DocSearchResult[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return [];

	const grouped = new Map<
		string,
		{ parent: DocSearchResult; children: DocSearchResult[]; maxScore: number }
	>();

	for (const item of searchIndex) {
		let score = 0;
		let snippet = item.snippet;

		const titleMatch = item.title.toLowerCase().includes(normalized);
		const headingMatch = item.heading?.toLowerCase().includes(normalized);
		const contentMatch = item.snippet?.toLowerCase().includes(normalized);

		if (item.matchType === 'title' && titleMatch) {
			score += 12;
			if (item.title.toLowerCase().startsWith(normalized)) score += 5;
		} else if (item.matchType === 'heading' && headingMatch) {
			score += 7;
		} else if (item.matchType === 'content' && contentMatch) {
			score += 2;
			if (item.snippet) {
				snippet = getSnippet(item.snippet, query);
			}
		}

		if (score <= 0) continue;

		if (!grouped.has(item.href)) {
			grouped.set(item.href, {
				parent: {
					title: item.title,
					slug: item.slug,
					href: item.href,
					matchType: 'title',
					score: 0
				},
				children: [],
				maxScore: 0
			});
		}

		const group = grouped.get(item.href);
		if (!group) continue;

		if (item.matchType === 'title') {
			group.parent = { ...item, score };
		} else {
			group.children.push({ ...item, score, snippet });
		}

		if (score > group.maxScore) {
			group.maxScore = score;
		}
	}

	return Array.from(grouped.values())
		.sort((a, b) => b.maxScore - a.maxScore || a.parent.title.localeCompare(b.parent.title))
		.slice(0, 20)
		.flatMap((group) => {
			const children = group.children.sort((a, b) => b.score - a.score).slice(0, 4);
			return [group.parent, ...children];
		});
}
