import { getLastMedia } from '../utils';
import { TagOptions } from './types';
import { Args, container } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

/**
 * Every tag may have his own callback
 */
export function getTagFilters(args: Args): TagOptions {
	return {
		// server
		server: args.message.guild?.name,
		'server.id': args.message.guildId,
		'server.memberCount': args.message.guild?.memberCount,
		'server.name': args.message.guild?.name,
		'server.icon': args.message.guild?.iconURL(),
		'server.owner': args.message.guild?.ownerId,
		'server.owner.id': args.message.guild?.ownerId,
		'server.owner.name': args.message.guild?.ownerId,
		'server.owner.avatar': args.message.guild?.ownerId,
		'server.owner.mention': args.message.guild?.ownerId,
		'server.region': 'deprecated',

		// author
		author: args.message.author.username,
		'author.id': args.message.author.id,
		'author.name': args.message.author.username,
		'author.avatar': args.message.author.avatarURL(),
		'author.mention': args.message.author.toString(),
		'author.tag': args.message.author.tag,
		'author.discriminator': args.message.author.discriminator,
		'author.bot': args.message.author.bot,

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
		'user.tag': () =>
			args
				.pick('user')
				.then((u) => u.tag)
				.catch(() => args.message.author.tag),
		'user.discriminator': () =>
			args
				.pick('user')
				.then((u) => u.discriminator)
				.catch(() => args.message.author.discriminator),
		'user.bot': () =>
			args
				.pick('user')
				.then((u) => u.bot)
				.catch(() => args.message.author.bot),

		// channel
		channel: (args.message.channel as TextChannel).name,
		'channel.id': args.message.channel.id,
		'channel.name': (args.message.channel as TextChannel).name,
		'channel.mention': args.message.channel.toString(),
		'channel.type': (args.message.channel as TextChannel).type,

		// member
		member: args.message.member?.displayName,
		'member.id': args.message.member?.id,
		'member.name': args.message.member?.displayName,
		'member.avatar': args.message.member?.displayAvatarURL(),
		'member.mention': args.message.member?.toString(),
		'member.tag': args.message.member?.user.tag,
		'member.discriminator': args.message.member?.user.discriminator,

		// role
		role: args.message.member?.roles.highest.name,
		'role.id': args.message.member?.roles.highest.id,
		'role.name': args.message.member?.roles.highest.name,
		'role.mention': args.message.member?.roles.highest.toString(),
		'role.color': args.message.member?.roles.highest.hexColor,
		'role.position': args.message.member?.roles.highest.position,
		'role.hoist': args.message.member?.roles.highest.hoist,
		'role.managed': args.message.member?.roles.highest.managed,
		'role.mentionable': args.message.member?.roles.highest.mentionable,

		// message
		message: args.message.content,
		'message.id': args.message.id,
		'message.content': args.message.content,
		'message.mention': args.message.toString(),
		'message.author': args.message.author.toString(),
		'message.author.id': args.message.author.id,
		'message.author.name': args.message.author.username,
		'message.author.avatar': args.message.author.avatarURL(),
		'message.author.tag': args.message.author.tag,
		'message.author.discriminator': args.message.author.discriminator,
		'message.author.bot': args.message.author.bot,

		// time
		time: () => new Date().toISOString(),

		// misc
		prefix: container.client.options.defaultPrefix?.toString(),
		ping: container.client.ws.ping,
		args: () => args.rest('string').catch(() => 'no args'),
		argsRaw: () => args.rest('string').catch(() => 'no args'),
		argsArray: () => args.rest('string').catch(() => 'no args'),
		argsArrayRaw: () => args.rest('string').catch(() => 'no args'),
		argsString: () => args.rest('string').catch(() => 'no args'),
		argsStringRaw: () => args.rest('string').catch(() => 'no args'),
		argsNumber: () => args.rest('number').catch(() => 'no args'),
		argsNumberRaw: () => args.rest('number').catch(() => 'no args'),
		argsBoolean: () => args.rest('boolean').catch(() => 'no args'),
		argsBooleanRaw: () => args.rest('boolean').catch(() => 'no args'),
		argsMember: () => args.pick('member').catch(() => 'no args'),

		// images
		lastAttachment: () =>
			getLastMedia(args.message.channel as TextChannel)
				.then((att) => att?.proxyURL)
				.catch(() => 'no images')
	};
}
