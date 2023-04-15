import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { NodePistonClient } from 'piston-api-client';
import { syntaxHighlight } from '../../lib/utils';
import { pistonLangs } from '../../lib/constants';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'tools',
        slashSubcommand: (builder) => builder.setName('code').setDescription('Execute code on a external container')
        .addStringOption(option => option.setName('language').setDescription('Language of the code').setRequired(true).addChoices(
            ...pistonLangs.map((lang) => ({
                name: lang,
                value: lang
            }))
        ))
        .addStringOption(option => option.setName('code').setDescription('Code to execute').setRequired(true))
        .addStringOption(option => option.setName('args').setDescription('Optional args for code').setRequired(false))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const language = interaction.options.getString('language', true);
		const code = interaction.options.getString('code', true);
		const args = interaction.options.getString('args', false);

		const piston = new NodePistonClient({ server: 'https://emkc.org' });
		const result = await piston.execute({
			language,
			version: '*',
			files: [
				{
					content: code
				}
			],
			args: args ? args.split(' ') : []
		});

		if (result.success) {
			return interaction.editReply({
				content: `✅ Here is your ${result.data.language}(${
					result.data.version
				}) code, took ${stopwatch.stop().toString()}\n${syntaxHighlight(
					result.data.language,
					result.data.run.stdout
				)}`
			});
		} else {
			return interaction.editReply({ content: 'An error occured' });
		}
	}
}
