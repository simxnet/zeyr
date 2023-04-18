import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { vote } from '../../lib/constants';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'system',
        slashSubcommand: (builder) => builder.setName('vote').setDescription('Vote for me on discordlist.gg')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction
	) {
		return interaction.reply({
			content: `🤔 You can vote me through [discordlist.gg](${vote})!`
		});
	}
}
