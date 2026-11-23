/* Storage failures never interrupt a model move or repeatedly cover its controls. */
(()=>{'use strict';
 if(window.ML_STORAGE)return;
 let native=null,temporary=null,limited=false,lastError='';const pending=new Map(),seen=new Map(),tabPrefix='math-landing:temporary-save:';
 try{native=window.localStorage}catch{}try{temporary=window.sessionStorage}catch{}
 function notify(error){const changed=!limited;limited=true;lastError=error?.name||lastError||'StorageUnavailable';if(changed)window.dispatchEvent(new CustomEvent('ml-storage-status'));}
 try{for(let i=0;i<(temporary?.length||0);i++){const k=temporary.key(i);if(k?.startsWith(tabPrefix)){pending.set(k.slice(tabPrefix.length),JSON.parse(temporary.getItem(k)).value);limited=true}}}catch{}
 function buffer(k,v){pending.set(k,v);try{temporary?.setItem(tabPrefix+k,JSON.stringify({value:v}))}catch{}}
 function unbuffer(k){pending.delete(k);try{temporary?.removeItem(tabPrefix+k)}catch{}}
 function get(k){k=String(k);if(pending.has(k))return pending.get(k);try{if(!native)throw new DOMException('Storage unavailable','SecurityError');const v=native.getItem(k);seen.set(k,v);return v}catch(e){notify(e);return seen.get(k)??null}}
 function put(k,v){k=String(k);v=String(v);seen.set(k,v);try{if(!native)throw new DOMException('Storage unavailable','SecurityError');native.setItem(k,v);unbuffer(k);return true}catch(e){buffer(k,v);notify(e);return false}}
 function remove(k){k=String(k);seen.delete(k);try{if(!native)throw new DOMException('Storage unavailable','SecurityError');native.removeItem(k);unbuffer(k)}catch(e){buffer(k,null);notify(e)}}
 function keys(){const all=new Set();try{for(let i=0;i<(native?.length||0);i++)all.add(native.key(i))}catch(e){notify(e);for(const k of seen.keys())all.add(k)}for(const[k,v]of pending)v===null?all.delete(k):all.add(k);return [...all].filter(k=>k!==null)}
 const api=Object.create(null);Object.defineProperties(api,{
  getItem:{value:get,configurable:true},setItem:{value:(k,v)=>{put(k,v)},configurable:true},removeItem:{value:remove,configurable:true},
  key:{value:i=>keys()[i]??null,configurable:true},length:{get:()=>keys().length,configurable:true},clear:{value:()=>keys().forEach(remove),configurable:true},
  [Symbol.toStringTag]:{value:'Storage',configurable:true}
 });
 const facade=new Proxy(api,{get:(t,k)=>k in t?Reflect.get(t,k):typeof k==='string'?get(k):undefined,set:(t,k,v)=>{put(k,v);return true},deleteProperty:(t,k)=>{remove(k);return true},ownKeys:()=>keys(),getOwnPropertyDescriptor:(t,k)=>Reflect.getOwnPropertyDescriptor(t,k)||(get(k)===null?undefined:{configurable:true,enumerable:true,writable:true,value:get(k)})});
 const bridge='<script>(function(){try{if(parent!==window&&parent.ML_STORAGE)Object.defineProperty(window,"localStorage",{configurable:true,get:function(){return parent.ML_STORAGE.storage}})}catch(e){}})();</'+'script>';
 window.ML_STORAGE={storage:facade,status:()=>({limited,pending:pending.size,lastError}),reportFailure:notify,
  wrapEngine:html=>html.includes('parent.ML_STORAGE.storage')?html:html.replace(/<head(?:\s[^>]*)?>/i,head=>head+bridge),
  retry(){try{if(!native)throw Error('Storage unavailable');const probe='math-landing:storage-probe:'+Date.now();native.setItem(probe,'1');native.removeItem(probe);for(const[k,v]of [...pending]){if(v===null)native.removeItem(k);else native.setItem(k,v);unbuffer(k)}limited=false;lastError='';window.dispatchEvent(new CustomEvent('ml-storage-status'));return true}catch(e){notify(e);return false}}
 };
 try{Object.defineProperty(window,'localStorage',{configurable:true,get:()=>facade})}catch{}
 function ui(){
  const style=document.createElement('style');style.textContent='#toast{pointer-events:none!important}#grownUpTools{position:relative}.ml-storage-indicator{position:absolute!important;right:2px;top:2px;display:grid!important;place-items:center;width:12px;height:12px;border-radius:50%;background:#e6bb50;color:#513800;font:700 10px/1 Andika,sans-serif;pointer-events:none}.storage-save-note{padding:10px;border:1px solid #bc9b49;border-radius:10px;background:#fff5d7;margin:0 0 10px}.storage-save-note p{margin:0 0 7px}.storage-save-note button{font-size:13px}';document.head.append(style);
  let queued=false;
  function paint(){queued=false;const menu=document.getElementById('grownUpTools'),save=document.getElementById('save'),mark=menu?.querySelector('.ml-storage-indicator');if(limited&&!mark&&menu){const badge=document.createElement('span');badge.className='ml-storage-indicator';badge.textContent='!';badge.setAttribute('aria-label','Saving limited. Open Save / help to download a backup.');menu.append(badge)}else if(!limited)mark?.remove();if(save){const title=limited?'Saving limited — download a backup from Save / help':'Save, restore and export';if(save.title!==title)save.title=title;save.dataset.storageLimited=String(limited)}
   const body=document.getElementById('modalBody'),isHelp=document.getElementById('modalTitle')?.textContent==='Save / help',old=document.getElementById('storageSaveNote');if(!limited||!isHelp){old?.remove();return}if(!old&&body){const note=document.createElement('section');note.id='storageSaveNote';note.className='storage-save-note';note.setAttribute('role','status');note.innerHTML='<p>Browser storage is full or unavailable. Your latest work is kept in this open tab. Download a project backup before closing the tab.</p><button type="button" id="retryBrowserStorage">Try saving again</button><span id="storageRetryResult" aria-live="polite"></span>';body.prepend(note);note.querySelector('button').onclick=()=>{const okay=ML_STORAGE.retry();if(!okay){const result=document.getElementById('storageRetryResult');if(result)result.textContent=' Still using temporary tab storage. You can download a backup below.'}else paint()}}
  }
  function queue(){if(!queued){queued=true;requestAnimationFrame(paint)}}new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});window.addEventListener('ml-storage-status',queue);paint();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui,{once:true});else ui();
})();
