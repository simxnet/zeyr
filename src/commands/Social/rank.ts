import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { Image } from 'imagescript';
import { decodeWEBP } from '../../lib/utils';
import { AttachmentBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'social',
        slashSubcommand: (builder) => builder.setName('rank').setDescription('Display a user\'s rank card')
        .addUserOption((u) => u.setName("user").setDescription("User to display rank card").setRequired(false))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		await interaction.deferReply({ fetchReply: true });
		const user = interaction.options.getUser('user') ?? interaction.user;

		const dbUser = await this.container.prisma.user.findUnique({
			where: {
				id: user.id
			}
		});

		if (!dbUser)
			return interaction.editReply({
				content:
					'❎ The user was registered on the database. Please run the command again'
			});

		const font = await fetch(
			'https://cdn.discordapp.com/attachments/1077040647271362593/1099273634050220042/Inter-Bold.ttf'
		)
			.then((r) => r.arrayBuffer())
			.then((b) => new Uint8Array(b));

		const avatar = (await fetch(
			user.displayAvatarURL({ extension: 'png' }) ?? user.defaultAvatarURL
		)
			.then((i) => i.arrayBuffer())
			.then((b) => decodeWEBP(b as Buffer))) as Image;

		const username = await Image.renderText(
			font,
			48,
			user.username,
			this.formatHex(this.colorScheme.white)
		);

		const ranking = await Image.renderText(
			font,
			48,
			'#1',
			this.formatHex(this.colorScheme.white)
		);

		// level
		const level = new Image(175, 45);

		const levelText = await Image.renderText(
			font,
			30,
			'lvl 5',
			this.formatHex(this.colorScheme.white)
		);

		level.fill(this.formatHex(this.colorScheme.bg));

		// card
		const card = new Image(930, 280);

		card.fill(this.formatHex(this.colorScheme.bg));

		// avatar layout
		card.drawBox(53, 0, 229, 283, this.formatHex(this.colorScheme.bgLight));
		card.composite(avatar.resize(175, 175).roundCorners(22), 80, 23);

		// level
		card.composite(level.roundCorners(25), 80, 216);
		card.composite(levelText, 137, 221);

		// ranking
		card.composite(ranking, 847, 23);

		// username
		card.composite(username, 300, 23);

		const buffer = await card.encode().then((i) => i.buffer);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: `${user.id}.png`
		});

		return interaction.editReply({
			content: `✅ Watching rank card from **${user.username}**`,
			files: [file]
		});
	}

	public colorScheme = {
		bg: '030711',
		bgLight: '0F172A',
		white: 'FFFFFF',
		primary: '56C4FB'
	};

	public formatHex(hex: string) {
		return Number(`0x${hex}FF`);
	}
}
