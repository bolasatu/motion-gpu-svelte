<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils/cn";
  import CopyCodeButton from "./CopyCodeButton.svelte";

  type ComponentProps = {
    class?: string;
    children?: Snippet;
    code?: string;
    unstyled?: boolean;
    [prop: string]: unknown;
  };

  const props = $props();
  const className = $derived((props as ComponentProps).class ?? "");
  const code = $derived((props as ComponentProps).code ?? "");
  const unstyled = $derived((props as ComponentProps).unstyled ?? false);
  const children = $derived((props as ComponentProps).children);
  const restProps = $derived(() => {
    const {
      class: _class,
      children: _children,
      code: _code,
      unstyled: _unstyled,
      ...rest
    } = props as ComponentProps;
    return rest;
  });
</script>

<div
  {...restProps}
  class={cn(
    unstyled
      ? "group/pre relative text-sm font-mono"
      : "group/pre border border-border relative mt-8 rounded-lg bg-card-light p-4 text-sm text-foreground shadow-sm font-mono",
    className,
  )}
>
  <div class="overflow-x-auto">
    {@render children?.()}
  </div>
  {#if code}
    <div class="pointer-events-none absolute top-2 right-2">
      <CopyCodeButton {code} class="pointer-events-auto" />
    </div>
  {/if}
</div>

<style>
  :global(.shiki) {
    background-color: transparent !important;
    font-size: 12px;
    font-weight: 400;
  }
</style>
