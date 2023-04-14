<script lang="ts">
	import { browser } from '$app/environment';
	import TopicsChart from '../components/topics-chart.svelte';
	import TopicsGrid from '../components/topics-grid.svelte';

	const MAX_DISPLAY_TOPIC = 20;

	/** @type {import('./$types').PageData} */
	export let data;

	const { posts } = data;

	const topics = data.topics.slice(0, MAX_DISPLAY_TOPIC + 1);
</script>

<div class="flex flex-col space-y-16">
	<h1 class="font-sans font-bold text-3xl">
		{MAX_DISPLAY_TOPIC} Most Discussed Topic by Expats in Estonia 2022
	</h1>
	{#if browser}
		<TopicsChart {posts} {topics} />
	{/if}
	<TopicsGrid {posts} {topics} />
</div>
