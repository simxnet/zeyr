import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Enime } from '../../lib/structures/api/enime/Enime';
import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'anime',
        slashSubcommand: (builder) => builder.setName('search').setDescription('Search animes with AnimixPlay')
        .addStringOption((o) => o.setName("query").setDescription("Search query").setRequired(true).setAutocomplete(true))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({ fetchReply: true });
		const query = interaction.options.getString('query', true);

		const search = await this.anime.getAnime(query);
		const searchEmbed = new EmbedBuilder()
			.setColor(search.color as ColorResolvable)
			.setAuthor({
				iconURL: search.coverImage,
				name: 'Anime search'
			})
			.setTitle(search.title.userPreferred)
			.setDescription(this.formatDescription(search.description))
			.setThumbnail(search.coverImage)
			.setImage(search.bannerImage)
			.addFields([
				{
					name: 'Status',
					value: codeBlock(search.status),
					inline: true
				},
				{
					name: 'Genre',
					value: codeBlock(search.genre.join(', ')),
					inline: true
				},
				{
					name: 'Format',
					value: codeBlock(search.format)
				}
			]);

		return interaction.editReply({
			embeds: [searchEmbed]
		});
	}

	public anime = new Enime();

	public formatDescription(description?: string) {
		return description
			? description.replace(/<br><br>/g, '\n')
			: 'No description';
	}
}
