import { PrismaClient } from '@prisma/client';
import { SapphireClient, container } from '@sapphire/framework';
import { greenBright } from 'colorette';
import type { ClientOptions } from 'discord.js';

export class ZClient extends SapphireClient {
	constructor(opts: ClientOptions) {
		super(opts);

		container.prisma = new PrismaClient();
	}

	/**
	 * Start the bot
	 */
	public async init() {
		await super.login();
		await container.prisma
			.$connect()
			.then(() => {
				container.logger.info(`${greenBright('+')} Prisma service online`);
			})
			.catch((error) => container.logger.fatal(error));
	}
}
