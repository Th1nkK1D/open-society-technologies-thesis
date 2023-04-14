<script>
	import { browser } from '$app/environment';
	import SentimentsChart from '../../components/sentiments-chart.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { topic, posts } = data;
</script>

<h1 class="font-sans font-bold text-3xl">
	<span style="color: {topic.color}">Topic #{topic.id}</span>
	{topic.label}
</h1>

{#if browser}
	<SentimentsChart {posts} />
{/if}
