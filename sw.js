// Aetherfall service worker — network-first, cache fallback (offline boot)
var CACHE = 'aetherfall-appkit-v35';
var CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './keyart.jpg', './portrait-blade.png', './portrait-arcanist.png', './portrait-bulwark.png', './portrait-ranger.png', './portrait-oracle.png', './wardens-lineup.png', './boss-splash.jpg', './tile-grass1.png', './tile-grass2.png', './tile-dirt1.png', './tile-dirt2.png', './tile-stone1.png', './tile-stone2.png', './tile-stone3.png', './tile-stone4.png', './prop-tree.png', './prop-rock.png', './prop-chest.png', './prop-sign.png', './prop-crystal.png', './icon-sword.png', './icon-charm.png', './icon-shield.png', './icon-bow.png', './icon-staff.png', './bld-train.png', './bld-tavern.png', './bld-garden.png', './bld-forge.png', './bld-vault.png', './foe-crawler.png', './foe-witch.png', './foe-brute.png', './foe-boss.png', './mascot-blade.png', './mount-warden.png', './walk0.png', './walk1.png', './walk2.png', './walk3.png', './walk4.png', './walk5.png', './walk6.png', './walk7.png'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(CORE); }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(res) {
      if (res && res.status === 200 && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function() {
      return caches.match(e.request, { ignoreSearch: true });
    })
  );
});
