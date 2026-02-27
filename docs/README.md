# Motion GPU Documentation

This documentation covers the `@motion-core/motion-gpu` package in depth, from core concepts to practical production use cases.

## Who this is for

- You want to render fullscreen WGSL shaders in Svelte 5.
- You want explicit control over frame scheduling and render invalidation.
- You want a post-processing pipeline (passes + render targets) on top of a fullscreen shader.

## Documentation map

1. [Concepts and Architecture](./01-concepts.md)
2. [Getting Started](./02-getting-started.md)
3. [Material System (WGSL + uniforms + defines + includes)](./03-material-system.md)
4. [Texture System](./04-texture-system.md)
5. [Frame Scheduler and Render Modes](./05-frame-scheduler.md)
6. [Render Passes and Render Targets](./06-render-passes.md)
7. [Hooks and Context](./07-hooks-and-context.md)
8. [Error Handling and Diagnostics](./08-error-handling.md)
9. [API Reference](./09-api-reference.md)
10. [Examples](./10-examples.md)
11. [Use Cases](./11-use-cases.md)
12. [Testing and Internal Notes](./12-testing-and-internal-notes.md)

## 60-second mental model

- `FragCanvas` owns the WebGPU renderer lifecycle.
- `defineMaterial` defines your main fullscreen fragment (`fn frag(uv: vec2f) -> vec4f`).
- `useFrame` schedules per-frame logic and controls invalidation.
- `useMotionGPU` gives runtime context (canvas, size, renderMode, scheduler).
- Optional passes (`BlitPass`, `CopyPass`, `ShaderPass`) create a post-processing graph.
- Optional advanced hook (`useMotionGPUUserContext`) provides namespaced shared runtime context.

## Package entrypoints

- Root entrypoint:
  - `@motion-core/motion-gpu`
  - Production API (`FragCanvas`, `defineMaterial`, `useFrame`, `useMotionGPU`, `useTexture`, passes).
- Advanced entrypoint:
  - `@motion-core/motion-gpu/advanced`
  - Adds power-user APIs (`useMotionGPUUserContext`, advanced scheduler/user-context types).
