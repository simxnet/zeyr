import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { WEBSHOT_API } from '../../lib/constants';
import { AttachmentBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    preconditions: ['NSFW'],
    registerSubCommand: {
        parentCommandName: 'tools',
        slashSubcommand: (builder) => builder.setName('webshot').setDescription('Take a screenshot of a website')
        .addStringOption(option => option.setName('url').setDescription('URL of the website').setRequired(true))
        .addStringOption(option => option.setName('fullpage').setDescription('Should screenshot full page').setRequired(false))
        .addBooleanOption(option => option.setName('wait').setDescription('Wait time before screenshot').setRequired(false))
        .addNumberOption(option => option.setName('width').setDescription('Width of the screenshot').setRequired(false))
        .addNumberOption(option => option.setName('height').setDescription('Height of the screenshot').setRequired(false))
        .addStringOption(option => option.setName('format').setDescription('Format of the output').setRequired(false).addChoices({
            name: 'png',
            value: 'png'
        },
        {
            name: 'jpeg',
            value: 'jpeg'
        }
        ))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const url = interaction.options.getString('url', true);
		const fullpage = interaction.options.getBoolean('fullpage') ?? false;
		const wait = interaction.options.getNumber('wait') ?? 100;
		const width = interaction.options.getNumber('width') ?? 1280;
		const height = interaction.options.getNumber('height') ?? 900;
		const format = interaction.options.getString('format') ?? 'png';

		const image = await (
			await fetch(
				`${WEBSHOT_API}/api/screenshot?resX=${width}&resY=${height}&outFormat=${format}&waitTime=${wait}&isFullPage=${fullpage}&url=${url}`
			)
		)
			.arrayBuffer()
			.catch((e) => {
				console.error(e);
				return interaction.editReply({
					content: `❌ Failed to get screenshot, took ${stopwatch
						.stop()
						.toString()}`
				});
			});

		const file = new AttachmentBuilder(Buffer.from(image as ArrayBuffer), {
			name: `screenshot.${format}`
		});

		return interaction.editReply({
			content: `✅ Done, took ${stopwatch.stop().toString()}`,
			files: [file]
		});
	}
}
