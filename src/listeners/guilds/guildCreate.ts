import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder, Guild } from 'discord.js';
import { color } from '../../lib/constants';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener<typeof Events.GuildCreate> {
	public async run(guild: Guild) {
		const target = guild.systemChannel ?? (await guild.fetchOwner());

		const thanks = new EmbedBuilder()
			.setColor(color)
			.setAuthor({
				iconURL: this.container.client.user?.displayAvatarURL(),
				name: 'Thanks for using Zeyr!'
			})
			.setDescription(
				`Zeyr is installed on your guild now!\n${codeBlock(
					'Zeyr is a basic bot with general purposes, it has image manipulation, tag scripting...\n\nTag scripting is WIP so please if you encounter any problem notify us via the support server.'
				)}\nThat's it, you are all set up to start using Zeyr on your server, have fun ;)\n\n*By having Zeyr you accept it's Terms of Service and Privacy policy*`
			)
			.setFooter({ iconURL: guild.iconURL() ?? undefined, text: guild.name });

		target.send({ embeds: [thanks] });
	}
}
