import { Anime, SearchResult } from './types';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

export class Enime {
	url: string;
	constructor(url?: string) {
		this.url = url ?? 'https://api.enime.moe';
	}

	public async search(query: string): Promise<SearchResult> {
		return await fetch<SearchResult>(
			`${this.url}/search/${query}?perPage=15`,
			FetchResultTypes.JSON
		);
	}

	public async getAnime(id: string): Promise<Anime> {
		return await fetch<Anime>(`${this.url}/anime/${id}`, FetchResultTypes.JSON);
	}
}
