import type { PrismaClient } from '@prisma/client';

declare module '@sapphire/framework' {
	interface Preconditions {
		Developer: never;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
	}
}

export default undefined;
