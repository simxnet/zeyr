import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { Guild } from 'discord.js';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener<typeof Events.GuildDelete> {
	public async run(guild: Guild) {
		const db = await this.container.prisma.guild.findUnique({
			where: {
				id: guild.id
			}
		});

		if (db)
			await this.container.prisma.guild.delete({
				where: {
					id: guild.id
				}
			});
	}
}
