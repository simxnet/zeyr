import { developers } from '../lib/constants';
import { Command, Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public run(message: Message) {
		return this.dev(message);
	}

	public interactionRun(interaction: Command.ChatInputCommandInteraction) {
		return this.dev(interaction);
	}

	public dev(context: Message | Command.ChatInputCommandInteraction) {
		if (developers.includes(context.member?.user.id!)) {
			return this.ok();
		} else {
			return this.error({ message: 'Noi noi' });
		}
	}
}
