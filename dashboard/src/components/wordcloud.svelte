<script lang="ts">
	import { onMount } from 'svelte';

	export let list: [string, number][];

	let wordcloudCanvas: HTMLElement;

	onMount(async () => {
		const { default: wordcloud } = await import('wordcloud');

		wordcloud(wordcloudCanvas, {
			list,
			backgroundColor: 'none',
			drawOutOfBound: false,
			shrinkToFit: true,
			color: 'random-light',
			minRotation: 0,
			maxRotation: 0
		});
	});
</script>

<div bind:this={wordcloudCanvas} class="w-full h-36" />
