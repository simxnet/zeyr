import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot) return;
		if (message.webhookId) return;
		if (message.system) return;
		if (message.channel.isDMBased()) return;

		const user = await this.container.prisma.user.findUnique({
			where: {
				id: message.author.id
			}
		});

		const member = await this.container.prisma.member.findUnique({
			where: {
				id: message.author.id
			}
		});

		const guild = await this.container.prisma.guild.findUnique({
			where: {
				id: message.guildId!
			}
		});

		if (!guild) {
			await this.container.prisma.guild.create({
				data: {
					id: message.guildId!
				}
			});
		}

		if (!user) {
			await this.container.prisma.user.create({
				data: {
					id: message.author.id
				}
			});
		}

		if (!member) {
			await this.container.prisma.member.create({
				data: {
					id: message.author.id,
					guildId: message.guildId!
				}
			});
		}
	}
}
