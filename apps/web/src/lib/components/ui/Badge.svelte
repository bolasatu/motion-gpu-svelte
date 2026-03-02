<script>
	let { children } = $props();
</script>

<div class="font-sans text-xs tracking-wide text-foreground-muted uppercase">
	{@render children()}
</div>
