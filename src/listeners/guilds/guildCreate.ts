import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder, Guild } from 'discord.js';
import { color, invite, support, vote } from '../../lib/constants';
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
					'Zeyr is a basic bot with general purposes with features as image manipulation, dev useful tools...\n\nNow you are ready to start using Zeyr, so please, if you have any question or problem with the bot, contact me at braixen#2308'
				)}\nThat's it, you are all set up to start using Zeyr on your server, have fun ;)\n\n*By having Zeyr you accept it's Terms of Service and Privacy policy*`
			)
			.addFields([
				{
					name: 'Some links',
					value: `- [Support server](${support})\n- [Invite](${invite})\n- [Vote](${vote})`
				}
			])
			.setFooter({ iconURL: guild.iconURL() ?? undefined, text: guild.name })
			.setImage('https://imgur.com/h0n0wUf.png');

		target.send({ embeds: [thanks] });
	}
}
