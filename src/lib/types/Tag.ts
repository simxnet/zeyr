import type { User } from 'discord.js';

export type Awaitable<T> = T | PromiseLike<T>;

export type PromisedTagFilterResult = Promise<TagFilterResult>;

export type TagFilterResult =
	| string
	| number
	| boolean
	| User
	| Function
	| undefined
	| null;

export type TagOptions = Record<string, Awaitable<TagFilterResult>>;
