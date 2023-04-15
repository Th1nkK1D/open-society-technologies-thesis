<script lang="ts">
	import {
		VisXYContainer,
		VisArea,
		VisAxis,
		VisCrosshair,
		VisTooltip,
		VisBulletLegend
	} from '@unovis/svelte';
	import { CurveType } from '@unovis/ts';
	import { Sentiment, type Post, SENTIMENTS } from '../models/post';
	import { MONTHS, tickFormat } from '../utils/chart';

	const SENTIMENTS_COLOR = ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(239, 68, 68)'];

	export let posts: Post[];

	type SentimentCountMap = { [key in Sentiment]: number };

	interface SentimentGroup {
		month: number;
		sentiments: SentimentCountMap;
	}

	$: topicCountByMonth = [...MONTHS.keys()].map((month) =>
		posts
			.filter(({ timestamp }) => timestamp.getMonth() === month)
			.reduce<SentimentGroup>(
				(obj, { sentiment }) => {
					obj.sentiments[sentiment]++;

					return obj;
				},
				{
					month,
					sentiments: {
						[Sentiment.Positive]: 0,
						[Sentiment.Neutral]: 0,
						[Sentiment.Negative]: 0
					}
				}
			)
	);

	const x = ({ month }: SentimentGroup) => month;

	$: y = SENTIMENTS.map(
		(sentiment) =>
			({ sentiments }: SentimentGroup) =>
				sentiments[sentiment]
	);

	$: color = (d: SentimentGroup, index: number) => SENTIMENTS_COLOR[index];

	const items = SENTIMENTS.map((name, index) => ({ name, color: SENTIMENTS_COLOR[index] }));

	$: template = (d: SentimentGroup) =>
		[
			`<b>${MONTHS[d.month]}</b>`,
			...[...SENTIMENTS].reverse().map((sentiment) => `${sentiment} (${d.sentiments[sentiment]})`)
		].join('<br/>');
</script>

<div class="space-y-2">
	<VisXYContainer data={topicCountByMonth} height="300">
		<VisArea {x} {y} {color} curveType={CurveType.Linear} />
		<VisAxis type="x" label="Month" numTicks={MONTHS.length} {tickFormat} />
		<VisAxis type="y" label="Number of Posts" />
		<VisCrosshair {color} {template} />
		<VisTooltip />
	</VisXYContainer>

	<VisBulletLegend {items} />
</div>
