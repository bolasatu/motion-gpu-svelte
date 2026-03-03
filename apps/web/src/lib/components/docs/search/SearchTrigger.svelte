<script lang="ts">
  import { searchState } from "$lib/stores/search.svelte";
  import { cn } from "$lib/utils/cn";
  import Search from "carbon-icons-svelte/lib/Search.svelte";

  let { class: className }: { class?: string } = $props();
</script>

<button
  type="button"
  class={cn(
    "group relative flex h-9 w-full items-center border border-border gap-2 rounded-lg bg-card px-3 py-1.5 text-sm text-foreground/45 transition-[color] duration-150 ease-out hover:text-foreground/70",
    className,
  )}
  onclick={() => searchState.open()}
>
  <Search size={18} class="text-foreground/45" />
  <span class="flex-1 text-left">Search...</span>
  <kbd
    class="border border-border pointer-events-none relative hidden h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-medium text-foreground/45 opacity-100 shadow-sm select-none font-mono sm:flex bg-background"
  >
    <span class="text-xs">⌘</span>K
  </kbd>
</button>
