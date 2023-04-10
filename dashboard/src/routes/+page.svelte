<script lang="ts">
	import TopicsChart from '../components/topics-chart.svelte';
	import { loadPosts } from '../utils/posts';
	import { loadTopics } from '../utils/topics';

	const loadData = Promise.all([loadPosts(), loadTopics()]);
</script>

<div>
	{#await loadData}
		Loading...
	{:then [posts, topics]}
		<TopicsChart {posts} {topics} />
	{/await}
</div>
