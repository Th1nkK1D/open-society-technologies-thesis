<script lang="ts">
	import { onMount } from 'svelte';
	import Mark from 'mark.js';
	import { Sentiment, type Post, SENTIMENTS } from '../models/post';

	const SENTIMENT_COLORS = {
		[Sentiment.Negative]: 'bg-red-500',
		[Sentiment.Neutral]: 'bg-blue-500',
		[Sentiment.Positive]: 'bg-green-500'
	};

	export let posts: Post[];

	let filterByKeyword = '';
	let filterBySentiment: Sentiment | null = null;
	let postsContainer: HTMLDivElement;
	let keywordMarker: Mark;

	$: filteredPost = (
		filterBySentiment ? posts.filter(({ sentiment }) => sentiment === filterBySentiment) : posts
	).filter(({ text }) => text.includes(filterByKeyword));

	$: {
		if (postsContainer) {
			keywordMarker?.unmark();

			if (filterByKeyword.length > 1) {
				keywordMarker = new Mark(postsContainer.querySelectorAll('p'));
				keywordMarker.mark(filterByKeyword, { separateWordSearch: false });
			}
		}
	}
</script>

<div class="space-y-6 flex flex-col">
	<h2 class="text-xl flex-1">
		<span class="font-bold">Conversations</span>
	</h2>

	<div class="flex flex-row items-center">
		<input
			type="text"
			placeholder="Filter by a keyword..."
			class="input input-bordered w-full max-w-md"
			bind:value={filterByKeyword}
		/>

		<div class="flex-1" />

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

	<div class="flex flex-col space-y-4" bind:this={postsContainer}>
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
