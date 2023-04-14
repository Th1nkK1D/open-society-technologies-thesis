<script lang="ts">
	import TopicsChart from '../components/topics-chart.svelte';
	import TopicsGrid from '../components/topics-grid.svelte';
	import { loadPosts } from '../utils/posts';
	import { loadTopics } from '../utils/topics';

	const MAX_DISPLAY_TOPIC = 20;
</script>

{#await Promise.all([loadPosts(), loadTopics()])}
	<progress class="progress w-full max-w-lg m-auto" />
{:then [posts, allTopics]}
	{@const topics = allTopics.slice(1, MAX_DISPLAY_TOPIC + 1)}

	<div class="flex flex-col space-y-16">
		<h1 class="font-sans font-bold text-3xl">
			{MAX_DISPLAY_TOPIC} Most Discussed Topic by Expats in Estonia 2022
		</h1>
		<TopicsChart {posts} {topics} />
		<TopicsGrid {posts} {topics} />
	</div>
{/await}
