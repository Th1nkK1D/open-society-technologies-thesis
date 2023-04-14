<script lang="ts">
	import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from '@unovis/svelte';
	import { CurveType, Line } from '@unovis/ts';
	import type { Post } from '../utils/posts';
	import type { Topic } from '../utils/topics';

	const MAX_TOOLTIP_TOPIC = 5;

	const MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	export let posts: Post[];
	export let topics: Topic[];

	type TopicCountMap = { [key: number]: number };

	interface TopicGroup {
		month: number;
		topics: TopicCountMap;
	}

	$: topicCountByMonth = [...MONTHS.keys()].map((month) =>
		posts
			.filter(({ timestamp }) => timestamp.getMonth() === month)
			.reduce<TopicGroup>(
				(obj, { topicId }) => {
					if (topicId in obj.topics) {
						obj.topics[topicId]++;
					}

					return obj;
				},
				{ month, topics: topics.reduce<TopicCountMap>((obj, { id }) => ({ ...obj, [id]: 0 }), {}) }
			)
	);

	const x = ({ month }: TopicGroup) => month;

	$: y = topics.map(
		({ id }) =>
			({ topics }: TopicGroup) =>
				topics[id]
	);

	$: color = (d: TopicGroup, topicId: number) => topics.find(({ id }) => id === topicId)?.color;

	const tickFormat = (index: number) => MONTHS[index].slice(0, 3);

	$: template = (d: TopicGroup) =>
		[
			`<b>${MONTHS[d.month]}</b>`,
			...Object.entries(d.topics)
				.sort((a, z) => z[1] - a[1])
				.slice(0, MAX_TOOLTIP_TOPIC)
				.map(([topicId, count]) => `${getTopicLabelElementById(+topicId)} (${count})`)
		].join('<br/>');

	$: triggers = {
		[Line.selectors.line]: (d: TopicGroup, topicId: number) =>
			`<b>${getTopicLabelElementById(topicId)}</b>`
	};

	$: getTopicLabelElementById = (topicId: number) => {
		const topic = topics.find(({ id }) => id === topicId);
		return topic ? `<span style="color: ${topic.color};">&bull;</span> ${topic.label}` : '';
	};
</script>

<VisXYContainer data={topicCountByMonth} height="500">
	<VisLine {x} {y} {color} curveType={CurveType.Linear} highlightOnHover />
	<VisAxis type="x" label="Month" numTicks={MONTHS.length} {tickFormat} />
	<VisAxis type="y" label="Number of Posts" />
	<VisCrosshair {template} {color} />
	<VisTooltip {triggers} />
</VisXYContainer>
