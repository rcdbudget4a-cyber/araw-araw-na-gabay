
const CACHE="aag-v1";
const CORE=["./","./index.html","./style.css","./app.js","./manifest.json","./data/content.json","./icons/icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(caches.match(e.request).then(cached=>{
    const net=fetch(e.request).then(r=>{
      if(r.ok && new URL(e.request.url).origin===location.origin){caches.open(CACHE).then(c=>c.put(e.request,r.clone()));}
      return r;
    }).catch(()=>cached);
    return cached || net;
  }));
});
