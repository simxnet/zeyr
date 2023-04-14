import { User } from 'discord.js';

export type PromisedTagFilterResult = Promise<
	string | number | boolean | User | undefined | null
>;

export type TagFilterResult =
	| string
	| number
	| boolean
	| User
	| undefined
	| null;
