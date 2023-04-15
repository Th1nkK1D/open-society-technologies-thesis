import type { Topic } from '../../models/topic.js';
import { loadPosts, loadTopics } from '../../utils/loader.js';
import topicRepresentatives from '../../data/topic-representatives.json';

const WORDCLOUD_SIZE_MULTIPLIER = 2000;

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const topicId = +params.topic_id;

	return {
		posts: loadPosts().filter((post) => post.topicId === topicId),
		topic: loadTopics().find(({ id }) => id === topicId) as Topic,
		representedWords: topicRepresentatives[topicId + 1].map(([word, value]) => [
			word,
			Math.round(+value * WORDCLOUD_SIZE_MULTIPLIER)
		])
	};
}
