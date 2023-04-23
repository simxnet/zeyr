// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import {
	ApplicationCommandRegistries,
	RegisterBehavior
} from '@sapphire/framework';

import '@kaname-png/plugin-subcommands-advanced/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';

import { setup } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { inspect } from 'util';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
	RegisterBehavior.BulkOverwrite
);

// Set default message to a custom one
PaginatedMessage.wrongUserInteractionReply = (u) =>
	`⚠ Nice try, this embed is only for **${u.tag}**`;

// Read env var
setup();

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });
