import type { TagOptions } from '../types/Tag';

export class TagLexer {
	filter: TagOptions;
	separators: string;
	constructor(filter: TagOptions) {
		this.filter = filter;
		this.separators = '{{key}}';
	}

	public parse() {
		const parsedFilter: TagOptions = {};

		for (const key of Object.keys(this.filter)) {
			parsedFilter[this.separators.replace('key', key)] = this.filter[key];
		}

		return parsedFilter;
	}
}
