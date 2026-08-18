const CACHE="aag-final-1-2";
const CORE=["./","./index.html","./style.css?v=1.2","./app.js?v=1.2","./manifest.json","./data/content.json?v=1.2","./icons/icon.svg","./icons/icon-192.png","./icons/icon-512.png",...Array.from({length:30},(_,i)=>`./assets/backgrounds/bg-${String(i+1).padStart(2,"0")}.svg`)];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET") return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin) return;
 const isShell=u.pathname.endsWith("/")||u.pathname.endsWith("index.html")||u.pathname.endsWith("app.js")||u.pathname.endsWith("style.css")||u.pathname.endsWith("content.json")||u.pathname.endsWith("manifest.json")||u.pathname.endsWith("sw.js");
 if(isShell){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request)));
 }else{
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match("./assets/backgrounds/bg-01.svg"))));
 }
});
