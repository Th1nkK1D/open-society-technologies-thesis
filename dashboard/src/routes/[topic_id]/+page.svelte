<script lang="ts">
	import { browser } from '$app/environment';
	import SentimentsChart from '../../components/sentiments-chart.svelte';
	import Wordcloud from '../../components/wordcloud.svelte';
	import { Sentiment } from '../../models/post';

	const SENTIMENT_COLORS = {
		[Sentiment.Negative]: 'bg-red-500',
		[Sentiment.Neutral]: 'bg-blue-500',
		[Sentiment.Positive]: 'bg-green-500'
	};

	/** @type {import('./$types').PageData} */
	export let data;

	const { topic, posts, representedWords } = data;
</script>

<div class="space-y-12">
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

	<div class="space-y-6">
		<div class="flex flex-row items-center">
			<h2 class="text-xl flex-1">
				<span class="font-bold">Conversations</span> ({posts.length} posts)
			</h2>

			<div class="flex flex-row items-center justify-end space-x-4">
				<span>Order by</span>
				<select class="select select-bordered">
					<option disabled selected>Published time</option>
					<option>Most positive topic</option>
					<option>Most negative topic</option>
				</select>
			</div>
		</div>

		<div class="flex flex-col space-y-4">
			{#each posts as { text, timestamp, sentiment }}
				<div class="card bg-base-200 rounded border border-base-300 shadow overflow-x-hidden">
					<div class="card-body flex flex-col px-3 py-2">
						<div class="flex flex-row text-sm">
							<span class="badge text-xs text-white {SENTIMENT_COLORS[sentiment]}">{sentiment}</span
							>
							<span class="flex-1" />
							<span class="text-gray-600">{timestamp.toLocaleDateString()}</span>
						</div>
						<p>{text}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
