<script lang="ts">
	import { cn } from '../../utils/cn';

	export let shinyWidth = 100;
	let className: any = '';
	export { className as class };
</script>

<p
	style:--shiny-width="{shinyWidth}px"
	class={cn(
		'mx-auto max-w-md text-foreground-muted',

		// Shimmer effect
		'animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',

		// Shimmer gradient
		'bg-linear-to-r from-transparent via-black/80 via-50% to-transparent',

		className
	)}
>
	<slot>Shimmer Animation</slot>
</p>
