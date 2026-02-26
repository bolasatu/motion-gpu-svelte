export type UniformValue =
	| number
	| [number, number]
	| [number, number, number]
	| [number, number, number, number];

export type UniformMap = Record<string, UniformValue>;
export type TextureSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

export interface TextureData {
	source: TextureSource;
	width?: number;
	height?: number;
}

export type TextureValue = TextureData | TextureSource | null;

export interface TextureDefinition {
	source?: TextureValue;
	colorSpace?: 'srgb' | 'linear';
	flipY?: boolean;
	filter?: GPUFilterMode;
	addressModeU?: GPUAddressMode;
	addressModeV?: GPUAddressMode;
}

export type TextureDefinitionMap = Record<string, TextureDefinition>;
export type TextureMap = Record<string, TextureValue>;
export type OutputColorSpace = 'srgb' | 'linear';

export type RenderMode = 'always' | 'on-demand' | 'manual';

export interface FrameState {
	time: number;
	delta: number;
	setUniform: (name: string, value: UniformValue) => void;
	setTexture: (name: string, value: TextureValue) => void;
	invalidate: () => void;
	advance: () => void;
	renderMode: RenderMode;
	autoRender: boolean;
	canvas: HTMLCanvasElement;
}

export interface RendererOptions {
	canvas: HTMLCanvasElement;
	fragmentWgsl: string;
	uniformKeys: string[];
	textureKeys: string[];
	textureDefinitions: TextureDefinitionMap;
	outputColorSpace: OutputColorSpace;
	clearColor: [number, number, number, number];
	getDpr: () => number;
}

export interface Renderer {
	render: (input: {
		time: number;
		delta: number;
		uniforms: UniformMap;
		textures: TextureMap;
	}) => void;
	destroy: () => void;
}
