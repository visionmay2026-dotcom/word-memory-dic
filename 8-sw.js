const C="wm-v8",PK="wm-pack-v2",PACK="4-core2.json.gz",FILES=["./","index.html","manifest.json","4-icon-192.png","5-icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{
 await (await caches.open(C)).addAll(FILES);
 try{const p=await caches.open(PK);if(!await p.match(PACK)){const r=await fetch(PACK);if(r.ok)await p.put(PACK,r)}}catch(x){}
 await self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==PK).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=="GET"||u.origin!==location.origin||u.pathname.startsWith("/api/"))return;
 if(u.pathname.endsWith("4-core2.json.gz")){
  e.respondWith(caches.open(PK).then(async c=>{const h=await c.match(PACK);if(h)return h;const n=await fetch(r);if(n.ok)c.put(PACK,n.clone());return n}));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(n=>{const c=n.clone();caches.open(C).then(x=>x.put(r,c));return n}).catch(()=>r.mode==="navigate"?caches.match("index.html"):Response.error())))});
