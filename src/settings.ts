import { ITheme } from '@xterm/xterm';
import defaultBellSound from './utils/default-bell-sound';

type CursorStyle = 'block' | 'underline' | 'bar';
type BellStyle = 'none' | 'visual' | 'sound' | 'both';


export class Settings {
	private static _instance: Settings;

	private readonly _storage: Storage;
	private readonly _session: Storage;

	constructor() {
		if (!Settings._instance) {
			this._storage = window.localStorage;
			this._session = window.sessionStorage;

			Settings._instance = this;
		}

		return Settings._instance;
	}

	reset() {
		this._storage.clear();
		this._session.clear();
	}

	protected getBoolean(key: string, _default?: boolean): boolean {
		const value = this._storage.getItem(key);

		if (value === null) {
			return _default || null;
		}

		return value === '1';
	}

	get showWelcome(): boolean {
		return !this.getBoolean('welcome', false);
	}

	set showWelcome(showWelcome: boolean) {
		this._storage.setItem('welcome', showWelcome ? '0' : '1');
	}

	/*
	 * Serial Settings
	 */

	get portIndex(): number {
		return Number.parseInt(this._session.getItem('portIndex')) || 0;
	}

	set portIndex(port: number) {
		this._session.setItem('portIndex', port.toString());
	}
	
	get echo(): boolean {
		return this._storage.getItem('echo') === '1' || false;
	}

	set echo(echo: boolean) {
		this._storage.setItem('echo', echo ? '1' : '0');
	}
	
	get flushOnEnter(): boolean {
		return this._storage.getItem('flushOnEnter') === '1' || false;
	}

	set flushOnEnter(flushOnEnter: boolean) {
		this._storage.setItem('flushOnEnter', flushOnEnter ? '1' : '0');
	}
	
	get baudRate(): number {
		return Number.parseInt(this._storage.getItem('baudRate')) || 115200;
	}

	set baudRate(baudRate: number) {
		this._storage.setItem('baudRate', baudRate.toString());
	}
	
	get dataBits(): number {
		return Number.parseInt(this._storage.getItem('dataBits')) || 8;
	}

	set dataBits(dataBits: number) {
		this._storage.setItem('dataBits', dataBits.toString());
	}
	
	get parity(): ParityType {
		return this._storage.getItem('parity') as ParityType || 'none';
	}

	set parity(parity: ParityType) {
		this._storage.setItem('parity', parity);
	}
	
	get stopBits(): number {
		return Number.parseInt(this._storage.getItem('stopBits')) || 1;
	}

	set stopBits(stopBits: number) {
		this._storage.setItem('stopBits', stopBits.toString());
	}
	
	get flowControl(): FlowControlType {
		return this._storage.getItem('flowControl') as FlowControlType || 'none';
	}

	set flowControl(flowControl: FlowControlType) {
		this._storage.setItem('flowControl', flowControl);
	}
	

	/*
	 * Xterm Settings
	 */

	get cursorStyle(): CursorStyle {
		return this._storage.getItem('cursorStyle') as CursorStyle || 'bar';
	}

	set cursorStyle(cursorStyle: CursorStyle) {
		this._storage.setItem('cursorStyle', cursorStyle);
	}

	get cursorBlink(): boolean {
		return this.getBoolean('cursorBlink', true);
	}

	set cursorBlink(cursorBlink: boolean) {
		this._storage.setItem('cursorBlink', cursorBlink ? '1' : '0');
	}

	get bellSound(): string {
		return this._storage.getItem('bellSound') || defaultBellSound;
	}

	set bellSound(bellSound: string) {
		this._storage.setItem('bellSound', bellSound);
	}

	get bell(): boolean {
		return this._storage.getItem('bellStyle') as BellStyle === 'sound';
	}

	set bell(bell: boolean) {
		this._storage.setItem('bellStyle', bell ? 'sound' : 'none');
	}

	get bellStyle(): BellStyle {
		return this._storage.getItem('bellStyle') as BellStyle || 'none';
	}

	set bellStyle(bellStyle: BellStyle) {
		this._storage.setItem('bellStyle', bellStyle);
	}

	get fontFamily(): string {
		return this._storage.getItem('fontFamily') || 'Source Code Pro';
	}

	set fontFamily(fontFamily: string) {
		this._storage.setItem('fontFamily', fontFamily);
	}

	get scrollback(): number | string {
		return Number.parseInt(this._storage.getItem('scrollback')) || 10_000;
	}

	set scrollback(scrollback: number | string) {
		this._storage.setItem('scrollback', scrollback.toString());
	}

	get theme(): string {
		return this._storage.getItem('terminal_theme') || 'default';
	}

	set theme(theme: string) {
		this._storage.setItem('terminal_theme', theme);
	}

	get themes(): Record<string, ITheme> {
		return JSON.parse(this._storage.getItem('themes')) || { 'default': {
			background:    '#000000',
			foreground:    '#ffffff',
			selection:     '#ffffff',
			cursor:        '#ffffff',
			cursorAccent:  '#000000',
			black:         '#2e3436',
			brightBlack:   '#555753',
			red:           '#cc0000',
			brightRed:     '#ef2929',
			green:         '#4e9a06',
			brightGreen:   '#8ae234',
			yellow:        '#c4a000',
			brightYellow:  '#fce94f',
			blue:          '#3465a4',
			brightBlue:    '#729fcf',
			magenta:       '#75507b',
			brightMagenta: '#ad7fa8',
			cyan:          '#06989a',
			brightCyan:    '#34e2e2',
			white:         '#d3d7cf',
			brightWhite:   '#eeeeec',
		} };
	}

	set themes(themes: Record<string, ITheme>) {
		this._storage.setItem('themes', JSON.stringify(themes));
	}
}

const settings = new Settings();
Object.freeze(settings);

export default settings;