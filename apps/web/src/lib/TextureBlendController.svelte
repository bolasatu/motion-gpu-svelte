<script lang="ts">
	import { useFrame, useTexture } from 'fragkit';

	interface Props {
		urls: string[];
		speed?: number;
	}

	let { urls, speed = 0.5 }: Props = $props();

	const { textures } = useTexture(() => urls);

	useFrame(({ time, setUniform, setTexture }) => {
		const loaded = textures.current;
		if (!loaded || loaded.length === 0) {
			return;
		}

		const secondIndex = loaded.length > 1 ? 1 : 0;
		const mix = loaded.length > 1 ? Math.sin(time * speed) * 0.5 + 0.5 : 0;

		setUniform('uMix', mix);
		setTexture('uTextureA', loaded[0]);
		setTexture('uTextureB', loaded[secondIndex]);
	});
</script>
