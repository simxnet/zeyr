import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';

@ApplyOptions<Subcommand.Options>({
    name: "anime"
})
export class ParentCommand extends Subcommand {
	public override registerApplicationCommands(
		registry: ApplicationCommandRegistry
	) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			// Calling both hooks is only necessary if required, it is not mandatory.
			return ctx
				.setName(this.name)
				.setDescription('Parent command of anime subcommands');
		});
	}
}
