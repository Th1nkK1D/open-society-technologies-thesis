<script lang="ts">
	import { Sentiment, type Post, SENTIMENTS } from '../models/post';

	const SENTIMENT_COLORS = {
		[Sentiment.Negative]: 'bg-red-500',
		[Sentiment.Neutral]: 'bg-blue-500',
		[Sentiment.Positive]: 'bg-green-500'
	};

	export let posts: Post[];

	let filterBySentiment: Sentiment | null = null;

	$: filteredPost = filterBySentiment
		? posts.filter(({ sentiment }) => sentiment === filterBySentiment)
		: posts;
</script>

<div class="space-y-6">
	<div class="flex flex-row items-center">
		<h2 class="text-xl flex-1">
			<span class="font-bold">Conversations</span>
		</h2>

		<div class="flex flex-row items-center justify-end space-x-4">
			<span>Show</span>
			<select class="select select-bordered" bind:value={filterBySentiment}>
				<option value={null}>All posts ({posts.length})</option>
				{#each SENTIMENTS as sentiment}
					<option value={sentiment}
						>{sentiment} posts ({posts.filter((p) => p.sentiment === sentiment).length})</option
					>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex flex-col space-y-4">
		{#each filteredPost as { text, timestamp, sentiment }}
			<div class="card bg-base-200 rounded border border-base-300 shadow overflow-x-hidden">
				<div class="card-body flex flex-col px-3 py-2">
					<div class="flex flex-row text-sm">
						<span class="badge text-xs text-white {SENTIMENT_COLORS[sentiment]}">{sentiment}</span>
						<span class="flex-1" />
						<span class="text-gray-600">{timestamp.toLocaleDateString()}</span>
					</div>
					<p>{text}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
