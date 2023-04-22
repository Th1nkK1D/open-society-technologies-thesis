import { loadPosts, loadTopics } from '../utils/loader.js';

const MAX_DISPLAY_TOPIC = 20;

/** @type {import('./$types').PageLoad} */
export function load() {
	const topics = loadTopics().slice(0, MAX_DISPLAY_TOPIC);
	const posts = loadPosts()
		.filter(({ topicId }) => topics.some(({ id }) => id === topicId))
		.map(({ topicId, sentiment, timestamp }) => ({ topicId, sentiment, timestamp }));

	return {
		MAX_DISPLAY_TOPIC,
		topics,
		posts
	};
}
