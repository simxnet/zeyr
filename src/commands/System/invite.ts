import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { invite } from '../../lib/constants';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: "system",
        slashSubcommand: (builder) => builder.setName('invite').setDescription('Invite me')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		return interaction.reply({
			content: `🤔 You can add me using my [invite.bot](${invite}) link!`
		});
	}
}
