<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section
	class="flex w-full items-center justify-center bg-foreground px-4 py-14 text-background sm:px-8 sm:py-20"
>
	<div class="grid max-w-3xl place-items-center gap-5 text-center">
		<h2 class="max-w-3xl text-4xl tracking-tight text-balance sm:text-6xl">
			Build sharper visuals with a runtime that stays in control.
		</h2>
		<p class="max-w-xl font-fono text-base text-background opacity-80">
			Start with the docs to learn the API, then explore the repository for examples and internals.
		</p>
		<div class="mt-2 flex flex-wrap justify-center gap-3">
			<a
				href={resolve('/docs' as '/')}
				class="bg-background px-5 py-2 font-fono text-sm text-foreground"
			>
				Open docs
			</a>
			<a
				href="https://github.com/motion-core/motion-gpu"
				target="_blank"
				rel="noreferrer"
				class="border border-background/35 px-5 py-2 font-fono text-sm"
			>
				View GitHub
			</a>
		</div>
	</div>
</section>
