# Frame Scheduler and Render Modes

## `useFrame`

`useFrame` registers a callback executed before renderer submission.

Overloads:

- `useFrame(callback, options?)`
- `useFrame(key, callback, options?)`

Returns:

- `task` metadata (`key`, `stage`)
- `start()` / `stop()`
- `started` readable store (effective running state)

## Task ordering

Tasks can declare dependencies:

- `before`: run before listed tasks.
- `after`: run after listed tasks.

The scheduler topologically sorts tasks with stable insertion-order fallback.

## Stages

Stages group tasks and also support `before/after` ordering.

`createStage(key, { before, after, callback })`

Stage callback signature:

```ts
(state, runTasks) => void
```

This lets you wrap task execution with custom orchestration.

## Invalidation model

Render modes:

- `always`: always render.
- `on-demand`: render when there is pending invalidation or `advance()`.
- `manual`: render only when `advance()` has been called.

Per-task invalidation options:

- `autoInvalidate` (default true)
- explicit `invalidation`:
  - `'never'`
  - `'always'`
  - `{ mode: 'on-change', token: valueOrResolver }`

## Useful behavior details

- Scheduler starts with one pending invalidation, so `on-demand` renders initial frame.
- `setRenderMode('on-demand')` injects a mode-change invalidation token.
- `autoRender = false` disables rendering regardless of mode.
- `maxDelta` clamps `delta` passed to frame callbacks.

## Diagnostics and profiling

Scheduler exposes:

- `getSchedule()` for resolved stage/task order.
- `setDiagnosticsEnabled(...)` and `getLastRunTimings()`.
- Profiling controls:
  - `setProfilingEnabled`
  - `setProfilingWindow`
  - `resetProfiling`
  - `getProfilingSnapshot`

Snapshots include rolling stats (`last`, `avg`, `min`, `max`, `count`) for total frame, each stage, and each task.
