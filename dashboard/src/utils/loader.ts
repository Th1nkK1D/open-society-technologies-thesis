import { csvParse } from 'd3-dsv';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { readFileSync } from 'fs';
import type { Sentiment } from '../models/post';
import type { Topic } from '../models/topic';

export function loadPosts() {
	return csvParse(readFileSync('src/data/posts.csv', { encoding: 'utf-8' }), (d) => ({
		text: d.text as string,
		timestamp: new Date(+(d.timestamp as string)),
		topicId: +(d.topicId as string),
		sentiment: d.sentiment as Sentiment,
		topicConfidence: +(d.topicConfidence as string),
		sentimentConfidence: +(d.sentimentConfidence as string)
	}));
}

export function loadTopics(): Topic[] {
	const topics = csvParse(
		readFileSync('src/data/topic-labels.csv', { encoding: 'utf-8' }),
		(d) => ({
			label: d.label as string
		})
	);

	return topics.map(({ label }, id) => ({
		id,
		label: label.replaceAll('_', ', '),
		color: schemeTableau10[id % schemeTableau10.length]
	}));
}
