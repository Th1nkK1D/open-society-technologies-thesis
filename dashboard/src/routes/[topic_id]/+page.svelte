<script lang="ts">
	import { browser } from '$app/environment';
	import SentimentsChart from '../../components/sentiments-chart.svelte';
	import Wordcloud from '../../components/wordcloud.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { topic, posts, representedWords } = data;
</script>

<h1 class="font-sans font-bold text-3xl">
	Topic: {topic.label}
</h1>

<div class="space-y-6">
	<h2 class="text-xl font-bold">Represented words</h2>
	<Wordcloud list={representedWords} />
</div>

<div class="space-y-6">
	<h2 class="text-xl font-bold">Sentiment</h2>

	{#if browser}
		<SentimentsChart {posts} />
	{/if}
</div>
