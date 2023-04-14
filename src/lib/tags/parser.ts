import { isThenable } from '@sapphire/utilities';
import { TagOptions } from './types';

export class TagParser {
	filter: TagOptions;
	constructor(filter: TagOptions) {
		this.filter = filter;
	}

	public async parse(query: string) {
		return this.replaceAsync(
			query,
			new RegExp(Object.keys(this.filter).join('|'), 'g'),
			async (m: string) => {
				let result = this.filter[m];

				if (typeof result === 'function') result = result();
				if (isThenable(result)) result = await result;

				return result as string;
			}
		);
	}

	private async replaceAsync(
		str: string,
		regex: RegExp,
		asyncFn: (match: string) => Promise<string>
	) {
		const promises: Promise<string>[] = [];
		str.replaceAll(regex, (match) => {
			const promise = asyncFn(match);
			promises.push(promise);
			return match;
		});
		const data = await Promise.all(promises);
		return str.replace(regex, () => data.shift()!);
	}
}
