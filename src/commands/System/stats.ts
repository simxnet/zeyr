import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder } from 'discord.js';
import { color } from '../../lib/constants';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'system',
        slashSubcommand: (builder) => builder.setName('stats').setDescription('Get internal information from Zeyr')
    }
})
export class UserCommand extends Command {
    public override chatInputRun(interaction: Command.ChatInputInteraction) {
        const { ramTotal, ramUsed } = this.getRamUsage;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Zeyr statistics")
            .setAuthor({
                name: 'Zeyr statistics',
                iconURL: this.container.client.user?.displayAvatarURL()!,
            })
            .setThumbnail(this.container.client.user?.displayAvatarURL()!)
            .addFields([
                {
                    name: 'RAM usage',
                    value: codeBlock(`📦 Heap: ${ramUsed}mb (Total: ${ramTotal}mb)`),
                },
                {
                    name: 'Uptime',
                    value: codeBlock(`⏲ ${Date.now() - this.container.client.uptime!}`),
                }
        ])

        return interaction.reply({
            embeds: [embed]
        })
    }
    
    private get getRamUsage() {
		const usage = process.memoryUsage();
		return {
			ramTotal: `${(usage.heapTotal / 1048576).toFixed(2)}`,
			ramUsed: `${(usage.heapUsed / 1048576).toFixed(2)}`
		};
	}
}