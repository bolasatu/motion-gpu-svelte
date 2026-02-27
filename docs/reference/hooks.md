# Hooks Reference

## `useFragkit()`

Returns runtime context provided by nearest `FragCanvas`.

### Type

```ts
interface FragkitContext {
  canvas: HTMLCanvasElement | undefined;
  size: CurrentReadable<{ width: number; height: number }>;
  dpr: CurrentWritable<number>;
  maxDelta: CurrentWritable<number>;
  renderMode: CurrentWritable<'always' | 'on-demand' | 'manual'>;
  autoRender: CurrentWritable<boolean>;
  user: CurrentWritable<Record<string | symbol, unknown>>;
  invalidate: () => void;
  advance: () => void;
  scheduler: {
    createStage: (...)
    getStage: (...)
    setDiagnosticsEnabled: (...)
    getDiagnosticsEnabled: (...)
    getLastRunTimings: (...)
    getSchedule: (...)
  };
}
```

### Behavior

- Throws outside `<FragCanvas>`.
- `size.current` is updated each frame from canvas dimensions.
- `renderMode` and `autoRender` stores are writable; changes are reflected in frame scheduler.
- `maxDelta` is writable and clamps frame delta passed to callbacks/rendering.
- `invalidate()` and `advance()` proxy frame registry controls.
- `user` is a namespaced store for plugin/runtime extension data.

## `useFragkitUserContext(...)`

Namespaced user/plugin context helper scoped to the current `FragCanvas`.

### Signatures

```ts
useFragkitUserContext() // full user context store
useFragkitUserContext(namespace) // readable scoped namespace
useFragkitUserContext(namespace, value, options?) // set namespace value
```

### Set options

- `existing: 'skip' | 'merge' | 'replace'` (default: `skip`)

### Notes

- Use this for plugin/module communication without prop drilling.
- Throws when used outside `<FragCanvas>`.

## `useFrame(...)`

Register per-frame callback in scheduler graph.

### Signatures

```ts
useFrame(callback, options?)
useFrame(key, callback, options?)
```

### Options

- `autoStart?: boolean` (default `true`)
- `autoInvalidate?: boolean` (default `true`)
- `stage?: FrameKey | FrameStage`
- `before?: FrameKey | FrameTask | Array<...>`
- `after?: FrameKey | FrameTask | Array<...>`
- `running?: () => boolean`

### Return

```ts
{
  task: { key, stage },
  start: () => void,
  stop: () => void,
  started: Readable<boolean>
}
```

### Scheduling semantics

- Tasks and stages are topologically ordered by `before`/`after`.
- Missing dependency keys are ignored.
- Cycles degrade to registration order for unresolved nodes.
- `started` reflects both explicit start/stop and `running()` gate state.
- In `on-demand` mode, active tasks with `autoInvalidate: true` request rendering.

### Constraints

- Throws outside `<FragCanvas>`.
- Callback receives `FrameState` with `setUniform`, `setTexture`, `invalidate`, `advance`, and timing values.

## `useTexture(urlInput, options?)`

Async helper that loads image textures via URL(s).

### Input

- `urlInput: string[] | (() => string[])`
- `options?: { colorSpace?: 'srgb' | 'linear'; requestInit?: RequestInit }`

### Return

```ts
{
  textures: CurrentReadable<LoadedTexture[] | null>;
  loading: CurrentReadable<boolean>;
  error: CurrentReadable<Error | null>;
  reload: () => Promise<void>;
}
```

### Behavior

- Automatically starts loading once.
- Uses internal request versioning to ignore stale async responses.
- Disposes previous bitmaps (`close()`) when replaced/unmounted.
- On failure: disposes prior textures, sets `textures = null`, sets `error`.
- `reload()` reruns the load flow.

### Example

```svelte
<script lang="ts">
  import { useTexture, useFrame } from 'fragkit';

  const tex = useTexture(['/assets/noise.png']);

  useFrame(({ setTexture }) => {
    if (!tex.loading.current && tex.textures.current?.[0]) {
      setTexture('uNoise', tex.textures.current[0].source);
    }
  }, { autoInvalidate: true });
</script>
```
