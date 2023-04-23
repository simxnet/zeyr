import { decodeWEBP, getLastMedia } from '../../lib/utils';
import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { AttachmentBuilder, TextChannel } from 'discord.js';
import { Image } from 'imagescript';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'image',
        slashSubcommand: (builder) => builder.setName('resize').setDescription('Resizes the image to the given dimensions.')
        .addNumberOption((o) => o.setName("width").setDescription("Width of the image").setMinValue(1).setMaxValue(9000).setRequired(true))
        .addNumberOption((o) => o.setName("height").setDescription("Height of the image").setMinValue(1).setMaxValue(9000).setRequired(true))
        .addAttachmentOption((o) => o.setName("image").setDescription("Image to invert").setRequired(false))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const width = interaction.options.getNumber('width', true);
		const height = interaction.options.getNumber('height', true);

		const image =
			interaction.options.getAttachment('image')?.proxyURL ??
			(await getLastMedia(interaction.channel as TextChannel).then(
				(i) => i?.proxyURL || i?.url
			));

		if (!image)
			return interaction.editReply({
				content: 'Please provide a valid image'
			});

		const resized = (await fetch(image)
			.then((img) => img.arrayBuffer())
			.then(async (b) => decodeWEBP(b as Buffer))
			.catch((e: Error) =>
				interaction.editReply({
					content: `❎ ${e.message}`
				})
			)) as Image;

		resized.resize(width, height);

		const buffer = await resized.encode().then((i) => i.buffer);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: 'resized.png'
		});

		return interaction.editReply({
			content: `✅ Done, took ${stopwatch.stop().toString()}`,
			files: [file]
		});
	}
}
