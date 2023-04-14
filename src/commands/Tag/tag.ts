import { ApplyOptions } from '@sapphire/decorators';
import { Subcommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { TagParser } from '../../lib/tags/parser';
import { TagLexer } from '../../lib/tags/lexer';
import { getTagFilters } from '../../lib/tags/filter';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Subcommand.Options>({
	description: 'Tags commands',
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
		}
	]
})
export class UserCommand extends Subcommand {
	public async show(message: Message, args: Args) {
		const name = await args.rest('string');

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name
			}
		});

		if (!tag) return send(message, `❌ The tag \`${name}\` does not exist`);

		const filter = getTagFilters(args);
		const lexer = new TagLexer(filter).parse();

		const content = new TagParser(lexer).parse(tag.content);

		return send(message, content);
	}

	public async add(message: Message, args: Args) {
		const name = await args.pick('string');
		const content = await args.rest('string');

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name
			}
		});

		if (tag) return send(message, `❌ The tag \`${name}\` already exists`);

		await this.container.prisma.tag.create({
			data: {
				name,
				content,
				userId: message.author.id
			}
		});

		return send(message, `✅ I've just created \`${name}\` tag`);
	}

	public async delete(message: Message, args: Args) {
		const name = await args.pick('string');

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name
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
}
