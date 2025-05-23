import { Dispatcher } from './dispatcher';
import Log from './log';
import { niceName } from './usb-devices';

export type SerialPortMap = Map<SerialPort, SerialPortMetadata>;

interface SerialEvent extends Event {
	target: SerialPort;
}

export interface SerialPortMetadata {
  index: number;
	label: string;
	info: SerialPortInfo;
}

const log = new Log('serial ports');

export class SerialPortManager extends Dispatcher {
	private static _instance: SerialPortManager;

	private _ports!: SerialPortMap;

	constructor() {
		if (!SerialPortManager._instance) {
			super();

			this._ports = new Map<SerialPort, SerialPortMetadata>();

			log.info('init');

			navigator.serial?.addEventListener('connect', (event: Event): void => {
				log.info('@connect', event);

				const port = (event as SerialEvent).target;
				const metadata = getPortMetadata(port, this._ports.has(port) ? this._ports.get(port)!.index : this._ports.size);

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
				const metadata = getPortMetadata(port, this._ports.get(port)!.index);

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
			this._ports.set(port, getPortMetadata(port, this._ports.size));
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
			const portMetadata = getPortMetadata(port, this._ports.has(port) ? this._ports.get(port)!.index : this._ports.size);

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

	public getPort(index: number): SerialPort | undefined {
		const [port, _portMetadata] = Array.from(this._ports)[index] || [];

		if (port) {
			return port;
		}
	}
}

const manager = new SerialPortManager();
//Object.freeze(manager);
export default manager;

export function getPortMetadata(port: SerialPort, index: number): SerialPortMetadata {
  const info = port.getInfo();

  const vendorId = info.usbVendorId?.toString(16)
  const productId = info.usbProductId?.toString(16)

	return {
    index: index,
		label: niceName(port, (typeof index === 'number' ? `Port ${index} ` : '') + `[0x${vendorId}:0x${productId}]`),
		info,
	};
}
