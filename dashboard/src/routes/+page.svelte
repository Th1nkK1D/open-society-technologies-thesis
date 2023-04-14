<script lang="ts">
	import TopicsChart from '../components/topics-chart.svelte';
	import { loadPosts } from '../utils/posts';
	import { loadTopics } from '../utils/topics';

	const MAX_DISPLAY_TOPIC = 20;

	const loadData = Promise.all([loadPosts(), loadTopics()]);
</script>

<div>
	{#await loadData}
		Loading...
	{:then [posts, allTopics]}
		{@const topics = allTopics.slice(1, MAX_DISPLAY_TOPIC + 1)}
		<TopicsChart {posts} {topics} />
	{/await}
</div>
