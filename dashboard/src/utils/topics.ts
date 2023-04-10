import { csv } from 'd3-fetch';
import { base } from '$app/paths';
import { interpolateTurbo } from 'd3-scale-chromatic';

export interface Topic {
	id: number;
	label: string;
	color: string;
}

export async function loadTopics(): Promise<Topic[]> {
	const topics = await csv<Pick<Topic, 'label'>>(`${base}/data/topic-labels.csv`, {}, (d) => ({
		label: d.label as string
	}));

	return [{ label: 'Uncetagorized' }, ...topics].map(({ label }, i) => ({
		id: i - 1,
		label: label.replaceAll('_', ', '),
		color: interpolateTurbo(Math.random())
	}));
}
