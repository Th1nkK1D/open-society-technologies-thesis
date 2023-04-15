<script lang="ts">
	import { base } from '$app/paths';
	import { type Post, SENTIMENTS } from '../models/post';
	import type { Topic } from '../models/topic';

	const SENTIMENT_COLORS = ['bg-green-500', 'bg-blue-500', 'bg-red-500'];

	export let topics: Topic[];
	export let posts: Post[];

	$: topicGroup = topics.map((topic) => {
		const sentiments = SENTIMENTS.map(
			(s) =>
				posts.filter(({ topicId, sentiment }) => topicId === topic.id && sentiment === s).length
		);

		return {
			...topic,
			sentiments,
			total: sentiments.reduce((sum, count) => sum + count, 0)
		};
	});
</script>

<div class="flex flex-col gap-4 bg-red">
	{#each topicGroup as { id, label, color, total, sentiments } (id)}
		{@const sentimentPercentages = sentiments.map((count) => (count * 100) / total)}

		<a
			href="{base}/{id}"
			class="card bg-base-200 hover:bg-base-300 rounded border border-base-300 shadow"
		>
			<div class="card-body flex flex-row px-4 py-2 items-center">
				<span class="h-4 w-4 rounded-full" style="background-color: {color};" />
				<h2 class="card-title flex-1">
					{label}
				</h2>
				<p class="text-center">{total} posts</p>
				<div class="flex flex-col text-xs space-y-1 w-64">
					<div class="flex flex-row">
						<span class=" text-green-500">{Math.round(sentimentPercentages[0])}%</span>
						<span class="flex-1 text-center">Sentiment</span>
						<span class="text-red-500">{Math.round(sentimentPercentages[2])}%</span>
					</div>
					<div class="flex flex-row bg-base-200 rounded-full h-2 overflow-hidden">
						{#each sentimentPercentages as percentage, index}
							<div class={SENTIMENT_COLORS[index]} style="width: {percentage}%" />
						{/each}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>
