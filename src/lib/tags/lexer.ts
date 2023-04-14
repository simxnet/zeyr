import { TagOptions } from './types';

export class TagLexer {
	filter: TagOptions;
	separators: string[];
	constructor(filter: TagOptions, separators = ['{{', '}}']) {
		this.filter = filter;
		this.separators = separators;
	}

	public format() {
		const formattedFilter: TagOptions = {};

		for (const key of Object.keys(this.filter)) {
			formattedFilter[`${this.separators[0]}${key}${this.separators[1]}`] =
				this.filter[key];
		}

		return formattedFilter;
	}
}
