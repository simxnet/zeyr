import type {
	ChatInputCommandDeniedPayload,
	Events
} from '@sapphire/framework';
import { Identifiers, Listener, type UserError } from '@sapphire/framework';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public async run(error: UserError, context: ChatInputCommandDeniedPayload) {
		const { name, location } = context.command;
		let errorMessage;

		switch (error.identifier) {
			case Identifiers.PreconditionCooldown:
				errorMessage = '❌ You are being rate limited';
				break;

			default:
				errorMessage = error.message;
				break;
		}

		this.container.logger.error(
			`Encountered error on chat input command "${name}" at path "${location.full}"`,
			error
		);
		return context.interaction[
			context.interaction.deferred ? 'editReply' : 'reply'
		]({
			content: errorMessage,
			ephemeral: true
		});
	}
}
