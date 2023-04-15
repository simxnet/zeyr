import { color } from '../../lib/constants';
import { getTagFilters } from '../../lib/tags/filter';
import { TagLexer } from '../../lib/tags/lexer';
import { TagParser } from '../../lib/tags/parser';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { codeBlock } from '@sapphire/utilities';
import { EmbedBuilder, Message } from 'discord.js';

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
			name: "source",
			messageRun: "source"
		},
		{
			name: "raw",
			messageRun: "source"
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

		const content = await new TagParser(lexer).parse(tag.content);

		return send(message, content);
	}

	public async add(message: Message, args: Args) {
		const name = await args.pick('string');
		const content = await args.rest('string');

		if (name.length >= 64) return send(message, '❌ The tag name is too long');

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

	public async source(message: Message, args: Args) {
		const name = await args.pick('string');

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name,
				guildId: message.guildId!
			},
			include: {
				author: true
			}
		});

		if (!tag) return send(message, `❌ The tag \`${name}\` does not exist`);

		const embedTag = new EmbedBuilder()
			.setTitle(tag.name)
			.setColor(color)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			})
			.setDescription(codeBlock(tag.content))
			.addFields([
				{
					name: 'Owner',
					value: `<@${tag.author.id}>`
				}
			]);

		return send(message, {
			content: `✅ You are viewing \`${name}\` tag`,
			embeds: [embedTag]
		});
	}
}
