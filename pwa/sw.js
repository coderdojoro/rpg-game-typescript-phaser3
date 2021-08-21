/**
 * You should only modify this, if you know what you are doing.
 * This phaser template is using workbox (https://developers.google.com/web/tools/workbox/)
 * to precache all assets.
 * It uses the InjectManifest function from 'workbox-webpack-plugin' inside
 * webpack/webpack.common.js
 */
import { precacheAndRoute } from 'workbox-precaching';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (evt) => {
    console.log('PWA install...');
    evt.waitUntil(
        caches.open('static').then((cache) => {
            // prettier-ignore
            return cache.addAll([
                '/favicon.ico',
                '/index.html',
                '/main.bundle.js',
                '/manifest.webmanifest',
                '/sw.js',
                'vendors.bundle.js',
                '/icons/icons-192.png',
                '/icons/icons-512.png',
                '/assets/buttons/install.png',
                '/assets/buttons/install-focus.png',
                '/assets/buttons/start.png',
                '/assets/buttons/start-focus.png',
                '/assets/img/coder-1.png',
                '/assets/img/coder-2.png',
                '/assets/img/fps.png',
                '/assets/img/phaser-dude.png',
                '/assets/img/phaser-logo.png'
            ]);
        })
    );
});

self.addEventListener('activate', (evt) => {
    console.log('activate...');
});

self.addEventListener('fetch', (evt) => {
    console.log('fetch...');
    evt.respondWidth(
        caches.match(evt.request).then((res) => {
            if (res) {
                return res;
            }
            return fetch(evt.request);
        })
    );
});
