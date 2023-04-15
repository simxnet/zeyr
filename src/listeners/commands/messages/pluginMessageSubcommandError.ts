import { Identifiers, UserError } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import {
	MessageSubcommandErrorPayload,
	SubcommandPluginEvents
} from '@sapphire/plugin-subcommands';

export class PluginListener extends Listener<
	typeof SubcommandPluginEvents.MessageSubcommandError
> {
	public constructor(context: Listener.Context) {
		super(context, { event: SubcommandPluginEvents.MessageSubcommandError });
	}

	public run(error: UserError, context: MessageSubcommandErrorPayload) {
		const { name, location } = context.command;
		let errorMessage;

		switch (error.identifier) {
			case Identifiers.ArgsMissing:
				errorMessage = '❌ You need to provide the enough arguments';
				break;

			default:
				errorMessage = error.message;
				break;
		}

		this.container.logger.error(
			`Encountered error on message subcommand "${name}" at path "${location.full}"`,
			error
		);
		return reply(context.message, {
			content: errorMessage
		});
	}
}
