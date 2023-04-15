import { getLastMedia } from '../../lib/utils';
import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { AttachmentBuilder, TextChannel } from 'discord.js';
import { Image, decode } from 'imagescript';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: __dirname.split('\\').pop()?.toLowerCase()!,
        slashSubcommand: (builder) => builder.setName('invert').setDescription('Inverts the images colors')
        .addAttachmentOption((o) => o.setName("image").setDescription("Image to invert").setRequired(false))
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

		const inverted = (await fetch(image)
			.then((img) => img.arrayBuffer())
			.then((b) => decode(b as Buffer))
			.catch((e: Error) =>
				interaction.editReply({
					content: `❌ ${e.message}`
				})
			)) as Image;

		inverted.invert();

		const buffer = await inverted.encode().then((i) => i.buffer);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: 'inverted.png'
		});

		return interaction.editReply({
			content: `✅ Done, took ${stopwatch.stop().toString()}`,
			files: [file]
		});
	}
}
