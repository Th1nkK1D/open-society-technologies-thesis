<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import PostsFeed from '../../components/posts-feed.svelte';
	import SentimentsChart from '../../components/sentiments-chart.svelte';
	import Wordcloud from '../../components/wordcloud.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { topic, posts, representativeWords } = data;
</script>

<div class="space-y-12">
	<div class="space-y-4">
		<a href="{base}/" class="text-sm opacity-60 hover:opacity-100 hover:underline">⇽ Back</a>
		<h1 class="font-sans font-bold text-3xl">
			[Topic] {topic.label}
		</h1>
	</div>
	<div class="space-y-6">
		<h2 class="text-xl font-bold">Representative words</h2>
		<Wordcloud list={representativeWords} />
	</div>

	<div class="space-y-6">
		<h2 class="text-xl font-bold">Sentiment</h2>

		{#if browser}
			<SentimentsChart {posts} />
		{/if}
	</div>

	<PostsFeed {posts} />
</div>
