import type { Events, MessageCommandDeniedPayload } from '@sapphire/framework';
import { Listener, type UserError } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
	public async run(
		{ message: content }: UserError,
		{ message }: MessageCommandDeniedPayload
	) {
		return reply(message, {
			content,
			allowedMentions: { users: [message.author.id], roles: [] }
		});
	}
}
