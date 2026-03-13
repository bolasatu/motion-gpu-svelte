import { assertUniformName } from './uniforms';
import type { MaterialLineMap, MaterialSourceLocation } from './material-preprocess';
import type { UniformLayout } from './types';

/**
 * Fallback uniform field used when no custom uniforms are provided.
 */
const DEFAULT_UNIFORM_FIELD = 'motiongpu_unused: vec4f,';

/**
 * Builds WGSL struct fields for user uniforms.
 */
function buildUniformStruct(layout: UniformLayout): string {
	if (layout.entries.length === 0) {
		return DEFAULT_UNIFORM_FIELD;
	}

	return layout.entries
		.map((entry) => {
			assertUniformName(entry.name);
			return `${entry.name}: ${entry.type},`;
		})
		.join('\n\t');
}

/**
 * Builds a numeric expression that references one uniform value to keep bindings alive.
 */
function getKeepAliveExpression(layout: UniformLayout): string {
	if (layout.entries.length === 0) {
		return 'motiongpuUniforms.motiongpu_unused.x';
	}

	const [firstEntry] = layout.entries;
	if (!firstEntry) {
		return 'motiongpuUniforms.motiongpu_unused.x';
	}

	if (firstEntry.type === 'f32') {
		return `motiongpuUniforms.${firstEntry.name}`;
	}

	if (firstEntry.type === 'mat4x4f') {
		return `motiongpuUniforms.${firstEntry.name}[0].x`;
	}

	return `motiongpuUniforms.${firstEntry.name}.x`;
}

/**
 * Builds texture sampler/texture binding declarations.
 */
function buildTextureBindings(textureKeys: string[]): string {
	if (textureKeys.length === 0) {
		return '';
	}

	const declarations: string[] = [];

	for (let index = 0; index < textureKeys.length; index += 1) {
		const key = textureKeys[index];
		if (key === undefined) {
			continue;
		}

		assertUniformName(key);
		const binding = 2 + index * 2;
		declarations.push(`@group(0) @binding(${binding}) var ${key}Sampler: sampler;`);
		declarations.push(`@group(0) @binding(${binding + 1}) var ${key}: texture_2d<f32>;`);
	}

	return declarations.join('\n');
}

/**
 * Optionally returns helper WGSL for linear-to-sRGB conversion.
 */
function buildColorTransformHelpers(enableSrgbTransform: boolean): string {
	if (!enableSrgbTransform) {
		return '';
	}

	return `
fn motiongpuLinearToSrgb(linearColor: vec3f) -> vec3f {
	let cutoff = vec3f(0.0031308);
	let lower = linearColor * 12.92;
	let higher = vec3f(1.055) * pow(linearColor, vec3f(1.0 / 2.4)) - vec3f(0.055);
	return select(lower, higher, linearColor > cutoff);
}
`;
}

/**
 * Builds fragment output code with optional color-space conversion.
 */
function buildFragmentOutput(keepAliveExpression: string, enableSrgbTransform: boolean): string {
	if (enableSrgbTransform) {
		return `
	let fragColor = frag(in.uv);
	let motiongpuKeepAlive = ${keepAliveExpression};
	let motiongpuLinear = vec4f(fragColor.rgb + motiongpuKeepAlive * 0.0, fragColor.a);
	let motiongpuSrgb = motiongpuLinearToSrgb(max(motiongpuLinear.rgb, vec3f(0.0)));
	return vec4f(motiongpuSrgb, motiongpuLinear.a);
`;
	}

	return `
	let fragColor = frag(in.uv);
	let motiongpuKeepAlive = ${keepAliveExpression};
	return vec4f(fragColor.rgb + motiongpuKeepAlive * 0.0, fragColor.a);
`;
}

/**
 * 1-based map from generated WGSL lines to original material source lines.
 */
export type ShaderLineMap = Array<MaterialSourceLocation | null>;

/**
 * Result of shader source generation with line mapping metadata.
 */
export interface BuiltShaderSource {
	/**
	 * Full WGSL source code.
	 */
	code: string;
	/**
	 * 1-based generated-line map to material source locations.
	 */
	lineMap: ShaderLineMap;
}

/**
 * Assembles complete WGSL shader source used by the fullscreen renderer pipeline.
 *
 * @param fragmentWgsl - User fragment shader code containing `frag(uv: vec2f) -> vec4f`.
 * @param uniformLayout - Resolved uniform layout.
 * @param textureKeys - Sorted texture keys.
 * @param options - Shader build options.
 * @returns Complete WGSL source for vertex + fragment stages.
 */
