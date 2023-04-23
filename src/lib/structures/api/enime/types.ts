type Paginated<D> = {
	data: D;
	meta: {
		total: number;
		lastPage: number;
		currentPage: number;
		perPage: number;
		prev: number | null;
		next: number | null;
	};
};

export type SearchResult = Paginated<Anime[]>;

export type Anime = {
	id: string;
	slug: string;
	description: string | undefined;
	title: {
		english: string;
		native: string;
		romaji: string;
		userPreferred: string;
	};
	status: 'RELEASING' | 'FINISHED' | 'NOT_YET_AIRED' | 'HIATUS';
	coverImage: string;
	bannerImage: string;
	currentEpisode: number;
	color: string;
	format: 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL' | 'MUSIC';
	genre: string[];
	createdAt: string;
	mappings: {
		mal?: number;
		anidb?: number;
		kitsu?: number;
		anilist?: number;
	};
};
