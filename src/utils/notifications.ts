import Log from './log';

const log = new Log('notifications');

export class Notify {
	private static _instance: Notify;

	constructor() {
		if (Notify._instance) {
			return Notify._instance;
		}

		if (!Notify.checkSupport()) {
			log.warn('feature not supported');
			return;
		}

		this.requestPermission();

		return Notify._instance = this;
	}

	protected static checkSupport(): boolean {
		return 'Notification' in window;
	}

	protected static checkPermission(): boolean {
		return Notification.permission === 'granted';
	}
	
	public async requestPermission(): Promise<NotificationPermission> {
		if (!Notify.checkPermission()) {
			const permission = await Notification.requestPermission();

			if (permission === 'granted') {
				log.info('permission granted');
			} else {
				log.warn('permission not granted');
			}

			return permission;
		}

		return Notification.permission;
	}

	public make(title: string, options: NotificationOptions = {silent: true}): Notification {
		if (Notify.checkPermission()) {
			return new Notification(title, options);
		}
	}
}

const singleton = new Notify();
Object.freeze(singleton);
export default singleton;