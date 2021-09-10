// const cacheName = 'crowd-africa';

// const staticAssets = [
//   './',
// ];

// self.addEventListener('install', async function () {
//   const cache = await caches.open(cacheName);
//   cache.addAll(staticAssets);
//     });

// self.addEventListener('activate', event => {
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener('fetch', event => {
//   const request = event.request;
//   const url = new URL(request.url);
//   if (url.origin === location.origin) {
//     event.respondWith(cacheFirst(request));
//   } else {
//     event.respondWith(networkFirst(request));
//   }
// });

// async function cacheFirst(request) {
//   const cachedResponse = await caches.match(request);
//   return cachedResponse || fetch(request);
// }

// async function networkFirst(request) {
//   const dynamicCache = await caches.open('news-dynamic');
//   try {
//     const networkResponse = await fetch(request);
//     dynamicCache.put(request, networkResponse.clone());
//     return networkResponse;
//   } catch (err) {
//     const cachedResponse = await dynamicCache.match(request);
//     return cachedResponse || await caches.match('./fallback.json');
//   }
// }


// Custom Code

const cacheName = 'crowd-africa';
const cachesAssets = [
    'sells/pos/get-product-suggestion',
    '/img/default.png',
    './js/pos.js',
    'products/create',
    '/products/product_form_part',
    'products/get_variation_template',
    'products/save_quick_product'
    
]

// Call install Event
self.addEventListener('install',e=>{
    console.log('Service Worker: Installed')
       e.waitUntil(
        caches
        .open(cacheName)
        .then(cache =>{
            console.log('Service Worker: Caching Files')
            cache.addAll(cachesAssets)
        })
        .then(()=> self.skipWaiting() )
    )
})



// Call Activate Event
self.addEventListener('activate',(e)=>{
    console.log('Service Worker: Activated')
    // Remove unWanted catches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache=>{
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing Old Caches')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

// Call Fetch Event
self.addEventListener('fetch',e=>{
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
         .then(res=>{
             //Make copy/clone of response
             const resClone = res.clone();
             //Open Cache
             caches
              .open(cacheName)
                .then(cache =>{
                    // Add response to cache
                    cache.put(e.request, resClone)
                })
                return res

         }).catch(err => caches.match(e.request))
          .then(res=>res)
    )
})





