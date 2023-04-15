<script>
	import { browser } from '$app/environment';
	import SentimentsChart from '../../components/sentiments-chart.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { topic, posts } = data;
</script>

<h1 class="font-sans font-bold text-3xl">
	Topic: {topic.label}
</h1>

<div class="space-y-6">
	<h2 class="text-xl font-bold text-center">Sentiment toward the topic</h2>

	{#if browser}
		<SentimentsChart {posts} />
	{/if}
</div>
