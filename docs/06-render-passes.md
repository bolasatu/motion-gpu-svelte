# Render Passes and Render Targets

## Render graph model

Each pass can define:

- `enabled`
- `needsSwap`
- `input`: `'source' | 'target'`
- `output`: `'source' | 'target' | 'canvas'`
- attachment flags: `clear`, `clearColor`, `preserve`

`planRenderGraph(...)` validates and resolves execution steps.

## Ping-pong flow

Default pass behavior (`needsSwap: true`) is `source -> target`, then swap source/target references.

This enables chained post-processing with minimal texture allocations.

## Built-in passes

### `BlitPass`

- Fullscreen sample from `input` and write to `output`.
- Useful for plain copy or explicit stage boundaries.

### `CopyPass`

- Tries `copyTextureToTexture` when safe.
- Falls back to fullscreen blit when direct copy cannot be used.

### `ShaderPass`

Requires fragment contract:

```wgsl
fn shade(inputColor: vec4f, uv: vec2f) -> vec4f
```

Used for custom color correction, blur, bloom combine, LUT transforms, etc.

## Render targets

`renderTargets` is a named map:

```ts
{
  half: { scale: 0.5 },
  bloom: { width: 640, height: 360, format: 'rgba16float' }
}
```

Rules:

- Keys must be WGSL-safe identifiers.
- Width/height and scale must be positive finite values.
- If width/height omitted, dimensions are derived from canvas size * scale.

## Dynamic targets and passes

`FragCanvas` accepts both static arrays/maps and dynamic getters (`getPasses`, `getRenderTargets` internally via props wiring).

At runtime:

- pass lifecycle is synced (`setSize`, `dispose`)
- render targets are reallocated only when resolved signature changes

## Pass context API

Each pass receives:

- `device`, `commandEncoder`
- slots: `source`, `target`, `canvas`
- resolved `input`, `output`
- `targets` map (named runtime render targets)
- frame info: `time`, `delta`, `width`, `height`
- `beginRenderPass(...)` helper with per-pass override options
