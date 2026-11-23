/* Save teacher requests from the two November homework weeks into the linked project notes. */
window.ML_HOMEWORK_AUDIT_MARKDOWN=(()=>{
 'use strict';
 const fileName='Math-Landing-Patterning-Assessments.md';
 const weeks=new Set(['2026-11-16','2026-11-23']);
 const queuePrefix='math-landing:november-audit-markdown:pending:';
 const sectionStart='<!-- ML-HOMEWORK-AUDIT-START -->';
 const sectionEnd='<!-- ML-HOMEWORK-AUDIT-END -->';
 const recordPattern=/<!-- ML-AUDIT-ENTRY ([^ ]+) -->\r?\n([\s\S]*?)\r?\n<!-- \/ML-AUDIT-ENTRY -->/g;
 let database, linkedFile, currentWrite, linking=false;
 let lastStatus='Link the project Markdown from Teacher tools to save requests there.';
 const escape=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const inline=value=>escape(value).replace(/[\r\n]+/g,' ');
 function status(message){
  lastStatus=message;
  const indicator=document.querySelector('[data-audit-markdown-status]');
  if(indicator)indicator.textContent=message;
 }
 function openDatabase(){
  return database??=new Promise((resolve,reject)=>{
   const request=indexedDB.open('math-landing-homework-audit-markdown',1);
   request.onupgradeneeded=()=>request.result.createObjectStore('settings');
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
 }
 async function getFileHandle(){
  if(linkedFile)return linkedFile;
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
   const request=db.transaction('settings').objectStore('settings').get('file');
   request.onsuccess=()=>resolve(linkedFile=request.result);
   request.onerror=()=>reject(request.error);
  });
 }
 async function rememberFile(handle){
  linkedFile=handle;
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
   const transaction=db.transaction('settings','readwrite');
   transaction.oncomplete=resolve;
   transaction.onabort=()=>reject(transaction.error);
   transaction.objectStore('settings').put(handle,'file');
  });
 }
 function readPending(){
  return Object.keys(localStorage).filter(key=>key.startsWith(queuePrefix)).flatMap(key=>{
   const content=localStorage.getItem(key);
   return content===null?[]:[[key,content]];
  });
 }
 function mergeMarkdown(original,batch){
  const newline=original.includes('\r\n')?'\r\n':'\n';
  const start=original.indexOf(sectionStart),end=original.indexOf(sectionEnd);
  if((start<0)!==(end<0)||start>=0&&end<start)throw Error('The audit section markers in the Markdown are incomplete.');
  const previous=start<0?'':original.slice(start,end);
  const entries=new Map(Array.from(previous.matchAll(recordPattern),match=>[match[1],match[2]]));
  for(const [key,content] of batch)entries.set(key.slice(queuePrefix.length),content);
  const section=[sectionStart,'## Homework audit requests for November 16–27, 2026',...Array.from(entries,([id,content])=>
   '\n<!-- ML-AUDIT-ENTRY '+id+' -->\n'+content+'\n<!-- /ML-AUDIT-ENTRY -->'),sectionEnd].join('\n').replace(/\r?\n/g,newline);
  if(start<0)return original+(original.endsWith(newline)?newline:newline+newline)+section+newline;
  return original.slice(0,start)+section+original.slice(end+sectionEnd.length);
 }
 async function writePending(handle){
  for(let batch=readPending();batch.length;batch=readPending()){
   const original=await (await handle.getFile()).text();
   const next=mergeMarkdown(original,batch);
   if(next!==original){
    const stream=await handle.createWritable();
    try{await stream.write(next);await stream.close();}
    catch(error){await stream.abort().catch(()=>{});throw error;}
   }
   for(const [key,content] of batch)if(localStorage.getItem(key)===content)localStorage.removeItem(key);
  }
 }
 function sync(){
  if(linking||currentWrite)return currentWrite;
  currentWrite=(async()=>{
   const handle=await getFileHandle();
   if(!handle||await handle.queryPermission({mode:'readwrite'})!=='granted'){
    status('Requests are saved in this browser. Link the project Markdown from Teacher tools to write them to the file.');
    return false;
   }
   const write=()=>writePending(handle);
   if(navigator.locks)await navigator.locks.request('math-landing-homework-audit-markdown',write);
   else await write();
   status('Audit requests saved to the project Markdown.');
   return true;
  })().catch(error=>{
   status('Markdown could not be updated. Requests are saved in this browser. '+error.message);
   return false;
  }).finally(()=>{currentWrite=null;});
  return currentWrite;
 }
 function enqueue(id,content){
  const key=queuePrefix+encodeURIComponent(id);
  try{localStorage.setItem(key,content);}
  catch{status('Could not queue the request for Markdown. It is still available in the teacher audit.');return;}
  if(!linking)void sync();
 }
 const heading=(page,week)=>[
  '### '+inline([page.pageCode,page.title].filter(Boolean).join(' · ')),
  '',
  '- Page: '+inline(page.pageId||page.id)+' · Grade '+page.grade+' · Homework week '+week
 ];
 function recordNote(note,cleared=false){
  const week=note.route?.week;
  if(!weeks.has(week)||note.route?.kind!=='homework')return;
  if(note.type==='question'&&!/^hw-2026-11-(1[6-9]|20|2[3-7])-g[123]-/.test(note.pageId))return;
  if(note.type==='entry')return;
  const lines=heading(note,week);
  if(cleared)lines.push('- Request cleared in the teacher audit.');
  else{
   for(const reason of note.reasons||[])lines.push('- '+inline(reason));
   if(note.applyToSimilar)lines.push('- Apply to matching pages.');
   if(note.addToHomework)lines.push('- Choose for homework.');
   if(note.addToClasswork)lines.push('- Choose for classwork.');
   if(note.comment?.trim())lines.push('',...escape(note.comment.trim()).split(/\r?\n/).map(line=>'> '+line));
   if(lines.length===3)lines.push('- Flagged for review.');
  }
  enqueue('note:'+note.id,lines.join('\n'));
 }
 function recordDeletion(page,deleted){
  if(!page||!weeks.has(page.homeworkWeek))return;
  const lines=heading(page,page.homeworkWeek);
  lines.push(deleted?'- Delete this page from homework.':'- Page restored to homework.');
  enqueue('deletion:'+page.id,lines.join('\n'));
 }
 async function link(prepare){
  if(typeof window.showOpenFilePicker!=='function')return 'Open the homework in Chrome or Edge to link the Markdown file.';
  linking=true;
  try{
   const [handle]=linkedFile?[linkedFile]:await window.showOpenFilePicker({id:'math-landing-audit-markdown',multiple:false,
    types:[{description:'Markdown',accept:{'text/markdown':['.md']}}]});
   if(handle.name!==fileName)return 'Choose '+fileName+'.';
   linkedFile=handle;
   if(await handle.requestPermission({mode:'readwrite'})!=='granted')return 'Allow editing to save audit requests to the Markdown.';
   await rememberFile(handle);
   prepare();
  }catch(error){
   return error.name==='AbortError'?'Markdown link unchanged.':'Could not link the Markdown. '+error.message;
  }finally{linking=false;}
  await currentWrite;
  await sync();
  return lastStatus;
 }
 window.addEventListener('storage',event=>{
  if(event.key?.startsWith(queuePrefix)&&event.newValue!==null)void sync();
 });
 if(readPending().length)void sync();
 function recordAssessment(note){
  const lines=['### '+inline(note.pageCode+' · '+note.title),'',
   '- Page: '+inline(note.pageCode)+' · Grade '+note.grade+' · Patterning assessment · Question '+note.question,
   '- Source: '+inline(note.sourceCode)+' · '+inline(note.sourceDate),
   '- Saved: '+inline(note.savedAt),'',...escape(note.comment||'Request cleared in the teacher audit.').split(/\r?\n/).map(line=>'> '+line)];
  enqueue('assessment:'+note.pageCode,lines.join('\n'));
 }
 return {recordNote,recordDeletion,recordAssessment,link,status:()=>lastStatus};
})();
