import type { Topic } from '../../models/topic.js';
import { loadPosts, loadTopics } from '../../utils/loader.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const topicId = +params.topic_id;

	return {
		posts: loadPosts().filter((post) => post.topicId === topicId),
		topic: loadTopics().find(({ id }) => id === topicId) as Topic
	};
}
