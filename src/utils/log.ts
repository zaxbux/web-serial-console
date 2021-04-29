class Log {
	private readonly _context: String;

	constructor(context: String) {
		this._context = context;
	}

	protected formatMessage(message: String): String {
		return `[${this._context}] ${message}`;
	}

	debug(message: String, ...data: any[]): void {
		if (data.length > 0) {
			console.groupCollapsed(this.formatMessage(message));
			console.debug(...data);
			console.groupEnd();
			return;
		}
	
		console.debug(this.formatMessage(message));
	}

	info(message: String, ...data: any[]): void {
		if (data.length > 0) {
			console.groupCollapsed(this.formatMessage(message));
			console.info(...data);
			console.groupEnd();
			return;
		}
	
		console.info(this.formatMessage(message));
	}
	
	warn(message: String, ...data: any[]): void {
		if (data.length > 0) {
			console.groupCollapsed(this.formatMessage(message));
			console.warn(...data);
			console.groupEnd();
			return;
		}
	
		console.warn(this.formatMessage(message));
	}
	
	error(message: String, ...data: any[]): void {
		if (data.length > 0) {
			console.groupCollapsed(this.formatMessage(message));
			console.error(...data);
			console.groupEnd();
			return;
		}
	
		console.error(this.formatMessage(message));
	}
	
	log(message: String, ...data: any[]): void {
		if (data.length > 0) {
			console.groupCollapsed(this.formatMessage(message));
			console.log(...data);
			console.groupEnd();
			return;
		}
	
		console.log(this.formatMessage(message));
	}
}

export default Log;