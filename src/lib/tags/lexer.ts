import { TagFilterResult } from '../types/Tag';

export class TagLexer {
	filter: Record<string, TagFilterResult>;
	separators: string;
	constructor(filter: Record<string, TagFilterResult>) {
		this.filter = filter;
		this.separators = '{{key}}';
	}

	public parse() {
		const parsedFilter: Record<string, TagFilterResult> = {};

		for (const key of Object.keys(this.filter)) {
			parsedFilter[this.separators.replace('key', key)] = this.filter[key];
		}

		return parsedFilter;
	}
}
