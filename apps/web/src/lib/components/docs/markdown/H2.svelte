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

<h2
  {...restProps}
  class={cn(
    "mt-12 scroll-m-24 [&_code]:text-base text-xl font-medium text-foreground font-display",
    className,
  )}
>
  {@render children?.()}
</h2>
