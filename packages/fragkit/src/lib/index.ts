/**
 * Public Fragkit package entrypoint.
 *
 * Exposes the production-ready core API for fullscreen WGSL rendering workflows.
 */
export { default as FragCanvas } from './FragCanvas.svelte';
export { defineMaterial } from './core/material';
export { BlitPass, CopyPass, ShaderPass } from './passes';
export { useFragkit } from './fragkit-context';
export { useFrame } from './frame-context';
export { useTexture } from './use-texture';
export type {
	FrameState,
	OutputColorSpace,
	RenderPass,
	RenderPassContext,
	RenderPassFlags,
	RenderPassInputSlot,
	RenderPassOutputSlot,
	RenderMode,
	RenderTarget,
	RenderTargetDefinition,
	RenderTargetDefinitionMap,
	TextureData,
	TextureDefinition,
	TextureDefinitionMap,
	TextureMap,
	TextureSource,
	TextureValue,
	TypedUniform,
	UniformMat4Value,
	UniformMap,
	UniformType,
	UniformValue
} from './core/types';
export type { LoadedTexture, TextureLoadOptions } from './core/texture-loader';
export type {
	FragMaterial,
	FragMaterialInput,
	MaterialDefineValue,
	MaterialDefines
} from './core/material';
export type { FragkitContext } from './fragkit-context';
export type { UseFrameOptions, UseFrameResult } from './frame-context';
export type { TextureUrlInput, UseTextureResult } from './use-texture';
