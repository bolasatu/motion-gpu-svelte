<script lang="ts">
  import { cn } from "$lib/utils/cn";
  import CopyCodeButton from "./markdown/CopyCodeButton.svelte";
  import ShikiCodeBlock from "./ShikiCodeBlock.svelte";
  import { getHighlighter } from "$lib/utils/highlighter";
  import {
    packageManagers,
    packageManagerStore,
    type PackageManager,
  } from "$lib/stores/package-manager.svelte";
  import { siteConfig } from "$lib/config/site";

  type Props = {
    pkg?: string;
    args?: string;
    isDev?: boolean;
  };

  let { pkg = siteConfig.package.name, args, isDev = false }: Props = $props();

  const commands: Record<PackageManager, string> = $derived(
    isDev
      ? {
          npm: `npm install -D ${pkg} ${args ?? ""}`,
          pnpm: `pnpm add -D ${pkg} ${args ?? ""}`,
          bun: `bun add -D ${pkg} ${args ?? ""}`,
          yarn: `yarn add -D ${pkg} ${args ?? ""}`,
        }
      : {
          npm: `npm install ${pkg} ${args ?? ""}`,
          pnpm: `pnpm add ${pkg} ${args ?? ""}`,
          bun: `bun add ${pkg} ${args ?? ""}`,
          yarn: `yarn add ${pkg} ${args ?? ""}`,
        },
  );

  const activeCommand = $derived(commands[packageManagerStore.active]);

  let highlightedCommands = $state<
    Record<PackageManager, { light: string } | null>
  >({
    npm: null,
    pnpm: null,
    bun: null,
    yarn: null,
  });

  $effect(() => {
    getHighlighter().then((highlighter) => {
      for (const pm of packageManagers) {
        const cmd = commands[pm];
        highlightedCommands[pm] = {
          light: highlighter.codeToHtml(cmd, {
            lang: "bash",
            theme: "github-light",
          }),
        };
      }
    });
  });
</script>

<div
  class="border border-border relative my-6 w-full rounded-lg bg-card shadow-sm"
>
  <div
    class="flex items-center justify-between rounded-t-lg border-b border-border bg-card-muted"
  >
    <div class="flex items-center">
      {#each packageManagers as pm (pm)}
        <button
          onclick={() => (packageManagerStore.active = pm)}
          class={cn(
            "relative px-4 py-2.5 text-sm font-medium transition-colors outline-none select-none",
            packageManagerStore.active === pm
              ? "text-foreground"
              : "text-foreground/45 hover:text-foreground/70",
          )}
        >
          {pm}
          {#if packageManagerStore.active === pm}
            <div class="absolute bottom-0 left-0 h-0.5 w-full bg-accent"></div>
          {/if}
        </button>
      {/each}
    </div>

    <CopyCodeButton code={activeCommand} class="mr-2" />
  </div>

  <div class="min-h-12.5 p-4">
    {#if highlightedCommands[packageManagerStore.active]}
      <ShikiCodeBlock
        code=""
        htmlLight={highlightedCommands[packageManagerStore.active]!.light}
        unstyled={true}
      />
    {:else}
      <code
        class="block text-sm leading-relaxed whitespace-pre text-foreground font-mono"
      >
        {activeCommand}
      </code>
    {/if}
  </div>
</div>
