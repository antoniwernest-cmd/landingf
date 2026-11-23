/* Use the homework viewport for models and answers instead of centred empty gaps. */
(()=>{'use strict';
 const ids=[...new Set(['2026-11-02','2026-11-09'].flatMap(w=>Object.values(ML_HOMEWORK_WEEKS[w].grades).flatMap(days=>days.flatMap(d=>d.questions.map(q=>q.id)))))];
 const compactIds=[...new Set(Object.values(ML_HOMEWORK_WEEKS['2026-11-09'].grades).flatMap(days=>days.flatMap(day=>day.questions.map(q=>q.id))))];
 const css=String.raw`
 .card-parallel-patterns{display:grid;grid-template-rows:repeat(2,minmax(0,1fr));flex:1;min-height:0;gap:12px}
 .card-parallel-pager{display:none;gap:7px}.card-parallel-pager button{flex:1;min-height:34px!important;font-size:14px!important;padding:4px!important}
 .card-parallel-patterns>section{display:grid;grid-template-rows:auto minmax(0,1fr);gap:7px;min-height:0}
 .card-parallel-patterns h2{font-size:clamp(15px,1.4vw,24px)!important;margin:0!important}
 .card-parallel-values{display:grid;grid-template-columns:repeat(var(--homework-row-cols,6),minmax(0,1fr));grid-auto-rows:minmax(0,1fr);gap:7px;min-height:0}
 html body .card-parallel-values>.term{min-height:0!important;padding:4px!important}
 @media print{html body #main .card-parallel-values{grid-template-columns:repeat(6,minmax(0,1fr))!important}html body #main .card-parallel-values>.term>strong{font-size:24px!important}.card-parallel-patterns h2{font-size:13px!important}}
 @media screen{
 html body.homework-space-fit.friendly-pattern-page>header{padding:6px 98px 6px 12px!important;min-height:0!important}
 html body.homework-space-fit.friendly-pattern-page>header>small{display:block;font-size:10px!important;line-height:1.2!important;margin:0!important}
 html body.homework-space-fit.friendly-pattern-page>header h1{font-size:clamp(21px,2.1vw,28px)!important;line-height:1.14!important;margin:2px 0!important}
 html body.homework-space-fit.friendly-pattern-page>header p{font-size:17px!important;line-height:1.22!important;margin:2px 0 0!important}
 html body.homework-space-fit.friendly-pattern-page>header #alignment{font-size:10px!important;line-height:1.15!important;margin:0!important}
 html body.homework-space-fit .ml-learning-art{width:84px!important;height:66px!important}
 html body.homework-space-fit #tools{justify-content:flex-start!important;gap:10px!important}
 html body.homework-space-fit #tools>.play-answer-parts{flex:none!important;margin:0!important}
 html body.homework-space-fit #tools>.play-answer-part{flex:none!important;margin:0!important}
 html body.homework-space-fit.task-card-page #main>.sequence{flex:1 1 0%!important}
 html body.homework-space-fit.task-card-page[data-card-kind=numbers] #main>.sequence>.term>strong,html body.homework-space-fit.task-card-page #main .card-parallel-values>.term>strong{font-size:var(--homework-number-size,40px)!important;line-height:1.05!important}
 html body.homework-space-fit.task-card-page #main>.tile-bank .bank button{min-height:clamp(44px,7vh,86px)!important;font-size:clamp(22px,1.7vw,38px)!important}
 @media(min-width:851px) and (min-height:501px){html body.homework-space-fit.task-card-page #main>.tile-bank .bank{grid-template-columns:repeat(var(--homework-bank-cols,5),minmax(0,1fr))!important}}
 html body.homework-space-fit.homework-compact-buttons #main .tile-bank .bank{display:flex!important;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px!important}
 html body.homework-space-fit.homework-compact-buttons #main .tile-bank .bank button{flex:0 0 auto!important;width:auto!important;min-width:44px!important;max-width:100%;height:auto!important;min-height:44px!important;padding:3px 10px!important;font-size:clamp(17px,2vw,24px)!important}
 html body.homework-space-fit.homework-compact-buttons :is(.play-pane-switch,.card-parallel-pager){justify-content:center}
 html body.homework-space-fit.homework-compact-buttons :is(.play-pane-switch,.card-parallel-pager) button{flex:0 1 auto!important;width:auto!important;min-height:44px!important;padding:4px 14px!important;font-size:clamp(14px,1.5vw,18px)!important}
 html body.homework-space-fit.homework-all-answers #tools>.play-answer-parts{display:none!important}
 html body.homework-space-fit.homework-all-answers #tools>.play-answer-part[hidden]{display:block!important}
 html body.homework-space-fit.homework-all-answers #tools .field-choices:not(:has(.symbol)){display:grid!important;grid-template-columns:repeat(var(--homework-answer-cols,3),minmax(0,1fr))!important;gap:6px!important}
 html body.homework-space-fit.homework-all-answers #tools .field-choices:not(:has(.symbol)) button{min-height:44px!important;font-size:clamp(15px,1.1vw,25px)!important;padding:5px!important;line-height:1.2!important}
 html body.homework-space-fit #tools .field>span{font-size:clamp(16px,1.2vw,26px)!important;line-height:1.2!important}
 html body.homework-space-fit.homework-all-answers #tools .play-answer-part+.play-answer-part{border-top:1px solid #d7e2e4;padding-top:10px!important}
 html body.homework-space-fit[data-play=chart-hops] .play-hop-side{justify-content:flex-start!important;gap:10px!important}
 html body.homework-space-fit[data-play=chart-hops] .play-trail{flex:1;grid-template-rows:repeat(2,minmax(0,1fr));align-items:stretch!important}
 html body.homework-space-fit[data-play=chart-hops] .play-hop{justify-content:flex-start;min-height:0}
 html body.homework-space-fit[data-play=chart-hops] .play-hop .term{flex:1;min-height:44px!important;max-height:126px!important}
 html body.homework-space-fit[data-play=chart-hops] .play-hop .term input{height:100%;min-height:0!important}
 html body.homework-space-fit .card-shape-source{justify-content:flex-start!important}
 html body.homework-space-fit .card-shape-source>.sequence{flex:1!important;grid-template-rows:minmax(0,1fr)!important;align-items:stretch!important}
 html body.homework-space-fit .card-shape-source>.sequence>.term{display:flex!important;flex-direction:column;justify-content:center;gap:8px!important;min-height:0!important}
 html body.homework-space-fit #main .card-shape-source .sequence .symbol{display:grid;place-items:center;min-height:0;width:100%!important;height:auto!important}
 html body.homework-space-fit #main .card-shape-source .sequence .symbol svg{width:clamp(44px,11vw,150px)!important;height:clamp(44px,11vw,150px)!important;max-width:100%;max-height:100%}
 html body.homework-space-fit .play-pane-switch{margin:5px 0 0!important}
 @media(min-width:1000px) and (min-height:560px){
 html body.homework-space-fit[data-play=chart-hops] .work{grid-template-columns:minmax(0,.95fr) minmax(0,1.4fr)!important;grid-template-rows:minmax(0,1fr) auto!important;gap:10px!important}
 html body.homework-space-fit[data-play=chart-hops] #main,html body.homework-space-fit[data-play=chart-hops] .play-chart-hop{display:contents!important}
 html body.homework-space-fit[data-play=chart-hops] .play-chart-panel{grid-column:1!important;grid-row:1/-1!important;padding:10px;border:1px solid #c5d9ce;border-radius:15px;background:#fff}
 html body.homework-space-fit[data-play=chart-hops] .play-hop-side{grid-column:2!important;grid-row:1!important;padding:10px;border:1px solid #c5d9ce;border-radius:15px;background:#fff;min-height:0}
 html body.homework-space-fit[data-play=chart-hops] #tools{grid-column:2!important;grid-row:2!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:12px!important;padding:10px!important}
 html body.homework-space-fit[data-play=chart-hops] #tools>.play-answer-parts{grid-column:1/-1}
 html body.homework-space-fit[data-play=chart-hops] #tools>.play-answer-part{min-width:0}
 html body.homework-space-fit[data-play=chart-hops].homework-all-answers #tools .play-answer-part+.play-answer-part{border-top:0;border-left:1px solid #d7e2e4;padding-top:0!important;padding-left:12px}
 }
 @media(min-width:1600px) and (min-height:650px){
 html body.homework-space-fit.homework-parallel-page .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto!important}
 html body.homework-space-fit.homework-parallel-page #main{grid-column:1!important;grid-row:1!important}
 html body.homework-space-fit.homework-parallel-page #tools{grid-column:1!important;grid-row:2!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px!important}
 html body.homework-space-fit.homework-parallel-page #tools>.play-answer-parts{grid-column:1/-1}
 html body.homework-space-fit.homework-parallel-page.homework-all-answers #tools .play-answer-part+.play-answer-part{border-top:0;border-left:1px solid #d7e2e4;padding-top:0!important;padding-left:12px}
 }
 @media(max-height:500px){
 html body.homework-space-fit .card-parallel-pager{display:flex}
 html body.homework-space-fit .card-parallel-patterns{grid-template-rows:auto minmax(0,1fr);gap:7px}
 html body.homework-space-fit .card-parallel-patterns>section[data-card-pattern-active=false]{display:none}
 html body.homework-space-fit.friendly-pattern-page>header{padding:4px 8px!important}
 html body.homework-space-fit.friendly-pattern-page>header h1{font-size:21px!important}
 html body.homework-space-fit.friendly-pattern-page>header p{font-size:14px!important}
 html body.homework-space-fit .ml-learning-art{display:none!important}
 html body.homework-space-fit #main .card-shape-source .sequence .symbol svg{width:60px!important;height:60px!important}
 }
 @media(max-width:680px){
 html body.homework-space-fit.friendly-pattern-page>header{padding:5px 8px!important}
 html body.homework-space-fit.friendly-pattern-page>header h1{font-size:21px!important}
 html body.homework-space-fit.friendly-pattern-page>header p{font-size:14px!important}
 html body.homework-space-fit .ml-learning-art{display:none!important}
 html body.homework-space-fit #main .card-shape-source .sequence .symbol svg{width:60px!important;height:60px!important}
 }
 @media(max-width:480px){html body.homework-space-fit[data-play=chart-hops] .play-trail{flex:0 1 auto;grid-template-rows:minmax(0,1fr)}html body.homework-space-fit[data-play=chart-hops] .play-hop .term{min-height:30px!important}}
 }
 @media screen{
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .play-pane-switch,html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools>.play-answer-parts{display:none!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work{grid-template-columns:minmax(0,2fr) minmax(0,3fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:8px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#main,html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#tools{grid-area:auto!important;min-width:0;min-height:0;padding:6px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#main{display:flex!important;justify-content:center!important;gap:4px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#tools{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);align-content:center;align-items:start;gap:8px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools>.play-answer-part{display:block!important;grid-column:auto!important;margin:0!important;min-width:0}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field{display:flex!important;flex-direction:column;gap:4px!important;min-width:0;margin:0!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field>span:first-child{font-size:clamp(13px,1.4vw,20px)!important;line-height:1.15}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices{margin:0!important;gap:4px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices:has(.symbol){display:flex!important;flex-wrap:wrap;justify-content:center}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices:has(.symbol) button{flex:0 0 auto!important;width:clamp(38px,4.2vw,56px)!important;min-width:0!important;min-height:40px!important;padding:2px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices .symbol,html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices .symbol svg,html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .unit-answer-pad .symbol svg{width:clamp(28px,3.4vw,42px)!important;height:clamp(28px,3.4vw,42px)!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .unit-answer-pad{min-height:36px!important;height:auto!important;padding:2px 4px!important;font-size:13px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices:not(:has(.symbol)){display:grid!important;grid-template-columns:minmax(0,1fr)!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools .field-choices:not(:has(.symbol)) button{min-height:32px!important;padding:3px 6px!important;font-size:clamp(12px,1.2vw,17px)!important;line-height:1.15!important;white-space:normal}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main>.card-shape-source{flex:none!important;align-self:stretch;justify-content:center!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main .card-shape-source>.sequence{grid-template-columns:none!important;grid-auto-flow:column;grid-auto-columns:minmax(0,74px);grid-template-rows:auto!important;justify-content:center;flex:none!important;height:auto!important;gap:4px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main .card-shape-source .sequence>.term{align-self:center!important;height:auto!important;gap:2px!important;padding:4px!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main .card-shape-source .sequence .symbol svg{width:clamp(30px,5.6vw,62px)!important;height:clamp(30px,5.6vw,62px)!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main>.card-prediction-label{font-size:clamp(12px,1.3vw,16px)!important;margin:2px 0!important}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) #main>.card-number-rows{flex:none;align-self:center;max-width:100%}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) .card-number-rows article{padding:6px 8px}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) .card-number-rows h2{margin:0 0 4px!important;font-size:clamp(13px,1.2vw,17px)}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) .card-number-rows article>div{flex-wrap:wrap;justify-content:center;gap:4px}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) .card-number-rows strong{flex:0 0 auto;min-width:clamp(34px,4vw,56px);padding:4px 6px;font-size:clamp(18px,2vw,30px)}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) #tools .field-choices:has(>button:is([data-field=outsideLater],[data-field=term10])),html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) #tools .field-choices:has(>button[data-field=pattern]){display:flex!important;flex-wrap:wrap;justify-content:center}
  html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) #tools .field-choices:has(>button:is([data-field=outsideLater],[data-field=term10]))>button,html body.homework-space-fit:has(#main>.card-number-rows>article:only-child) #tools .field-choices:has(>button[data-field=pattern])>button{flex:0 0 auto!important;min-width:44px!important}
  @media(max-width:640px){
   html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important;gap:4px!important}
   html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main>.card-prediction-label{display:none}
   html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#tools{align-content:start}
  }
 }
 @media print{
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .play-pane-switch,html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools>.play-answer-parts{display:none!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#main,html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) .work>#tools{display:flex!important;grid-area:auto!important;min-height:0}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #tools>.play-answer-part{display:block!important}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main .card-shape-source>.sequence{grid-template-columns:none!important;grid-auto-flow:column;grid-auto-columns:minmax(0,66px);grid-template-rows:auto!important;justify-content:center}
  html body.homework-space-fit:has(#main>.card-shape-source,#main>.card-number-rows>article:only-child) #main .card-shape-source .sequence .symbol svg{width:42px!important;height:42px!important}
 }
 `;
 function install(ids,compactIds){
  if(!ids.includes(window.ML_CONFIG?.id)||!document.querySelector('.play-answer-parts,.shape-workspace'))return;
  document.body.classList.toggle('homework-compact-buttons',compactIds.includes(window.ML_CONFIG.id));
  document.body.classList.add('homework-space-fit');let queued=false,printing=false;
  function fit(){queued=false;if(printing)return;const body=document.body,tools=document.getElementById('tools'),main=document.getElementById('main');if(!tools)return;
   const task=ML_CONFIG.patterningWorksheet?.tasks.find(t=>t.id===ML_CONFIG.patterningTask),digits=Math.max(2,...(task?.values||[]).map(v=>String(v).length));
   body.classList.toggle('homework-parallel-page',!!task?.cardPatternRows);
   for(const row of main?.querySelectorAll(':scope>.sequence,.card-parallel-values')||[]){
    if(row.classList.contains('card-parallel-values'))row.style.setProperty('--homework-row-cols',main.clientWidth>=650?6:3);
    const cell=row.firstElementChild;if(cell)row.style.setProperty('--homework-number-size',Math.floor(Math.max(24,Math.min(112,cell.clientHeight*.48,(cell.clientWidth-16)/(digits*.65))))+'px');
   }
   for(const bank of main?.querySelectorAll(':scope>.tile-bank .bank')||[]){const n=bank.children.length;if(n)bank.style.setProperty('--homework-bank-cols',Math.ceil(n/Math.ceil(n/Math.min(5,n))));}
   body.classList.remove('homework-all-answers');
   if(body.classList.contains('homework-compact-buttons')||main?.querySelector(':scope>.card-shape-source,:scope>.card-number-rows>article:only-child'))return;
   const parts=[...tools.querySelectorAll(':scope>.play-answer-part')];
   if(parts.length<2||parts.length>4||innerWidth<=850||innerHeight<=500||!tools.getClientRects().length)return;
   for(const choices of tools.querySelectorAll('.field-choices:not(:has(.symbol))'))choices.style.setProperty('--homework-answer-cols',Math.min(3,choices.children.length));
   body.classList.add('homework-all-answers');
   const edge=tools.getBoundingClientRect().bottom-parseFloat(getComputedStyle(tools).paddingBottom)+2;
   if(parts.some(p=>p.getBoundingClientRect().bottom>edge)||tools.scrollHeight>tools.clientHeight+2)body.classList.remove('homework-all-answers');
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
  new MutationObserver(schedule).observe(document.getElementById('tools'),{childList:true,subtree:true});
  const observer=new ResizeObserver(schedule);observer.observe(document.body);if(document.getElementById('main'))observer.observe(document.getElementById('main'));addEventListener('resize',schedule);
  addEventListener('beforeprint',()=>{printing=true});addEventListener('afterprint',()=>{printing=false;schedule()});
  document.fonts.ready.then(schedule);if(window.ML_PROJECT_FONT_READY)ML_PROJECT_FONT_READY.then(schedule);schedule();
  window.ML_HOMEWORK_SPACE_FIT={refresh:schedule};
 }
 for(const[name,html]of Object.entries(ML_ENGINES))if(html.includes('play-answer-parts')||html.includes('shape-workspace'))ML_ENGINES[name]=html.replace('</head>','<style id="homeworkSpaceFit">'+css+'</style></head>').replace('</body>','<script>('+install.toString()+')('+JSON.stringify(ids)+','+JSON.stringify(compactIds)+');</'+'script></body>');
 const coachCSS=String.raw`
 @media screen{
  .homework-tap-tabs{flex-wrap:wrap!important;row-gap:3px!important}
  @media(min-width:680px){
   @layer homework-header-layout{
    header.homework-split-header{
     display:grid!important;grid-template-columns:minmax(0,1fr) clamp(238px,24vw,328px)!important;
     grid-template-rows:auto auto auto auto!important;align-content:center!important;
     align-items:start!important;column-gap:12px!important;row-gap:2px!important;
     min-height:0!important;padding:5px 8px!important;
    }
    header.homework-split-header > :is(#source,#title,#alignment,#prompt){
     grid-column:1!important;grid-row:auto!important;min-width:0!important;margin-block:0!important;
    }
    header.homework-split-header > .homework-tap-tabs{
     grid-column:2!important;grid-row:1/-1!important;width:100%!important;min-width:0!important;
     align-self:center!important;justify-content:center!important;margin:0!important;gap:4px!important;
    }
    header.homework-split-header > .homework-tap-tabs > button{
     flex:0 0 auto!important;width:auto!important;max-width:100%!important;padding:3px 9px!important;
    }
    header.homework-split-header > :is(.ml-learning-art,.mathology-story){display:none!important}
   }
  }
  .homework-tap-coach{display:flex;align-items:center;justify-content:center;gap:5px;flex:0 0 auto;grid-column:1/-1;box-sizing:border-box;width:100%;min-width:0;min-height:42px;margin:0;padding:0 4px;border-radius:7px;background:#fff1ce;color:#43305b;font-size:clamp(12px,1.35vw,16px);font-weight:bold;line-height:1.14}
  .homework-tap-tabs>.homework-tap-coach{flex-basis:100%}
  .tile-bank:has(>.homework-tap-coach)>.hint{display:none!important}
  #tools:has(>.play-answer-parts.homework-tap-tabs)>.play-answer-part{grid-column:1/-1}
  .homework-tap-coach img,.homework-tap-coach svg{display:block;flex:none;object-fit:contain;width:44px;height:42px}
  .homework-tap-coach svg{width:32px;height:32px}
  @media(max-height:420px){
   html body.homework-space-fit[data-play=chart-hops]:not(.no-tools) .play-pane-switch{display:flex!important}
   html body.homework-space-fit[data-play=chart-hops] .work{grid-template-columns:minmax(0,1fr)!important}
   html body.homework-space-fit[data-play=chart-hops] .play-pane-switch button{min-height:32px!important}
   html body.homework-space-fit[data-play=chart-hops] .play-chart-hop{grid-template-rows:minmax(0,1fr);height:100%}
   html body.homework-space-fit[data-play=chart-hops] .play-chart-panel{grid-template-rows:auto minmax(0,1fr);min-height:0;gap:2px}
   html body.homework-space-fit[data-play=chart-hops] .play-chart{height:100%;min-height:0;max-height:100%;gap:1px}
   html body.homework-space-fit[data-play=chart-hops] .play-chart button{min-height:0!important;padding:0!important;line-height:1;font-size:clamp(10px,2.7vh,14px)!important}
   html body.homework-space-fit[data-play=chart-hops] .play-hop-side{min-height:0;gap:3px}
   html body.homework-space-fit[data-play=chart-hops] .play-model-tabs button{min-height:28px!important}
   html body.homework-space-fit[data-play=chart-hops][data-pane=model] #tools,html body.homework-space-fit[data-play=chart-hops][data-pane=answers] #main{display:none!important}
  }
  @media(max-height:420px){.homework-tap-coach{min-height:29px;font-size:12px}.homework-tap-coach img{width:31px;height:29px}.homework-tap-coach svg{width:24px;height:24px}}
 }
 @media print{.homework-tap-coach{display:none!important}}
 `;
 function installTapCoaches(){
  const tabs=[
   ['.play-model-tabs','Tap a button to switch models.'],
   ['.play-answer-parts,.engaging-answer-tabs','Tap each part to answer it.'],
   ['.play-pane-switch','Tap Build & look or My answers.'],
   ['.nov1-pane-tabs,.term-view-tabs,.pattern-device-tabs','Tap a button to switch views.'],
   ['.card-model-switch,.model-tabs','Tap a button to switch models.'],
   ['.card-parallel-pager','Tap a button to switch patterns.'],
   ['.card-table-pager','Tap a button to see those rows.']
  ];
  const choices=[
   ['.reading-month-grid','Tap a date on the calendar.'],
   ['.tile-bank','Tap a tile to pick it up, or drag it into a space.'],
   ['.play-chart','Tap a number on the chart.'],
   ['.rv-trades','Tap a trade button to regroup the blocks.'],
   ['.rv-jumps','Tap a button to choose the size of your jump.'],
   ['.work:has(.card-shape-source) .field-choices:has([data-field="picture"])','Tap a picture.'],
   ['.field-choices','Tap the button that matches your answer.'],
   ['.dot-board','Tap a space to build your model.'],
   ['.sequence,.reading-options,.rv-options,.rv-answers','Tap a button to choose your answer.']
  ];
  const finger='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="17" width="18" height="5" rx="2.5" fill="#b4dcec" stroke="#254d66" stroke-width="1.5"/><path d="M17 2H9L6 5v5a1.5 1.5 0 0 0 3 0V8h2v9a1.5 1.5 0 0 0 3 0v-5h2a3 3 0 0 0 3-3V5Z" fill="#ffdda6" stroke="#67432c" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 16l-1-2m18 2 1-2" fill="none" stroke="#9d4f22" stroke-width="1.5" stroke-linecap="round"/></svg>';
  function makeCue(instruction){
   const cue=document.createElement('p');
   cue.className='homework-tap-coach';
   const rocky=document.createElement('img');
   rocky.src='assets/sports/rocky-tapping.webp';rocky.alt='';rocky.draggable=false;
   const text=document.createElement('span');text.textContent=instruction;
   cue.append(rocky);cue.insertAdjacentHTML('beforeend',finger);cue.append(text);
   return cue;
  }
  function visibleButtons(group){
   return [...group.querySelectorAll('button')].some(button=>!button.disabled&&button.getClientRects().length);
  }
  let queued=false,fallbackGroup=null,fallbackCue=null;
  function update(){
   queued=false;
   const header=document.querySelector("header");
   let visibleTabs=false,headerTabs=false;
   for(const [selector,instruction] of tabs){
    for(const group of document.querySelectorAll(selector)){
     if(group.querySelectorAll('button').length<2)continue;
     if(!group.querySelector(':scope>.homework-tap-coach')){
      const locked=group.querySelector('[data-play-part="2"]:disabled');
      group.classList.add('homework-tap-tabs');group.prepend(makeCue(locked?'Choose an answer in Part 2 to unlock Part 3.':instruction));
     }
     if(visibleButtons(group)){visibleTabs=true;headerTabs ||= group.parentElement===header;}
    }
   }
   header?.classList.toggle('homework-split-header',headerTabs);
   if(header&&document.body.dataset.play==='attributes'){
   if(!header.querySelector('[data-attribute-coach]')){const cue=makeCue('Tap the answer for each row.');cue.dataset.attributeCoach='';header.append(cue);}
   visibleTabs=true;
  }
  let target=null,instruction='';
   if(!visibleTabs){
    for(const [selector,hint] of choices){
     target=[...document.querySelectorAll(selector)].find(visibleButtons);
     if(target){instruction=hint;break;}
    }
   }
   if(target===fallbackGroup&&(!target||fallbackCue?.isConnected))return;
   fallbackCue?.remove();fallbackGroup=target;fallbackCue=null;
   if(target){
    fallbackCue=makeCue(instruction);
    const bank=target.matches('.tile-bank')?target.querySelector(':scope>.bank'):null;
    (bank||target).before(fallbackCue);
   }
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','data-pane','data-nov1-pane']});
  addEventListener('resize',schedule);update();
 }
 const pictureVisual=':is(.symbol,img,svg,canvas)';
 const pictureGroup=':is(.bank,.field-choices,.ml-answer-options,.mc-bank,.rv-answers,.skills-round-answers,.choices,.options)' +
  ':has(>button '+pictureVisual+')';
 const pictureButton=pictureGroup+' > button:has('+pictureVisual+')';
 const pictureChoiceCSS=`
 @media screen{
  @layer homework-picture-choices{
   ${pictureGroup}{display:flex!important;flex-wrap:wrap;justify-content:center!important;align-items:center;gap:6px!important}
   ${pictureButton}{
    display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 auto!important;
    inline-size:fit-content!important;min-inline-size:44px!important;max-inline-size:100%!important;
    block-size:auto!important;min-block-size:44px!important;padding:4px 8px!important;
   }
   ${pictureButton} .symbol{
    display:inline-grid!important;place-items:center;inline-size:clamp(32px,4vw,48px)!important;
    block-size:clamp(32px,4vw,48px)!important;flex:none;
   }
   ${pictureButton} .symbol svg{inline-size:100%!important;block-size:100%!important}
   ${pictureButton} > :is(img,svg,canvas){
    inline-size:auto!important;block-size:auto!important;max-inline-size:84px!important;max-block-size:54px!important;object-fit:contain;
   }
   @media(max-height:420px){
    ${pictureGroup}{gap:3px!important}
    ${pictureButton}{padding-inline:4px!important}
   }
   @media(min-width:641px) and (max-height:420px){
    body.task-card-page:has(#main>.card-letter-code) .play-pane-switch button{min-height:34px!important}
    body.task-card-page #main:has(>.card-letter-code){
     display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) auto;grid-template-rows:auto auto;
     align-content:center;align-items:center;gap:4px 6px!important;padding:5px!important;
    }
    body.task-card-page #main>.card-letter-code{grid-column:1;grid-row:1;gap:3px}
    body.task-card-page #main>.card-letter-code strong{font-size:15px!important;padding:2px!important;min-height:0!important}
    body.task-card-page #main:has(>.card-letter-code)>.card-scene-label{grid-column:1;grid-row:2;font-size:11px!important;margin:0}
    body.task-card-page #main:has(>.card-letter-code)>.sequence{
     grid-column:2;grid-row:1/-1;grid-template-columns:none!important;grid-auto-flow:column;
     grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)!important;gap:3px!important;
    }
    body.task-card-page #main:has(>.card-letter-code)>.tile-bank{grid-column:3;grid-row:1/-1;padding:3px!important}
   }
  }
 }
 `;
 const answerContextCSS=" @media screen{\n @layer homework-answer-context{\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) header #prompt{display:block!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work{\n   display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.18fr)!important;\n   grid-template-rows:minmax(0,1fr)!important;gap:6px!important;\n  }\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main{\n   display:flex!important;flex-direction:column!important;grid-area:1/1!important;\n   min-width:0!important;min-height:0!important;padding:5px!important;gap:5px!important;\n  }\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#tools{\n   grid-area:1/2!important;min-width:0!important;min-height:0!important;\n   align-content:start!important;justify-content:flex-start!important;padding:5px!important;gap:5px!important;\n  }\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main:is(:has(>.dots-layout),:has(>.growth-board),:has(>.term-table)){display:grid!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main>.tile-bank{margin:0!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#tools .field-choices:not(:has(.symbol)){\n   display:flex!important;flex-wrap:wrap!important;align-items:start!important;justify-content:flex-start!important;gap:4px!important;\n  }\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#tools .field-choices:not(:has(.symbol))>button{\n   flex:0 1 auto!important;width:auto!important;min-width:44px!important;max-width:100%!important;\n   min-height:34px!important;padding:3px 8px!important;white-space:normal!important;line-height:1.18!important;\n  }\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main:has(>.growth-board){grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:minmax(36px,1fr) auto minmax(0,1fr)!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>.figure-strip{grid-area:1/1/2/-1!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>.growth-title{grid-area:2/1!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>.growth-board{grid-area:3/1/4/-1!important}\n  html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>.mobile-piece-bank{grid-area:2/2!important}\n  @media(max-height:460px){\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .ml-letter-parts:has(>.homework-tap-coach)>.ml-letter-part-help{display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers){grid-template-rows:auto minmax(0,1fr)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools>.composition-answers{display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers) .field:has(>.unit-answer-pad){\n    display:grid!important;grid-template-columns:minmax(65px,.85fr) minmax(42px,.6fr) minmax(0,1.6fr)!important;\n    gap:3px!important;align-items:center!important;padding:2px!important;\n   }\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers) .field .unit-answer-pad{min-height:30px!important;font-size:12px!important;padding:2px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers) .field-choices button{min-height:26px!important;padding:2px 4px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-trail{grid-template-columns:repeat(var(--n),minmax(0,1fr))!important;grid-template-rows:minmax(0,1fr)!important;align-items:center!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-hop{gap:2px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-hop .term{font-size:14px!important;padding:2px!important;min-height:23px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-hop .term input{font-size:14px!important;min-height:20px!important;height:20px!important;padding:0!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-hop .play-jump{font-size:10px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table{\n    display:grid!important;grid-template-columns:minmax(56px,1.2fr) repeat(var(--homework-term-columns,6),minmax(0,1fr));\n    grid-template-rows:auto repeat(2,minmax(24px,auto));grid-auto-flow:column;width:100%!important;height:auto!important;align-self:center;\n   }\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table :is(thead,tbody,tr){display:contents!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table caption{grid-area:1/1/2/-1}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table thead th:first-child{grid-area:2/1}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table thead th:nth-child(2){grid-area:3/1}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table tbody th{grid-row:2}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table tbody td{grid-row:3}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field{display:grid!important;grid-template-columns:minmax(68px,.78fr) minmax(0,1.45fr)!important;align-items:center!important;padding:2px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field>span{font-size:12px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field-choices button{min-height:25px!important;padding:1px 4px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>:is(.tile-bank,.mobile-piece-bank,.unit-counter-bank){display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main:has(>.nov1-lesson){grid-template-rows:0 minmax(0,1fr)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main .card-table-tip,html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop .play-tip{display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main .card-table-wrap{padding:0!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main .card-table-panes{width:100%!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main .card-value-table :is(th,td){font-size:12px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main .card-value-table .term>strong{font-size:17px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>.card-jump-labels{gap:3px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #main>.card-jump-labels b{padding:1px 3px!important;font-size:12px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) :is(#tools>.homework-tap-tabs,#main .play-model-tabs){flex-direction:row!important;row-gap:2px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) :is(#tools>.homework-tap-tabs,#main .play-model-tabs)>button{\n    flex:0 1 auto!important;width:auto!important;min-height:28px!important;padding:2px 6px!important;font-size:12px!important;\n   }\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) :is(#tools>.homework-tap-tabs,#main .play-model-tabs)>.homework-tap-coach{min-height:20px;font-size:11px}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) :is(#tools>.homework-tap-tabs,#main .play-model-tabs)>.homework-tap-coach :is(img,svg){width:20px;height:20px}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-trail{gap:3px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-hop .term{min-height:26px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .composition-answers{margin:0!important;line-height:1.1}\n   html body.term-table-page .term-view-tabs{display:flex!important}\n   html body.term-table-page[data-term-panel=table] #tools{display:none!important}\n   html body.term-table-page[data-term-panel=table] .work{grid-template-columns:minmax(0,1fr)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .work>#main{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #main>.model-region{display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table :is(th,td){height:auto!important;padding:1px!important;font-size:12px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page .term-table :is(.term,input){min-height:16px!important;font-size:14px!important;padding:0!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools>.extra-fields{align-content:start!important;gap:4px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field{gap:2px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field-choices button{min-height:27px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main .sequence>.term{min-height:30px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main .tile-bank .bank button{min-height:34px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main>.card-jump-labels{font-size:12px!important;margin:0!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#tools .field-choices:not(:has(.symbol))>button{font-size:clamp(12px,1.4vw,16px)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main>.nov1-lesson{display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main:has(>.nov1-lesson){grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main .dot-panel{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) auto!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main .dot-controls{grid-area:3/1!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#main .dot-board{grid-area:2/1!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-has-table=true]{display:flex!important;flex-direction:column!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-has-table=true] .play-hop-side{display:contents!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-has-table=true] .play-model-tabs{order:0!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-has-table=true] .phone-chart-view{display:block!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-has-table=true]:not([data-current-model=chart]) .play-chart-panel,html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-current-model=chart] .play-model-content{display:none!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .play-chart-hop[data-has-table=true] :is(.play-chart-panel,.play-model-content){order:1!important;min-height:0;flex:1 1 0}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs){display:grid!important;grid-template-columns:minmax(83px,.31fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;align-items:start!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs)>.engaging-answer-tabs{grid-area:1/1!important;align-self:start!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs)>.extra-fields{grid-area:1/2!important;display:block!important;min-height:0!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs) .field:has(>.unit-answer-pad){grid-template-columns:minmax(0,1fr) minmax(62px,.48fr)!important;grid-template-rows:auto auto!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs) .field:has(>.unit-answer-pad)>.field-choices{grid-column:1/-1!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs) .field>span:first-child{font-size:12px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field-choices:not(:has(.symbol)),html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs) .field-choices:not(:has(.symbol)){\n    display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;align-items:stretch!important;\n   }\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*).term-table-page #tools .field-choices:not(:has(.symbol))>button,html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs) .field-choices:not(:has(.symbol))>button{\n    justify-self:start;width:fit-content!important;min-width:min(44px,100%)!important;min-height:25px!important;\n    max-width:100%!important;padding:2px 4px!important;font-size:11px!important;line-height:1.08!important;\n   }\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs){position:relative!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs)>.engaging-answer-tabs{position:absolute!important;inset:5px auto auto 5px!important;width:84px!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) #tools:has(>.composition-answers):has(>.engaging-answer-tabs)>.extra-fields{grid-area:1/1/2/-1!important;align-self:start!important;flex:none!important;margin:0 0 0 90px!important;width:calc(100% - 90px)!important}\n  }\n  @media(max-width:620px){\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) minmax(0,1.15fr)!important}\n   html body:is([data-pane=answers],[data-nov1-pane=answers],[data-term-panel=answers],[data-pattern-pane=tools]):has(.work>#main>*) .work>#tools{grid-area:2/1!important}\n  }\n }\n }";
 const novemberCSS=String.raw`
@media screen{
@layer november-homework{
html body:has(.reading-month-grid) .reading-work{display:grid!important;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:8px!important;min-height:0!important}
html body:has(.reading-month-grid) .calendar-story{display:none!important}
html body #readingCalendar:not([hidden]){grid-area:1/1!important;display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) auto!important;align-content:stretch!important;gap:3px 8px!important;min-height:0!important;padding:5px!important}
html body #readingCalendar>.reading-month{grid-area:1/1!important;align-self:center;font-size:clamp(12px,2.7vh,22px)!important}
html body #readingCalendar>.homework-tap-coach{grid-area:1/2!important;margin:0!important;min-height:0!important;font-size:clamp(10px,2.3vh,17px)!important;line-height:1.05!important}
html body #readingCalendar>.homework-tap-coach :is(img,svg){width:clamp(18px,5vh,36px)!important;height:clamp(18px,5vh,36px)!important}
html body #readingCalendar>.reading-month-grid{grid-area:2/1/3/-1!important;min-height:0!important;height:100%!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:auto!important;grid-auto-rows:minmax(0,1fr)!important;gap:3px!important}
html body #readingCalendar .calendar-weekday{font-size:clamp(10px,2.4vh,17px)!important;line-height:1.05!important}
html body #readingCalendar [data-calendar-date]{min-height:0!important;min-width:0!important;height:100%!important;padding:0!important;font-size:clamp(12px,3.4vh,26px)!important;line-height:1!important;box-shadow:none!important}
html body #readingCalendar>small{grid-area:3/1/4/-1!important;margin:0!important;font-size:clamp(10px,2.3vh,15px)!important;line-height:1.1!important}
html body:has(.reading-month-grid) .reading-answer{grid-area:1/2!important;align-self:center!important;display:flex!important;flex-direction:column!important;align-items:start!important;width:100%!important;min-width:0!important;gap:6px!important;box-sizing:border-box}
html body:has(.reading-month-grid) .reading-answer .ml-answer-options{display:flex!important;flex-wrap:wrap!important;gap:5px!important;width:100%!important;min-width:0!important}
html body :is(.reading-answer .ml-answer-options,.field-choices,.tile-bank .bank,.play-pane-switch,.play-model-tabs,.ml-letter-parts,.homework-tap-tabs){display:flex;flex-wrap:wrap;align-content:start;justify-content:start}
html body :is(.reading-answer .ml-answer-options,.field-choices,.tile-bank .bank,.play-pane-switch,.play-model-tabs,.ml-letter-parts,.homework-tap-tabs):not(:has(.math-expression))>button{flex:0 1 auto!important;width:fit-content!important;min-width:min(42px,100%)!important;max-width:100%!important;min-height:clamp(30px,8vh,44px)!important;height:auto!important;padding:3px 10px!important;white-space:normal!important;line-height:1.14!important}
html body :is(.field-choices,.tile-bank .bank):not(:has(.math-expression)){display:flex!important;gap:5px!important;align-items:flex-start!important}
html body .ml-letter-parts{display:flex!important;gap:5px!important}
html body .ml-letter-parts:has(>.homework-tap-coach)>.ml-letter-part-help{display:none!important}
html body .card-game-deck{display:inline-block;vertical-align:middle;width:auto;height:1.65em;margin-inline-end:.35em}
html body .card-table-tip .card-game-deck{width:100%;height:100%;margin:0}
html body .fives-columns{grid-template-columns:minmax(0,.76fr) minmax(0,1fr)!important;gap:6px!important}
html body .fives-figures article{gap:3px!important;padding:4px!important}
html body .fives-build{display:grid!important;grid-template-rows:auto auto minmax(0,1fr)!important;gap:3px!important;justify-content:stretch!important;align-items:stretch!important;padding:4px!important;min-height:0!important}
html body .fives-build h2{margin:0!important;padding:0 34px!important;line-height:1.12!important}
html body .fives-build .hint{margin:0!important;font-size:clamp(11px,2.7vh,16px)!important;line-height:1.12!important;text-align:center}
html body .fives-board{min-width:0!important;width:100%!important;max-width:none!important;min-height:0!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;box-sizing:border-box!important;align-content:center!important;justify-content:center!important;grid-template-columns:repeat(5,var(--five-cell,24px))!important;grid-template-rows:repeat(5,var(--five-cell,24px))!important;gap:3px!important;padding:0!important}
html body .fives-board .dot-cell{border-radius:7px!important;box-shadow:none!important}
html body .fives-value-table{font-size:clamp(12px,3.4vh,19px)!important;border-spacing:2px!important}
html body .fives-value-table :is(th,td){padding:2px!important;line-height:1.1!important}
html body :is([data-dot][aria-pressed=false],[data-unit-answer-pad]:empty,[data-answer-drop]:empty,[data-block-drop]:empty,[data-dropzone]:empty,[data-card-slot]:not(.given),.term[data-slot]:not(.given),.unit-answer-pad):not([aria-pressed=true],.correct,.wrong,.selected,[aria-disabled=true],[data-week-drop-over]){background:#d5f2f6!important;outline:2px dashed #287182!important;outline-offset:-2px!important}
html body :is(.growth-board [data-growth-slot][aria-pressed=false]:not([data-week-drop-over]))>rect{fill:#d5f2f6!important;stroke:#287182!important}
html body [data-week-drop-over]{background:#ffdf91!important;outline:3px solid #784b07!important;outline-offset:-3px!important}
html body [data-week-drop-over]>rect{fill:#ffdf91!important;stroke:#784b07!important}
html body .tile-bank:has(.bank){width:fit-content!important;max-width:100%!important;margin-inline:auto!important;align-self:center!important}
/* Give the model its own row above the supply. A zero-basis model must grow. */
html body #main:has(>.tile-bank)>:is(.sequence,.card-parallel-patterns){flex:1 1 0!important;min-height:0!important}
html body #main:has(>.tile-bank)>.tile-bank{flex:0 0 auto!important}
html body #main:has(>.tile-bank)>:is(.sequence,.card-parallel-patterns) .term{align-self:stretch}
html body #main:has(>.tile-bank>.bank)>.tile-bank{width:max-content!important;max-width:100%!important}
html body #main:has(>.tile-bank) .sequence>.term:has(.symbol){min-height:0!important;height:auto!important;max-height:none!important}
@media(min-height:421px){
 html body #main:has(>.tile-bank)>:is(.sequence,.card-parallel-patterns){max-height:clamp(145px,54vh,340px)}
}
@media(max-height:420px){
 html body #main:has(>.tile-bank)>:is(.card-hockey-sequence,.sequence)>.term{min-height:0!important}
 html body[data-play=five-markers] #main>.play-tip{margin:0!important;font-size:11px!important;line-height:1.12!important}
 html body #main>.card-hockey-sequence>.term>strong{font-size:clamp(15px,5vh,23px)!important}
 html body #main>.card-hockey-sequence>.term>small{font-size:10px!important;line-height:1!important}
 html body #main>.card-hockey-sequence .card-hockey-picture{flex-basis:30px}
}
html body .fives-build{grid-template-columns:minmax(0,1fr) 41px!important}
html body .fives-build>:is(h2,.hint){grid-column:1/-1!important}
html body .fives-build h2{padding:0!important}
html body .fives-build .fives-board{grid-area:3/1!important;justify-content:end!important}
html body .fives-build>.dot-supply{position:static!important;grid-area:3/2!important;align-self:center!important;justify-self:start!important}
html body .fives-figures .symbol{max-height:none!important}
html body .fives-figures svg{filter:none!important}
html body.task-card-page #main:has(>.card-table-wrap){display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto!important;align-content:stretch!important;gap:5px!important}
html body.task-card-page #main:has(>.card-table-wrap)>.card-table-pager:has(button){grid-area:1/1}
html body.task-card-page #main:has(>.card-table-wrap)>.card-table-wrap{grid-area:1/1!important;align-self:stretch!important;height:100%!important;min-height:0!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:4px!important}
html body.task-card-page #main:has(>.card-table-wrap)>.tile-bank{grid-area:2/1!important;justify-self:center!important}
html body.task-card-page #main .card-table-tip{display:none!important}
html body.task-card-page #main .card-table-panes{height:100%!important;min-height:0!important;grid-template-columns:repeat(var(--table-panes),minmax(0,1fr))!important}
html body.task-card-page #main .card-table-pager{display:none!important}
html body.task-card-page #main .card-value-table{display:grid!important;height:100%!important;min-height:0!important;grid-template-rows:auto auto repeat(var(--card-value-rows),minmax(0,1fr))!important}
html body.task-card-page #main .card-value-table :is(th,td){padding:1px!important;min-height:0!important}
html body.task-card-page #main .card-value-table .term{min-height:0!important;padding:0!important}
html body.task-card-page #main .card-value-table .term>strong{font-size:clamp(12px,4vh,23px)!important}
html body .card-book{display:block;width:auto;height:clamp(17px,7vh,48px);max-width:100%;margin:0 auto 2px}
html body .card-number-rows:has(.card-book) article{padding:4px!important}
html body .card-number-rows:has(.card-book) article>div>strong{padding:3px 2px!important;line-height:1.05!important}
html body .card-number-rows:has(.card-book) h2{margin-bottom:3px!important}
html body .reading-work>.reading-answer .ml-answer-options>button{font-size:clamp(12px,3vh,18px)!important}
@media(max-height:420px){
html body:has(.reading-month-grid) .reading-work{align-content:stretch!important;align-items:stretch!important}
html body:has(.reading-month-grid) .reading-answer{max-height:100%!important;padding:4px!important}
html body:has(.reading-month-grid) .reading-answer .ml-answer-options>button{min-height:26px!important;padding:2px 5px!important}
html body .card-number-rows{gap:4px!important}
html body .card-number-rows article{padding:4px!important}
html body .card-number-rows strong{padding:3px 1px!important;font-size:clamp(13px,4vh,21px)!important}
}

html body:has(.reading-month-grid) .reading-answer>span{flex:none!important;width:auto!important;height:auto!important}
html body:has(.reading-month-grid) .reading-answer .ml-answer-options.a8-inline-choices{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;align-content:center!important;justify-items:start!important;flex:none!important}
html body:has(.reading-month-grid) .reading-answer .ml-answer-options.a8-inline-choices>button{min-width:0!important;width:fit-content!important;height:auto!important;min-height:clamp(26px,6vh,40px)!important;padding:2px 6px!important}
html body.task-card-page #main .card-horizontal-table{display:table!important;height:auto!important;width:100%;align-self:center;table-layout:fixed}
html body.task-card-page #main .card-horizontal-table :is(tbody,tr){display:revert!important}
html body.task-card-page #main .card-horizontal-table :is(th,td){display:table-cell!important;height:clamp(28px,9vh,58px);overflow:visible}
html body.task-card-page #main .card-horizontal-table :is(th,td):first-child{width:18%;overflow-wrap:break-word}
html body.task-card-page #main .card-horizontal-table .term{min-height:23px!important}
html body.task-card-page #main .card-horizontal-table .card-game-deck{height:clamp(22px,8vh,54px)}
html body.task-card-page #main:has(.card-horizontal-table)>.card-table-wrap{display:grid!important;padding:0!important}
@media(max-height:420px){
html body:has(.fives-board) header .homework-tap-coach{min-height:22px!important;font-size:11px!important}
html body:has(.fives-board) header .homework-tap-coach :is(img,svg){width:22px!important;height:22px!important}
html body:has(.fives-board) .fives-columns{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto!important;gap:3px!important}
html body:has(.fives-board) .fives-build{grid-area:1/2/3/3!important;grid-template-rows:auto auto minmax(0,1fr)!important;padding:2px!important}
html body:has(.fives-board) .fives-value-table{grid-area:2/1!important;font-size:10px!important}
html body:has(.fives-board) .fives-value-table caption{font-size:8px!important;line-height:1!important}
html body:has(.fives-board) .fives-value-table th:first-child{width:33px!important}
html body:has(.fives-board) .fives-value-table :is(th,td){padding:0 1px!important}
html body:has(.fives-board) .fives-figures{gap:3px!important}
html body:has(.fives-board) .fives-figures article{padding:1px!important;gap:1px!important}
html body:has(.fives-board) .fives-figures :is(h2,b){font-size:10px!important;line-height:1!important;text-align:center}
html body:has(.fives-board) .fives-board{gap:2px!important}
html body:has(.fives-board) .fives-board .dot-cell{border-radius:4px!important}
html body:has(.fives-board) .fives-build>.dot-supply{width:31px!important;height:31px!important;min-width:31px!important;min-height:31px!important}
html body:has(.fives-board) .fives-build{grid-template-columns:minmax(0,1fr) 32px!important}
html body:has(.fives-board) .fives-build .hint{font-size:9px!important}
html body.term-table-page[data-term-panel=table] #main{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto!important}
html body.term-table-page[data-term-panel=table] .term-table{display:grid!important;grid-template-columns:minmax(44px,1.25fr) repeat(var(--homework-term-columns),minmax(0,1fr));grid-template-rows:auto repeat(2,minmax(24px,auto));grid-auto-flow:column;height:auto!important;align-self:center!important}
html body.term-table-page[data-term-panel=table] .term-table :is(thead,tbody,tr){display:contents!important}
html body.term-table-page[data-term-panel=table] .term-table caption{grid-area:1/1/2/-1}
html body.term-table-page[data-term-panel=table] .term-table thead th:first-child{grid-area:2/1}
html body.term-table-page[data-term-panel=table] .term-table thead th:nth-child(2){grid-area:3/1}
html body.term-table-page[data-term-panel=table] .term-table tbody th{grid-row:2}
html body.term-table-page[data-term-panel=table] .term-table tbody td{grid-row:3}
html body.term-table-page[data-term-panel=table] .term-table :is(th,td){height:auto!important;padding:1px!important;font-size:12px!important;width:auto!important}
html body.term-table-page[data-term-panel=table] .term-table :is(input,.term){min-height:19px!important;font-size:14px!important;padding:0!important}
html body.term-table-page[data-term-panel=table] .model-region .model svg{max-height:40px!important}
html body.term-table-page[data-term-panel=table] .model-region .model{padding:2px!important}
html body.term-table-page[data-term-panel=table] .model-tabs button{min-height:23px!important;padding:1px 4px!important}
html body:has(.rv-mats) .rv-work{flex:1 1 0!important;min-height:0!important}
html body:has(.rv-mats) .rv-mat{padding:2px!important;gap:2px!important}
html body:has(.rv-mats) .rv-mat h2{font-size:12px!important}
html body:has(.rv-mats) .rv-mat .homework-tap-coach{min-height:0!important;font-size:10px!important}
html body:has(.rv-mats) .rv-mat .homework-tap-coach :is(img,svg){width:17px!important;height:17px!important}
html body:has(.rv-mats) .rv-place>b{font-size:10px!important;line-height:1!important}
html body:has(.rv-mats) .rv-face{--u:2px!important}
html body:has(.rv-mats) .rv-block{min-width:12px!important;min-height:10px!important}
html body:has(.rv-mats) .rv-trades button{font-size:10px!important;min-height:20px!important;padding:1px 4px!important}
html body:has(.rv-mats) header{min-height:0!important;gap:2px!important}
html body:has(.rv-mats) header h1{font-size:19px!important;line-height:1.05!important}
html body:has(.rv-mats) header p{font-size:13px!important;line-height:1.1!important}
html body:has(.rv-mats) .rv-answers{gap:3px!important;padding:2px!important}
html body:has(.rv-mats) .rv-answers button{min-height:22px!important;font-size:14px!important;padding:1px 5px!important}
html body .play-chart-hop[data-has-table=true] .phone-chart-view{display:block!important}
html body .play-chart-hop[data-has-table=true]:not([data-current-model=chart]) .play-chart-panel,html body .play-chart-hop[data-current-model=chart] .play-model-content{display:none!important}
html body .play-chart-hop[data-has-table=true]{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important;gap:3px!important}
html body .play-chart-hop[data-has-table=true] .play-hop-side{display:contents!important}
html body .play-chart-hop[data-has-table=true] .play-model-tabs{grid-area:1/1!important;gap:3px!important}
html body .play-chart-hop[data-has-table=true] :is(.play-chart-panel,.play-model-content){grid-area:2/1!important;min-height:0!important}
html body .play-chart-hop .homework-tap-coach{min-height:0!important;font-size:10px!important}
html body .play-chart-hop .homework-tap-coach :is(img,svg){width:18px!important;height:18px!important}
html body .play-chart-hop .play-tip{display:none!important}
}

@media(max-height:420px){
html body.task-card-page #main .card-horizontal-table{align-self:start!important;border-spacing:2px!important}
html body.task-card-page #main .card-horizontal-table :is(th,td){height:clamp(19px,7vh,27px)!important}
html body.task-card-page #main .card-horizontal-table .card-game-deck{height:clamp(19px,6vh,29px)!important}
html body.task-card-page #main .card-horizontal-table caption{margin:0!important;padding:0!important;line-height:1!important}
html body.task-card-page #main:has(.card-horizontal-table)>.tile-bank{width:max-content!important;max-width:100%!important;padding:3px!important}
html body.task-card-page #main:has(.card-horizontal-table)>.tile-bank .hint{margin:0!important;line-height:1!important;font-size:10px!important}
html body.task-card-page #main:has(.card-horizontal-table)>.tile-bank .bank{justify-content:center!important;gap:3px!important}
html body .play-chart-hop .play-hop-side :is(.play-trail,.play-model-content){min-height:0!important;gap:3px!important}
html body .play-chart-hop .play-trail{min-height:0!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important}
html body .play-chart-hop .play-hop{gap:2px!important;min-height:0!important}
html body .play-chart-hop .play-hop .hop-arc{font-size:12px!important;line-height:1!important;min-height:0!important;padding:0!important}
html body .play-chart-hop .play-hop .term{min-height:18px!important;padding:1px!important}
html body .play-chart-hop .play-hop .term :is(input,strong){min-height:0!important;font-size:14px!important;line-height:1!important;padding:0!important}
html body.term-table-page[data-term-panel=table] #main>.tile-bank{grid-column:1!important;grid-row:2!important;max-width:100%!important;margin:0!important}
html body.term-table-page[data-term-panel=table] #main>.model-region{grid-area:1/2/3/3!important;align-self:stretch!important;justify-content:center!important}
html body.term-table-page[data-term-panel=table] #main>.model-region .model-tabs{margin:0!important}
html body:has(.rv-mats) #reviewActivity>.rv-answers{flex-wrap:nowrap!important}
html body:has(.rv-mats) #reviewActivity>.rv-answers>strong{flex:0 1 auto!important;font-size:12px!important}
html body:has(.rv-mats) #reviewActivity>.rv-answers button{flex:0 1 auto!important}
html body:has(.rv-mats) #reviewActivity>.homework-tap-coach{min-height:0!important;font-size:10px!important}
html body:has(.rv-mats) #reviewActivity>.homework-tap-coach :is(img,svg){width:16px!important;height:16px!important}
html body:has(.rv-mats) .rv-mat>.homework-tap-coach{display:none!important}
html body:has(.rv-mats) .rv-trades{gap:2px!important}
html body:has(.rv-mats) .rv-trades button{width:auto!important;min-width:0!important;max-width:100%!important}
html body:has(.rv-mats) .rv-place{gap:2px!important}
html body .rv-jump-with-blocks :is(h2,.rv-jump-block-board strong){font-size:13px!important;line-height:1.1!important}
html body .rv-jump-with-blocks .rv-jumps button{width:auto!important;min-height:23px!important;font-size:11px!important;padding:2px 5px!important}
html body .rv-jump-with-blocks .homework-tap-coach{min-height:0!important;font-size:10px!important}
html body .rv-jump-with-blocks .homework-tap-coach :is(img,svg){width:16px!important;height:16px!important}
}

html body .fives-build>.dot-supply circle{fill:#e8454e;stroke:#a82736}
html body.task-card-page #main:has(.card-horizontal-table)>.tile-bank{justify-self:end!important;margin-inline:0!important}
@media(max-height:420px){
html body[data-pane=model] .fives-build{grid-template-columns:minmax(55px,.48fr) minmax(0,1fr) 32px!important;grid-template-rows:minmax(0,1fr) minmax(0,1fr)!important}
html body[data-pane=model] .fives-build>h2{grid-area:1/1!important;align-self:end}
html body[data-pane=model] .fives-build>.hint{grid-area:2/1!important;align-self:start}
html body[data-pane=model] .fives-build>.fives-board{grid-area:1/2/3/3!important}
html body[data-pane=model] .fives-build>.dot-supply{grid-area:1/3/3/4!important}
}

@media(max-height:420px){
html body .work .homework-tap-coach{min-height:0!important;font-size:clamp(10px,3.2vh,13px)!important;line-height:1.1!important;margin-block:0!important}
html body .work .homework-tap-coach :is(img,svg){width:20px!important;height:20px!important}
html body .work :is(.card-model-switch,.play-answer-parts){row-gap:3px!important;gap:3px!important}
html body .work :is(.card-model-switch,.play-answer-parts)>button{min-height:24px!important;padding:2px 6px!important;font-size:12px!important}
html body .work:has(.card-figure-work) #main{gap:4px!important}
html body .card-figure-work .card-mini-table{font-size:11px!important;border-spacing:1px!important}
html body .card-figure-work .card-mini-table :is(th,td){padding:1px!important}
html body .card-figure-work .card-known-figures article{padding:2px!important;gap:2px!important}
html body .card-figure-work .card-known-figures h2{font-size:12px!important;margin:0!important;line-height:1.05!important}
html body #tools:has(.play-answer-parts) .play-answer-part{margin:0!important}
html body #tools:has(.play-answer-part) .field{gap:3px!important;padding:2px!important}
html body #tools:has(.play-answer-part) .field>span:first-child{font-size:13px!important;line-height:1.12!important}
html body #tools:has(.play-answer-part) .field-choices{gap:3px!important}
html body #tools:has(.play-answer-part) .field-choices>button{font-size:12px!important;min-height:24px!important;padding:2px 5px!important;line-height:1.1!important}
html body #tools:has(.play-answer-part) .unit-answer-pad{min-height:25px!important;padding:1px 4px!important}
html body #main:has(>.scoreboards+.display-row)>.scoreboards{min-height:37px!important;max-height:48px!important}
html body #main:has(>.scoreboards+.display-row)>.display-row{min-height:0!important;gap:3px!important}
html body #main:has(>.scoreboards+.display-row)>.display-row .term{min-height:0!important;padding:1px!important}
html body #main:has(>.scoreboards+.display-row)>.display-row .term strong{font-size:17px!important;line-height:1!important}
}

@media(max-width:1100px){
html body.term-table-page #main>.tile-bank{padding:3px!important}
html body.term-table-page #main>.tile-bank .hint{margin:0!important;line-height:1.1!important}
}
@media(max-height:420px){
html body #main:has(>.scoreboards):has(>.display-row){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)!important;grid-template-rows:minmax(0,1fr)!important;align-items:center!important;gap:4px!important}
html body #main:has(>.scoreboards):has(>.display-row)>.scoreboards{min-height:0!important;max-height:100%!important}
html body #main:has(>.scoreboards):has(>.display-row)>.display-row{min-height:0!important;align-items:center!important;gap:3px!important}
html body #main:has(>.scoreboards):has(>.display-row)>.display-row>.term{min-height:30px!important;max-height:54px!important;padding:1px!important}
html body .play-attribute-rows{gap:3px!important}
html body .play-attribute-rows>article{padding:2px 4px!important;gap:4px!important}
html body #reviewActivity:has(>.rv-work .rv-mats){grid-template-columns:minmax(0,1fr) minmax(100px,.22fr)!important;grid-template-rows:auto minmax(0,1fr) auto!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>:is(header,footer){grid-column:1/-1!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>.rv-work{grid-area:2/1!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>.rv-answers{grid-area:2/2!important;flex-wrap:wrap!important;align-content:center!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>.rv-answers>strong{flex-basis:100%!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>.homework-tap-coach{display:none!important}
html body #reviewActivity:has(>.rv-work .rv-mats) .rv-trades button{font-size:9px!important;min-height:17px!important;line-height:1.05!important}
html body #reviewActivity:has(>.rv-work .rv-mats) .rv-trades{padding:0!important}

html body #reviewActivity:has(>.rv-work .rv-mats)>.rv-answers{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto!important;justify-items:stretch!important;gap:2px!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>.rv-answers>strong{grid-column:1/-1!important;line-height:1!important;margin:0!important}
html body #reviewActivity:has(>.rv-work .rv-mats)>.rv-answers>button{font-size:13px!important;min-height:19px!important;min-width:0!important;padding:1px 3px!important;line-height:1!important}

html body #main:has(>.scoreboards):has(>.display-row)>.scoreboards>div{padding:2px!important;gap:1px!important;min-width:0!important;min-height:0!important}
}


/* Keep the reference pictures and the answer controls visible together. */
html body #main:has(>.card-shape-source)>.card-shape-source{width:100%!important}
html body #main .card-shape-source>.sequence{grid-auto-columns:minmax(0,clamp(68px,18vw,188px))!important;width:100%!important;gap:clamp(4px,1vw,12px)!important}
html body #main .card-shape-source .sequence>.term{width:100%!important;max-width:100%!important;padding:clamp(3px,1vh,8px)!important}
html body #main .card-shape-source .sequence .symbol svg{width:clamp(62px,26vh,165px)!important;height:clamp(62px,26vh,165px)!important;max-width:100%!important}
html body #main:has(.card-forward-jumps)>.card-number-rows{width:min(100%,580px)!important;max-width:100%!important;flex:0 1 auto!important}
html body #main .card-number-rows article:has(>.card-forward-jumps){display:grid;justify-items:center;gap:5px;padding:clamp(5px,2vh,14px)!important}
html body #main .card-number-rows article:has(>.card-forward-jumps)>h2{font-size:clamp(13px,4vh,25px)!important;text-align:center}
html body #main .card-forward-jumps{display:block;width:100%;height:auto;max-height:clamp(60px,34vh,200px)}
@media(max-height:420px){
 html body #main .card-shape-source .sequence .symbol svg{width:clamp(38px,17vh,75px)!important;height:clamp(38px,17vh,75px)!important}
 html body #main>.card-prediction-label{margin:0!important;line-height:1.12}
}


@media(max-height:420px){
 html body #main:has(>.sequence)>.tile-bank{padding:3px!important;gap:3px!important}
 html body #main:has(>.sequence)>.tile-bank .hint{font-size:10px!important;line-height:1.1!important;margin:0!important}
 html body #main:has(>.sequence)>.tile-bank .bank{width:max-content!important;max-width:100%!important;gap:4px!important}
 html body #main:has(>.sequence)>.tile-bank .bank button{height:auto!important;min-height:30px!important;font-size:17px!important;padding:2px 5px!important}
 html body[data-play=five-markers] #main{justify-content:flex-start!important;gap:4px!important;padding:5px!important}
 html body[data-play=five-markers] #main>.tile-bank .bank button{min-height:32px!important;min-width:38px!important}
 html body[data-play=five-markers] #main>.tile-bank .bank .symbol,
 html body[data-play=five-markers] #main>.tile-bank .bank .symbol svg{width:28px!important;height:28px!important}
 html body[data-play=five-markers] #main>.sequence{gap:3px!important}
 html body[data-play=five-markers] #main>.sequence>.term{min-height:0!important;padding:1px!important}
 html body[data-play=five-markers] #main>.sequence>.term>small{font-size:9px!important}
}


@media(min-width:641px){
 html body .work:has(#main>.card-shape-source)>#main{justify-content:flex-start!important;padding-top:clamp(8px,3vh,22px)!important}
}
@media(max-height:420px) and (min-width:641px){
 html body[data-play=five-markers] #main:has(>.tile-bank){display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto minmax(0,1fr)!important}
 html body[data-play=five-markers] #main>.play-tip{grid-area:1/1/2/-1}
 html body[data-play=five-markers] #main>.sequence{grid-area:2/1!important}
 html body[data-play=five-markers] #main>.tile-bank{grid-area:2/2!important;max-width:112px!important;align-self:center!important}
 html body #main:has(>.card-hockey-sequence,.card-horizontal-table)>.tile-bank .bank{display:flex!important;flex-wrap:nowrap!important;width:max-content!important;max-width:100%!important}
 html body #main:has(.card-horizontal-table)>.tile-bank{min-width:190px!important}
 html body #main:has(.card-horizontal-table)>.tile-bank .bank button{flex:0 0 auto!important;min-width:35px!important;min-height:28px!important;padding:2px 5px!important}
}


/* Keep every active tablet control in the same viewport as its reference model. */
@media(max-height:420px){
 html body.task-card-page #main:has(>.card-table-wrap)>.tile-bank{padding:3px!important;gap:3px!important}
 html body.task-card-page #main:has(>.card-table-wrap)>.tile-bank .bank{width:max-content!important;max-width:100%!important;gap:3px!important}
 html body.task-card-page #main:has(>.card-table-wrap)>.tile-bank .bank button{min-height:28px!important;height:auto!important;font-size:17px!important;padding:1px 5px!important}
 html body .play-figures .play-build:has(>.dot-supply){display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto minmax(0,1fr)!important;gap:3px!important}
 html body .play-figures .play-build h2{grid-column:1/-1;padding:0!important;min-height:0!important}
 html body .play-figures .play-build>.dot-supply{position:static!important;grid-area:2/2!important;width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;align-self:center!important}
 html body .play-figures .play-build>.play-block-board{grid-area:2/1!important;max-height:100%!important}
 html body .play-attribute-rows>article>.field{display:grid!important;grid-template-columns:minmax(75px,.4fr) minmax(0,1fr)!important;align-items:center!important;gap:4px!important;padding:1px!important}
 html body .play-attribute-rows>article>.field>span:first-child{font-size:11px!important;line-height:1.05!important}
 html body .play-attribute-rows>article>.field .field-choices>button{min-height:23px!important;font-size:11px!important;padding:1px 4px!important}
 html body.term-table-page[data-term-panel=table] #main>.term-table{align-self:end!important;grid-template-rows:auto repeat(2,minmax(19px,auto))!important}
 html body.term-table-page[data-term-panel=table] #main>.term-table caption{font-size:10px!important;padding:0!important}
 html body.term-table-page[data-term-panel=table] #main>.tile-bank{padding:2px!important;justify-self:start!important}
 html body.term-table-page[data-term-panel=table] #main>.tile-bank .bank{gap:3px!important}
 html body.term-table-page[data-term-panel=table] #main>.tile-bank .bank button{min-height:24px!important;font-size:14px!important;padding:1px 4px!important}
 html body.term-table-page[data-term-panel=answers] #tools{gap:3px!important;padding:4px!important}
 html body.term-table-page[data-term-panel=answers] #tools>.extra-fields{display:flex!important;gap:3px!important;min-height:0!important}
 html body.term-table-page[data-term-panel=answers] #tools .field{grid-template-columns:minmax(88px,.65fr) minmax(0,1fr)!important;padding:1px!important;gap:3px!important}
 html body.term-table-page[data-term-panel=answers] #tools .field-choices{display:flex!important;flex-wrap:wrap!important;gap:3px!important}
 html body.term-table-page[data-term-panel=answers] #tools .field-choices>button{min-height:22px!important;line-height:1.07!important;padding:1px 4px!important}
 html body.term-table-page[data-term-panel=answers] #tools>.hint{margin:0!important;font-size:10px!important;line-height:1.08!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools{gap:2px!important;padding:3px!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools>.homework-tap-tabs{display:flex!important;flex-wrap:nowrap!important;gap:3px!important;margin:0!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools>.homework-tap-tabs>.homework-tap-coach{flex:0 0 auto!important;width:auto!important;padding:0 2px!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools>.homework-tap-tabs>.homework-tap-coach span{display:none!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools>.homework-tap-tabs>button{min-height:22px!important;padding:1px 4px!important;font-size:11px!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools .field{display:grid!important;grid-template-columns:minmax(80px,.6fr) minmax(0,1fr)!important;align-items:center!important;padding:1px!important;gap:3px!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools .field>span:first-child{font-size:11px!important;line-height:1.05!important}
 html body:is([data-pane=answers],[data-pattern-pane=tools]) .work:has(.card-data-graph,.scoreboards) #tools .field-choices>button{min-height:21px!important;font-size:11px!important;padding:1px 4px!important}
 html body[data-pattern-pane=tools] #main:has(>.scoreboards):has(>.display-row){grid-template-columns:minmax(0,1fr)!important}
 html body[data-pattern-pane=tools] #main:has(>.scoreboards)>.display-row{display:none!important}
}


@media(max-height:420px){
 html body.term-table-page[data-term-panel=answers] #tools .field :is(select,input){min-height:26px!important;height:26px!important;font-size:14px!important;padding:1px 4px!important}
 html body[data-nov1-pane=answers] #main:has(>.scoreboards):has(>.display-row){grid-template-columns:minmax(0,1fr)!important}
 html body[data-nov1-pane=answers] #main:has(>.scoreboards)>.display-row{display:none!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools{padding:3px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools>.homework-tap-tabs{flex-wrap:nowrap!important;gap:3px!important;margin:0!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools>.homework-tap-tabs>.homework-tap-coach{flex:0 0 auto!important;width:auto!important;padding:0 2px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools>.homework-tap-tabs>.homework-tap-coach span{display:none!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools>.homework-tap-tabs>button{min-height:22px!important;padding:1px 4px!important;font-size:11px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .field:not([hidden]){display:grid!important;grid-template-columns:minmax(65px,.68fr) minmax(65px,.75fr) minmax(0,1.6fr)!important;align-items:center!important;gap:2px!important;padding:1px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .field>span:first-child{font-size:11px!important;line-height:1.05!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .field>.unit-numeric-answer{grid-column:2/-1!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools :is(.unit-answer-pad,.unit-answer-pad input,.field-choices>button){min-height:20px!important;padding:1px 3px!important;font-size:11px!important;line-height:1.08!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .nov1-help{grid-column:1/-1!important;margin:0!important;font-size:10px!important;line-height:1.08!important}
}


/* Compact reference pages share one natural-height row for the model and answers. */
html body[data-fitted-reference]{grid-template-rows:auto auto auto!important;align-content:start!important}
html body[data-fitted-reference] .work{grid-template-rows:auto!important;align-content:start!important;align-items:start!important}
html body[data-fitted-reference] .work>:is(#main,#tools){height:auto!important;justify-content:start!important;align-content:start!important}
html body[data-fitted-reference] #main:has(.card-number-rows) .card-number-rows{justify-content:start!important;margin:0!important}
html body[data-fitted-reference] #main .card-forward-jumps{max-height:180px}
html body[data-fitted-reference] #main .card-shape-source .sequence .symbol svg{width:clamp(95px,12vw,165px)!important;height:clamp(95px,12vw,165px)!important}
html body[data-fitted-reference][data-pane=model] #main:has(>.card-table-wrap)>.card-table-wrap{height:auto!important;align-self:center!important}
html body[data-fitted-reference][data-pane=model] #main:has(>.card-table-wrap) .card-value-table{height:auto!important;grid-template-rows:auto auto repeat(var(--card-value-rows),minmax(36px,auto))!important}
html body[data-fitted-reference][data-pane=model] #main:has(>.card-table-wrap):has(>.tile-bank .bank button){grid-template-columns:minmax(0,720px) minmax(105px,auto)!important;grid-template-rows:auto!important;justify-content:center!important;column-gap:10px!important}
html body[data-fitted-reference][data-pane=model] #main:has(>.card-table-wrap)>.tile-bank{grid-area:1/2!important;width:max-content!important;max-width:100%!important;align-self:center!important}
html body[data-fitted-reference][data-pane=model] #main:has(>.card-table-wrap)>.tile-bank .bank{width:max-content!important;max-width:100%!important}
html body[data-fitted-reference] .card-horizontal-table .card-game-deck{height:56px}
html body[data-fitted-reference] #main .card-vine{height:clamp(62px,6vw,90px)}
html body .card-vine{display:block;height:clamp(25px,10vh,73px);width:auto;max-width:100%;margin:0 auto 2px}
html body .card-number-rows:has(.card-vine) article{padding:clamp(3px,1.4vh,10px)!important}
html body .card-number-rows:has(.card-vine) article h2{margin:0 0 3px!important}
html body .card-number-rows:has(.card-vine) strong{padding:3px 1px!important;line-height:1.05!important}
html body .card-number-change{display:grid;place-items:center;align-self:center;flex:0 1 auto;min-width:14px;color:#236475;font-size:clamp(10px,1.3vw,19px);font-weight:bold;line-height:1}
html body .card-number-change svg{width:clamp(12px,2.3vw,32px);height:10px}
html body #main .card-number-rows article>.card-change-row{flex-wrap:nowrap!important;align-items:center;gap:3px}
html body #main .card-change-row>strong{flex:1 1 0!important;min-width:0!important;padding:4px 1px!important}
html body.term-table-page #main>.tile-bank:not(:has(.bank button)){display:none!important}
html body.term-table-page #main .model-region{overflow:visible!important;justify-content:center!important}
html body.term-table-page #main .model-region .model{height:auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;align-items:center;justify-content:center!important;overflow:visible!important}
html body.term-table-page #main .model-region .model h3{margin:0!important;text-align:center;line-height:1.13!important}
html body.term-table-page #main .model-region .model p{margin:2px 0 0!important;text-align:center;line-height:1.13!important}
html body.term-table-page #main .model-region .models{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}
html body.term-table-page #main .model-region .model-tabs{margin:0 0 6px!important}
html body.term-table-page header .term-view-tabs>button{font-size:clamp(12px,1.1vw,17px)!important;min-height:32px!important;padding:3px 7px!important}
html body[data-play=attributes] header:has(>[data-attribute-coach])>[data-attribute-coach]{width:max-content!important;max-width:100%!important;min-height:24px!important;padding:0 5px!important}
html body[data-play=attributes] header [data-attribute-coach] :is(img,svg){width:23px!important;height:23px!important}
html body[data-play=attributes] .play-attribute-rows .play-pattern-row{padding-block:2px!important}
html body[data-play=attributes] .play-attribute-rows .field{padding-block:2px!important}
@media(min-width:900px){
 html body[data-play=attributes] header:has(>[data-attribute-coach]){display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto auto auto!important;gap:2px 10px!important}
 html body[data-play=attributes] header:has(>[data-attribute-coach])>:is(#source,#title,#alignment,#prompt){grid-column:1!important}
 html body[data-play=attributes] header>[data-attribute-coach]{grid-area:1/2/5/3!important;align-self:center}
 html body.term-table-page #main{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto!important}
 html body.term-table-page #main>.term-table{display:grid!important;grid-template-columns:minmax(82px,1.4fr) repeat(var(--homework-term-columns),minmax(0,1fr));grid-template-rows:auto repeat(2,minmax(36px,auto))!important;grid-auto-flow:column;height:auto!important;align-self:center!important;grid-area:1/1!important}
 html body.term-table-page #main>.term-table :is(thead,tbody,tr){display:contents!important}
 html body.term-table-page #main>.term-table caption{grid-area:1/1/2/-1}
 html body.term-table-page #main>.term-table thead th:first-child{grid-area:2/1}
 html body.term-table-page #main>.term-table thead th:nth-child(2){grid-area:3/1}
 html body.term-table-page #main>.term-table tbody th{grid-row:2}
 html body.term-table-page #main>.term-table tbody td{grid-row:3}
 html body.term-table-page #main>.term-table :is(th,td){height:auto!important;width:auto!important;padding:2px!important;font-size:clamp(13px,1.4vw,19px)!important}
 html body.term-table-page #main>.term-table :is(.term,input){min-height:29px!important;font-size:clamp(16px,1.7vw,24px)!important;padding:1px!important}
 html body.term-table-page #main>.tile-bank{grid-area:2/1!important;justify-self:end}
 html body.term-table-page #main>.model-region{grid-area:1/2/3/3!important;align-self:center!important}
 html body .card-data-graph{display:grid!important;grid-template-columns:minmax(0,2.4fr) minmax(135px,1fr)!important;grid-template-rows:minmax(0,1fr) minmax(0,1fr)!important;align-items:center;gap:6px 12px!important}
 html body .card-data-graph svg{grid-area:1/1/3/2!important;width:100%!important;height:100%!important}
 html body .card-data-graph p{grid-column:2!important;align-self:end;margin:0!important;text-align:left!important}
 html body .card-data-graph .card-new-observation{grid-column:2!important;align-self:start;text-align:left!important}
}
@media(min-height:421px){
 html body .fives-build>.fives-board{grid-area:3/1/4/-1!important;justify-content:center!important}
 html body .fives-build>.dot-supply{grid-area:3/1/4/-1!important;justify-self:center!important;translate:calc(2.5 * var(--five-cell,24px) + 30px) 0}
}


html body[data-fitted-reference] #main .card-horizontal-table .card-game-deck{height:56px!important}
@media(min-width:641px) and (max-width:899px){
 html body .card-data-graph{display:grid!important;grid-template-columns:minmax(0,2.4fr) minmax(96px,1fr)!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;align-items:center;gap:3px 7px!important}
 html body .card-data-graph svg{grid-area:1/1/3/2!important;min-height:0;width:100%!important;height:100%!important}
 html body .card-data-graph p{grid-column:2!important;font-size:11px!important;margin:0!important;text-align:left!important;line-height:1.12!important}
 html body .card-data-graph .card-new-observation{padding:3px!important}
}


html body.term-table-page #main>.term-table caption{padding-inline:6px!important}
@media(min-width:641px) and (min-height:280px) and (max-height:420px){
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools>.homework-tap-tabs>button{min-height:28px!important;font-size:12px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .field{gap:4px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .field>span:first-child{font-size:12px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools :is(.unit-answer-pad,.unit-answer-pad input,.field-choices>button){min-height:28px!important;font-size:12px!important}
 html body[data-nov1-pane=answers] .work:has(.scoreboards) #tools .nov1-help{font-size:11px!important}
}


@media(min-width:641px) and (max-width:899px){
 html body[data-play=attributes] header:has(>[data-attribute-coach]){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,176px)!important;grid-template-rows:auto auto auto auto!important;gap:2px 8px!important}
 html body[data-play=attributes] header:has(>[data-attribute-coach])>:is(#source,#title,#alignment,#prompt){grid-column:1!important}
 html body[data-play=attributes] header>[data-attribute-coach]{grid-area:1/2/5/3!important;align-self:center}
}
@media(min-width:1100px) and (max-width:1450px){
 html body[data-pattern-pane=main] .work:has(#main>.growth-board):has(#main>.mobile-piece-bank) #tools>.model-piece-bank{display:none!important}
}

@media(max-height:410px){
html body .fives-build .hint{font-size:10px!important}
html body .fives-figures h2,html body .fives-build h2{font-size:clamp(12px,3.8vh,17px)!important}
html body .fives-figures b,html body .fives-value-table caption{font-size:10px!important}
html body .fives-value-table th:first-child{width:48px!important}
html body .mathology-header:has(.mathology-story):has(#readingTitle){min-height:0!important;padding:4px 7px!important;gap:2px!important}
html body:has(.reading-month-grid) .mathology-header :is(.mathology-story,#readingPrompt){margin:0!important}
html body:has(.reading-month-grid) .mathology-header .mathology-story{max-height:50px!important}
html body :is(.field-choices,.tile-bank .bank,.ml-letter-parts,.homework-tap-tabs)>button{min-height:27px!important;padding:2px 6px!important}
}
}
}
`;
 function installWeekDropPads(){
 const pads='[data-dot][aria-pressed=false],[data-unit-answer-pad],[data-answer-drop],[data-block-drop],[data-dropzone],.term[data-slot]:not(.given),.growth-board [data-growth-slot][aria-pressed=false]';
 const pieces='[data-dot-supply],[data-unit-token],[draggable=true],[data-token],[data-piece],[data-growth-piece],[data-unit-counter],[data-unit-choice],[data-block-move],.mobile-piece-bank button,.tile-bank .bank button,.dot-cell';
 let start=null,over=null,board=null;
 const clear=()=>{over?.removeAttribute('data-week-drop-over');over=null;start=null;};
 document.addEventListener('pointerdown',e=>{if(e.button===0&&e.target.closest(pieces))start={id:e.pointerId,x:e.clientX,y:e.clientY};},true);
 document.addEventListener('pointermove',e=>{
  if(!start||e.pointerId!==start.id||Math.hypot(e.clientX-start.x,e.clientY-start.y)<5)return;
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest(pads);
  if(target===over)return;
  over?.removeAttribute('data-week-drop-over');over=target;over?.setAttribute('data-week-drop-over','');
 },true);
 for(const event of ['pointerup','pointercancel','dragend','drop','blur'])addEventListener(event,clear,true);
 const resize=new ResizeObserver(entries=>{for(const {target,contentRect:{width,height}} of entries)target.parentElement.style.setProperty('--five-cell',Math.max(1,Math.min(48,(width-12)/5,(height-12)/5))+'px');});
 const findBoard=()=>{const next=document.querySelector('.fives-board');if(next===board)return;if(board)resize.unobserve(board);board=next;if(board)resize.observe(board);};
 new MutationObserver(findBoard).observe(document.body,{childList:true,subtree:true});findBoard();
}
 const referenceStageStyle=document.createElement("style");
 referenceStageStyle.textContent="@media screen{#learn[data-fitted-reference]{grid-template-rows:auto minmax(0,var(--reference-stage-height,1fr)) auto!important;align-content:start}}";
 document.head.append(referenceStageStyle);
 function fitReferenceFrame(){
 const frame=window.frameElement;
 if(frame?.id!=='engine')return;
 const stage=frame.closest('.question-stage'),learn=frame.closest('#learn');
 if(!stage||!learn)return;
 const desktop=parent.matchMedia('(min-width:1000px) and (min-height:650px)');
 let scheduled=false;
 function fit(){
  scheduled=false;
  if(frame.contentDocument!==document)return;
  const compact=desktop.matches;
  document.body.toggleAttribute('data-fitted-reference',compact);
  if(!compact){learn.removeAttribute('data-fitted-reference');return;}
  const footer=document.querySelector('body>footer');
  if(!footer)return;
  const extra=[...stage.children].filter(el=>!el.contains(frame)&&el.getClientRects().length);
  const extraHeight=extra.reduce((sum,el)=>sum+el.getBoundingClientRect().height,0);
  const height=Math.ceil(footer.getBoundingClientRect().bottom+parseFloat(getComputedStyle(document.body).paddingBottom)+8+extraHeight+extra.length*6);
  const target=height+'px';
  if(learn.style.getPropertyValue('--reference-stage-height')!==target)learn.style.setProperty('--reference-stage-height',target);
  learn.setAttribute('data-fitted-reference','');
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(fit);}}
 const observer=new ResizeObserver(schedule);
 for(const element of document.querySelectorAll('body>header,body>.work,body>footer'))observer.observe(element);
 for(const element of stage.children)if(!element.contains(frame))observer.observe(element);
 desktop.addEventListener('change',schedule);addEventListener('pagehide',()=>{desktop.removeEventListener('change',schedule);observer.disconnect();},{once:true});
 schedule();
}
 function withTapCoach(html,question){
  document.getElementById("learn")?.removeAttribute("data-fitted-reference");
  if(question.homeworkOnly&&!question.classworkOnly){
   html=html.replace(/<head[^>]*>/i,head=>head+'<style id="homeworkAnswerContext">'+answerContextCSS+'</style>');
   html=html.replace(/<\/head>/i,'<style>'+pictureChoiceCSS+'</style></head>');
  }
  const days=ML_HOMEWORK_WEEKS['2026-11-09'].grades[question.grade]||[];
  if(!days.some(day=>day.questions.some(page=>page.id===question.id)))return html;
  if(question.engine==="reading"&&question.config?.calendar){
   const monthName=new Intl.DateTimeFormat("en-CA",{month:"long",timeZone:"UTC"}).format(new Date(Date.UTC(question.config.calendar.year??2026,question.config.calendar.month??9,1)));
   html=html.replaceAll("October calendar",monthName+" calendar").replaceAll("October \x27+",monthName+" \x27+");
  }
  const task=question.config?.patterningWorksheet?.tasks[0];
  const fitReference=question.engine==="homework-task-cards"&&(task?.shapeRow||task?.numberRows||task?.cardKind==="table");
  const shortReference=!!task?.showNumberChanges&&task.numberRows?.length===1;
  const referenceScript=fitReference&&!shortReference?"("+fitReferenceFrame.toString()+")();":"";
  const referenceStyle=shortReference?String.raw`
@layer november-homework {
@media screen {
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .work{
  display:grid!important;grid-template-columns:minmax(0,1fr)!important;
  grid-template-rows:minmax(min-content,1fr) minmax(min-content,1fr)!important;gap:8px!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .work>#main{
  display:flex!important;grid-area:1/1!important;justify-content:center!important;
  padding:clamp(5px,1.8vh,14px)!important;min-height:0!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #main>.card-number-rows{
  flex:1 1 auto!important;align-self:center!important;width:min(100%,1160px)!important;max-width:100%!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .card-number-rows article{
  flex:1 1 auto;display:grid;align-content:center;gap:clamp(5px,2vh,12px)!important;
  padding:clamp(5px,2.5vh,17px) clamp(6px,3vw,34px)!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .card-number-rows h2{
  font-size:clamp(16px,5vh,29px)!important;line-height:1.1!important;margin:0!important;
 }
 html body.task-card-page #main .card-number-rows article>.card-change-row{
  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr) minmax(0,.6fr)) minmax(0,1fr);
  justify-content:stretch!important;gap:clamp(3px,1.2vw,17px)!important;
 }
 html body.homework-space-fit.task-card-page #main>.card-number-rows>article>.card-change-row>strong{
  display:grid;place-items:center;min-height:clamp(38px,18vh,110px);line-height:1!important;
  font-size:clamp(23px,min(10.5vh,5.5vw),68px)!important;border:2px solid #90b6c8;
 }
 html body.homework-space-fit.task-card-page #main .card-change-row>.card-number-change{
  font-size:clamp(14px,min(5.9vh,3.5vw),37px)!important;gap:3px;
 }
 html body.homework-space-fit.task-card-page #main .card-change-row>.card-number-change svg{
  width:min(100%,64px)!important;height:auto!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .work>#tools{
  display:grid!important;grid-area:2/1!important;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)!important;
  gap:clamp(5px,1.2vw,16px)!important;align-items:stretch!important;align-content:center!important;
  padding:clamp(5px,1.8vh,14px)!important;width:min(100%,1188px)!important;
  justify-self:center;box-sizing:border-box;min-height:0!important;background:transparent!important;border:0!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field{
  padding:clamp(5px,2vh,15px)!important;justify-content:center!important;gap:clamp(4px,1.3vh,9px)!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field>span:first-child{
  font-size:clamp(14px,min(4.5vh,2.35vw),24px)!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field-choices{
  display:flex!important;flex-wrap:wrap;justify-content:flex-start!important;gap:clamp(4px,1.4vh,10px)!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field-choices>button{
  flex:0 0 auto!important;width:max-content!important;max-width:100%;min-height:clamp(32px,8vh,55px)!important;
  font-size:clamp(13px,min(4vh,2.15vw),22px)!important;padding:4px clamp(7px,1.3vw,18px)!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field-choices>button:is([data-field=outsideLater],[data-field=term10]){
  min-width:clamp(42px,5vw,76px)!important;font-size:clamp(18px,5vh,29px)!important;
 }
 html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .homework-tap-coach{
  align-self:flex-start;width:max-content!important;max-width:100%;padding-inline:5px!important;
 }
 @media(max-height:420px){
  html body.homework-space-fit.task-card-page #main>.card-number-rows>article>.card-change-row>strong{font-size:clamp(24px,7.8vh,34px)!important}
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field-choices>button{font-size:clamp(13px,3.7vh,16px)!important}
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field-choices>button:is([data-field=outsideLater],[data-field=term10]){font-size:clamp(18px,5.1vh,22px)!important}
 }
 @media(max-height:340px){
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .work{grid-template-rows:auto minmax(min-content,1fr)!important;gap:4px!important}
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .work>:is(#main,#tools){padding:4px!important}
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field{padding:4px!important}
  html body.homework-space-fit.task-card-page #main .card-change-row>strong{min-height:clamp(32px,13vh,44px)}
 }
 @media(max-width:520px){
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) #tools .field-choices>button{min-width:32px!important}
  html body.homework-space-fit.task-card-page:has(#main>.card-number-rows>article:only-child .card-change-row) .work>#tools{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)!important}
 }
}
}
`:"";
  return html.replace(/<head[^>]*>/i,head=>head+'<style id="novemberHomeworkLayout">'+novemberCSS+'</style>').replace(/<\/head>/i,'<style>'+coachCSS+referenceStyle+'</style></head>').replace(/<\/body>/i,'<script>('+installTapCoaches.toString()+')();('+installWeekDropPads.toString()+')();'+referenceScript+'</'+'script></body>');
 }
 window.ML_HOMEWORK_SPACE_FIT={ids,withTapCoach};
})();
