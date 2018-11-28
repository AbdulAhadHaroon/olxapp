var cacheName = 'olxapp';

console.log('... Service Worker File Running ...');

importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');


 var config = {
    messagingSenderId: "837016258598"
  };
  firebase.initializeApp(config);


var filesToCache = ['./' , './firebase-messaging-sw.js' , './js/firebase.js' , './index.html' ,'./signup.html' , 
                    './offline.html' , './js/app.js' , 
                    './js/signup.js' , './js/offline.js' 
                    , './images/olx.png' , 'bootstrap.min.css' ,
                        './main.css'];

self.addEventListener('install', function(e) {
    self.skipWaiting();
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }

            }));
        })
        
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (ev) => {
    console.log('Fetch from Service Worker ', ev);
    const req = ev.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
      ev.respondWith(cacheFirst(req));
    }
    return ev.respondWith(networkFirst(req));
  });
  
  async function cacheFirst(req) {
    let cacheRes = await caches.match(req);
    return cacheRes || fetch(req);
  }
  
  async function networkFirst(req) {
    const dynamicCache = await caches.open('v1-dynamic');
    try {
      const networkResponse = await fetch(req);
      dynamicCache.put(req, networkResponse.clone());
      return networkResponse;
    } catch (err) {
      const cacheResponse = await caches.match(req);
      return cacheResponse;
    }
  }
// offline msg

self.addEventListener('message', function (evt) {
    console.log('postMessage received', evt.data);
  });

// push notification firebase service worker

  const messaging= firebase.messaging();

   self.addEventListener('push', function (event) {
    console.log('Received a push message', event);
  
    var notification = event.data.json().notification
    var title = notification.title || 'one new message.';
    var body = notification.body || 'We have received a push message.';
    var icon = './images/icon-192x192.png';
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
      })
    );
  
  });
  
  // on Notification Click do whatever you want...
  self.addEventListener('notificationclick', function (event) {
    console.log('On notification click: ', event.notification.tag);
    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
      type: 'window'
    }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/chatlist.html');
      }
    }));
  
  });


  messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = payload.title || 'one new message';
    var notificationOptions = {
      body: payload.body || 'hello seller',
      icon: './images/icon-192x192.png'
    };
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });