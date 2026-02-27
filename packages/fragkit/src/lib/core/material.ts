import type { TextureDefinitionMap, UniformMap } from './types';
import { normalizeTextureDefinition } from './textures';
import { assertUniformName, resolveUniformLayout } from './uniforms';

/**
 * Allowed value types for WGSL `const` define injection.
 */
export type MaterialDefineValue = string | number | boolean;

/**
 * Define map keyed by uniform-compatible identifier names.
 */
export type MaterialDefines = Record<string, MaterialDefineValue>;

/**
 * Public material declaration consumed by `FragCanvas`.
 */
export interface FragMaterial {
	/**
	 * User WGSL source containing `frag(uv: vec2f) -> vec4f`.
	 */
	fragment: string;
	/**
	 * Initial uniform values.
	 */
	uniforms?: UniformMap;
	/**
	 * Texture definitions keyed by texture uniform name.
	 */
	textures?: TextureDefinitionMap;
	/**
	 * Optional compile-time define constants injected into WGSL.
	 */
	defines?: MaterialDefines;
}

/**
 * Fully resolved, immutable material snapshot used for renderer creation/caching.
 */
export interface ResolvedMaterial {
	/**
	 * Final fragment WGSL after define injection.
	 */
	fragmentWgsl: string;
	/**
	 * Cloned uniforms.
	 */
	uniforms: UniformMap;
	/**
	 * Cloned texture definitions.
	 */
	textures: TextureDefinitionMap;
	/**
	 * Resolved packed uniform layout.
	 */
	uniformLayout: ReturnType<typeof resolveUniformLayout>;
	/**
	 * Sorted texture keys.
	 */
	textureKeys: string[];
	/**
	 * Deterministic JSON signature for cache invalidation.
	 */
	signature: string;
}

/**
 * Builds a deterministic texture-config signature map used in material cache signatures.
 *
 * @param textures - Raw texture definitions from material input.
 * @param textureKeys - Sorted texture keys.
 * @returns Compact signature entries describing effective texture config per key.
 */
function buildTextureConfigSignature(
	textures: TextureDefinitionMap,
	textureKeys: string[]
): Record<string, string> {
	const signature: Record<string, string> = {};

	for (const key of textureKeys) {
		const normalized = normalizeTextureDefinition(textures[key]);
		signature[key] = [
			normalized.colorSpace,
			normalized.flipY ? '1' : '0',
			normalized.generateMipmaps ? '1' : '0',
			normalized.premultipliedAlpha ? '1' : '0',
			normalized.anisotropy,
			normalized.filter,
			normalized.addressModeU,
			normalized.addressModeV
		].join(':');
	}

	return signature;
}

/**
 * Converts a define entry to a WGSL `const` declaration line.
 *
 * @param key - Define identifier.
 * @param value - Define value.
 * @returns WGSL declaration line.
 */
function toDefineLine(key: string, value: MaterialDefineValue): string {
	if (typeof value === 'boolean') {
		return `const ${key}: bool = ${value ? 'true' : 'false'};`;
	}

	if (typeof value === 'number') {
		if (!Number.isFinite(value)) {
			throw new Error(`Invalid define value for "${key}". Define numbers must be finite.`);
		}

		const valueLiteral = Number.isInteger(value) ? `${value}.0` : `${value}`;
		return `const ${key}: f32 = ${valueLiteral};`;
	}

	return `const ${key} = ${value};`;
}

/**
 * Creates a stable WGSL define block from the provided map.
 *
 * @param defines - Optional material defines.
 * @returns Joined WGSL const declarations ordered by key.
 */
export function buildDefinesBlock(defines: MaterialDefines | undefined): string {
	if (!defines || Object.keys(defines).length === 0) {
		return '';
	}

	return Object.entries(defines)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => {
			assertUniformName(key);
			return toDefineLine(key, value);
		})
		.join('\n');
}

/**
 * Prepends resolved defines to a fragment shader.
 *
 * @param fragment - Raw WGSL fragment source.
 * @param defines - Optional define map.
 * @returns Fragment source with a leading define block when defines are present.
 */
export function applyMaterialDefines(
	fragment: string,
	defines: MaterialDefines | undefined
): string {
	const defineBlock = buildDefinesBlock(defines);
	if (defineBlock.length === 0) {
		return fragment;
	}

	return `${defineBlock}\n\n${fragment}`;
}

/**
 * Creates a shallow-cloned material object that is safe to reuse and mutate externally.
 *
 * @param input - User material declaration.
 * @returns Cloned material snapshot.
 */
export function createMaterial(input: FragMaterial): FragMaterial {
	return {
		fragment: input.fragment,
		uniforms: { ...(input.uniforms ?? {}) },
		textures: { ...(input.textures ?? {}) },
		defines: { ...(input.defines ?? {}) }
	};
}

/**
 * Resolves a material to renderer-ready data and a deterministic signature.
 *
 * @param material - Material input.
 * @returns Resolved material with packed uniform layout, sorted texture keys and cache signature.
 */
export function resolveMaterial(material: FragMaterial): ResolvedMaterial {
	const base = material;
	const uniforms = { ...(base.uniforms ?? {}) };
	const textures = { ...(base.textures ?? {}) };
	const uniformLayout = resolveUniformLayout(uniforms);
	const textureKeys = Object.keys(textures).sort();
	const fragmentWgsl = applyMaterialDefines(base.fragment, base.defines);
	const textureConfig = buildTextureConfigSignature(textures, textureKeys);

	const signature = JSON.stringify({
		fragmentWgsl,
		uniforms: uniformLayout.entries.map((entry) => `${entry.name}:${entry.type}`),
		textureKeys,
		textureConfig
	});

	return {
		fragmentWgsl,
		uniforms,
		textures,
		uniformLayout,
		textureKeys,
		signature
	};
}
