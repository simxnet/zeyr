import {
	InteractionHandler,
	InteractionHandlerTypes
} from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Enime } from '../../lib/structures/api/enime/Enime';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Autocomplete,
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(
		interaction: AutocompleteInteraction,
		result: InteractionHandler.ParseResult<this>
	) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.commandName === 'anime/search') return this.none();

		const current = interaction.options.getFocused(true);

		switch (current.name) {
			case 'query': {
				const searchResult = await this.anime.search(current.value);

				return this.some(
					searchResult.data.map((match) => ({
						name: match.title.userPreferred,
						value: match.id
					}))
				);
			}
			default:
				return this.none();
		}
	}

	public anime = new Enime();
}
