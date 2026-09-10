// Scope cache cleanup to this application's legacy cache; serve fresh files.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>/^fuji-recipe-v\d+$/.test(key)).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
