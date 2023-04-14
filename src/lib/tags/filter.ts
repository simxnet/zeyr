import { Args, container } from '@sapphire/framework';
import { TagFilterResult } from '../types/Tag';

export function getTagFilters(args: Args): Record<string, TagFilterResult> {
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

		// misc
		prefix: container.client.options.defaultPrefix?.toString(),
		ping: container.client.ws.ping
	};
}
