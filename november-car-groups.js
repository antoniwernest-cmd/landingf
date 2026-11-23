/* Build the same number from two different combinations of car groups. */
(() => {
 'use strict';
 const styles = `
 .activity:has(.car-activity){--car-step-x:.39;--car-step-y:.18;--car-aspect:.666667;--max-car-width:88px;gap:clamp(4px,1vh,10px);padding-block:clamp(6px,1.35vh,16px)}
 .car-activity{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:7px;min-height:0}
 .car-board{display:grid;grid-template-columns:minmax(0,.7fr) repeat(2,minmax(0,1fr));min-height:0;gap:clamp(4px,1vw,14px)}
 .car-bank,.car-pad{display:grid;grid-template-rows:auto minmax(0,1fr);gap:5px;min-width:0;min-height:0;border:1px solid #99aca6;border-radius:12px;padding:clamp(4px,.8vw,12px);background:#fffefa}
 .car-bank h2,.car-pad-target{font-size:clamp(12px,1.8vw,25px);line-height:1.12;font-weight:800;margin:0}
 .car-pad{border:2px dashed #55978d;background:#e7f5f1}
 .car-pad:last-child{border-color:#8d7cbe;background:#f1edfc}
 .car-pad[data-over],.car-pad[data-active]{border-style:solid;box-shadow:inset 0 0 0 2px #d39c39}
 .car-pad[data-check="correct"]{border-color:#217651}
 .car-pad[data-check="retry"]{border-color:#a64c31}
 .car-pad header{display:flex;align-items:center;justify-content:space-between;gap:4px;min-width:0}
 .car-pad-target{border:1px solid #748e87;border-radius:7px;padding:4px;background:#fffefa;color:#174840;text-align:left;min-height:38px;min-width:0}
 .car-pad output{font-weight:800;white-space:nowrap;font-size:clamp(12px,1.65vw,22px)}
 .car-bank-grid,.car-pad-grid{display:grid;gap:clamp(2px,.55vw,7px);min-height:0;min-width:0}
 .car-bank-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}
 .car-pad-grid:has(.car-stack){--tile-edge:3px;--car-width:var(--max-car-width);--card-header:22px;display:block;position:relative;gap:4px}
 .car-empty{grid-column:1/-1;grid-row:1/-1;place-self:center;font-size:clamp(12px,1.5vw,21px);color:#355950}
 .car-group,.car-stack{display:grid;min-width:0;min-height:0;position:relative;height:100%}
 .car-group{grid-template-rows:minmax(0,1fr) auto;gap:1px;border:1px solid #9b7b43;border-radius:8px;background:#fff4d0;color:#493925;padding:2px 4px;cursor:grab;touch-action:none}
 .car-stack{position:absolute;left:var(--card-left,0);top:var(--card-top,0);height:auto}
 .car-stack .car-group{height:auto;background:#fffefa;padding:calc(var(--tile-edge) - 1px);grid-template-rows:var(--card-header) auto;gap:0;text-align:left}
 .car-quantity{align-self:center;justify-self:start;padding-inline:1px;font-size:clamp(9px,calc(var(--card-header) * .74),17px);line-height:1;font-weight:800}
 .car-group[aria-pressed="true"]{outline:2px solid #8550bd;outline-offset:-2px;background:#faebff}
 .car-preview{display:grid;place-items:center;min-height:0;min-width:0;container-type:size}
 .car-art{
  --art-width:calc(1 + var(--car-intervals) * var(--car-step-x));
  --art-height:calc(var(--car-aspect) + var(--car-intervals) * var(--car-step-y));
  display:block;position:relative;width:calc(var(--car-width) * var(--art-width));height:calc(var(--car-width) * var(--art-height));
 }
 .car-preview .car-art{--car-width:min(calc(100cqw / var(--art-width)),calc(100cqh / var(--art-height)),var(--max-car-width))}
 .car-art img{
  position:absolute;left:calc(var(--car-width) * var(--car-index) * var(--car-step-x));top:calc(var(--car-width) * var(--car-index) * var(--car-step-y));
  width:var(--car-width);height:calc(var(--car-width) * var(--car-aspect));object-fit:contain;pointer-events:none
 }
 .car-group b{font-size:clamp(10px,1.4vw,19px);line-height:1.12;white-space:nowrap}
 .car-remove{position:absolute;inset:0 0 auto auto;display:grid;place-items:center;width:clamp(9px,42%,var(--card-header));height:var(--card-header);border:0;border-radius:0 7px 0 7px;background:#eedde5;color:#58253c;padding:0;min-height:0;line-height:1;font-size:clamp(9px,calc(var(--card-header) * .76),17px);font-weight:900}
 .car-feedback{display:flex;justify-content:space-between;align-items:center;gap:6px;min-height:35px;font-size:clamp(12px,1.28vw,18px);font-weight:700}
 .car-reset{min-height:35px;white-space:nowrap;border:1px solid #748e87;border-radius:7px;padding:3px 9px;background:#fffefa;color:#174840;font-weight:bold}
 .car-ghost{--car-width:46px;position:fixed;pointer-events:none;z-index:20;transform:translate(-50%,-50%);padding:3px;border:2px solid #8550bd;border-radius:8px;background:#fff4d0}
 @media(max-width:620px) and (orientation:portrait){
  .car-board{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,.65fr) minmax(0,1fr)}
  .car-bank{grid-column:1/-1}
  .car-bank-grid{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr))}
  .car-pad header{flex-wrap:wrap}
  .car-pad-target{min-height:29px}
 }
 @media print{
  .activity:has(.car-activity){height:166mm;overflow:hidden;break-inside:avoid}
  .car-reset,.car-remove{visibility:hidden}
 }
 `;
 function boot() {
  const cfg=window.ML_CONFIG, task=cfg.task, target=task.target;
  const root=document.querySelector('.activity');
  const sizes=[1,2,3,4,5,6,7,8];
  const padNames=['Landing pad A','Landing pad B'];
  const key='math-landing:november-addition:'+cfg.student+':'+cfg.id+':'+cfg.revision;
  let saved={};
  if (!cfg.cataloguePreview) {
   try { saved=JSON.parse(localStorage.getItem(key))||{}; } catch {}
  }
  const groups=padNames.map((_,pad)=>sizes.map((_,index)=>{
   const count=saved.groups?.[pad]?.[index];
   return Number.isSafeInteger(count)&&count>=0?count:0;
  }));
  let selected=null, drag=null, skipClick=false;
  let checked=saved.checked||'',done=saved.done===true;
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const photo=escape(task.picture);
  const signature=()=>JSON.stringify(groups);
  const sum=pad=>groups[pad].reduce((total,count,index)=>total+count*sizes[index],0);
  const signal=type=>{if(!cfg.cataloguePreview)parent.postMessage({type,id:cfg.id},'*');};
  function persist() {
   if (!cfg.cataloguePreview) {
    try { localStorage.setItem(key,JSON.stringify({groups,checked,done})); } catch {}
   }
  }
  function art(size) {
   const cars=Array.from({length:size},(_,index)=>'<img src="'+photo+'" alt="" draggable="false" style="--car-index:'+index+'">');
   return '<span class="car-art" style="--car-intervals:'+(size-1)+'" aria-hidden="true">'+cars.join('')+'</span>';
  }
  function groupButton(size, source, instance=0) {
   const placed=source!=='bank';
   const artwork=art(size);
   return '<button type="button" class="car-group" data-car-group="'+size+'" data-source="'+source+'" data-instance="'+instance+'" aria-pressed="false" aria-label="Group of '+size+'">'+
    (placed?'<span class="car-quantity" aria-hidden="true">'+size+'</span>'+artwork:'<span class="car-preview">'+artwork+'</span><b aria-hidden="true">Group of '+size+'</b>')+'</button>';
  }
  document.title=task.title;
  root.innerHTML='<h1>'+escape(task.title)+'</h1><p class="prompt">'+escape(task.prompt)+'</p><div class="car-activity"><div class="car-board">'+
   '<section class="car-bank"><h2>Car groups</h2><div class="car-bank-grid">'+sizes.map(size=>groupButton(size,'bank')).join('')+'</div></section>'+
   padNames.map((name,index)=>'<section class="car-pad" data-car-pad="'+index+'" aria-label="'+name+'"><header><button type="button" class="car-pad-target" data-place="'+index+'" aria-label="Place selected group on '+name+'">'+name+'</button><output aria-label="'+name+' total"></output></header><div class="car-pad-grid"></div></section>').join('')+
   '</div><div class="car-feedback"><p role="status">Drag a group or select it, then choose a pad.</p><button type="button" class="car-reset">Reset</button></div></div>';
  const pads=[...root.querySelectorAll('.car-pad')];
  const padGrids=pads.map(pad=>pad.querySelector('.car-pad-grid'));
  const status=root.querySelector('[role="status"]');
  function describe(pad) {
   return groups[pad].flatMap((count,index)=>count?[count+' '+(count===1?'group':'groups')+' of '+sizes[index]]:[]).join(', ');
  }
  function snapshot() {
   const sums=pads.map((_,i)=>sum(i));
   const hits=sums.map(value=>value===target);
   const complete=sums.every(value=>value>0);
   const distinct=groups[0].some((count,index)=>count!==groups[1][index]);
   const correct=hits.every(Boolean)&&distinct;
   const isChecked=checked===signature();
   const items=padNames.map((name,i)=>({field:'pad-'+i,label:name,actual:sums[i],expected:target,entered:sums[i]>0,correct:hits[i]}));
   const comparison=!hits.every(Boolean)?'Totals differ from '+target:distinct?'Different combinations':'Same combination';
   items.push({field:'different-groups',label:'Different groups that both total '+target,actual:complete?comparison:'',expected:'Different combinations that total '+target,
    entered:complete,correct});
   for (const item of items) Object.assign(item,{id:item.field,counted:true,checked:isChecked});
   const score=items.filter(item=>item.correct).length;
   const message=correct?'Both pads show '+target+' in different ways.':!complete?'Build '+target+' on both pads.':
    hits.every(Boolean)?'Both pads total '+target+'. Change the groups on one pad.':'Check the total on each pad.';
   return {done,response:{answers:{[padNames[0]]:describe(0),[padNames[1]]:describe(1)},marks:items},
    assessment:{signature:signature(),checked:isChecked,complete,correct:isChecked&&correct,answerCorrect:correct,message,score,total:items.length,answerChecks:items,
     partAssessment:{version:2,checked:isChecked,correct:isChecked?score:0,total:items.length,items}}};
  }
  function paintSelection() {
   root.querySelectorAll('[data-car-group]').forEach(button=>{
    const active=selected?.source===button.dataset.source&&selected.size===Number(button.dataset.carGroup)&&selected.instance===button.dataset.instance;
    button.setAttribute('aria-pressed',String(active));
   });
   pads.forEach((pad,i)=>pad.toggleAttribute('data-active',Boolean(selected)&&selected.source!==String(i)));
  }
  function fitGroups(grid) {
   const cards=Array.from(grid.querySelectorAll('.car-stack'),element=>({element,size:Number(element.firstElementChild.dataset.carGroup)}));
   if(!cards.length)return;
   const style=getComputedStyle(grid);
   const gap=parseFloat(style.gap);
   const offsetX=parseFloat(style.getPropertyValue('--car-step-x'));
   const offsetY=parseFloat(style.getPropertyValue('--car-step-y'));
   const aspect=parseFloat(style.getPropertyValue('--car-aspect'));
   const edges=2*parseFloat(style.getPropertyValue('--tile-edge'));
   const {width,height}=grid.getBoundingClientRect();
   const pileSize=Math.ceil(cards.length/Math.ceil(cards.length/4));
   const piles=[];
   for(let start=0;start<cards.length;start+=pileSize)piles.push(cards.slice(start,start+pileSize));
   function arrange(carWidth) {
    const header=Math.max(12,Math.min(24,Math.round(carWidth*.29)));
    // The next card starts below the previous card's quantity and remove button.
    const stepX=Math.max(3,Math.round(carWidth*.24));
    const stepY=header+2;
    let left=0,top=0,rowHeight=0;
    let fits=true;
    const positions=[];
    for(const pile of piles){
     let pileWidth=0,pileHeight=0;
     for(const [level,{size}] of pile.entries()){
      const cardWidth=(1+(size-1)*offsetX)*carWidth+edges;
      const cardHeight=(aspect+(size-1)*offsetY)*carWidth+edges+header;
      pileWidth=Math.max(pileWidth,level*stepX+cardWidth);
      pileHeight=Math.max(pileHeight,level*stepY+cardHeight);
     }
     if(left>0&&left+pileWidth>width){
      top+=rowHeight+gap;
      left=0;
      rowHeight=0;
     }
     if(pileWidth>width||top+pileHeight>height)fits=false;
     pile.forEach(({element},level)=>positions.push({element,x:left+level*stepX,y:top+level*stepY}));
     left+=pileWidth+gap;
     rowHeight=Math.max(rowHeight,pileHeight);
    }
    return {fits,header,positions};
   }
   let carWidth=Math.max(1,Math.min(parseFloat(style.getPropertyValue('--max-car-width')),Math.floor(width)));
   let layout=arrange(carWidth);
   while(carWidth>1&&!layout.fits)layout=arrange(--carWidth);
   grid.style.setProperty('--car-width',carWidth+'px');
   grid.style.setProperty('--card-header',layout.header+'px');
   for(const {element,x,y} of layout.positions){
    element.style.setProperty('--card-left',x+'px');
    element.style.setProperty('--card-top',y+'px');
   }
  }
  function paint() {
   for(const [i,pad] of pads.entries()){
    pad.querySelector('output').textContent=sum(i)+' / '+target;
    if(checked===signature())pad.dataset.check=sum(i)===target?'correct':'retry';
    else delete pad.dataset.check;
    const grid=padGrids[i];
    grid.innerHTML=sizes.map((size,index)=>{
     const count=groups[i][index];
     if(!count)return '';
     return Array.from({length:count},(_,instance)=>'<div class="car-stack">'+groupButton(size,String(i),instance)+
      '<button type="button" class="car-remove" data-remove="'+size+'" aria-label="Remove one group of '+size+' from '+padNames[i]+'">×</button></div>').join('');
    }).join('')||'<p class="car-empty">Drop a group here.</p>';
    fitGroups(grid);
   }
   paintSelection();
  }
  function change(message,type='ml-state') {
   checked='';done=false;persist();paint();status.textContent=message;signal(type);
  }
  function place(group,pad) {
   if(!group||group.source===String(pad))return;
   const index=group.size-1;
   if(group.source!=='bank'){
    if(!groups[Number(group.source)][index])return;
    groups[Number(group.source)][index]--;
   }
   groups[pad][index]++;
   if(group.source!=='bank')selected=null;
   change(padNames[pad]+' has '+sum(pad)+' cars.');
  }
  function remove(pad,size) {
   if(!groups[pad][size-1])return;
   groups[pad][size-1]--;
   selected=null;
   change(padNames[pad]+' has '+sum(pad)+' cars.');
   (pads[pad].querySelector('[data-car-group="'+size+'"]')||pads[pad].querySelector('[data-place]')).focus();
  }
  const groupFrom=button=>({source:button.dataset.source,size:Number(button.dataset.carGroup),instance:button.dataset.instance});
  root.addEventListener('click',event=>{
   if(skipClick)return;
   const group=event.target.closest('[data-car-group]');
   if(group){
    selected=groupFrom(group);paintSelection();
    status.textContent='Group of '+selected.size+' selected. Choose a landing pad.';
    return;
   }
   const returnButton=event.target.closest('[data-remove]');
   if(returnButton){remove(Number(returnButton.closest('[data-car-pad]').dataset.carPad),Number(returnButton.dataset.remove));return;}
   const destination=event.target.closest('[data-car-pad]');
   if(destination&&selected){place(selected,Number(destination.dataset.carPad));return;}
   if(event.target.closest('.car-reset')){
    groups.forEach(pad=>pad.fill(0));selected=null;change('Both pads are empty.','ml-reset');
   }
  });
  root.addEventListener('keydown',event=>{
   if(event.key==='Escape'){selected=null;paintSelection();}
   const group=event.target.closest('[data-car-group]');
   if(event.key==='Delete'&&group&&group.dataset.source!=='bank'){
    event.preventDefault();remove(Number(group.dataset.source),Number(group.dataset.carGroup));
   }
  });
  function targetPad(event) {
   return document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-car-pad]');
  }
  root.addEventListener('pointerdown',event=>{
   const button=event.target.closest('[data-car-group]');
   if(!button||event.button!==0||drag)return;
   drag={group:groupFrom(button),id:event.pointerId,x:event.clientX,y:event.clientY};
   button.setPointerCapture(event.pointerId);
  });
  root.addEventListener('pointermove',event=>{
   if(drag?.id!==event.pointerId)return;
   if(!drag.ghost&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>5){
    drag.ghost=document.createElement('span');drag.ghost.className='car-ghost';drag.ghost.innerHTML=art(drag.group.size);root.append(drag.ghost);
   }
   if(!drag.ghost)return;
   drag.ghost.style.left=event.clientX+'px';drag.ghost.style.top=event.clientY+'px';
   const target=targetPad(event);
   pads.forEach(pad=>pad.toggleAttribute('data-over',pad===target));
  });
  function stopDrag(event,cancelled=false) {
   if(drag?.id!==event.pointerId)return;
   const {ghost,group}=drag;
   drag=null;ghost?.remove();
   pads.forEach(pad=>pad.removeAttribute('data-over'));
   if(!ghost||cancelled)return;
   skipClick=true;
   setTimeout(()=>{skipClick=false;},0);
   const pad=targetPad(event);
   if(pad){selected=null;place(group,Number(pad.dataset.carPad));}
  }
  root.addEventListener('pointerup',event=>stopDrag(event));
  for(const event of ['pointercancel','lostpointercapture'])root.addEventListener(event,e=>stopDrag(e,true));
  window.ML_ENGINE={
   get:snapshot,
   check(){checked=signature();persist();paint();const current=snapshot();status.textContent=current.assessment.message;return current;},
   setDone(value){done=Boolean(value);persist();}
  };
  paint();
  const padObserver=new ResizeObserver(entries=>entries.forEach(({target})=>fitGroups(target)));
  padGrids.forEach(grid=>padObserver.observe(grid));
  if(checked===signature())status.textContent=snapshot().assessment.message;
  signal('ml-ready');
 }
 window.ML_NOVEMBER_CAR_GROUPS_ENGINE={styles,boot};
})();
