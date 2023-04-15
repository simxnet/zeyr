import { ApplyOptions } from '@sapphire/decorators';
import {
	InteractionHandler,
	InteractionHandlerTypes
} from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import type { ModalSubmitInteraction } from 'discord.js';
import { NodePistonClient } from 'piston-api-client';
import { syntaxHighlight } from '../../lib/utils';
import { pistonLangs } from '../../lib/constants';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== '@tools/code') return this.none();

		const language = interaction.fields.getTextInputValue('language');
		const code = interaction.fields.getTextInputValue('code');
		const args = interaction.fields.getTextInputValue('args');

		return this.some({ language, code, args });
	}

	public async execute(
		interaction: ModalSubmitInteraction,
		language: string,
		code: string,
		args?: string
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		if (!pistonLangs.includes(language))
			return interaction.editReply({
				content: '❌ The language you submitted is invalid'
			});

		const piston = new NodePistonClient({ server: 'https://emkc.org' });
		const result = await piston.execute({
			language,
			version: '*',
			files: [
				{
					content: code
				}
			],
			args: args ? args.split(' ') : undefined
		});

		if (result.success) {
			console.log(result.data.run);
			if (result.data.run.output === '') {
				return interaction.editReply({
					content: `✅ Your code ran with no output! ${result.data.language}(${
						result.data.version
					}) code, took ${stopwatch.stop().toString()}`
				});
			}
			return interaction.editReply({
				content: `✅ Here is your ${result.data.language}(${
					result.data.version
				}) code, took ${stopwatch.stop().toString()}\n${syntaxHighlight(
					result.data.language,
					result.data.run.output
				)}`
			});
		} else {
			return interaction.editReply({ content: '❌ Something happened' });
		}
	}

	public async run(
		interaction: ModalSubmitInteraction,
		options: InteractionHandler.ParseResult<this>
	) {
		await this.execute(
			interaction,
			options.language,
			options.code,
			options.args
		);
	}
}
