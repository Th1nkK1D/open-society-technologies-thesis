<script lang="ts">
	import TopicsChart from '../components/topics-chart.svelte';
	import { loadPosts } from '../utils/posts';
</script>

<div>
	{#await loadPosts()}
		Loading...
	{:then posts}
		<TopicsChart {posts} />
	{/await}
</div>
