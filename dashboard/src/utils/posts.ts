import { csv } from 'd3-fetch';
import { base } from '$app/paths';

export enum Sentiment {
	Positive = 'Positive',
	Negative = 'Negative',
	Neutral = 'Neutral'
}

export interface Post {
	text: string;
	timestamp: Date;
	topicId: number;
	sentiment: Sentiment;
	topicConfident: number;
	sentimentConfident: number;
}

export async function loadPosts() {
	return csv<Post>(`${base}/data/posts.csv`, {}, (d) => ({
		text: d.text as string,
		timestamp: new Date(+(d.timestamp as string)),
		topicId: +(d.topicId as string),
		sentiment: d.sentiment as Sentiment,
		topicConfident: +(d.topicConfident as string),
		sentimentConfident: +(d.sentimentConfident as string)
	}));
}
