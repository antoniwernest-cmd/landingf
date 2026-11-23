/* Keep shape creation and prediction controls together in the available screen. */
(()=>{
 const css=String.raw`
 body.shape-workspace .work{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)!important}
 body.shape-workspace #main>.sequence{grid-template-columns:repeat(var(--shape-core,3),minmax(0,1fr))!important;grid-template-rows:repeat(var(--shape-rows,3),minmax(0,1fr))!important}
 body.shape-workspace #main>.tile-bank{flex:none!important;min-height:0!important}
 body.shape-workspace #main>.tile-bank .bank{display:grid!important;grid-template-columns:repeat(var(--shape-bank-cols,10),minmax(0,1fr))!important;gap:6px!important}
 body.shape-workspace #main>.tile-bank .bank button{height:44px!important;min-height:44px!important;padding:3px!important}
 body.shape-workspace #main>.tile-bank .symbol svg{width:34px!important;height:34px!important}
 body.shape-workspace #tools{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:9px!important;padding:10px!important}
 body.shape-workspace #tools>.core-tools{display:flex!important;flex-wrap:wrap!important;gap:7px!important;align-items:center!important;flex:none!important}
 body.shape-workspace #tools>.core-tools button{min-height:44px!important;min-width:44px!important}
 body.shape-workspace #tools>.hint,body.shape-workspace #tools>.part-note{display:none!important}
 body.shape-workspace #tools>.extra-fields{display:flex!important;flex-direction:column!important;min-height:0!important;flex:1!important;gap:8px!important}
 body.shape-workspace #tools .field{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;min-height:0!important;flex:1!important;gap:7px!important;padding:0!important}
 body.shape-workspace #tools .field>span{font-size:clamp(15px,1.5vw,20px)!important;flex:none!important}
 body.shape-workspace #tools .unit-answer-pad{flex:none!important;min-height:48px!important;height:48px!important;max-height:48px!important}
 body.shape-workspace #tools .field-choices{display:grid!important;grid-template-columns:repeat(var(--shape-choice-cols,5),minmax(0,1fr))!important;grid-template-rows:repeat(var(--shape-choice-rows,4),minmax(0,1fr))!important;flex:1!important;min-height:0!important;gap:8px!important;align-content:stretch!important}
 body.shape-workspace.pattern-focus[data-pattern-pane=tools] #tools .field-choices:not(.unit-number-options){display:grid!important;flex-wrap:nowrap!important;gap:6px!important}
 body.shape-workspace #tools .field-choices button{display:flex!important;justify-content:center!important;align-items:center!important;min-height:44px!important;min-width:0!important;padding:4px!important}
 body.shape-workspace #tools .field-choices button:has(.symbol){min-height:44px!important}
 body.shape-workspace #tools .field-choices .symbol{width:100%;height:100%;min-height:0;display:flex;align-items:center;justify-content:center}
 body.shape-workspace #tools .field-choices .symbol svg{width:var(--shape-choice-size,48px)!important;height:var(--shape-choice-size,48px)!important;max-width:100%!important;max-height:100%!important}
 body.shape-workspace.pattern-focus .work{grid-template-columns:minmax(0,1fr)!important}
 body.shape-workspace.pattern-focus[data-pattern-pane=main] #tools{display:none!important}
 body.shape-workspace.pattern-focus[data-pattern-pane=tools] #main{display:none!important}
 @media(max-width:850px),(max-height:530px){
  body.shape-workspace #tools{gap:6px!important;padding:7px!important}
  body.shape-workspace #tools .field{gap:5px!important}
  body.shape-workspace #tools .unit-answer-pad{height:44px!important;min-height:44px!important}
 }
 @media print{body.shape-workspace .work{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)!important}body.shape-workspace #main,body.shape-workspace #tools{display:flex!important}}
 `;
 function install(){
  const task=window.ML_CONFIG?.patterningWorksheet?.tasks?.find(t=>t.id===ML_CONFIG.patterningTask);
  if(task?.type!=='createShape'||!task.fields?.some(f=>f.kind==='shape'))return;
  document.body.classList.add('shape-workspace');document.body.dataset.shapeWorkspace='true';let pending=false;
  function measure(){pending=false;
   const main=document.getElementById('main'),tools=document.getElementById('tools');if(!main||!tools)return;
   const core=task.exactCore||task.coreAnswer||3,count=main.querySelector(':scope>.sequence')?.children.length||task.length||9;
   document.body.style.setProperty('--shape-core',core);document.body.style.setProperty('--shape-rows',Math.ceil(count/core));
   for(const prop of ['display','grid-template-columns','grid-template-rows'])tools.style.removeProperty(prop);
   for(const el of tools.querySelectorAll(':scope>.core-tools,:scope>.extra-fields'))for(const prop of ['grid-column','grid-row'])el.style.removeProperty(prop);
   const bank=main.querySelector('.bank');if(bank)bank.style.setProperty('--shape-bank-cols',Math.max(3,Math.min(10,Math.floor(bank.clientWidth/48))));
   for(const choices of tools.querySelectorAll('.field-choices')){
    if(!choices.clientWidth||!choices.clientHeight)continue;
    const count=choices.children.length,roomRows=Math.max(1,Math.floor((choices.clientHeight+6)/50)),fitCols=Math.max(1,Math.floor((choices.clientWidth+6)/50)),cols=Math.max(1,Math.min(fitCols,Math.max(Math.ceil(count/roomRows),Math.min(6,Math.floor(choices.clientWidth/75))))),rows=Math.ceil(count/cols),size=Math.max(28,Math.min(70,choices.clientWidth/cols-18,choices.clientHeight/rows-15));
    choices.style.setProperty('--shape-choice-cols',cols);choices.style.setProperty('--shape-choice-rows',rows);choices.style.setProperty('--shape-choice-size',Math.floor(size)+'px');choices.style.setProperty('grid-template-columns','repeat('+cols+',minmax(0,1fr))','important');choices.style.setProperty('grid-template-rows','repeat('+rows+',minmax(0,1fr))','important');
   }
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(()=>requestAnimationFrame(measure))}}
  new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-pattern-pane']});const observer=new ResizeObserver(schedule);observer.observe(document.querySelector('.work'));observer.observe(document.getElementById('tools'));addEventListener('resize',schedule);document.fonts.ready.then(schedule);schedule();dispatchEvent(new Event('resize'));
 }
 for(const key of ['pattern-resources','patterning-pdf']){let html=window.ML_ENGINES?.[key];if(!html)continue;html=html.replace('function fitPattern(){',"function fitPattern(){if(document.body.classList.contains('shape-workspace'))return;");html=html.replace('const short=(innerHeight<=520||innerWidth<850)&&innerWidth>=650;',"const short=(innerHeight<=520||innerWidth<850)&&(innerWidth>=650||document.body.classList.contains('shape-workspace'));");html=html.replace('</head>','<style id="shapeWorkspace">'+css.replaceAll('body.shape-workspace','html body.shape-workspace[data-shape-workspace]')+'</style></head>').replace('</body>','<script>('+install.toString()+')();</'+'script></body>');window.ML_ENGINES[key]=html;}
})();
