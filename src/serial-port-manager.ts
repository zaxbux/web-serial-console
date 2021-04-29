import { Dispatcher } from './utils/dispatcher';
import Log from './utils/log';
import { niceName } from './utils/usb-devices';

type SerialPortMap = Map<SerialPort, SerialPortMetadata>;

interface SerialEvent extends Event {
	target: SerialPort;
}

interface SerialPortMetadata {
	label: String;
	info: SerialPortInfo;
}

const log = new Log('serial ports');

export class SerialPortManager extends Dispatcher {
	private static _instance: SerialPortManager;

	private _ports: SerialPortMap;

	constructor() {
		if (!SerialPortManager._instance) {
			super();

			this._ports = new Map<SerialPort, SerialPortMetadata>();

			log.info('init');

			navigator.serial?.addEventListener('connect', (event: Event): void => {
				log.info('@connect', event);
		
				const port = (event as SerialEvent).target;
				const metadata = getPortMetadata(port);

				this.dispatch('connect', {
					port,
					metadata
				});
		
				this._ports.set(port, metadata);
				this.dispatch('update', { ports: this._ports });
			});

			navigator.serial?.addEventListener('disconnect', (event: Event): void => {
				log.info('@disconnect', event);
		
				const port = (event as SerialEvent).target;
				const metadata = getPortMetadata(port);

				this.dispatch('disconnect', {
					port,
					metadata
				});
		
				this._ports.delete(port);
				this.dispatch('update', { ports: this._ports });
			});

			SerialPortManager._instance = this;
		}

		return SerialPortManager._instance;
	}

	/**
	 * Gets serial ports that we are authorized to access.
	 * @returns Map of serial ports.
	 */
	public async getPorts(): Promise<SerialPortMap> {
		const ports = await navigator.serial.getPorts();

		for (const port of ports) {
			this._ports.set(port, getPortMetadata(port));
		}

		this.dispatch('update', { ports: this._ports });

		log.debug('getPorts()', this._ports);

		return this._ports;
	}

	/**
	 * Requests the user to choose a port.
	 * @returns The port chosen.
	 */
	public async requestPort(): Promise<SerialPort> {
		log.debug('requestPort()');

		try {
			const port = await navigator.serial.requestPort();
			const portMetadata = getPortMetadata(port);

			log.info('selected port', portMetadata);
			this.dispatch('new', {port, portMetadata});

			this._ports.set(port, portMetadata);
			this.dispatch('update', { ports: this._ports });

			return port;
		} catch (error) {
			log.error('rejected', error);
			throw error;
		}
	}

	get ports(): SerialPortMap {
		return this._ports;
	}

	public getPort(index: number): SerialPort {
		const [port, portMetadata] = Array.from(this._ports)[index];

		if (port) {
			return port;
		}
	}
}

const manager = new SerialPortManager();
//Object.freeze(manager);
export default manager;

export function getPortMetadata(port: SerialPort): SerialPortMetadata {
	return {
		label: niceName(port),
		info: port.getInfo(),
	};
};