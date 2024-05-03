import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SerializeAddon } from '@xterm/addon-serialize';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import terminalTestPattern from './utils/terminal-test-pattern';


export class TerminalPlatform {
	private _terminal: Terminal;
	private _addons: {
		fit: FitAddon,
		search: SearchAddon,
		serialize: SerializeAddon,
	};

	constructor(options?: ITerminalOptions) {
		this._terminal = new Terminal(options);

		this._addons = {
			fit: new FitAddon(),
			search: new SearchAddon(),
			serialize: new SerializeAddon(),
		};

		this._terminal.loadAddon(this._addons.fit);
		this._terminal.loadAddon(this._addons.search);
		this._terminal.loadAddon(this._addons.serialize);

		this._terminal.loadAddon(new WebLinksAddon((event, uri) => {
			if (event.ctrlKey) {
				if (confirm(`Continue to "${uri}"?`)) {
					window.open(uri, );
				}
			}
		}))
		
		this._terminal.loadAddon(new Unicode11Addon())
		this._terminal.unicode.activeVersion = '11'
	}

	public async writeTestPattern(): Promise<void> {
		this._terminal.writeln('');
		this._terminal.writeln('Welcome to the web-based serial console!');
		this._terminal.writeln('Powered by the Web Serial API ( https://wicg.github.io/serial/ )');
		this._terminal.writeln('');
		this._terminal.writeln('Created by Zachary Schneider');
		this._terminal.writeln('\thello@zacharyschneider.ca');
		this._terminal.writeln('\thttps://www.zacharyschneider.ca');
		this._terminal.writeln('');
		this._terminal.writeln('Tip: To open a link, hold CTRL and click the link.');
		this._terminal.writeln('');
		this._terminal.writeln('Bugs: https://github.com/zaxbux/web-serial-console');

		this._terminal.writeln('');

		await terminalTestPattern(this._terminal);
	}

	get terminal(): Terminal {
		return this._terminal;
	}

	get fitAddon(): FitAddon {
		return this._addons.fit;
	}

	get searchAddon(): SearchAddon {
		return this._addons.search;
	}

	get serializeAddon(): SerializeAddon {
		return this._addons.serialize;
	}
}