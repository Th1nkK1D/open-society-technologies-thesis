<script lang="ts">
	import { browser } from '$app/environment';
	import TopicsChart from '../components/topics-chart.svelte';
	import TopicsGrid from '../components/topics-grid.svelte';

	const MAX_DISPLAY_TOPIC = 20;

	/** @type {import('./$types').PageData} */
	export let data;

	const { posts } = data;

	const topics = data.topics.slice(0, MAX_DISPLAY_TOPIC);
</script>

<h1 class="font-sans font-bold text-4xl mb-12">
	{MAX_DISPLAY_TOPIC} Most Discussed Topic by Expats in Estonia 2022
</h1>

{#if browser}
	<TopicsChart {posts} {topics} />
{/if}

<div class="space-y-4 mt-4">
	<div class="flex flex-row items-center justify-end space-x-4">
		<span>Order by</span>
		<select class="select select-bordered">
			<option disabled selected>Higest number of posts</option>
			<option>Most positive topic</option>
			<option>Most negative topic</option>
		</select>
	</div>

	<TopicsGrid {posts} {topics} />
</div>
