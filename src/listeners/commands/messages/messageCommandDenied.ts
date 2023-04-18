import type { Events, MessageCommandDeniedPayload } from "@sapphire/framework";
import { Identifiers, Listener, type UserError } from "@sapphire/framework";
import { reply } from "@sapphire/plugin-editable-commands";

export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
	public async run(error: UserError, context: MessageCommandDeniedPayload) {
		const { name, location } = context.command;
		let errorMessage;

		switch (error.identifier) {
			case Identifiers.ArgsMissing:
				errorMessage = "❌ You need to provide the enough arguments";
				break;

			case Identifiers.PreconditionCooldown:
				context.message.react("⛔");
				errorMessage = "❌ You are being rate limited";
				break;

			case Identifiers.CommandDisabled:
				errorMessage = "❌ This command has been disabled temporally";
				break;

			default:
				errorMessage = error.message;
				break;
		}

		this.container.logger.error(
			`Encountered error on message subcommand "${name}" at path "${location.full}"`,
			error,
		);
		return reply(context.message, {
			content: errorMessage,
		});
	}
}
