import { Args, container } from '@sapphire/framework';
import { getLastMedia } from '../utils';
import { TextChannel } from 'discord.js';
import { TagOptions } from './types';

/**
 * Every tag may have his own callback
 */
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
		user: () => args.pick('user').catch(() => args.message.author),
		'user.name': () =>
			args
				.pick('user')
				.then((u) => u.username)
				.catch(() => args.message.author.username),
		'user.id': () =>
			args
				.pick('user')
				.then((u) => u.id)
				.catch(() => args.message.author.id),
		'user.avatar': () =>
			args
				.pick('user')
				.then((u) => u.displayAvatarURL())
				.catch(() => args.message.author.displayAvatarURL()),
		'user.mention': () => args.pick('user').catch(() => args.message.author),

		// misc
		prefix: container.client.options.defaultPrefix?.toString(),
		ping: container.client.ws.ping,
		args: () => args.rest('string').catch(() => 'no args'),

		// images
		'attachment.last': () =>
			getLastMedia(args.message.channel as TextChannel)
				.then((att) => att?.proxyURL)
				.catch(() => 'no images')
	};
}
