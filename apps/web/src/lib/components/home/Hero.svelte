<script lang="ts">
  import Logo from "$lib/assets/motiongpu-logo.svg?raw";
  import { resolve } from "$app/paths";
  import Book from "carbon-icons-svelte/lib/Book.svelte";
  import WatsonHealth3DPrintMesh from "carbon-icons-svelte/lib/WatsonHealth3DPrintMesh.svelte";
  import Button from "../ui/Button.svelte";

  const docsRoute = "/docs" as const;
  const playgroundRoute = "/playground" as const;
</script>

<section
  id="home"
  class="flex h-[50vh] w-full flex-col items-center justify-center gap-3 py-24 sm:gap-6"
>
  <span
    class="inline-flex shrink-0 items-center text-accent [&>svg]:size-16 [&>svg]:fill-current"
    aria-hidden="true"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html Logo}
  </span>
  <h1
    class="max-w-2xl text-center text-4xl tracking-tight text-balance sm:text-6xl"
  >
    A <span class="text-accent">Svelte-first</span> pipeline for modern
    <span class="text-accent">GPU visuals.</span>
  </h1>
  <p class="max-w-2xl text-center text-lg text-balance text-foreground/70">
    If you need performance, clarity, and composability in WebGPU for Svelte,
    this is the stack.
  </p>
  <div class="items-center gap-2 flex">
    <Button
      variant="brand"
      href={resolve(playgroundRoute as "/playground")}
      size="md"
    >
      <WatsonHealth3DPrintMesh size={16} />
      <span>Playground</span>
    </Button>
    <Button href={resolve(docsRoute as "/")} size="md">
      <Book size={16} />
      <span>Docs</span>
    </Button>
  </div>
</section>
