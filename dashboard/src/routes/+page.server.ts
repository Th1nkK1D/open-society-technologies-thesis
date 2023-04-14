import { loadPosts, loadTopics } from '../utils/loader.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	return {
		posts: loadPosts(),
		topics: loadTopics()
	};
}
