/* Reuses Math Landing's assessment storage and optimistic revision checks. */
const storeKey='math-landing:patterning-20:2026-11-18';
const teacherDigest='7c252ab334fb8fd88e8242c4972c21db9c7ce0b47c9acc4ebfe40c14614cb734';
function assessmentStorage(){
 let cache={runs:{}},mode='memory',connection,webStore,evidenceDatabase;
 const temporaryEvidence=new Map();
 function merge(incoming){
  if(!incoming?.runs||typeof incoming.runs!=='object'||Array.isArray(incoming.runs))return cache;
  const runs={...cache.runs};
  for(const [key,run] of Object.entries(incoming.runs)){
   if(Array.isArray(run?.locked)&&(run.revision??0)>=(runs[key]?.revision??0))runs[key]=run;
  }
  return {runs};
 }
 function browserData(name){try{return JSON.parse(window[name].getItem(storeKey));}catch{return null;}}
 function browserFallback(names=['localStorage','sessionStorage']){
  for(const name of names){
   try{const store=window[name];store.setItem(storeKey+':probe','1');store.removeItem(storeKey+':probe');webStore=store;mode=name;return;}catch{}
  }
  mode='memory';webStore=null;
 }
 function openDatabase(name=storeKey,storeName='assessment'){return new Promise((resolve,reject)=>{
  const request=window.indexedDB.open(name,1);
  let abandoned=false;
  const timeout=setTimeout(()=>fail(Error('Assessment database did not open in time')),2500);
  const fail=error=>{abandoned=true;clearTimeout(timeout);reject(error);};
  request.onupgradeneeded=()=>request.result.createObjectStore(storeName);
  request.onsuccess=()=>{clearTimeout(timeout);if(abandoned)request.result.close();else{request.result.onversionchange=()=>request.result.close();resolve(request.result);}};
  request.onerror=()=>fail(request.error||Error('Assessment database unavailable'));
  request.onblocked=()=>fail(Error('Assessment database blocked'));
 });}
 function databaseAction(change){return new Promise((resolve,reject)=>{
  const tx=connection.transaction('assessment',change?'readwrite':'readonly'),store=tx.objectStore('assessment'),request=store.get('current');
  let result;
  request.onsuccess=()=>{
   try{
    const latest=merge(request.result),next=change?change(latest):latest;
    result=next;if(change&&next)store.put(next,'current');
   }catch{tx.abort();}
  };
  tx.oncomplete=()=>resolve(result);
  tx.onabort=tx.onerror=()=>reject(tx.error||Error('Assessment transaction unavailable'));
 });}
 const ready=(async()=>{
  cache=merge(browserData('localStorage'));
  cache=merge(browserData('sessionStorage'));
  try{connection=await openDatabase();cache=await databaseAction();mode='database';}catch{browserFallback();}
 })();
 async function load(){
  await ready;
  if(mode==='database'){try{cache=await databaseAction();return cache;}catch{browserFallback();}}
  if(webStore)cache=merge(browserData(mode));
  return cache;
 }
 async function save(key,revision,run){
  await ready;
  const change=latest=>{
   if(latest.runs[key]?.revision!==revision)return null;
   return {runs:{...latest.runs,[key]:{...run,revision:(revision??0)+1}}};
  };
  if(mode==='database'){
   try{const next=await databaseAction(change);if(next)cache=next;return next;}catch{browserFallback();}
  }
  while(webStore){
   const next=change(merge(browserData(mode)));if(!next)return null;
   try{webStore.setItem(storeKey,JSON.stringify(next));cache=next;return cache;}
   catch{browserFallback(mode==='localStorage'?['sessionStorage']:[]);}
  }
  const next=change(cache);if(next)cache=next;return next;
 }
 async function evidence(key,png){
  if(!key)return null;
  await ready;
  if(!temporaryEvidence.has(key)){
   try{
    evidenceDatabase??=openDatabase(storeKey+':pictures','evidence');
    const pictures=await evidenceDatabase;
    return await new Promise((resolve,reject)=>{
    const tx=pictures.transaction('evidence',png?'readwrite':'readonly'),store=tx.objectStore('evidence');
    const req=png?store.put(png,key):store.get(key);
    tx.oncomplete=()=>resolve(png||req.result||temporaryEvidence.get(key)||null);
    tx.onabort=tx.onerror=()=>reject(tx.error);
    });
   }catch{}
  }
  if(png)temporaryEvidence.set(key,png);
  return temporaryEvidence.get(key)||null;
 }
 return {load,save,evidence,temporary:()=>mode==='memory'||mode==='sessionStorage'};
}
