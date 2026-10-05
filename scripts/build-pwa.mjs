import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export function serviceWorkerSource(html){
const assets=[...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map(m=>m[1]);
const version=createHash('sha256').update(html).digest('hex').slice(0,16);
const source=`const CACHE='scolarecouv-shell-${version}';
const FILES=${JSON.stringify(['/',...assets,'/manifest.webmanifest','/icon.svg'])};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('scolarecouv-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname==='/health'||url.pathname==='/sw.js')return;
if(req.mode==='navigate'){event.respondWith(caches.open(CACHE).then(cache=>cache.match('/').then(hit=>hit||fetch(req))));return;}
if(FILES.includes(url.pathname)){event.respondWith(caches.open(CACHE).then(cache=>cache.match(req).then(hit=>hit||fetch(req))));}
});`;
return source;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){await writeFile('dist/sw.js',serviceWorkerSource(await readFile('dist/index.html','utf8')));}
