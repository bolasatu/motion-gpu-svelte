# Material System

## Material contract

Your fragment must declare exactly this shape:

```wgsl
fn frag(uv: vec2f) -> vec4f
```

If not, `defineMaterial` throws.

## `defineMaterial(...)`

```ts
const material = defineMaterial({
  fragment: `...`,
  uniforms: { ... },
  textures: { ... },
  defines: { ... },
  includes: { ... }
});
```

The result is immutable (`Object.freeze`) and safe for caching.

## Uniforms

Supported runtime forms:

- Scalar: `number` -> `f32`
- Tuple: `[x, y]` / `[x, y, z]` / `[x, y, z, w]`
- Explicit typed value:
  - `{ type: 'f32', value: number }`
  - `{ type: 'vec2f', value: [number, number] }`
  - `{ type: 'vec3f', value: [number, number, number] }`
  - `{ type: 'vec4f', value: [number, number, number, number] }`
  - `{ type: 'mat4x4f', value: number[] | Float32Array }` (16 values)

Uniform names must be WGSL-safe identifiers: `[A-Za-z_][A-Za-z0-9_]*`.

## Defines

Define values can be:

- `boolean`
- `number` (finite)
- Typed define:
  - `{ type: 'bool' | 'f32' | 'i32' | 'u32', value: ... }`

Generated as WGSL `const` declarations and prepended deterministically (sorted by key).

## Includes

`#include <name>` directives are expanded recursively from `includes` map.

Rules:

- Include names must be WGSL-safe identifiers.
- Unknown include reference throws.
- Circular include references throw.

## Material signature

`resolveMaterial` computes a deterministic signature from:

- Preprocessed fragment WGSL (after defines/includes).
- Uniform layout (names + types).
- Texture keys and normalized texture configuration.

This drives renderer rebuild logic.

## Line mapping for diagnostics

Material preprocess keeps a generated-line -> source-line map for:

- fragment lines
- include lines
- define lines

Shader compilation errors can then be shown as user-friendly source references.
