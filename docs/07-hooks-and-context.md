# Hooks and Context

## `useMotionGPU()`

Available only inside `<FragCanvas>` subtree.

Returns runtime context:

- `canvas`
- `size` (`CurrentReadable<{ width; height }>`)
- `dpr`, `maxDelta`, `renderMode`, `autoRender` (`CurrentWritable` stores)
- `user` (`CurrentWritable<Record<namespace, unknown>>`)
- `invalidate()`, `advance()`
- `scheduler` API (stages, diagnostics, profiling)

Outside `FragCanvas`, it throws:

- `useMotionGPU must be used inside <FragCanvas>`

## `useFrame(...)`

Registers frame tasks and auto-unsubscribes on component destroy.

Common pattern:

```ts
useFrame('camera-update', (state) => {
  state.setUniform('uTime', state.time);
});
```

## `useTexture(...)`

Reactive URL texture loading hook with cancellation, error state, and reload support.

## Advanced: `useMotionGPUUserContext(...)`

Import from `@motion-core/motion-gpu/advanced`.

Modes:

- No args -> full user store.
- `namespace` -> scoped readable store.
- `namespace + value` -> set/initialize value.

Conflict behavior (`existing` option):

- `skip` (default)
- `replace`
- `merge` (shallow merge when both old/new values are plain objects)

## CurrentWritable utilities

Internal helper `currentWritable` creates Svelte stores with synchronous `.current` access.

This pattern is used heavily in context APIs for low-overhead runtime reads.
