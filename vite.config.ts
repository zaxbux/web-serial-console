import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		VitePWA({
			srcDir: 'src',
			filename: 'sw.ts',
			base: '/',
			strategies: 'injectManifest',
			manifest: {
				"name": "Serial Console",
				"short_name": "Console",
				"description": "A web-based serial console.",
				"lang": "en-CA",
				"start_url": "/?source=pwa",
				"display": "standalone",
				"theme_color": "#212121",
				"icons": [
					{
						"src": "/icon.svg",
						"sizes": "any"
					},
					{
						"src": "/icon.png",
						"sizes": "144x144",
						"type": "image/png"
					}
				]
			}
		}),
	],
});
