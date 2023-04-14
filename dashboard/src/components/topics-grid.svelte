<script lang="ts">
	import { type Post, Sentiment } from '../models/post';
	import type { Topic } from '../models/topic';

	const SENTIMENT_COLORS = ['bg-green-500', 'bg-base-300', 'bg-red-500'];

	export let topics: Topic[];
	export let posts: Post[];

	$: topicGroup = topics.map((topic) => {
		const sentiments = Object.values(Sentiment).map(
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

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
	{#each topicGroup as { id, label, color, total, sentiments }, index (id)}
		{@const sentimentPercentages = sentiments.map((count) => (count * 100) / total)}

		<div class="card bg-base-200 rounded border border-base-300 shadow">
			<div class="card-body">
				<span class="card-title" style="color: {color};">#{index + 1}</span>
				<h2 class="card-title">
					{label}
				</h2>
				<p>{total} posts</p>
				<div class="flex flex-col text-xs space-y-1">
					<div class="flex flex-row">
						<span class="flex-1 text-green-500">{Math.round(sentimentPercentages[0])}%</span>
						<span class="text-red-500">{Math.round(sentimentPercentages[2])}%</span>
					</div>
					<div class="flex flex-row bg-base-200 rounded-full h-2 overflow-hidden">
						{#each sentimentPercentages as percentage, index}
							<div class={SENTIMENT_COLORS[index]} style="width: {percentage}%" />
						{/each}
					</div>
					<div class="flex flex-row text-gray-400">
						<span class="flex-1">Positive</span>
						<span>Negative</span>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
