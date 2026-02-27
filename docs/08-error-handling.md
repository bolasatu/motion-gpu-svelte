# Error Handling and Diagnostics

## Error pipeline

`FragCanvas` catches failures in two phases:

- `initialization`
- `render`

It converts unknown errors into a normalized `MotionGPUErrorReport`.

## Error report fields

- `title`
- `message`
- `hint`
- `details[]`
- `stack[]`
- `rawMessage`
- `phase`

## Built-in classification examples

Known patterns are mapped to readable titles/hints:

- WebGPU unavailable
- adapter unavailable
- invalid webgpu canvas context
- WGSL compilation failed
- device lost
- uncaptured GPU error
- bind group mismatch
- texture usage mismatch

Unknown errors still get a generic MotionGPU classification.

## UI behavior

By default `FragCanvas` renders a full-screen diagnostic overlay (through internal `Portal.svelte`).

Props:

- `showErrorOverlay` (default `true`)
- `onError(report)` callback

Even with overlay disabled, `onError` still receives reports.

## Shader compile diagnostics

Compiler errors include generated line number and mapped source location:

- `user fragment line X`
- `include "name" line X`
- `define "NAME"`

This is enabled by material preprocessor + shader line map integration.

## Renderer retry behavior

If renderer creation fails for a given material signature, `FragCanvas` retries with exponential backoff (capped delay), and resets retry state when signature changes.
