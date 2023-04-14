import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Command.Options>({
    enabled: false,
    registerSubCommand: {
        parentCommandName: 'misc',
        slashSubcommand: (builder) => builder.setName('facts').setDescription('No 🧢').addStringOption((o) => o.setName("text").setDescription("Text for the image").setRequired(true))
    }
})
export class UserCommand extends Command {
    public override async chatInputRun(interaction: Command.ChatInputInteraction) {
        return interaction.reply({ content: "WIP" })
    }
}