import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Piece, type PieceOptions, Store } from '@sapphire/framework';
import { blue, gray, green, yellow } from 'colorette';

const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
	}

	private printBanner() {
		const success = green('+');
		const info = yellow('*');

		if (dev) {
			this.container.logger.info(`${info} Development build`);
		}

		this.container.logger.info(`${success} Connected to gateway`);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<Piece<PieceOptions>>, last: boolean) {
		const success = green('+');

		return gray(
			`${last ? '└─' : '├─'} ${success} ${this.style(
				store.size.toString().padEnd(3, ' ')
			)} ${store.name}.`
		);
	}
}
