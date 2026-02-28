<script lang="ts">
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils/cn';

	type Props = {
		label: string;
		title: string;
		href: string;
		align?: 'left' | 'right';
	};

	let { label, title, href, align = 'left' }: Props = $props();
</script>

<a
	href={resolve(href as '/')}
	class={cn(
		'block border border-background-muted/90 bg-background px-4 py-3 transition-colors hover:bg-background-muted',
		align === 'right' && 'text-right'
	)}
>
	<p class="font-fono text-xs tracking-wide text-foreground-muted uppercase">{label}</p>
	<p class="text-base tracking-tight text-foreground">{title}</p>
</a>