export function buildShaderSource(
	fragmentWgsl: string,
	uniformLayout: UniformLayout,
	textureKeys: string[] = [],
	options?: { convertLinearToSrgb?: boolean }
): string {
	const uniformFields = buildUniformStruct(uniformLayout);
	const keepAliveExpression = getKeepAliveExpression(uniformLayout);
	const textureBindings = buildTextureBindings(textureKeys);
	const enableSrgbTransform = options?.convertLinearToSrgb ?? false;
	const colorTransformHelpers = buildColorTransformHelpers(enableSrgbTransform);
	const fragmentOutput = buildFragmentOutput(keepAliveExpression, enableSrgbTransform);

	// WGSL syntax overview for beginners:
	// - `var<uniform>` defines read-only uniform variables.
	// - `@group(N) @binding(M)` maps the variable to the layout defined in the CPU renderer.
	//   All buffers, samplers, and textures must have unique binding locations.
	// - `textureSample()` takes a texture and a sampler to read pixel data at a UV coordinate.
	// - `@builtin(position)` represents the SV_Position/gl_Position coordinate.
	// - `@location(N)` denotes a user-defined inter-stage variable (like UVs) or fragment output.
	return `
struct MotionGPUFrame {
	time: f32,
	delta: f32,
	resolution: vec2f,
};

struct MotionGPUUniforms {
	${uniformFields}
};

// Bind Group 0, Binding 0: Frame uniforms
@group(0) @binding(0) var<uniform> motiongpuFrame: MotionGPUFrame;
// Bind Group 0, Binding 1: User uniforms
@group(0) @binding(1) var<uniform> motiongpuUniforms: MotionGPUUniforms;
// Samplers and Textures are bound sequentially starting from Binding 2
${textureBindings}
${colorTransformHelpers}

struct MotionGPUVertexOut {
	@builtin(position) position: vec4f,
	@location(0) uv: vec2f,
};

// Fullscreen Triangle trick: WebGPU allows us to draw a triangle without vertex buffers.
// We provide 3 vertices (-1 to 3 ranges) that completely cover the normalized device coordinates (-1 to 1).
@vertex
fn motiongpuVertex(@builtin(vertex_index) index: u32) -> MotionGPUVertexOut {
	var positions = array<vec2f, 3>(
		vec2f(-1.0, -3.0),
		vec2f(-1.0, 1.0),
		vec2f(3.0, 1.0)
	);

	let position = positions[index];
	var out: MotionGPUVertexOut;
	out.position = vec4f(position, 0.0, 1.0);
	// Convert clip-space positions to standard 0-to-1 UV coordinates for fragments.
	out.uv = (position + vec2f(1.0, 1.0)) * 0.5;
	return out;
}

// User-provided fragment shader code containing \`fn frag(uv: vec2f) -> vec4f\`
${fragmentWgsl}

// The main fragment entry point called by the pipeline.
@fragment
fn motiongpuFragment(in: MotionGPUVertexOut) -> @location(0) vec4f {
	${fragmentOutput}
}
`;
}

/**
 * Assembles complete WGSL shader source with material-source line mapping metadata.
 */
export function buildShaderSourceWithMap(
	fragmentWgsl: string,
	uniformLayout: UniformLayout,
	textureKeys: string[] = [],
	options?: {
		convertLinearToSrgb?: boolean;
		fragmentLineMap?: MaterialLineMap;
	}
): BuiltShaderSource {
	const code = buildShaderSource(fragmentWgsl, uniformLayout, textureKeys, options);
	const fragmentStartIndex = code.indexOf(fragmentWgsl);
	const lineCount = code.split('\n').length;
	const lineMap: ShaderLineMap = new Array(lineCount + 1).fill(null);

	if (fragmentStartIndex === -1) {
		return {
			code,
			lineMap
		};
	}

	const fragmentStartLine = code.slice(0, fragmentStartIndex).split('\n').length;
	const fragmentLineCount = fragmentWgsl.split('\n').length;

	for (let line = 0; line < fragmentLineCount; line += 1) {
		const generatedLine = fragmentStartLine + line;
		lineMap[generatedLine] = options?.fragmentLineMap?.[line + 1] ?? {
			kind: 'fragment',
			line: line + 1
		};
	}

	return {
		code,
		lineMap
	};
}

/**
 * Converts source location metadata to user-facing diagnostics label.
 */
export function formatShaderSourceLocation(location: MaterialSourceLocation | null): string | null {
	if (!location) {
		return null;
	}

	if (location.kind === 'fragment') {
		return `fragment line ${location.line}`;
	}

	if (location.kind === 'include') {
		return `include <${location.include}> line ${location.line}`;
	}

	return `define "${location.define}" line ${location.line}`;
}
