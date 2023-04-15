import { ApplyOptions } from '@sapphire/decorators';
import {
	ChatInputCommandDeniedPayload,
	Events,
	Identifiers,
	Listener,
	ListenerOptions,
	UserError
} from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(
		error: UserError,
		{ interaction, command }: ChatInputCommandDeniedPayload
	) {
		const { name, location } = command;
		let errorMessage;

		switch (error.identifier) {
			case Identifiers.PreconditionNSFW:
				errorMessage = '❌ This command may be ran in a NSFW channel';
				break;

			default:
				errorMessage = error.message;
				break;
		}

		this.container.logger.error(
			`Encountered error on message subcommand "${name}" at path "${location.full}"`,
			error
		);
		return interaction[interaction.deferred ? 'editReply' : 'reply']({
			content: errorMessage
		});
	}
}
