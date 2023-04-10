<script lang="ts">
	import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from '@unovis/svelte';
	import type { Post } from '../utils/posts';

	export let posts: Post[];

	interface TopicGroup {
		month: number;
		topics: { [key: number]: number };
	}

	$: topicCountByMonth = [...Array(12).keys()].map((month) =>
		posts
			.filter(({ timestamp }) => timestamp.getMonth() === month)
			.reduce<TopicGroup>(
				(obj, { topicId }) => {
					if (!obj.topics[topicId]) {
						obj.topics[topicId] = 1;
					} else {
						obj.topics[topicId]++;
					}

					return obj;
				},
				{ month, topics: {} }
			)
	);

	const x = ({ month }: TopicGroup) => month;

	const y = [...Array(20).keys()].map(
		(topic) =>
			({ topics }: TopicGroup) =>
				topics[topic]
	);
	const template = (d: TopicGroup) => d.month;
</script>

<VisXYContainer data={topicCountByMonth} height="500">
	<VisLine {x} {y} highlightOnHover />
	<VisAxis type="x" />
	<VisAxis type="y" />
	<VisCrosshair {template} />
	<VisTooltip />
</VisXYContainer>
