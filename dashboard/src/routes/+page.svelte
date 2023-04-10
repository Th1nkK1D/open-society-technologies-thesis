<script lang="ts">
	import { loadPosts } from '../utils/posts';
</script>

<div>
	<h1 class="text-2xl">Topic Trend</h1>
	{#await loadPosts()}
		Loading
	{:then posts}
		{JSON.stringify(posts[0])}
	{/await}
</div>
