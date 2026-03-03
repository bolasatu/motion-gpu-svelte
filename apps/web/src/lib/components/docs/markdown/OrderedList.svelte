<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils/cn";

  type ComponentProps = {
    class?: string;
    children?: Snippet;
    [prop: string]: unknown;
  };

  const {
    children,
    class: className = "",
    ...restProps
  }: ComponentProps = $props();
</script>

<ol
  {...restProps}
  class={cn(
    "mt-6 list-decimal text-sm space-y-2 pl-6 text-pretty leading-relaxed text-foreground/70 [&>li]:pl-1",
    className,
  )}
>
  {@render children?.()}
</ol>
