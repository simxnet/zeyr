import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot) return;
		if (message.webhookId) return;
		if (message.system) return;

		const user = await this.container.prisma.user.findUnique({
			where: {
				id: message.author.id
			}
		});

		if (!user) {
			await this.container.prisma.user.create({
				data: {
					id: message.author.id
				}
			});
		}

		console.log(user);
	}
}
