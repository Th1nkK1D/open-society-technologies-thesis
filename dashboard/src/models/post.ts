export enum Sentiment {
	Positive = 'Positive',
	Negative = 'Negative',
	Neutral = 'Neutral'
}

export const SENTIMENTS = [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative];

export interface Post {
	text: string;
	timestamp: Date;
	topicId: number;
	sentiment: Sentiment;
	topicConfidence: number;
	sentimentConfidence: number;
}
