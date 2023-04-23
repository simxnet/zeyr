import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'tools',
        slashSubcommand: (builder) => builder.setName('code').setDescription('Execute code on a external container')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		const modal = new ModalBuilder()
			.setCustomId('@tools/code')
			.setTitle('Code to evaluate')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('language')
						.setLabel('Language')
						.setPlaceholder('Please make sure you select a correct language')
						.setRequired(true)
						.setStyle(TextInputStyle.Short)
				),
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('code')
						.setLabel('Code')
						.setPlaceholder('Code to run')
						.setRequired(true)
						.setStyle(TextInputStyle.Paragraph)
				),
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('args')
						.setLabel('Args')
						.setPlaceholder('(OPTIONAL) Args for code')
						.setRequired(false)
						.setStyle(TextInputStyle.Paragraph)
				)
			);

		await interaction.showModal(modal);

		return interaction.reply({
			content: 'Continue on modal.',
			ephemeral: true
		});
	}
}
