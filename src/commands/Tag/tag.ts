import { getTagFilters } from '../../lib/tags/filter';
import { TagLexer } from '../../lib/tags/lexer';
import { TagParser } from '../../lib/tags/parser';
import { ApplyOptions, RequiresUserPermissions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

@ApplyOptions<Subcommand.Options>({
	description: 'Tags commands',
	aliases: ['t'],
	subcommands: [
		{
			name: "show",
			messageRun: "show",
			default: true
		},
		{
			name: "add",
			messageRun: "add"
		},
		{
			name: "delete",
			messageRun: "delete"
		},
		{
			name: "removeAll",
			messageRun: "removeAll"
		}
	]
})
export class UserCommand extends Subcommand {
	public async show(message: Message, args: Args) {
		const name = await args.pick('string');

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name,
				guildId: message.guildId!
			}
		});

		if (!tag) return send(message, `❌ The tag \`${name}\` does not exist`);

		const filter = getTagFilters(args);
		const lexer = new TagLexer(filter).format();

		console.log(lexer);

		const content = await new TagParser(lexer).parse(tag.content);

		return send(message, content);
	}

	public async add(message: Message, args: Args) {
		try {
			const name = await args.pick('string');
			const content = await args.rest('string');

			if (name.length >= 64)
				return send(message, '❌ The tag name is too long');

			const tag = await this.container.prisma.tag.findFirst({
				where: {
					name,
					guildId: message.guildId!
				}
			});

			if (tag) return send(message, `❌ The tag \`${name}\` already exists`);

			await this.container.prisma.tag.create({
				data: {
					name,
					content,
					memberId: message.member!.id,
					guildId: message.guildId!
				}
			});

			return send(message, `✅ I've just created \`${name}\` tag`);
		} catch (e) {
			console.log(e);
			return send(message, 'Lol error');
		}
	}

	public async delete(message: Message, args: Args) {
		const name = await args.pick('string');

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name,
				guildId: message.guildId!
			}
		});

		if (!tag) return send(message, `❌ The tag \`${name}\` does not exist`);

		await this.container.prisma.tag.delete({
			where: {
				id: tag.id
			}
		});

		return send(message, `✅ I've just deleted \`${name}\` tag`);
	}

	@RequiresUserPermissions(['Administrator'])
	public async removeAll(message: Message) {
		const tags = await this.container.prisma.tag.findMany({
			where: {
				guildId: message.guildId!
			}
		});

		if (!tags.length) return send(message, '❌ There are no tags to delete');

		await this.container.prisma.tag
			.deleteMany({
				where: {
					guildId: message.guildId!
				}
			})
			.catch(() => send(message, '❌ Something happened'));

		return send(message, `✅ I've just deleted all the tags in this server`);
	}
}
