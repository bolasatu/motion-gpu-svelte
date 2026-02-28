<script lang="ts">
	interface Props {
		class?: string;
		[key: string]: unknown;
	}

	let { class: className = '', ...rest }: Props = $props();
</script>

<hr {...rest} class={`my-8 border-0 border-t border-border ${className}`.trim()} />
