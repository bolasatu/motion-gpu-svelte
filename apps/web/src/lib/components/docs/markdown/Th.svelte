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

<th
  {...restProps}
  class={cn(
    "py-2 px-4 text-left align-middle font-medium text-sm text-foreground",
    className,
  )}
>
  {@render children?.()}
</th>
