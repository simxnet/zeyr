import type { TagOptions } from '../types/Tag';
import { Args, container } from '@sapphire/framework';

export function getTagFilters(args: Args): TagOptions {
	return {
		// server
		server: args.message.guild?.name,
		'server.id': args.message.guildId,
		'server.memberCount': args.message.guild?.memberCount,

		// author
		author: args.message.author.username,
		'author.id': args.message.author.id,
		'author.name': args.message.author.username,
		'author.avatar': args.message.author.avatarURL(),
		'author.mention': args.message.author.toString(),

		// user
		user: args.pick('user'),

		// misc
		prefix: container.client.options.defaultPrefix?.toString(),
		ping: container.client.ws.ping
	};
}
