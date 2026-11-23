/* Fill the shared pattern work areas without changing answers, IDs or saved work. */
(()=>{
 const css=String.raw`
 .space-fill #main{justify-content:flex-start!important}
 .space-fill #main>.sequence,.space-fill #main>.display-row{flex:1 1 0!important;grid-auto-rows:minmax(0,1fr);min-height:0}
 .space-fill #main>.sequence>.term{height:100%;min-height:44px!important;gap:5px}
 .space-fill #main>.sequence>.term>.symbol{width:100%;min-height:0;flex:1;display:flex;justify-content:center;align-items:center}
 .space-fill #main>.sequence>.term>.symbol svg{width:var(--space-symbol,52px)!important;height:var(--space-symbol,52px)!important;max-width:90%;max-height:90%}
 .space-fill #main>.sequence>.term>strong{font-size:var(--space-number,36px)!important;line-height:1.1}
 .space-fill #main>.sequence>.term>small{font-size:clamp(11px,1.1vw,16px)!important;flex:none}
 .space-fill #main>.sequence>.term>input{font-size:var(--space-number,32px)!important;max-height:85%;min-height:38px}
 .space-fill #main>.table{flex:1 1 0!important;grid-template-rows:auto minmax(0,1fr)}
 .space-fill .model-region{max-height:none!important;flex:1 1 0;min-height:55px}
 .space-fill #main>.dots-layout{flex:1;min-height:0;grid-template-rows:minmax(0,1fr)}
 .space-fill .dot-board{flex:1;grid-template-rows:repeat(4,minmax(0,1fr));min-height:0}
 .space-fill .dot-cell{width:var(--space-dot,34px)!important;height:var(--space-dot,34px)!important;max-width:100%;max-height:100%!important;align-self:center;justify-self:center}
 .space-roomy .vocabulary-note{font-size:clamp(15px,1.2vw,18px);padding:10px 12px;flex:none}
 .space-roomy .display-label{font-size:16px;flex:none}
 .space-wrap-label::after{content:' · Read across each row';font-size:.85em;color:#58738b}
 .space-roomy #tools.space-answer-cards>.extra-fields{flex:1;grid-auto-rows:minmax(0,1fr);gap:12px}
 .space-roomy #tools.space-answer-cards>.extra-fields>.field{padding:10px;gap:8px;border:2px solid #a6c8df;border-radius:12px;background:#edf6ff;justify-content:center}
 .space-roomy #tools.space-answer-cards>.extra-fields>.field:nth-child(2n){background:#f1eaff;border-color:#bba1d6}
 .space-roomy #tools.space-answer-cards>.extra-fields>.field:nth-child(3n){background:#fff3cd;border-color:#d9bd72}
 .space-roomy #tools.space-answer-cards .field>span{font-size:clamp(16px,1.2vw,20px)!important}
 .space-roomy #tools.space-answer-cards .unit-answer-pad{flex:1;min-height:54px;max-height:130px;font-size:clamp(20px,1.7vw,28px);padding:8px 25px 8px 8px}
 .space-roomy #tools.space-answer-cards .field-choices:not(.unit-number-options){display:grid;grid-template-columns:repeat(var(--space-choices,3),minmax(0,1fr));gap:8px;flex:none}
 .space-roomy #tools.space-answer-cards .field-choices button{min-height:52px;font-size:clamp(16px,1.3vw,23px);padding:8px;min-width:0}
 .space-roomy #tools.space-answer-cards .unit-numeric-answer{flex:1;max-height:130px}
 .space-roomy #tools.space-answer-cards .unit-numeric-answer input{font-size:28px}
 @media print{.space-fill .model-region{min-height:55px}.space-fill #main>.sequence>.term{min-height:44px!important}}
 `;
 function fillSpace(){
  if(!window.ML_CONFIG?.patterningWorksheet)return;
  document.body.classList.add('space-fill');let queued=false;
  function set(el,key,value){if(el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value)}
  function measure(){queued=false;const body=document.body;body.classList.toggle('space-roomy',innerHeight>=530&&innerWidth>=650);
   const tools=document.getElementById('tools');if(tools){const fields=tools.querySelectorAll(':scope>.extra-fields>.field'),answers=tools.querySelectorAll(':scope>.extra-fields>.field .unit-answer-pad');tools.classList.toggle('space-answer-cards',fields.length>0&&fields.length<=3&&answers.length===fields.length&&!tools.querySelector('.core-tools,.reasoning,.mapping'));}
   for(const row of document.querySelectorAll('#main>.sequence')){const box=row.getBoundingClientRect(),count=row.children.length;let cols=0;if(body.classList.contains('space-roomy')&&count){cols=Math.min(count,Math.max(2,Math.round(Math.sqrt(count*box.width/Math.max(1,box.height)/1.3))));const task=ML_CONFIG.patterningWorksheet.tasks.find(q=>q.id===ML_CONFIG.patterningTask),values=row.classList.contains('display-row')?task?.display?.values:null;let core=task?.coreAnswer;if(values)for(let period=1;period<=Math.floor(values.length/2);period++)if(values.every((v,i)=>v===values[i%period])){core=period;break}if(core&&core<=cols+1&&core>1){const candidates=Array.from({length:Math.ceil(count/core)},(_,i)=>(i+1)*core).filter(n=>n<=count);cols=candidates.sort((a,b)=>Math.abs(a-cols)-Math.abs(b-cols))[0]||cols;}set(row,'grid-template-columns','repeat('+cols+',minmax(0,1fr))');set(row,'grid-template-rows','repeat('+Math.ceil(count/cols)+',minmax(0,1fr))')}else{row.style.removeProperty('grid-template-columns');row.style.removeProperty('grid-template-rows')}row.previousElementSibling?.classList.toggle('space-wrap-label',!!cols&&count>cols&&row.previousElementSibling.classList.contains('display-label'));for(const cell of row.children){const r=cell.getBoundingClientRect(),size=Math.max(26,Math.min(200,r.width*.8,(r.height-27)*.85)),font=Math.max(22,Math.min(68,r.width*.42,(r.height-25)*.56));set(cell,'--space-symbol',Math.round(size)+'px');set(cell,'--space-number',Math.round(font)+'px')}}
   for(const board of document.querySelectorAll('.dot-board')){const r=board.getBoundingClientRect(),size=Math.max(12,Math.min(70,(r.width-25)/6,(r.height-15)/4));set(board,'--space-dot',Math.floor(size)+'px')}
   for(const row of document.querySelectorAll('.field-choices'))set(row,'--space-choices',String(Math.min(3,row.children.length)||1));
  }
  function queue(){if(!queued){queued=true;requestAnimationFrame(()=>requestAnimationFrame(measure))}}
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});new ResizeObserver(queue).observe(document.getElementById('main'));addEventListener('resize',queue);document.fonts.ready.then(queue);queue();
 }
 for(const name of ['patterning-pdf','pattern-resources']){let html=window.ML_ENGINES?.[name];if(!html)continue;html=html.replace('</head>','<style id="patternSpaceLayout">'+css+'</style></head>').replace('</body>','<script>('+fillSpace.toString()+')();</'+'script></body>');window.ML_ENGINES[name]=html;}
})();
