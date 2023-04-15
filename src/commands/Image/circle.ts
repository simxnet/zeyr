import { getLastMedia } from '../../lib/utils';
import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { AttachmentBuilder, TextChannel } from 'discord.js';
import { Image, decode } from 'imagescript';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: __dirname.split('\\').pop()?.toLowerCase()!,
        slashSubcommand: (builder) => builder.setName('circle').setDescription('Crops the image into a circle')
        .addAttachmentOption((o) => o.setName("image").setDescription("Image to crop").setRequired(false))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const image =
			interaction.options.getAttachment('image')?.proxyURL ??
			(await getLastMedia(interaction.channel as TextChannel).then(
				(i) => i?.proxyURL
			));

		if (!image)
			return interaction.reply({
				content: 'Please provide a valid image',
				ephemeral: true
			});

		const circle = (await fetch(image)
			.then((img) => img.arrayBuffer())
			.then((b) => decode(b as Buffer))
			.catch((e: Error) =>
				interaction.editReply({
					content: `❌ ${e.message}`
				})
			)) as Image;

		circle.cropCircle();

		const buffer = await circle.encode().then((i) => i.buffer);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: 'circle.png'
		});

		return interaction.editReply({
			content: `✅ Done, took ${stopwatch.stop().toString()}`,
			files: [file]
		});
	}
}
