# Texture System

## Texture declaration (`TextureDefinition`)

Each texture key can define:

- `source`
- `colorSpace`: `'srgb' | 'linear'`
- `flipY`
- `generateMipmaps`
- `premultipliedAlpha`
- `update`: `'once' | 'onInvalidate' | 'perFrame'`
- sampler settings: `anisotropy`, `filter`, `addressModeU`, `addressModeV`

## Runtime texture value forms

- `TextureSource` (`ImageBitmap`, `HTMLImageElement`, `HTMLCanvasElement`, `HTMLVideoElement`)
- `TextureData` object (`{ source, width?, height?, ...overrides }`)
- `null` (unbind to fallback)

## Upload behavior and update modes

`renderer.ts` applies update policy per texture:

- `once`: upload when resource is allocated or changed.
- `onInvalidate`: upload when an invalidation-worthy change is detected.
- `perFrame`: upload every frame (useful for video/live canvas).

If source is a video and no mode is provided, default resolves to `perFrame`.

## Mipmaps

When `generateMipmaps` is true, Motion GPU generates mip chain on CPU by downscaling through canvas contexts and uploading each level.

## URL texture loading (`useTexture`)

`useTexture(urls, options)` wraps URL loading with reactive state:

- `textures.current`: `LoadedTexture[] | null`
- `loading.current`: `boolean`
- `error.current`: `Error | null`
- `reload()`: aborts in-flight request and starts fresh

### Loader details

- Uses `fetch` + `createImageBitmap`.
- Supports abort via `AbortSignal`.
- Maintains a resource cache keyed by full IO/decode config.
- Disposes already-loaded bitmaps on failure.

## Recommended patterns

- Static image atlas: `update: 'once'`.
- User-interactive updates: `update: 'onInvalidate'` + explicit invalidation tokens.
- Video/webcam/canvas stream: `update: 'perFrame'`.
