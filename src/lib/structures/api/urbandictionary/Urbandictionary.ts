import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { type List } from './types';

export class Urbandictionary {
	url: string;
	constructor(url?: string) {
		this.url = url ?? 'https://api.urbandictionary.com/v0';
	}

	public async define(term: string) {
		return await fetch<List>(
			`${this.url}/define?term=${term}`,
			FetchResultTypes.JSON
		);
	}
}
