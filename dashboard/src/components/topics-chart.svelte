<script lang="ts">
	import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from '@unovis/svelte';
	import { Line } from '@unovis/ts';
	import type { Post } from '../utils/posts';
	import type { Topic } from '../utils/topics';

	const MAX_CHART_TOPIC = 20;
	const MAX_TOOLTIP_TOPIC = 5;

	export let posts: Post[];
	export let topics: Topic[];

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

	const y = topics.slice(1, MAX_CHART_TOPIC + 1).map(
		({ id }) =>
			({ topics }: TopicGroup) =>
				topics[id]
	);

	const color = (d: TopicGroup, topicIndex: number) => topics[topicIndex + 1].color;

	const template = (d: TopicGroup) =>
		[
			`<b>${d.month}</b>`,
			...Object.entries(d.topics)
				.sort((a, z) => z[1] - a[1])
				.slice(1, MAX_TOOLTIP_TOPIC + 1)
				.map(([topicIndex, count]) => `${getTopicLabelElement(topics[+topicIndex + 1])}: ${count}`)
		].join('<br/>');

	const triggers = {
		[Line.selectors.line]: (d: TopicGroup, topicIndex: number) =>
			`<b>${getTopicLabelElement(topics[topicIndex + 1])}</b>`
	};

	const getTopicLabelElement = ({ label, color }: Topic) =>
		`<span style="color: ${color};">&bull;</span> ${label}`;
</script>

<VisXYContainer data={topicCountByMonth} height="500">
	<VisLine {x} {y} {color} highlightOnHover />
	<VisAxis type="x" />
	<VisAxis type="y" />
	<VisCrosshair {template} />
	<VisTooltip {triggers} />
</VisXYContainer>
