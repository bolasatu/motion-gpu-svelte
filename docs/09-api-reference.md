# API Reference

## Root exports (`@motion-core/motion-gpu`)

- `FragCanvas`
- `defineMaterial`
- `useMotionGPU`
- `useFrame`
- `useTexture`
- `BlitPass`
- `CopyPass`
- `ShaderPass`

## Advanced exports (`@motion-core/motion-gpu/advanced`)

- everything from root
- `useMotionGPUUserContext`

## `FragCanvas` props

- `material: FragMaterial` (required)
- `renderTargets?: RenderTargetDefinitionMap`
- `passes?: RenderPass[]`
- `clearColor?: [number, number, number, number]` (default `[0,0,0,1]`)
- `outputColorSpace?: 'srgb' | 'linear'` (default `'srgb'`)
- `renderMode?: 'always' | 'on-demand' | 'manual'` (default `'always'`)
- `autoRender?: boolean` (default `true`)
- `maxDelta?: number` (default `0.1`)
- `adapterOptions?: GPURequestAdapterOptions`
- `deviceDescriptor?: GPUDeviceDescriptor`
- `dpr?: number` (default device pixel ratio)
- `showErrorOverlay?: boolean` (default `true`)
- `onError?: (report) => void`
- `class?: string`
- `style?: string`
- `children?: Snippet`

## `defineMaterial(input)`

Input shape:

- `fragment` (required WGSL)
- `uniforms?`
- `textures?`
- `defines?`
- `includes?`

Returns immutable `FragMaterial`.

## `useFrame`

Options (`UseFrameOptions`):

- `autoStart?: boolean`
- `autoInvalidate?: boolean`
- `invalidation?: FrameTaskInvalidation`
- `stage?: FrameKey | FrameStage`
- `before?: FrameKey | FrameTask | Array<...>`
- `after?: FrameKey | FrameTask | Array<...>`
- `running?: () => boolean`

Return (`UseFrameResult`):

- `task`
- `start()`
- `stop()`
- `started` readable

## `useTexture(urlInput, options?)`

- `urlInput`: `string[] | (() => string[])`
- `options`: forwarded to loader (`fetch`, decode, metadata overrides)

Return:

- `textures`, `loading`, `error` (all `CurrentReadable`)
- `reload(): Promise<void>`

## `useMotionGPUUserContext` (advanced)

Overloads:

- `useMotionGPUUserContext()` -> full user store
- `useMotionGPUUserContext(namespace)` -> namespaced readable store
- `useMotionGPUUserContext(namespace, value, options?)` -> set value and return resolved entry

## Built-in pass constructors

- `new BlitPass(options?)`
- `new CopyPass(options?)`
- `new ShaderPass({ fragment, ...flags })`

All implement `RenderPass` interface.

## Key types

- uniforms: `UniformValue`, `UniformType`, `UniformMap`
- textures: `TextureValue`, `TextureDefinitionMap`, `TextureUpdateMode`
- passes: `RenderPass`, `RenderPassContext`, `RenderTargetDefinitionMap`
- scheduler: `RenderMode`, `FrameState`, `FrameInvalidationToken`
