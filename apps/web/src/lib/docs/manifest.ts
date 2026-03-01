export type DocEntry = {
	slug: string;
	title: string;
	description: string;
};

export type DocRouteGroup = {
	id: string;
	title: string;
	entries: DocEntry[];
};

export const docsRouteGroups: DocRouteGroup[] = [
	{
		id: 'foundations',
		title: 'Foundations',
		entries: [
			{
				slug: '',
				title: 'Overview',
				description: 'Core mental model, package anatomy, and map of the MotionGPU documentation.'
			},
			{
				slug: 'concepts-and-architecture',
				title: 'Concepts and Architecture',
				description:
					'Design goals, runtime lifecycle, rebuild policy, data flow, and scheduling architecture.'
			},
			{
				slug: 'getting-started',
				title: 'Getting Started',
				description:
					'Install MotionGPU and build your first fullscreen shader runtime in Svelte 5, step by step.'
			}
		]
	},
	{
		id: 'shader-authoring',
		title: 'Shader Authoring',
		entries: [
			{
				slug: 'writing-shaders',
				title: 'Writing WGSL Shaders',
				description:
					'WGSL basics for MotionGPU: the fragment contract, built-in bindings, coordinate space, and common patterns.'
			},
			{
				slug: 'shader-includes-and-defines',
				title: 'Includes and Defines',
				description:
					'The #include preprocessor, typed define constants, expansion ordering, and source-map diagnostics.'
			}
		]
	},
	{
		id: 'runtime-systems',
		title: 'Runtime Systems',
		entries: [
			{
				slug: 'defining-materials',
				title: 'Defining Materials',
				description:
					'The defineMaterial() API: validation, immutability, signature caching, and practical authoring guidance.'
			},
			{
				slug: 'uniforms',
				title: 'Uniforms',
				description:
					'Uniform input forms, type inference, WGSL alignment and packing rules, and runtime updates with setUniform.'
			},
			{
				slug: 'textures',
				title: 'Texture Definitions',
				description:
					'TextureDefinition fields, source types, update modes, upload behavior, mipmaps, and sampler configuration.'
			},
			{
				slug: 'texture-loading',
				title: 'Loading Textures',
				description:
					'The useTexture hook: TextureLoadOptions, blob caching, abort and reload race safety, and reactive state.'
			},
			{
				slug: 'frame-scheduler',
				title: 'Frame Scheduler',
				description:
					'useFrame overloads, UseFrameOptions, invalidation policies, and the FrameState callback API.'
			},
			{
				slug: 'render-modes',
				title: 'Render Modes and Scheduling',
				description:
					'always, on-demand, and manual render modes, the stages API, dependency ordering, and profiling.'
			},
			{
				slug: 'render-passes',
				title: 'Render Passes',
				description:
					'Render graph planning, slot semantics, BlitPass, CopyPass, ShaderPass, and pass lifecycle.'
			},
			{
				slug: 'render-targets',
				title: 'Render Targets',
				description:
					'RenderTargetDefinitionMap: resolution rules, scale and explicit dimensions, and format selection.'
			}
		]
	},
	{
		id: 'context-and-hooks',
		title: 'Context and Hooks',
		entries: [
			{
				slug: 'hooks-and-context',
				title: 'Hooks and Context',
				description:
					'useMotionGPU() context shape, the CurrentWritable pattern, reactive store access, and integration patterns.'
			},
			{
				slug: 'user-context',
				title: 'User Context (Advanced)',
				description:
					'useMotionGPUUserContext overloads, conflict strategies (skip, replace, merge), and plugin state patterns.'
			}
		]
	},
	{
		id: 'reference-and-reliability',
		title: 'Reference and Reliability',
		entries: [
			{
				slug: 'error-handling',
				title: 'Error Handling and Diagnostics',
				description:
					'Normalized error reporting, classification patterns, overlay behavior, shader compile diagnostics, and retry strategy.'
			},
			{
				slug: 'fragcanvas-reference',
				title: 'FragCanvas Reference',
				description:
					'Complete FragCanvas props reference with types, defaults, lifecycle, error callbacks, and styling.'
			},
			{
				slug: 'api-reference',
				title: 'API Reference',
				description:
					'Complete export tables for root and advanced entrypoints, type groups, FrameState, and RenderPassContext.'
			},
			{
				slug: 'examples',
				title: 'Examples',
				description:
					'Worked integration examples: animation loops, on-demand rendering, textures, post-processing, and more.'
			},
			{
				slug: 'testing-and-internals',
				title: 'Testing and Internal Notes',
				description:
					'Test coverage map, enforced runtime contracts, implementation details, build commands, and caveats.'
			}
		]
	}
];

export const docsManifest: DocEntry[] = docsRouteGroups.flatMap((group) => group.entries);

export const getDocHref = (slug: string) => (slug ? `/docs/${slug}` : '/docs');

export const getDocBySlug = (slug: string) =>
	docsManifest.find((entry) => entry.slug === slug) ?? null;

export const getAdjacentDocs = (slug: string) => {
	const index = docsManifest.findIndex((entry) => entry.slug === slug);
	if (index === -1) {
		return { previous: null, next: null } as const;
	}

	return {
		previous: index > 0 ? docsManifest[index - 1] : null,
		next: index < docsManifest.length - 1 ? docsManifest[index + 1] : null
	} as const;
};
