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
	topicConfidence: number;
	sentimentConfidence: number;
}
