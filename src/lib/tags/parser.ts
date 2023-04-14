import { TagFilterResult } from '../types/Tag';

export class TagParser {
	filter: Record<string, TagFilterResult>;
	constructor(filter: Record<string, TagFilterResult>) {
		this.filter = filter;
	}

	public parse(query: string) {
		return query.replaceAll(
			new RegExp(Object.keys(this.filter).join('|'), 'g'),
			(m) => this.filter[m] as string
		);
	}
}
