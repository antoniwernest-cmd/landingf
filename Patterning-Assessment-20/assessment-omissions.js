/* Teacher decisions stay separate from student answers and travel with saved work. */
window.ML_OMISSIONS=(()=>{
 const prefix=storeKey+':teacher-omit:',cache=new Map();
 const signature=q=>JSON.stringify([q.code,q.source?.code,q.title,q.model,q.fields.map(f=>[f.type,f.answer])]);
 const key=q=>prefix+q.grade+':'+q.code;
 const matches=(record,q)=>record&&typeof record.omitted==='boolean'&&record.signature===signature(q);
 function path(q){const k=key(q);if(!cache.has(k)){try{cache.set(k,JSON.parse(localStorage.getItem(k)||'null'));}catch{cache.set(k,null);}}const record=cache.get(k);return matches(record,q)?record:null;}
 function decision(q,run){const own=run?.omissions?.[q.code];if(matches(own,q)&&own.scope==='student')return own;return path(q)||(matches(own,q)?own:null);}
 function record(q,omitted,scope,previous){const at=new Date().toISOString();return {omitted,scope,by:'teacher',at,code:q.code,title:q.title,signature:signature(q),message:omitted?'Dropped by teacher — not part of the mark':'Restored by teacher — included in the mark',history:[...(previous?.history??[]),{omitted,by:'teacher',at}]};}
 function setPath(q,omitted){const value=record(q,omitted,'path',path(q));try{localStorage.setItem(key(q),JSON.stringify(value));}catch{throw Error('The teacher omission could not be saved on this device.');}cache.set(key(q),value);return value;}
 function setStudent(run,q,omitted){return {...run,omissions:{...run.omissions,[q.code]:record(q,omitted,'student',decision(q,run))}};}
 function snapshot(run){const omissions={};for(const q of run.questions){const value=decision(q,run);if(value)omissions[q.code]=value;}return {...run,omissions};}
 function atSubmission(q,run){const own=(run.omissionsAtLock??run.omissions)?.[q.code];return matches(own,q)&&own.omitted;}
 addEventListener('storage',event=>{if(event.key?.startsWith(prefix)){cache.delete(event.key);window.dispatchEvent(new CustomEvent('ml-omissions-changed'));}});
 return {signature,matches,path,decision,setPath,setStudent,snapshot,atSubmission};
})();
