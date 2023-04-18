import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Tag',
	aliases: ['t', 'tags']
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return send(
			message,
			'❌ We are migrating tags into slash and we also will now manage them via a custom handler, this handler will help us to make a cleaner structure and provide more customizable tags'
		);
	}
}
