/* Per-answer marks reuse each activity's checker and keep evidence for unchanged answers. */
(()=>{'use strict';
 const css=String.raw`
 #mlPartMarks{position:fixed;inset:0;z-index:70;pointer-events:none;overflow:hidden}
 #mlPartMarks .ml-part-tick{position:absolute;display:grid;place-items:center;width:var(--tick-size);height:var(--tick-size);font:900 var(--tick-size)/1 Andika,sans-serif!important;color:#12733b!important;opacity:.5!important;pointer-events:none;background:transparent!important;text-shadow:none;filter:none;transform-origin:center;animation:ml-check-arrive .7s cubic-bezier(.2,.7,.3,1) 1 both}
 @keyframes ml-check-arrive{from{transform:rotate(-360deg) scale(.45)}to{transform:rotate(0deg) scale(1)}}
 @media(prefers-reduced-motion:reduce){#mlPartMarks .ml-part-tick{animation:none}}
 [data-ml-mark-owner]{position:relative!important}
 [data-ml-mark-owner]>.part-mark,[data-ml-mark-owner] .part-mark{display:none!important}
 [data-ml-mark-owner] .mathology-part-correct,[data-ml-native-part-tick]{display:none!important}
 [data-ml-mark-owner][data-homework-part]::after,[data-ml-mark-owner][data-ml-result]::after{content:none!important}
 body.ml-part-marks .part-mark{opacity:.5!important;color:#12733b!important;background:transparent!important;transform:scale(1.6);transform-origin:center;pointer-events:none}
 @media print{#mlPartMarks{display:none!important}[data-ml-print-check]{position:relative!important}[data-ml-print-check]::after{content:"✓"!important;position:absolute;right:2px;top:50%;transform:translateY(-50%);color:#12733b!important;font:900 30px/1 Andika,sans-serif!important;opacity:.5!important;pointer-events:none}}
 `;
 function install(){
  if(window.ML_PER_PART_MARKS)return;const cfg=window.ML_CONFIG;if(!cfg?.id||['november-addition','november-balance-lab'].includes(cfg.engine))return;
  const storageKey='math-landing:v2:part-marks:'+cfg.student+':'+cfg.id;
  let ledger={checked:false,items:{}},baseGet,baseCheck,engine,queued=false,initial=true,checking=false,lastPublished='',printing=false;
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved?.items)ledger=saved;}catch{}
  const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
  const fingerprint=p=>stable([p.actual,p.expected,p.correct===true]);
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(ledger))}catch{}};
  const array=v=>Array.isArray(v)?v:[];
  function parts(snapshot){
   const a=snapshot?.assessment||{},items=[],seen=new Set();
   function add(m,i){if(!m)return;const id=String(m.key??m.field??m.id??('part:'+i));if(seen.has(id))return;seen.add(id);const actual=m.actual??m.answer??m.placed,entered=m.entered!==undefined?m.entered===true:actual!==undefined&&actual!==null&&actual!=='';
    items.push({...m,actual,id,key:id,field:String(m.field??id),label:String(m.label||m.field||id),entered,manual:!!m.manual,counted:m.counted!==false&&!m.optional&&!m.manual,correct:entered&&m.correct===true});
   }
   const native=array(a.answerChecks).length?array(a.answerChecks):array(a.partChecks).length?array(a.partChecks):array(a.answers);
   native.forEach(add);const prior=array(a.partAssessment?.items);prior.forEach(add);if(!prior.length)array(a.marks).forEach(add);
   if(!items.length&&!a.manualReview){const r=snapshot?.response||{},actual={...r};for(const key of ['done','finished','checked','history','updated'])delete actual[key];const entered=a.complete===true||Object.values(actual).some(v=>v!==undefined&&v!==null&&v!==''&&v!==false&&(!Array.isArray(v)||v.length));add({key:'page',label:cfg.title||'This question',actual,expected:'Complete the question correctly',entered,correct:a.correct===true},0);}
   return items;
  }
  function remember(snapshot){const all=parts(snapshot);ledger={checked:true,items:{}};for(const p of all)if(p.counted&&p.entered)ledger.items[p.id]={fingerprint:fingerprint(p),correct:p.correct};save();}
  function decorate(snapshot){
   if(!snapshot?.assessment)return snapshot;const raw=snapshot.assessment,all=parts(snapshot);
   if(initial){initial=false;if(!ledger.checked&&raw.checked===true)remember(snapshot);}
   const items=all.map(p=>{const proof=ledger.items[p.id],checked=!!(ledger.checked&&p.entered&&proof?.fingerprint===fingerprint(p));return{...p,checked,correct:checked&&p.correct&&proof.correct===true};});
   const counted=items.filter(p=>p.counted),score=counted.filter(p=>p.correct).length,total=counted.length;
   const summary={version:2,checked:ledger.checked,correct:score,score,total,items};
   const message=ledger.checked&&total?score+' of '+total+' parts correct. '+(score===total?(raw.requiresTeacherReview?'Your teacher will review the explanation.':'Every part is correct!'):'Keep the checks and try the remaining parts.') :raw.message;
   return{...snapshot,assessment:{...raw,score:ledger.checked?score:raw.score??0,total,partAssessment:summary,message}};
  }
  const query=(attr,value)=>[...document.querySelectorAll('['+attr+'="'+CSS.escape(String(value))+'"]')];
  function visible(el){if(!el?.isConnected||!el.getClientRects().length)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth&&getComputedStyle(el).visibility!=='hidden';}
  const first=els=>els.find(visible)||null;
  function controls(name){
   const pads=query('data-unit-answer-pad',name);if(first(pads))return first(pads);
   const field=query('data-field',name).concat(query('data-answer',name),query('data-select',name),query('data-closed',name));
   const selected=field.filter(e=>e.matches('button')&&(e.getAttribute('aria-pressed')==='true'||e.matches('.chosen,.selected,.active')));
   if(first(selected))return first(selected);
   const inputs=query('data-field-input',name).concat(field.filter(e=>e.matches('input,select,textarea')));
   const input=first(inputs);if(input){const row=input.closest('label');return first(row?[row.querySelector('.ml-answer-field-heading'),row.querySelector('.mc-value'),row].filter(Boolean):[input])||input;}
   const task=cfg.patterningWorksheet?.tasks.find(t=>t.id===cfg.patterningTask),index=task?.fields?.findIndex(f=>f.id===name);if(index>=0)return first(query('data-play-part',index+(task.type==='createShape'?1:0)).concat(query('data-engaging-field',index)));
   return null;
  }
  function target(p,snapshot){
   const id=p.id,field=p.field;let el;
   if(/^v\d+$/.test(id)){const i=id.slice(1);return first(query('data-slot',i).concat(query('data-cell-input',i).map(e=>e.closest('.term,label')||e)));}
   if(/^v-grid-\d+$/.test(id))return first(query('data-growth-slot',id.slice(7)));
   if(id==='v-grid-count')return first([...document.querySelectorAll('.growth-count')]);
   if(id==='v-grid-shape')return first([...document.querySelectorAll('.growth-title,.build-title')]);
   if(id.startsWith('f:'))return controls(id.slice(2));
   if(id.startsWith('mathology:')){const heading=document.querySelector('#mathologyStrategyDialog[open] .mathology-strategy-body h3');if(heading?.textContent.trim()===p.label)return first([...document.querySelectorAll('[data-strategy-answer]')]);return document.getElementById('mathologyStrategy');}
   if(id.startsWith('map:'))return first(query('data-map',id.slice(4)).map(e=>e.closest('label')||e));
   if(/^sort\d+$/.test(id))return first(query('data-sort-item',id.slice(4)));
   if(/^slot-\d+$/.test(id))return first(query('data-slot',id.slice(5)));
   if(/^dots\d+$/.test(id)){const dot=first(query('data-dot',id.slice(4)+':0'));return dot?.closest('.dot-panel,.play-figure,.card-build,.play-build,.five-column-build')?.querySelector('h2,h3')||dot?.closest('section')?.querySelector('h2,h3')||dot?.closest('.dot-board,.card-board')||dot;}
   if(id==='core')return first([...document.querySelectorAll('[data-core][aria-pressed=true],.core-tools')]);
   if(id==='types')return first([...document.querySelectorAll('.part-note,#tools>.hint,.core-tools')]);
   if(id==='code-run')return first([...document.querySelectorAll('[data-card-run]')]);
   if((el=controls(field))||(el=controls(id)))return el;
   const names={answer:['readingAnswer'], 'built-model':[], 'combined-model':[], 'jump-model':[]};
   for(const name of names[id]||[]){el=document.getElementById(name);if(visible(el))return el.closest('label')||el;const chosen=el?.nextElementSibling?.querySelector('button[aria-pressed=true],button.selected,button.active');if(visible(chosen))return chosen;}
   const direct=[...document.querySelectorAll('[data-part],[data-part-id],[data-criterion]')].filter(e=>[e.dataset.part,e.dataset.partId,e.dataset.criterion].includes(id));if(first(direct))return first(direct);
   const headings=[...document.querySelectorAll('h2,h3,h4,.field>span,.ml-answer-field-heading,.count-label')].filter(visible),label=p.label.toLowerCase().replace(/[^a-z0-9]/g,'');
   el=headings.find(e=>e.textContent.toLowerCase().replace(/[^a-z0-9]/g,'')===label);if(el)return el;
   if(id==='built-model')return first([...document.querySelectorAll('.skills-build .rv-mat h2,.rv-mat[data-drop=work] h2')]);
   if(id==='combined-model')return first([...document.querySelectorAll('.mats .mat[data-owner="'+CSS.escape(snapshot.response.receiver||'')+'"] h2')]);
   if(id==='jump-model')return first([...document.querySelectorAll('.jump-line-title,.jump-line-drop h3,.jump-block-board>section:nth-child(2)>h3')]);
   if(/^c\d+$/.test(id))return [...document.querySelectorAll('.countrows .countrow,.zone-grid .zone')][+id.slice(1)]?.querySelector('h3,strong,.count-label,.label');
   if(/^child-\d+$/.test(id))return [...document.querySelectorAll('.share-child>h3')][+id.slice(6)];
   if(id==='leftovers-model')return first([...document.querySelectorAll('.share-leftover-pad>h3')]);
   if(id==='page')return first([...document.querySelectorAll('.task-title,#title,#task>h2,header h1')]);
   // Keep a labelled check for model criteria without a dedicated answer control.
   return first(headings.filter(e=>/model|build|figure|pattern|sort|code|map|graph|work/i.test(e.textContent)));
  }
  function printAnchor(el){const task=cfg.patterningWorksheet?.tasks.find(t=>t.id===cfg.patterningTask),index=el?.dataset.playPart!==undefined?+el.dataset.playPart-(task?.type==='createShape'?1:0):el?.dataset.engagingField!==undefined?+el.dataset.engagingField:-1,field=task?.fields?.[index];if(field){const node=query('data-field',field.id)[0]||query('data-field-input',field.id)[0];const label=node?.closest('.field')?.querySelector(':scope>span');if(label)return label;}return el?.closest('.field')?.querySelector(':scope>span,.ml-answer-field-heading')||el?.closest('label')?.querySelector('.ml-answer-field-heading')||el;}
  function paint(){
   queued=false;if(!engine||printing)return;const snapshot=engine.get(),a=snapshot.assessment,summary=a.partAssessment;if(!summary)return;
   let layer=document.getElementById('mlPartMarks');const host=document.querySelector('dialog[open]')||document.body;if(!layer){layer=document.createElement('div');layer.id='mlPartMarks';layer.setAttribute('aria-label','Correct parts');host.append(layer);}else if(layer.parentElement!==host)host.append(layer);
   const wanted=new Map(),owners=new Set(),used=new Map();
   for(const p of summary.items){if(!p.counted||!p.correct)continue;const el=target(p,snapshot);if(!visible(el))continue;const r=el.getBoundingClientRect(),n=used.get(el)||0;used.set(el,n+1);owners.add(el);el.dataset.mlMarkOwner='true';const host=el.closest('.field');if(host){owners.add(host);host.dataset.mlMarkOwner='true';}for(const old of el.querySelectorAll('text'))if(old.textContent==='✓')old.dataset.mlNativePartTick='true';const paper=printAnchor(el);if(paper)paper.dataset.mlPrintCheck='true';
    const size=Math.floor(Math.min(60,Math.max(40,r.height*.7),Math.max(28,r.width*.65))),x=Math.max(0,Math.min(innerWidth-size,r.right-size-3-n*(size+2))),y=Math.max(0,Math.min(innerHeight-size,r.top+(r.height-size)/2));wanted.set(p.id,{p,size,x,y});
   }
   for(const el of document.querySelectorAll('[data-ml-mark-owner]'))if(!owners.has(el))delete el.dataset.mlMarkOwner;
   const papers=new Set([...owners].map(printAnchor));for(const el of document.querySelectorAll('[data-ml-print-check]'))if(!papers.has(el))delete el.dataset.mlPrintCheck;
   for(const tick of [...layer.children])if(!wanted.has(tick.dataset.partKey))tick.remove();
   for(const[id,v]of wanted){let tick=[...layer.children].find(e=>e.dataset.partKey===id);if(!tick){tick=document.createElement('span');tick.className='ml-part-tick';tick.dataset.partKey=id;tick.textContent='✓';tick.setAttribute('role','img');layer.append(tick);}const label='Correct: '+v.p.label;if(tick.getAttribute('aria-label')!==label)tick.setAttribute('aria-label',label);tick.style.setProperty('--tick-size',v.size+'px');tick.style.left=v.x+'px';tick.style.top=v.y+'px';}
   if(summary.checked){for(const el of [document.getElementById('status'),document.getElementById('rvStatus')].filter(Boolean))if(el.textContent!==a.message)el.textContent=a.message;}
   const publish=stable([a.signature,summary.checked,summary.correct,summary.total]);if(publish!==lastPublished){lastPublished=publish;parent.postMessage({type:'ml-state',id:cfg.id,payload:snapshot},'*');}
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
  function bind(){if(!window.ML_ENGINE||window.ML_ENGINE.perPartMarksV2)return;engine=window.ML_ENGINE;baseGet=engine.get.bind(engine);baseCheck=engine.check.bind(engine);
   engine.get=()=>decorate(baseGet());engine.check=()=>{checking=true;try{const raw=baseCheck();remember(raw);const result=decorate(raw);schedule();return result;}finally{checking=false;}};engine.perPartMarksV2=true;document.body.classList.add('ml-part-marks');schedule();
  }
  function reset(){ledger={checked:false,items:{}};try{localStorage.removeItem(storageKey)}catch{}schedule();}
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&(b.matches('#reset,#rvReset,#imReset,[data-action=reset]')||/^(?:Start (?:this question )?again|Reset question)$/i.test(b.textContent.trim())))reset();schedule();},true);
  for(const name of ['input','change','pointerup','keyup'])document.addEventListener(name,schedule,true);
  new MutationObserver(records=>{if(records.some(r=>!r.target.closest?.('#mlPartMarks'))){bind();schedule();}}).observe(document.body,{childList:true,subtree:true});
  const resizeObserver=new ResizeObserver(schedule);for(const el of [document.body,document.getElementById('tools'),document.getElementById('main')].filter(Boolean))resizeObserver.observe(el);
  addEventListener('resize',schedule);document.fonts.ready.then(schedule);addEventListener('beforeprint',()=>{paint();printing=true});addEventListener('afterprint',()=>{printing=false;schedule()});
  window.ML_PER_PART_MARKS={refresh:schedule,reset};bind();
 }
 function wrap(html){if(html.includes('data-ml-part-marks-v2'))return html;return html.replace(/<\/head>/i,'<style data-ml-part-marks-v2>'+css+'</style><script data-ml-part-marks-v2>document.addEventListener("DOMContentLoaded",()=>requestAnimationFrame('+install.toString()+'),{once:true});</'+'script></head>');}
 const old=window.ML_STORAGE?.wrapEngine;if(old)ML_STORAGE.wrapEngine=html=>wrap(old(html));
 window.ML_PART_MARKS={wrap};
})();
