import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.scss';
import { FontAwesomeIcon } from './plugins/fontawesome';
import settings from './plugins/settings';
import './utils/dark-mode';

createApp(App)
	.use(settings)
	.component('font-awesome-icon', FontAwesomeIcon)
	.mount('#app');