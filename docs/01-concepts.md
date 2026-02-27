# Concepts and Architecture

## Core goals

Motion GPU is a Svelte-first WebGPU runtime for fullscreen shader rendering with:

- Strong contracts for shader/material input.
- Predictable frame scheduling.
- Built-in post-processing graph support.
- Runtime diagnostics and error normalization.

## Main runtime pieces

1. `FragCanvas.svelte`
- Creates and owns the renderer.
- Resolves material every frame.
- Runs frame scheduler callbacks.
- Executes render graph and optional passes.
- Exposes runtime context via Svelte context.

2. Material layer (`core/material.ts` + `core/material-preprocess.ts`)
- Validates fragment contract (`fn frag(uv: vec2f) -> vec4f`).
- Validates/clones uniforms and textures.
- Expands `#include <name>` directives.
- Injects typed `const` defines.
- Produces deterministic signature for pipeline rebuild policy.

3. Renderer (`core/renderer.ts`)
- Initializes WebGPU device/context.
- Compiles WGSL and maps compile errors to user source lines.
- Manages uniform buffer and dirty-range updates.
- Manages texture uploads and update modes.
- Executes scene pass + render graph + final canvas blit.

4. Frame scheduler (`frame-context.ts`)
- Registers frame tasks with ordering constraints (`before` / `after`).
- Supports task stages with custom stage callbacks.
- Controls render invalidation and `manual` advance.
- Supports diagnostics/profiling snapshots.

5. Pass graph (`core/render-graph.ts`, `passes/*`)
- Plans pass execution from declarative pass config.
- Supports source/target ping-pong and canvas output.
- Includes built-ins: `BlitPass`, `CopyPass`, `ShaderPass`.

## Render pipeline flow

1. `FragCanvas` resolves current material.
2. It builds a renderer signature from material + output color space.
3. If signature changed, renderer is rebuilt (with retry backoff on failures).
4. On each animation frame:
- Run scheduler tasks (`useFrame` callbacks).
- Merge static material uniforms/textures with runtime values set in tasks.
- Render main fullscreen shader.
- Execute optional pass graph.
- Present final output to canvas.

## Data model highlights

- Uniforms are strongly typed (`f32`, `vec2f`, `vec3f`, `vec4f`, `mat4x4f`).
- Uniform layout follows WGSL-like alignment rules.
- Texture keys and uniform keys must be valid WGSL identifiers.
- Render targets are named textures resolved from fixed size or canvas scale.

## Philosophy

- Strict validation early (`defineMaterial`, texture/uniform checks).
- Runtime flexibility where it matters (dynamic passes, dynamic render targets, dynamic textures).
- Deterministic signatures for cache/rebuild decisions.
- User-facing errors designed to be readable and actionable.
