# Testing and Internal Notes

## What is covered by tests

The package test suite validates:

- public API surface for root vs advanced entrypoints
- shader generation and source mapping
- uniform type/layout/packing behavior
- material validation, defines, includes, signatures
- texture normalization and URL loader behavior (including cancellation/cache)
- scheduler ordering, invalidation, modes, profiling, diagnostics
- render graph validation rules
- error normalization behavior

## Important contracts enforced by tests

- `FragCanvas` shows readable WebGPU error diagnostics and reports `onError`.
- `useMotionGPU` and `useFrame` must run inside `FragCanvas`.
- `useMotionGPUUserContext` supports `skip`, `merge`, and `replace` modes.
- `ShaderPass` requires `fn shade(inputColor: vec4f, uv: vec2f) -> vec4f`.

## Build and validation commands

From `packages/motion-gpu`:

```bash
bun run build
bun run test
bun run check
bun run lint
```

## Internal implementation details worth knowing

- Renderer writes frame uniforms every frame, but material uniforms use dirty-range writes.
- Textures keep fallback 1x1 white textures until real source is available.
- Render targets are realloc-only on signature change (size/format/key topology).
- Shader compile errors are remapped to fragment/include/define source context.
- Scheduler diagnostics and profiling are powered by the same timing collection path.

## Practical caveats

- WebGPU availability varies by browser, platform, and secure-context settings.
- `onInvalidate` texture mode is not equivalent to `perFrame`; choose explicitly.
- `autoRender = false` overrides mode behavior and suppresses rendering entirely.
- Material objects should always come from `defineMaterial` (do not handcraft plain objects).
