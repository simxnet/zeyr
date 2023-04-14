import type { Events, MessageCommandErrorPayload } from '@sapphire/framework';
import { Listener, type UserError } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
export class UserEvent extends Listener<typeof Events.MessageCommandError> {
	public async run(
		{ context, message: content }: UserError,
		{ message }: MessageCommandErrorPayload
	) {
		if (Reflect.get(Object(context), 'silent')) return;

		return reply(message, {
			content,
			allowedMentions: { users: [message.author.id], roles: [] }
		});
	}
}
