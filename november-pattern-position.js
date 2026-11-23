/* Find the end of the target's core, then count back. */
(() => {
 'use strict';
 const styles = `
 .activity:has(.pattern-position-work){gap:clamp(4px,1.25vh,12px);padding-block:clamp(6px,1.6vh,18px)}
 .pattern-position-work{min-height:0;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(5px,1.2vw,17px)}
 .pattern-position-model,.pattern-position-answer{display:grid;min-width:0;min-height:0;gap:clamp(3px,1vh,9px);background:#fffefa;border:1px solid #b8d4ca;border-radius:15px;padding:clamp(5px,1.2vw,17px)}
 .pattern-position-model{grid-template-rows:auto minmax(0,1fr) auto minmax(0,1fr) auto;background:#e8f5ef}
 .pattern-position-answer{grid-template-rows:auto minmax(0,1fr) minmax(38px,.62fr) auto;background:#f0ebfc}
 .pattern-position-work h2{margin:0;color:#27534f;font-size:clamp(14px,2vw,28px);line-height:1.1}
 .pattern-shape{width:100%;height:100%;min-width:0;min-height:0;display:block;pointer-events:none}
 .pattern-core,.pattern-count-strip{display:grid;grid-template-columns:repeat(var(--core-length),minmax(0,1fr));gap:clamp(2px,.55vw,7px);min-height:0}
 .pattern-core>span{display:grid;min-width:0;min-height:0;grid-template-rows:minmax(0,1fr);padding:2px;background:#fffefa;border:1px solid #a7c9bb;border-radius:10px}
 .pattern-core>span:last-child{background:#fff1be;border-color:#bc9140}
 .pattern-count-strip>span{display:grid;grid-template-rows:minmax(0,1fr) auto;min-height:0;line-height:1.05;padding:2px;text-align:center;color:#254f4d;background:#fdfefa;border:1px solid #b6d4cb;border-radius:6px;font-size:clamp(11px,2.5vh,20px);font-weight:bold}
 .pattern-count-strip>span[data-unvisited]{border-style:dashed;background:transparent}
 .pattern-count-strip>span[data-diamond]{background:#fff1be;border-color:#bc9140}
 .pattern-count-strip>span[data-target-position]{color:#51378a;border-color:#8057bd;background:#eee3ff}
 .pattern-count-strip>span[data-current]{outline:2px solid #8057bd;outline-offset:-2px}
 .pattern-count-strip .pattern-missing{font-size:clamp(16px,4.2vh,28px);align-self:center}
 .pattern-core-heading,.pattern-count-tools,.pattern-status-row,.pattern-anchor{display:flex;gap:5px;justify-content:space-between;align-items:center;line-height:1.12;font-size:clamp(12px,1.3vw,18px);font-weight:bold}
 .pattern-core-heading span{color:#4f6150;text-align:right}
 .pattern-count-tools button,.pattern-reset,.pattern-anchor select{min-height:40px;padding:2px 7px;border:1px solid #759a8d;border-radius:8px;background:#fffefa;font:inherit;color:#174840;white-space:nowrap}
 .pattern-count-tools button:disabled{opacity:.62;cursor:default}
 .pattern-anchor{position:relative}
 .pattern-anchor select{min-width:64px;max-width:100%;text-align:center}
 .pattern-anchor[data-mark="correct"] select{border-color:#167047}
 .pattern-anchor[data-mark="retry"] select{border-color:#a13930}
 .pattern-position-drop{display:grid;place-items:center;justify-self:center;position:relative;height:100%;width:min(56%,210px);min-height:0;border:2px dashed #8064b6;border-radius:13px;background:#fffefa;color:#553384;font-size:clamp(24px,7vh,54px);font-weight:bold}
 .pattern-position-drop[data-filled],.pattern-position-drop[data-over]{background:#e7d9fe;border-style:solid}
 .pattern-position-drop[data-over]{outline:3px solid #7552a8}
 .pattern-position-bank{display:grid;grid-template-columns:repeat(var(--choices),minmax(0,1fr));gap:clamp(2px,.55vw,8px);min-height:0}
 .pattern-position-bank button{background:#fffefa;border:1px solid #8c78b3;border-radius:9px;padding:2px 1px;min-width:0;min-height:0;touch-action:none;cursor:grab}
 .pattern-position-ghost{position:fixed;z-index:20;pointer-events:none;transform:translate(-50%,-50%);width:50px;height:50px;border:1px solid #8064b6;border-radius:8px;background:#fffefa}
 @media(max-width:600px) and (orientation:portrait){
  .pattern-position-work{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1.5fr) minmax(0,1fr)}
  .pattern-position-answer{grid-template-columns:minmax(68px,.75fr) minmax(0,2fr);grid-template-rows:auto minmax(46px,1fr) auto}
  .pattern-position-answer h2,.pattern-status-row{grid-column:1/-1}
  .pattern-position-drop{width:100%;height:100%}
 }
 @media(max-height:440px){.pattern-count-tools button,.pattern-reset,.pattern-anchor select{min-height:32px}.pattern-position-model,.pattern-position-answer{padding:4px}}
 @media print{.activity:has(.pattern-position-work){height:166mm;overflow:hidden;break-inside:avoid}.pattern-count-tools button,.pattern-reset{visibility:hidden}}
 `;
 function boot() {
  const cfg=window.ML_CONFIG, task=cfg.task, core=task.core, target=task.position;
  const root=document.querySelector('.activity');
  const size=core.length, diamond=Math.ceil(target/size)*size, distance=diamond-target;
  const expected=core[size-1-distance];
  const anchorOptions=[...new Set([diamond-size,target,diamond-1,diamond,diamond+size])].filter(n=>n>0).sort((a,b)=>a-b);
  const key='math-landing:november-addition:'+cfg.student+':'+cfg.id+':'+cfg.revision;
  const drawings={
   Circle:['#53c1b5','#17675e','<circle cx="36" cy="34" r="24"/>','M17 29q5-15 20-15'],
   Square:['#7dadef','#325f93','<rect x="12" y="11" width="48" height="47" rx="7"/>','M17 33V20q0-4 4-4h23'],
   Triangle:['#ffaf55','#8c551a','<path d="M36 8 65 57H7Z" stroke-linejoin="round"/>','M15 51 36 15'],
   Star:['#f3cb54','#866314','<path d="m36 6 9 17 20 4-14 14 2 21-17-10-18 10 3-21L7 27l20-4Z" stroke-linejoin="round"/>','m13 29 17-4 6-12'],
   Hexagon:['#8ccd76','#38652e','<path d="M21 10h30l15 24-15 24H21L6 34Z" stroke-linejoin="round"/>','M12 34 24 15h20'],
   Diamond:['#c492ec','#73409c','<path d="M36 6 63 34 36 62 9 34Z" stroke-linejoin="round"/>','M16 34 36 13l15 15']
  };
  let saved={};
  if (!cfg.cataloguePreview) {
   try { saved=JSON.parse(localStorage.getItem(key))||{}; } catch {}
  }
  let answer=task.choices.includes(saved.answer)?saved.answer:'';
  let anchor=anchorOptions.includes(saved.anchor)?saved.anchor:0;
  let steps=anchor===diamond&&Number.isInteger(saved.steps)?Math.max(0,Math.min(saved.steps,distance)):0;
  let checked=saved.checked||'',done=saved.done===true,drag=null,skipClick=false;
  const signature=()=>JSON.stringify([anchor,steps,answer]);
  const signal=type=>{if(!cfg.cataloguePreview)parent.postMessage({type,id:cfg.id},'*');};
  function persist() {
   if (!cfg.cataloguePreview) {
    try { localStorage.setItem(key,JSON.stringify({anchor,steps,answer,checked,done})); } catch {}
   }
  }
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function shape(name) {
   const [fill,stroke,body,shine]=drawings[name];
   return '<svg class="pattern-shape" viewBox="0 0 72 72" aria-hidden="true"><ellipse cx="36" cy="64" rx="23" ry="4" fill="#243c56" opacity=".16"/>'+
    '<g fill="'+fill+'" stroke="'+stroke+'" stroke-width="3">'+body+'</g><path d="'+shine+'" fill="none" stroke="#fff" stroke-width="3" opacity=".65" stroke-linecap="round"/></svg>';
  }
  const badge='<span class="vertical-badge" aria-hidden="true"></span>';
  document.title=task.title;
  root.innerHTML='<h1>'+escape(task.title)+'</h1><p class="prompt">'+escape(task.prompt)+'</p>'+
   '<div class="pattern-position-work" style="--core-length:'+core.length+';--choices:'+task.choices.length+'">'+
   '<section class="pattern-position-model" aria-label="Repeating pattern model"><div class="pattern-core-heading"><h2>One core</h2><span>Diamond every '+size+' positions</span></div>'+
   '<div class="pattern-core" role="img" aria-label="Core: '+core.join(', ')+'">'+core.map(name=>'<span>'+shape(name)+'</span>').join('')+'</div>'+
   '<label class="pattern-anchor"><span>1. First diamond at or after '+target+'</span><select aria-label="Diamond position"><option value="">Choose</option>'+
   anchorOptions.map(n=>'<option value="'+n+'">'+n+'</option>').join('')+'</select>'+badge+'</label>'+
   '<div class="pattern-count-strip" aria-label="Count-back strip"></div><div class="pattern-count-tools"><span class="pattern-count-label"></span>'+
   '<button type="button" class="pattern-step">← Count back 1</button></div></section>'+
   '<section class="pattern-position-answer" aria-label="Your prediction"><h2>3. Shape at '+target+'</h2>'+
   '<div class="pattern-position-drop" role="img"><span>?</span>'+badge+'</div>'+
   '<div class="pattern-position-bank" aria-label="Shape choices">'+task.choices.map(name=>'<button type="button" data-shape="'+name+
    '" aria-label="'+name+'" title="'+name+'">'+shape(name)+'</button>').join('')+'</div>'+
   '<div class="pattern-status-row"><p role="status">Start with the diamond position.</p><button type="button" class="pattern-reset">Reset</button></div></section></div>';
  const drop=root.querySelector('.pattern-position-drop');
  const anchorControl=root.querySelector('.pattern-anchor');
  const anchorSelect=anchorControl.querySelector('select');
  const status=root.querySelector('[role="status"]');
  const stepButton=root.querySelector('.pattern-step');
  const strip=root.querySelector('.pattern-count-strip');
  const countLabel=root.querySelector('.pattern-count-label');
  const stepText=count=>count+' '+(count===1?'step':'steps');
  function paintStrip() {
   const started=anchor===diamond, current=diamond-steps;
   strip.innerHTML=core.map((name,index)=>{
    const position=diamond-size+1+index;
    if (!started||position<current) return '<span data-unvisited aria-hidden="true"></span>';
    const atTarget=position===target, atDiamond=position===diamond;
    const shown=atTarget&&!atDiamond?answer:name;
    return '<span'+(atTarget?' data-target-position':'')+(atDiamond?' data-diamond':'')+(position===current?' data-current':'')+
     ' role="img" aria-label="'+position+': '+(shown||'missing shape')+'">'+
     (shown?shape(shown):'<strong class="pattern-missing">?</strong>')+'<b aria-hidden="true">'+position+'</b></span>';
   }).join('');
   stepButton.disabled=!started||steps===distance;
   countLabel.textContent='2. '+(!started?'Count back to '+target:steps===distance
    ? 'Reached '+target+' in '+stepText(steps)+'.' : 'At '+current+' · Count back to '+target+'.');
  }
  function snapshot() {
   const reached=anchor===diamond&&steps===distance;
   const marks=[
    {field:'diamond',label:'Diamond position',answer:anchor||'',expected:diamond,correct:anchor===diamond},
    {field:'count-back',label:'Steps back to '+target,answer:anchor===diamond?steps:'',expected:distance,correct:reached},
    {field:'shape',label:'Shape at position '+target,answer,expected,correct:answer===expected}
   ];
   const score=marks.filter(item=>item.correct).length,complete=reached&&Boolean(answer);
   const correct=complete&&score===marks.length,isChecked=checked===signature();
   const message=correct?(distance?'Correct! Count back '+stepText(distance)+' from '+diamond+' to '+target+'.':'Correct! The diamond is at '+target+'.'):
    anchor!==diamond?'Find the first diamond at or after '+target+'.':!reached?'Keep counting back to '+target+'.':
    answer?'Match position '+target+' to its shape in the core.':'Drag or tap the shape for '+target+'.';
   const items=marks.map(m=>({...m,id:m.field,actual:m.answer,entered:m.answer!=='',counted:true,checked:isChecked}));
   return {done,response:{answers:Object.fromEntries(marks.map(({label,answer})=>[label,answer])),marks},
    assessment:{signature:signature(),checked:isChecked,complete,correct:isChecked&&correct,answerCorrect:correct,message,score,total:marks.length,answerChecks:items,
     partAssessment:{version:2,checked:isChecked,correct:isChecked?score:0,total:marks.length,items}}};
  }
  function mark(node,item,spin) {
   if (checked!==signature()||item.answer==='') { delete node.dataset.mark; return; }
   node.dataset.mark=item.correct?'correct':'retry';
   const badge=node.querySelector('.vertical-badge');
   badge.textContent=item.correct?'✓':'↻';
   badge.toggleAttribute('data-spin',spin&&item.correct);
  }
  function paint(spin=false) {
   drop.firstElementChild.innerHTML=answer?shape(answer):'?';
   drop.firstElementChild.style.cssText=answer?'width:100%;height:100%;min-height:0':'';
   drop.toggleAttribute('data-filled',Boolean(answer));
   drop.setAttribute('aria-label','Position '+target+(answer?': '+answer:', empty'));
   anchorSelect.value=anchor||'';
   for (const choice of root.querySelectorAll('[data-shape]')) choice.setAttribute('aria-pressed',String(choice.dataset.shape===answer));
   const {response}=snapshot();
   mark(anchorControl,response.marks[0],spin);
   mark(drop,response.marks[2],spin);
   paintStrip();
  }
  function change(message,type='ml-state') {
   checked='';done=false;persist();paint();status.textContent=message;signal(type);
  }
  function choose(name) {
   answer=name;
   change(name+' placed at '+target+'.');
  }
  root.addEventListener('click',e=>{
   if (skipClick) return;
   const choice=e.target.closest('[data-shape]');
   if (choice) choose(choice.dataset.shape);
   if (e.target===stepButton&&anchor===diamond&&steps<distance) {
    steps++;
    change(steps===distance?'Reached '+target+'. Match it to its shape in the core.':'Counted back to '+(diamond-steps)+'.');
    if(steps===distance&&e.detail===0)root.querySelector('[data-shape]')?.focus();
   }
   if (e.target.closest('.pattern-reset')) {
    answer='';anchor=0;steps=0;change('Start with the diamond position.','ml-reset');
   }
  });
  anchorSelect.addEventListener('change',()=>{
   anchor=Number(anchorSelect.value);steps=0;
   change(anchor===diamond?(distance?'Diamond at '+anchor+'. Count back to '+target+'.':'The diamond is at '+target+'. No steps back needed.'):
    'Diamonds land every '+size+' positions. Choose the first diamond at or after '+target+'.');
  });
  root.addEventListener('pointerdown',e=>{
   const button=e.target.closest('[data-shape]');
   if (!button||e.button!==0||drag) return;
   drag={id:e.pointerId,x:e.clientX,y:e.clientY,name:button.dataset.shape};
   button.setPointerCapture(e.pointerId);
  });
  const overDrop=e=>document.elementFromPoint(e.clientX,e.clientY)?.closest('.pattern-position-drop')===drop;
  root.addEventListener('pointermove',e=>{
   if (drag?.id!==e.pointerId) return;
   if (!drag.ghost&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5) {
    drag.ghost=document.createElement('span');drag.ghost.className='pattern-position-ghost';
    drag.ghost.innerHTML=shape(drag.name);drag.ghost.setAttribute('aria-hidden','true');root.append(drag.ghost);
   }
   if (!drag.ghost) return;
   drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
   drop.toggleAttribute('data-over',overDrop(e));
  });
  function endDrag(e,cancelled=false) {
   if (drag?.id!==e.pointerId) return;
   const {ghost,name}=drag;
   drag=null;
   ghost?.remove();
   drop.removeAttribute('data-over');
   if (!ghost||cancelled) return;
   skipClick=true;
   setTimeout(()=>{skipClick=false;},0);
   if (overDrop(e)) choose(name);
  }
  root.addEventListener('pointerup',e=>endDrag(e));
  for (const event of ['pointercancel','lostpointercapture']) root.addEventListener(event,e=>endDrag(e,true));
  window.ML_ENGINE={
   get:snapshot,check(){checked=signature();persist();paint(true);const current=snapshot();status.textContent=current.assessment.message;return current;},
   setDone(value){done=Boolean(value);persist();}
  };
  paint();
  if (checked===signature()) status.textContent=snapshot().assessment.message;
  signal('ml-ready');
 }
 window.ML_NOVEMBER_PATTERN_POSITION_ENGINE={styles,boot};
})();
