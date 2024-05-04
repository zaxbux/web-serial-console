import { Terminal } from '@xterm/xterm';

declare interface SerialPortConsoleCallbacks {
	onConnecting(options: SerialOptions): void;
	onConnected(port: SerialPort): void;
	onDisconnecting(data?: { early?: boolean}): void;
	onDisconnected(data?: { early?: boolean}): void;
	onConnectError(error: Error): void;
	onDisconnectError(error: Error): void;
}

const BEL_SEQUENCE = Uint8Array.from([0x07]);

export class SerialPortConsole {
	private _port?: SerialPort;
	private _reader?: ReadableStreamDefaultReader;
	private _terminal: Terminal;
	private _callbacks: SerialPortConsoleCallbacks;
	private _echo: boolean;
	private _flushOnEnter: boolean;

	constructor(terminal: Terminal, callbacks: SerialPortConsoleCallbacks) {
		this._terminal = terminal;
		this._callbacks = callbacks;
		this._echo = false;
		this._flushOnEnter = false;

		this._init();
	}

	private _init() {
		const encoder = new TextEncoder();
		let buffer = '';

		this._terminal.onData((data) => {
			if (this._echo) {
				this._terminal.write(encoder.encode(data));
			}

			if (this._port?.writable == null) {
				console.warn(`port is not connected or is not writable`);

				// ring bell
				this._terminal.write(BEL_SEQUENCE);
				return;
			}

			const writer = this._port.writable.getWriter();

			if (this._flushOnEnter) {
				buffer += data;
				if (data === '\r') {
					writer.write(encoder.encode(buffer));
					writer.releaseLock();
					buffer = '';
				}
			} else {
				writer.write(encoder.encode(data));
			}

			writer.releaseLock();
		});
	}

	/**
	 * Initiates a connection to the selected port.
	 */
	async connect(port: SerialPort, options: SerialOptions): Promise<void> {
		if (!port) {
			return;
		}

		this._port = port;

		this._callbacks.onConnecting(options);

		try {
      await this._port.open(options);
    } catch (err) {
      this._callbacks.onConnectError(err)
    }

		this._callbacks.onConnected(port);

		while (this._port && this._port.readable) {
			try {
				this._reader = this._port.readable.getReader();
				for (; ;) {
					const { value, done } = await this._reader.read();
					if (value) {
						this._terminal.write(value);
					}
					if (done) {
						break;
					}
				}

				this._reader.releaseLock();
				delete this._reader;
			} catch (error) {
				this._callbacks.onConnectError(error);
			}
		}

		if (this._port) {
			try {
				this._callbacks.onDisconnecting({ early: true });

				await this._port.close();
			} catch (error) {
				this._callbacks.onDisconnectError(error);
			}

			this._callbacks.onDisconnected({ early: true });
		}
	}

	/**
	 * Closes the currently active connection.
	 */
	async disconnect(): Promise<void> {
		// Move |port| into a local variable so that connectToPort() doesn't try to
		// close it on exit.
		const localPort = this._port;
		delete this._port;

		if (this._reader) {
			await this._reader.cancel();
		}

		if (localPort) {
			try {
				this._callbacks.onDisconnecting();

				await localPort.close();
			} catch (error) {
				this._callbacks.onDisconnectError(error);
			}
		}

		this._callbacks.onDisconnected();
	}

	set echo(value: boolean) {
		this._echo = value;
	}

	set flushOnEnter(value: boolean) {
		this._flushOnEnter = value;
	}
}
