<script>
	let { children } = $props();
</script>

<div class="font-mono text-xs tracking-wide text-foreground-muted uppercase">
	{@render children()}
</div>
