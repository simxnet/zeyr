import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Urbandictionary } from '../../lib/structures/api/urbandictionary/Urbandictionary';
import { EmbedBuilder } from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { color } from '../../lib/constants';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'tools',
        slashSubcommand: (builder) => builder.setName('urbandictionary').setDescription('Search definitions on Urbandictionary')
        .addStringOption((s) => s.setName("term").setDescription("Search for a term definition").setRequired(true))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({
			fetchReply: true
		});
		const term = interaction.options.getString('term', true);

		const definition = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(color)
				.setThumbnail('https://imgur.com/IT2Sjug.png')
		});

		const { list } = await this.ud.define(term);

		if (!list || list.length <= 0) {
			return interaction.editReply({
				content: "❎ I wasn't able to find a definition for that term"
			});
		}

		for (const item of list) {
			definition.addPageEmbed((embed) =>
				embed //
					.setDescription(item.definition)
					.setTitle('Urbandictionary')
					.setAuthor({
						name: item.word,
						url: item.permalink
					})
					.setFooter({
						text: ` Definition by ${item.author}`
					})
					.addFields([
						{
							name: 'Example',
							value: item.example
						},
						{
							name: 'Thumbs up',
							value: `👍 ${item.thumbs_up}`,
							inline: true
						},
						{
							name: 'Thumbs down',
							value: `👎 ${item.thumbs_down}`,
							inline: true
						}
					])
			);
		}

		return definition.run(interaction);
	}

	public ud = new Urbandictionary();
}
