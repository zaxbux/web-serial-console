import { App } from '@vue/runtime-core';
import SettingsStatic, { Settings } from '../settings';

declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		$settings: Settings
	}
}

export default {
	install: (app: App) => {
		app.config.globalProperties.$settings = SettingsStatic;
	}
};