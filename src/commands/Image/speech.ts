import { decodeWEBP, getLastMedia } from '../../lib/utils';
import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { AttachmentBuilder, TextChannel } from 'discord.js';
import { Image, decode } from 'imagescript';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'image',
        slashSubcommand: (builder) => builder.setName('speech-balloon').setDescription('Creates a image with speech balloon')
        .addAttachmentOption((o) => o.setName("image").setDescription("🤓🤓").setRequired(false))
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
				(i) => i?.proxyURL || i?.url
			));

		if (!image)
			return interaction.editReply({
				content: 'Please provide a valid image'
			});

		const balloon = (await fetch(this.SPEECH_BALLON_IMAGE_URL)
			.then((img) => img.arrayBuffer())
			.then((b) => decode(b as Buffer))) as Image;

		const speech = (await fetch(image)
			.then((img) => img.arrayBuffer())
			.then(async (b) => decodeWEBP(b as Buffer))
			.catch((e: Error) =>
				interaction.editReply({
					content: `❌ ${e.message}`
				})
			)) as Image;

		speech.fit(speech.width, speech.height + (balloon.height - 100) * 2);
		speech.composite(balloon.resize(speech.width, balloon.height - 100), 0, 0);
		speech.crop(0, 0, speech.width, speech.height - balloon.height);

		const buffer = await speech.encode().then((i) => i.buffer);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: 'speech.gif'
		});

		return interaction.editReply({
			content: `✅ Done, took ${stopwatch.stop().toString()}`,
			files: [file]
		});
	}

	public SPEECH_BALLON_IMAGE_URL = 'https://i.redd.it/z0nqjst12ih61.jpg';
}
