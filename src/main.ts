import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.scss';
import { FontAwesomeIcon } from './plugins/fontawesome';
import settings from './plugins/settings';
import './utils/dark-mode';
import Notify from './utils/notifications';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
	Notify.make('Ready to install!');
  },
});

createApp(App)
	.use(settings)
	.component('font-awesome-icon', FontAwesomeIcon)
	.mount('#app');