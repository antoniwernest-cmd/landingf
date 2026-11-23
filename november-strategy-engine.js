/* The strategy pages share Math Landing's frame, saved work and per-choice feedback. */
(() => {
 'use strict';
 const styles = `
 .strategy{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,1fr);gap:clamp(6px,1.1vw,18px);min-height:0}
 .strategy-model,.strategy-art{min-width:0;min-height:0;display:grid;gap:clamp(4px,1vh,10px);border:1px solid #bdd8d3;border-radius:16px;background:#fffefa;padding:clamp(7px,1.35vh,17px)}
 .strategy-model{grid-template-rows:minmax(0,1fr) auto;align-items:center}
 .strategy-model.no-visual{grid-template-rows:minmax(0,1fr)}
 .strategy-art{align-content:stretch;grid-template-rows:minmax(0,1fr);background:radial-gradient(ellipse at 50% 60%,#fcfffd,#e0f0ec)}
 .strategy-art img{width:100%;height:100%;min-height:0;object-fit:contain;padding:clamp(4px,2vw,30px)}
 .strategy:has(.strategy-bank) .strategy-model{grid-template-rows:minmax(0,1fr) auto auto}
 .strategy-visual{display:flex;align-items:center;justify-content:center;min-height:0;height:100%;min-width:0}
 .strategy-visual svg{display:block;width:100%;height:100%;min-height:0}
 .strategy-rows{display:grid;gap:clamp(3px,1.1vh,11px);width:100%}
 .strategy-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:clamp(4px,.8vw,15px);text-align:center;font-size:clamp(18px,3.1vw,39px);line-height:1.12;font-weight:700}
 .strategy-row .phrase{font-size:clamp(15px,2.3vw,28px);color:#295761}
 .strategy-model.no-visual .strategy-rows{align-self:stretch;align-content:space-evenly}
 .strategy-field{position:relative;display:inline-flex;align-items:stretch;min-width:0;max-width:100%;vertical-align:middle}
 .strategy-field select,.strategy-slot,.strategy-bank button{font:700 clamp(16px,2.65vw,32px)/1.08 "Andika","Trebuchet MS",sans-serif;color:#164854;background:#e9f8f4;border:2px solid #84b3ab;border-radius:10px;min-height:clamp(32px,5.5vh,54px);min-width:3.05em;padding:3px 7px}
 .strategy-slot{border-style:dashed;background:#fffefa;touch-action:none;cursor:pointer}
 .strategy-slot[data-filled]{background:#cce7fe;border-color:#527eaa;border-style:solid}
 .strategy-field select:focus-visible,.strategy-slot:focus-visible,.strategy-bank button:focus-visible{outline:3px solid #285e9d;outline-offset:2px}
 .strategy-slot[data-hover],.strategy-bank button[aria-pressed=true]{outline:3px solid #327aa5;outline-offset:1px}
 .strategy-field[data-mark=retry] select,.strategy-field[data-mark=retry] .strategy-slot{border-color:#a94b20}
 .strategy-help{display:grid;gap:4px;padding:0 2px;color:#28535c;font-size:clamp(13px,1.9vw,22px);font-weight:700}
 .strategy-help label{display:block}
 .strategy-help select{width:100%;font-size:clamp(13px,1.65vw,21px);white-space:normal}
 .strategy-bank{display:flex;flex-wrap:wrap;gap:clamp(4px,1vw,12px);justify-content:center;padding:2px}
 .strategy-bank button,.strategy-ghost{cursor:grab;touch-action:none;border-style:solid;box-shadow:0 3px 0 #557f80}
 .strategy-ghost{position:fixed;z-index:10;pointer-events:none;padding:5px 14px;border-radius:10px;background:#cdf4ed;color:#164854;font-weight:700;transform:translate(-50%,-65%)}
 .strategy-piece{display:inline-grid;place-items:center;position:relative;min-width:1.45em}
 .strategy-piece img{width:1.38em;height:1.08em;object-fit:contain;position:absolute;pointer-events:none}
 .strategy-piece b{position:relative;padding:0 .12em;border-radius:.2em;background:#153528bf;color:white;font-size:.82em;text-shadow:0 1px 2px #153528}
 .doubles-activity .strategy-model{container-type:size}
 .doubles-activity .strategy-rows{gap:clamp(3px,1.6cqh,10px)}
 .doubles-activity .strategy-row{font-size:clamp(17px,min(3.1vw,10cqh),39px)}
 .doubles-activity .strategy-row .phrase{font-size:clamp(14px,min(2.3vw,7.5cqh),28px)}
 .doubles-activity :is(.strategy-field select,.strategy-slot,.strategy-bank button){font-size:clamp(16px,min(2.65vw,8.5cqh),32px);min-height:clamp(34px,12cqh,54px)}
 .strategy-tokens{display:flex;align-items:stretch;gap:clamp(5px,1.5vw,20px);width:min(100%,720px);height:min(100%,148px)}
 .strategy-double-group{flex:1;min-width:0;display:grid;place-items:center;grid-template-rows:minmax(0,1fr);border-radius:12px;padding:4px;background:#dfefef;border:1px solid #a4c8c1}
 .strategy-double-group:nth-child(2){background:#e8e2fc;border-color:#b5a3d3}
 .strategy-double-group:nth-child(3){flex:0 1 clamp(42px,12%,120px);background:#fff1ca;border-color:#dec078}
 .strategy-double-group.with-objects{grid-template-rows:minmax(0,1fr) auto;gap:2px}
 .strategy-double-objects{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));grid-template-rows:repeat(var(--rows),minmax(0,1fr));width:100%;height:100%;min-height:0}
 .strategy-double-objects img{display:block;width:100%;height:100%;min-height:0;object-fit:contain}
 .strategy-double-count{color:#234d56;font-size:clamp(15px,min(3.4vw,10cqh),45px);font-weight:700;line-height:1}
 .with-objects .strategy-double-count{font-size:clamp(14px,min(2vw,5.5cqh),23px)}
 .strategy-columns{height:100%;width:min(100%,510px);min-height:0;align-content:center;display:grid;grid-template-columns:1em repeat(var(--places),minmax(0,1fr));text-align:center;font-size:clamp(18px,min(3.4vw,7vh),42px);font-weight:700;line-height:1.05;gap:2px}
 .strategy-columns .head{background:#e1f1ed;padding:3px 1px;border-radius:4px;font-size:.55em;color:#2c565c}
 .strategy-columns .result{border-top:2px solid #477577;padding-top:3px}
 .strategy-columns .exchange{font-size:.58em;color:#75491a}
 .column-model{display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);width:100%;height:100%;min-height:0;gap:5px;justify-items:center}
 .column-model .strategy-columns{font-size:clamp(17px, min(3vw, 5vh), 35px)}
 .strategy.algorithm{grid-template-columns:minmax(0,4.4fr) minmax(0,1fr)}
 .algorithm .strategy-model{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);grid-template-rows:minmax(0,1fr)}
 .algorithm .strategy-rows{gap:clamp(3px,.85vh,10px)}
 .algorithm .strategy-row{font-size:clamp(16px,2.35vw,30px)}
 .algorithm .strategy-field select{font-size:clamp(16px,2.2vw,28px);min-height:clamp(29px,4.8vh,48px)}
 .strategy-activity{gap:clamp(3px,1.1vh,11px);padding:clamp(6px,1.5vh,16px) clamp(8px,1.1vw,18px) clamp(7px,1.3vh,14px)}
 .strategy-activity .prompt{font-size:clamp(16px,2.4vw,30px);line-height:1.16}
 .strategy-activity h1{font-size:clamp(24px,4.2vw,48px)}
 .two-level-parts .strategy-model{grid-template-rows:minmax(0,1fr) auto}
 .split-trees{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:clamp(4px,2.4vw,34px);width:100%;height:100%;min-height:0}
 .split-tree{display:grid;grid-template-rows:minmax(0,1fr) minmax(8px,.45fr) minmax(0,1fr) minmax(8px,.45fr) minmax(0,1fr);align-items:stretch;min-width:0;min-height:0;text-align:center}
 .split-tree-left{grid-template-columns:repeat(3,minmax(0,1fr))}
 .split-tree-right{grid-template-columns:repeat(2,minmax(0,1fr))}
 .split-root{grid-column:1/-1;grid-row:1;place-self:center;min-width:65%;border-radius:12px;background:#f7dda5;padding:2px 8px;font-size:clamp(22px,min(4vw,7vh),55px);font-weight:900}
 .split-node{display:grid;align-content:center;justify-items:center;min-width:0;gap:2px;font-size:clamp(11px,1.45vw,20px);font-weight:700}
 .split-node .strategy-field{width:min(86%,126px)}
 .split-node select{width:100%;min-width:0;padding:3px;min-height:clamp(34px,6vh,57px)}
 .split-node[data-split="hundreds"]{grid-column:1;grid-row:3}
 .split-node[data-split="rest"]{grid-column:2/4;grid-row:3}
 .split-leaf{grid-row:5}
 .split-leaf.split-first-left{grid-column:2}
 .split-leaf.split-last-left{grid-column:3}
 .split-leaf.split-first-right{grid-column:1}
 .split-leaf.split-last-right{grid-column:2}
 .strategy-visual .split-branch{min-height:0;stroke:#729492;stroke-width:3;fill:none;overflow:visible;pointer-events:none}
 .split-branch path{vector-effect:non-scaling-stroke}
 .split-first-branch{grid-column:1/-1;grid-row:2}
 .split-second-branch{grid-column:2/4;grid-row:4}
 .split-right-stem{grid-column:1/-1;grid-row:2/4}
 .split-right-branch{grid-column:1/-1;grid-row:4}
 .split-total{border-top:1px solid #d2e2de;padding-top:clamp(4px,1vh,10px)}
 .strategy.array-activity{grid-template-columns:minmax(0,1fr)}
 .array-activity .strategy-model{grid-template-columns:minmax(0,1fr) minmax(155px,25%);grid-template-rows:minmax(0,1fr)}
 .array-activity .strategy-visual{container-type:size}
 .array-grid{position:relative;display:grid;--cell-size:min(calc((100cqw - var(--columns) * 4px) / var(--columns)),calc((100cqh - var(--rows) * 4px) / var(--rows)));grid-template-columns:repeat(var(--columns),var(--cell-size));grid-template-rows:repeat(var(--rows),var(--cell-size));gap:4px}
 .array-grid .strategy-field,.array-grid .strategy-slot{width:100%;height:100%;min-width:0;min-height:0}
 .array-grid .strategy-slot{display:grid;grid-template: minmax(0,1fr) / minmax(0,1fr);place-items:center;padding:2px;border-radius:9px;background:#f1faf8}
 /* Keep raised edges and press motion inside the tightly spaced grid. */
 :root .activity .strategy.array-activity .array-grid .strategy-field > .strategy-slot{box-shadow:none!important;translate:none!important}
 .array-grid .strategy-slot:focus-visible,.array-grid .strategy-slot[data-hover]{outline-offset:-4px}
 .array-grid .strategy-slot[data-filled]{background:#d4edff}
 .array-grid .strategy-slot img{display:block;width:100%;height:100%;min-height:0;object-fit:contain;pointer-events:none}
 .array-tools{display:grid;align-content:center;justify-items:stretch;gap:clamp(4px,1.25vh,12px);min-width:0}
 .array-bank{display:grid;justify-items:center;align-items:center;gap:2px;padding:4px;border-radius:12px;border:2px solid #84b3ab;background:#e9f8f4;color:#164854;font-size:clamp(13px,1.65vw,21px);font-weight:700;line-height:1.1;cursor:grab;touch-action:none}
 .array-bank img,.array-ghost img{display:block;width:clamp(38px,11vh,100px);height:clamp(35px,10vh,82px);object-fit:contain;pointer-events:none}
 .array-bank[aria-pressed=true]{outline:3px solid #327aa5;outline-offset:1px}
 .array-reset{justify-self:center;font-size:clamp(13px,1.4vw,20px);min-height:34px;padding:3px 10px;border:1px solid #56867c;border-radius:9px;background:#fffefa;font-weight:700}
 .array-meta{margin-top:3px;color:#34575f;font-size:clamp(12px,1.2vw,17px);font-weight:700}
 .array-choice{display:grid;gap:3px;font-size:clamp(12px,1.4vw,17px);font-weight:700}
 .array-choice select{width:100%;font-size:clamp(13px,1.5vw,21px)}
 .array-activity .strategy-row{font-size:clamp(17px,2.4vw,32px);gap:4px}
 .array-activity .strategy-row select{font-size:clamp(15px,2vw,26px);min-width:2.35em}
 .strategy.two-ways{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto minmax(0,1fr);gap:clamp(6px,1.25vw,16px)}
 .ways-problem{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:clamp(9px,2vw,24px);padding:3px 8px;border:1px solid #bdd8d3;border-radius:12px;background:#e5f4ee;font-size:clamp(21px,min(3.2vw,7vh),44px);font-weight:900;line-height:1.05}
 .ways-problem img{width:clamp(36px,8vh,75px);height:clamp(32px,7vh,64px);object-fit:contain}
 .ways-method{display:grid;grid-template-rows:auto minmax(0,1fr);align-items:stretch;gap:clamp(4px,1vh,12px)}
 .ways-method h2{margin:0;font-size:clamp(19px,2.6vw,34px);line-height:1.1;color:#174e4f}
 .ways-method p{margin:4px 0 0;color:#34575f;font-size:clamp(14px,1.5vw,21px);line-height:1.12;font-weight:700}
 .ways-method:nth-of-type(2){background:#f7f4fc;border-color:#d4c8e7}
 .ways-method .strategy-rows{grid-template-rows:repeat(3,minmax(0,1fr));align-items:center;text-align:center}
 .ways-method .strategy-row{flex-wrap:nowrap;gap:clamp(4px,.8vw,12px);font-size:clamp(20px,3.1vw,39px)}
 .ways-method select{min-width:2.45em}
 .ways-method [data-value]{padding:2px 4px;border-radius:6px;background:#e5efed}
 @media(max-width:620px) and (orientation:portrait){
  .strategy.two-ways{grid-template-columns:minmax(0,1fr);grid-template-rows:auto repeat(2,minmax(0,1fr));gap:5px}
  .ways-method .strategy-rows{gap:2px}
  .ways-method .strategy-row{font-size:19px}
  .ways-method select{min-height:34px}
 }
 @media(max-width:630px) and (orientation:portrait){
  .array-activity .strategy-model{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto}
  .array-tools{grid-template-columns:minmax(57px,1fr) minmax(0,2.35fr);align-items:center;gap:4px 8px}
  .array-bank{grid-row:1/3;font-size:13px}
  .array-reset{grid-column:2;grid-row:3}
  .array-activity .strategy-row{font-size:17px}
 }
 @media(max-width:675px){.strategy,.strategy.algorithm{grid-template-columns:minmax(0,1fr) minmax(65px,19%);gap:5px}.strategy-model,.strategy-art{padding:5px}.strategy-art img{padding:0}.strategy-row{gap:4px;font-size:clamp(16px,4.5vw,26px)}.strategy-row .phrase{font-size:clamp(14px,3.65vw,22px)}.strategy-field select,.strategy-slot,.strategy-bank button{min-width:2.25em;padding:3px;min-height:30px}.strategy-bank{column-gap:6px}.algorithm .strategy-model{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(96px,1fr) auto}.strategy-columns{font-size:clamp(17px,4.7vw,32px)}}
 @media(max-height:475px){.strategy-model{padding:5px;gap:4px}.strategy-rows{gap:4px}.strategy-row{font-size:clamp(16px,2.65vw,28px)}.strategy-field select,.strategy-slot,.strategy-bank button{min-height:29px;padding-block:1px}.strategy-activity h1{font-size:clamp(21px,3.5vw,37px)}.strategy-activity .prompt{font-size:clamp(15px,2.1vw,23px)}}
 @media print{.strategy-activity{contain:layout;overflow:clip;break-inside:avoid}}
 `;
 function boot() {
  const cfg=window.ML_CONFIG, task=cfg.task, model=task.model, fields=task.fields;
  if(window.ML_SUBTRACTION?.numbers(task)){window.ML_SUBTRACTION.boot();return;}
  const isArray=model.type==='object-array';
  const borrowingModel=model.borrow||(model.type==='columns'&&model.symbol==='−'?{a:model.a,b:model.b}:null);
  const isBorrowing=Boolean(borrowingModel&&window.ML_BORROWING.nextStep(window.ML_BORROWING.initial(borrowingModel.a),borrowingModel.b)!==null);
  const root=document.querySelector('.activity');
  const storage='math-landing:november-addition:'+cfg.student+':'+cfg.id+':'+cfg.revision;
  const signal = type => {if(!cfg.cataloguePreview)parent.postMessage({type,id:cfg.id},'*');};
  const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let saved={};
  if(!cfg.cataloguePreview) try{saved=JSON.parse(localStorage.getItem(storage))||{}}catch{}
  let done=saved.done===true, checked=typeof saved.checked==='string'?saved.checked:'', selected=null, drag=null, pointerHandledChoice=null;
  const answers=Object.fromEntries(Object.keys(fields).map(k=>[k,saved.answers?.[k]??null]));
  let borrowTrades=Array.isArray(saved.borrowTrades)?saved.borrowTrades:[],borrowAid=null,borrowPanel=saved.borrowPanel==='answers'?'answers':'model';
  const dragKeys=new Set(task.drag?.keys||[]);
  const signature=()=>JSON.stringify(answers);
  const stored=()=>{if(!cfg.cataloguePreview)try{localStorage.setItem(storage,JSON.stringify({answers,checked,done,...(isBorrowing?{borrowTrades,borrowPanel}:{})}));}catch{}};
  function arrayMark(){
   const occupied=model.keys.filter(key=>answers[key]===1);
   const positions=occupied.map(key=>key.slice(4).split('_').map(Number));
   const rows=new Set(positions.map(([row])=>row)), columns=new Set(positions.map(([,column])=>column));
   const count=occupied.length, target=model.targetRows*model.targetColumns;
   const contiguous=values=>values.size>0&&Math.max(...values)-Math.min(...values)+1===values.size;
   const correct=count===target&&rows.size===model.targetRows&&columns.size===model.targetColumns&&contiguous(rows)&&contiguous(columns);
   return {key:'array',label:'Array',answer:count?occupied.map(key=>fields[key].label).join('; '):null,
    expected:model.targetRows+' rows of '+model.targetColumns,correct};
  }
  const marks=()=>[
   ...(isArray?[arrayMark()]:[]),
   ...Object.entries(fields).filter(([,f])=>!f.cell).map(([key,f])=>({key,label:f.label,answer:answers[key],expected:f.answer,correct:answers[key]===f.answer}))
  ];
  function snapshot(){
   const m=marks(), score=m.filter(x=>x.correct).length, entered=m.filter(x=>x.answer!==null).length;
   const sig=signature(), isChecked=checked===sig, all=score===m.length, complete=entered===m.length;
   const message=all?'You got it!':isArray&&!m[0].correct?
    'Make '+model.targetRows+' rows of '+model.targetColumns+' with no gaps.':
    complete?'Try the marked choices again.':'Keep going. Some choices are still open.';
   return {done,response:{answers:Object.fromEntries(m.filter(x=>x.answer!==null).map(x=>[x.label,x.answer])),marks:m},
    assessment:{checked:isChecked,signature:sig,complete,correct:isChecked&&all,answerCorrect:all,message,score,total:m.length,
     answerChecks:m.map(({key,label,answer,expected,correct})=>({field:key,label,actual:answer,expected,entered:answer!==null,correct})),
     partAssessment:{checked:isChecked,correct:score,total:m.length}}};
  }
  function options(f,key){
   const numeric=typeof f.answer==='number';
   const limit=f.optionLimit||6;
   const pool=[...new Set([f.answer,...f.options.filter(v=>v!==f.answer&&(!numeric||v>=0))])];
   if(numeric) for(let offset=1;pool.length<limit;offset++) {
    for(const val of [f.answer+offset,f.answer-offset])if(val>=0&&!pool.includes(val)&&pool.length<limit)pool.push(val);
   }
   const sorted=pool.slice(0,limit).sort(numeric?(a,b)=>a-b:()=>0);
   const rotate=(task.choiceSeed+key.charCodeAt(0))%sorted.length;
   return sorted.slice(rotate).concat(sorted.slice(0,rotate));
  }
  const ref=k=>'<span data-value="'+k+'">□</span>';
  const art='<img src="'+esc(task.picture)+'" alt="" draggable="false">';
  const piece=n=>'<span class="strategy-piece">'+art+'<b>'+esc(n)+'</b></span>';
  function control(k){
   const f=fields[k], text=esc(f.label);
   return '<span class="strategy-field" data-field="'+k+'">'+(dragKeys.has(k)
    ? '<button type="button" class="strategy-slot" data-slot="'+k+'" aria-label="'+text+'">□</button>'
    : '<select aria-label="'+text+'" data-choice="'+k+'"><option value="">□</option>'+
     options(f,k).map(value=>'<option value="'+esc(value)+'">'+esc(value)+'</option>').join('')+'</select>')+'</span>';
  }
  const occurrence = new Set();
  const renderToken=p=>{
   if(p?.key){
    if(occurrence.has(p.key))return ref(p.key);
    occurrence.add(p.key);
    return control(p.key);
   }
   const val=p?.text??p, phrase=String(val).length>3&&!/^\d+$/.test(val);
   return '<span'+(phrase?' class="phrase"':'')+'>'+esc(val)+'</span>';
  };
  const svg=(content,viewBox,description)=>'<svg viewBox="'+viewBox+'" role="img" aria-label="'+esc(description)+'">'+content+'</svg>';
  const t=(x,y,n,attr='')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="700" fill="#204850" '+attr+'>'+n+'</text>';
  const rect=(x,y,w,h,c,rx=6)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+c+'"/>';
  function splitTrees(){
   const branch=(name,path)=>'<svg class="split-branch '+name+'" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="'+path+'"/></svg>';
   const node=(key,label,position='')=>'<div class="split-node '+position+'" data-split="'+key+'"><span>'+label+'</span>'+renderToken({key})+'</div>';
   return '<div class="split-trees"><section class="split-tree split-tree-left" aria-label="Split '+model.left+' in two steps">'+
    '<strong class="split-root">'+model.left+'</strong>'+branch('split-first-branch','M50 0V8L17 20M50 8L67 20')+
    node('hundreds','Hundreds')+node('rest','Left over')+branch('split-second-branch','M50 0V8L25 20M50 8L75 20')+
    node('leftTens','Tens','split-leaf split-first-left')+node('leftOnes','Ones','split-leaf split-last-left')+
    '</section><section class="split-tree split-tree-right" aria-label="Split '+model.right+' into tens and ones">'+
    '<strong class="split-root">'+model.right+'</strong>'+branch('split-right-stem','M50 0V20')+
    branch('split-right-branch','M50 0V8L25 20M50 8L75 20')+
    node('rightTens','Tens','split-leaf split-first-right')+node('rightOnes','Ones','split-leaf split-last-right')+'</section></div>';
  }
  function picture(){
   if(isBorrowing)return '<div class="borrow-workspace" aria-label="Borrowing from the place on the left"></div>';
   if(isArray)return '<div class="array-grid" data-field="array" role="group" aria-label="Build your array" style="--rows:'+model.gridRows+';--columns:'+model.gridColumns+'">'+
    model.keys.map(control).join('')+'</div>';
   if(model.type==='two-level-parts')return splitTrees();
   // Use the same amber lamp and blue base as the number path.
   const beacon=(x,y)=>'<g class="strategy-beacon" aria-hidden="true" transform="translate('+x+' '+y+')">'+
    '<circle cx="0" cy="-20" r="14" fill="#ffd168" opacity=".32"/>'+
    '<path d="M-8-7v-13a8 8 0 0 1 16 0v13z" fill="#ffb02e" stroke="#95511a" stroke-width="1"/>'+
    '<ellipse cx="-2.5" cy="-21" rx="3.5" ry="5" fill="#fff4ac"/>'+
    '<rect x="-12" y="-9" width="24" height="8" rx="3" fill="#497583" stroke="#234653" stroke-width="1"/></g>';
   if(model.type==='benchmarks'){
    const ticks=[0,5,10,15,20].map((n,i)=>{
     const x=32+i*104;
     return beacon(x,41)+'<path d="M'+x+' 41v17" stroke="#537b7d" stroke-width="3"/>'+t(x,81,n,'font-size="25"');
    }).join('');
    return svg('<path d="M32 50H448" stroke="#537b7d" stroke-width="3"/>'+ticks,'0 0 480 90','Benchmarks at 0, 5, 10, 15 and 20');
   }
   if(model.type==='line'){
    const from=model.subtract?432:48,to=model.subtract?48:432,y=110;
    const jumps=model.unitHops?Array(model.jumps[0]).fill(1):model.jumps;
    const coords=[from, ...jumps.map((_,i)=>from+(to-from)*(i+1)/jumps.length)];
    const arrow='<defs><marker id="tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#396c75" d="M0 0L10 5L0 10Z"/></marker></defs>';
    const hops=jumps.map((n,i)=>{
     const s=coords[i],e=coords[i+1],m=(s+e)/2;
     return '<path d="M'+s+' 66Q'+m+' -4 '+e+' 65" fill="none" stroke="#396c75" stroke-width="3" marker-end="url(#tip)"/>'+
      t(m,32,(model.subtract?'−':'+')+n,'font-size="23"');
    }).join('');
    const points=coords.map((x,i)=>{
     const key=model.unitHops?i===jumps.length?'end':null:model.ends[i-1]?.key;
     const value=i===0?model.start:key?'<tspan data-value="'+key+'">□</tspan>':'';
     return beacon(x,y-3)+'<circle cx="'+x+'" cy="'+y+'" r="5" fill="#32637f"/>'+t(x,141,value,'font-size="26"');
    }).join('');
    return svg(arrow+'<path d="M18 '+y+'H462" stroke="#537b7d" stroke-width="3"/>'+hops+points,'0 0 480 150','Open number line starting at '+model.start+', with '+jumps.length+' '+(model.subtract?'left':'right')+(model.unitHops?' jumps of one':' jumps of '+jumps.join(' and ')));
   }
   if(model.type==='ten'){
    const box=45;
    const grid=Array.from({length:10},(_,i)=>{
     const x=18+(i%5)*box,y=12+Math.floor(i/5)*box;
     return rect(x,y,box-3,box-3,'#ebf4ef',5)+(i<model.start%10||model.start===10?'<circle cx="'+(x+21)+'" cy="'+(y+21)+'" r="14" fill="#32958d"/>':'');
    }).join('');
    const full=model.start>10, extra=full?' + '+(model.start%10)+' ones':'';
    return svg(grid+(full?t(310,59,'1 full ten','font-size="23"')+t(310,89,extra,'font-size="20"'):''),full?'0 0 398 112':'0 0 260 112','Ten frame showing '+model.start);
   }
   if(model.type==='parts'){
    const unknown='?';
    const centers=model.parts.length===3?[73,215,357]:[122,308];
    const wholeKey=fields.whole?'whole':model.whole===null&&fields.total?'total':null;
    const whole=model.whole??(wholeKey?'<tspan data-value="'+wholeKey+'">□</tspan>':unknown);
    const parts=model.parts.map((n,i)=>{
     const key=typeof n==='string'?n:n===null&&fields.total&&i===model.resultPart?'total':
      fields.h&&model.parts.length===3?['h','t','o'][i]:fields.o?['t','o'][i]:null;
     return typeof n==='number'?n:key?'<tspan data-value="'+key+'">□</tspan>':unknown;
    });
    return svg(centers.map((x,i)=>'<path d="M215 52L'+x+' 83" stroke="#779493" stroke-width="3"/>'+rect(x-45,79,90,38,i%2?'#e0d8fb':'#d5f1ed')+t(x,106,parts[i],'font-size="26"')).join('')+
     rect(164,7,102,44,'#f7dda5')+t(215,38,whole,'font-size="27"'),'0 0 430 128','Part-whole diagram');
   }
   if(model.type==='blocks')return blocks(model);
   if(model.type==='doubles'){
    const amounts=model.independent?[model.left,model.right]:[model.amount,model.amount,...(model.extra?[model.extra]:[])];
    const groups=amounts.map(n=>{
     const count='<span class="strategy-double-count">'+n+'</span>';
     if(n>16)return '<div class="strategy-double-group">'+count+'</div>';
     const columns=Math.min(5,n);
     const rows=Math.ceil(n/columns);
     const objects=art.repeat(n);
     return '<div class="strategy-double-group with-objects"><div class="strategy-double-objects" style="--cols:'+columns+';--rows:'+rows+'">'+objects+'</div>'+count+'</div>';
    }).join('');
    return '<div class="strategy-tokens" role="group" aria-label="'+(model.independent?'The two starting groups':'Two equal groups'+(model.extra?' and some extra objects':''))+'">'+groups+'</div>';
   }
   if(model.type==='columns'){
    const sumKey='total', width=Math.max(String(model.a).length,String(model.b).length,model.places||(model.high?3:2));
    const headings=['Th','H','T','O'].slice(-width);
    const cells=(value,showOperator)=>'<span>'+showOperator+'</span>'+String(value).padStart(width,' ').split('').map(ch=>'<span>'+ch+'</span>').join('');
    const shown=(key,i)=>'<span data-digit="'+key+'" data-position="'+i+'">□</span>';
    const exchange='<span></span>'+Array.from({length:width},(_,i)=>{
     const right=width-1-i;
     const key=model.symbol==='−' ? (['ones','tens','hundreds'][right]) : (['','carry','carryHundreds','carryThousands'][right]);
     return '<span class="exchange">'+(fields[key]?ref(key):'')+'</span>';
    }).join('');
    const columns='<div class="strategy-columns" role="img" aria-label="Place-value columns for '+model.a+' '+model.symbol+' '+model.b+'" style="--places:'+width+'"><span></span>'+
     headings.map(h=>'<span class="head">'+h+'</span>').join('')+exchange+cells(model.a,'')+cells(model.b,model.symbol)+
     '<span></span>'+Array.from({length:width},(_,i)=>'<span class="result">'+shown(sumKey,width-1-i)+'</span>').join('')+'</div>';
    return model.showBlocks?'<div class="column-model">'+blocks({values:model.blocksBefore,trade:'ten',tradeFields:model.blockFields})+columns+'</div>':columns;
   }
   return '';
  }
  function blocks(blockModel){
    const hasHundreds=cfg.grade===3, groups=hasHundreds?3:2, names=['Hundreds','Tens','Ones'];
    const areas=blockModel.values.map((n,g)=>{
     if(!hasHundreds&&!g)return '';
     const x=(g-(hasHundreds?0:1))*144;
     const kind=g===0?'#4e92ce':g===1?'#189b82':'#edac46';
     const symbols=Array.from({length:n},(_,i)=>{
      if(g===0){
       const xx=x+12+(i%5)*24,yy=36+Math.floor(i/5)*24;
       return rect(xx,yy,20,20,kind,1)+Array.from({length:9},(_,k)=>2*(k+1)).map(k=>'<path d="M'+(xx+k)+' '+yy+'v20M'+xx+' '+(yy+k)+'h20" stroke="#d4edff" opacity=".72" stroke-width=".42"/>').join('');
      }
      if(g===1){
       const xx=x+14+i*(n>10?6:12), rodWidth=n>10?4:8;
       return rect(xx,33,rodWidth,48,kind,1)+Array.from({length:9},(_,k)=>'<path d="M'+xx+' '+(38+4.6*k)+'h'+rodWidth+'" stroke="#c7f6dd" stroke-width=".85"/>').join('');
      }
      return rect(x+17+(i%5)*23,31+Math.floor(i/5)*17,13,13,kind,2);
     }).join('');
     const [k,l]=blockModel.tradeFields||[];
     const current=blockModel.trade==='hundred'?(g===0?k:g===1?l:null):blockModel.trade==='ten'?(g===1?k:g===2?l:null):null;
     return rect(x+3,2,138,119,'#edf7f4')+t(x+72,22,names[g],'font-size="15"')+symbols+
      (blockModel.trade?t(x+72,108,'After: '+(current?'<tspan data-value="'+current+'">□</tspan>':n),'font-size="15"'):'');
    }).join('');
    return svg(areas,'0 0 '+144*groups+' 124','Base-ten chart showing '+blockModel.values[0]+' hundreds, '+blockModel.values[1]+' tens and '+blockModel.values[2]+' ones');
  }
  root.classList.add('strategy-activity');
  if(isBorrowing){root.classList.add('borrowing-activity');root.dataset.borrowPanel=borrowPanel;}
  document.title=task.title;
  const isTwoWays=model.type==='two-ways';
  const visual=picture();
  const renderRows=rows=>rows.map(row=>'<div class="strategy-row'+(model.type==='two-level-parts'?' split-total':'')+'">'+row.map(renderToken).join('')+'</div>').join('');
  const rows=model.type==='line'?model.ends.map((end,i)=>[i===model.ends.length-1?'Finish:':'After jump '+(i+1),end]):model.rows;
  const written=isTwoWays?'':renderRows(rows);
  const modelVisual=visual?'<div class="strategy-visual">'+visual+'</div>':'';
  const borrowSwitch=isBorrowing?'<nav class="borrow-tool-switch" aria-label="Question tools"><button type="button" data-borrow-show="model" aria-pressed="'+(borrowPanel==='model')+'">Borrowing model</button><button type="button" data-borrow-show="answers" aria-pressed="'+(borrowPanel==='answers')+'">Answers</button></nav>':'';
  const arrayTools=isArray?'<div class="array-tools"><button type="button" class="array-bank" data-number="1" aria-pressed="false">'+art+
   '<span>'+esc(task.art.item)+' ∞</span></button>'+written+
   (fields.repeated?'<div class="array-choice"><span>Repeated addition</span>'+control('repeated')+'</div>':'')+
   '<button type="button" class="array-reset">Reset grid</button></div>':'';
  const heading='<h1>'+esc(task.title)+'</h1><div class="prompt">'+esc(task.prompt)+(isArray?
   '<p class="array-meta">'+esc(task.code+' · '+task.expectation)+'</p>':'')+
   '</div>';
  const twoWays=()=>'<div class="strategy two-ways"><div class="ways-problem">'+art+
   '<span>'+esc(model.equation.join(' '))+'</span></div>'+
   model.methods.map(method=>'<section class="strategy-model ways-method"><header><h2>'+esc(method.title)+'</h2><p>'+esc(method.hint)+
    '</p></header><div class="strategy-rows">'+renderRows(method.rows)+'</div></section>').join('')+'</div>';
  root.innerHTML=heading+(isTwoWays?twoWays():'<div class="strategy'+(model.type==='columns'?' algorithm':'')+
   (isArray?' array-activity':'')+
   (model.type==='doubles'?' doubles-activity':'')+
   (model.type==='two-level-parts'?' two-level-parts':'')+'"><section class="strategy-model'+(visual?'':' no-visual')+'">'+
   borrowSwitch+modelVisual+(isArray?arrayTools:'<div class="strategy-rows">'+written+
   (fields.why?'<div class="strategy-help"><label>Why does it work?</label>'+control('why')+'</div>':'')+'</div>'+
   (task.drag?'<div class="strategy-bank" aria-label="Reusable number tiles">'+task.drag.numbers.map(n=>'<button type="button" data-number="'+n+'" aria-pressed="false">'+piece(n)+'</button>').join('')+'</div>':''))+
   '</section>'+(isArray?'':'<figure class="strategy-art">'+art+'</figure>')+'</div>')+'<div id="activity-status" role="status" class="sr-only"></div>';
  const status=root.querySelector('#activity-status');
  const announce=text=>{status.textContent=text;};
  root.addEventListener('click',e=>{
   const button=e.target.closest('[data-borrow-show]');if(!button)return;
   borrowPanel=button.dataset.borrowShow;root.dataset.borrowPanel=borrowPanel;
   root.querySelectorAll('[data-borrow-show]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.borrowShow===borrowPanel)));
   stored();
  });
  if(isBorrowing)borrowAid=window.ML_BORROWING.mount(root.querySelector('.borrow-workspace'),{
   ...borrowingModel,saved:borrowTrades,onChange:trades=>{borrowTrades=trades;stored();signal('ml-state');}
  });
  function paint(spin=false){
   root.querySelectorAll('[data-value]').forEach(el=>{el.textContent=answers[el.dataset.value]??'□';});
   root.querySelectorAll('[data-digit]').forEach(el=>{
    const v=answers[el.dataset.digit];
    el.textContent=v===null?'□':String(v).at(-1-Number(el.dataset.position))??' ';
   });
   root.querySelectorAll('[data-choice]').forEach(el=>{el.value=answers[el.dataset.choice]??'';});
   root.querySelectorAll('[data-slot]').forEach(el=>{
    const key=el.dataset.slot, n=answers[key];
    el.innerHTML=isArray?(n===null?'':art):n===null?'□':piece(n);
    el.toggleAttribute('data-filled',n!==null);
    el.setAttribute('aria-label',fields[key].label+(n===null?', empty':isArray?', filled. Select to clear.':', '+n+'. Select to clear or drop a new number.'));
   });
   root.querySelectorAll('[data-number]').forEach(el=>el.setAttribute('aria-pressed',String(selected!==null&&Number(el.dataset.number)===selected)));
   for(const {key,answer,correct} of marks()){
    const holder=root.querySelector('[data-field="'+key+'"]');
    if(!holder)continue;
    holder.querySelector('.choice-mark')?.remove();
    delete holder.dataset.mark;
    if(answer===null||checked!==signature())continue;
    const badge=document.createElement('span');
    badge.className='choice-mark';
    holder.dataset.mark=correct?'correct':'retry';
    badge.textContent=correct?'✓':'↻';
    badge.setAttribute('role','img');
    badge.setAttribute('aria-label',correct?'Correct':'Try again');
    if(!spin)badge.style.animation='none';
    holder.append(badge);
   }
  }
  function change(key,value){
   if(answers[key]===value)return;
   answers[key]=value;checked='';done=false;
   stored();paint();signal('ml-state');
  }
  root.addEventListener('change',e=>{
   const key=e.target.dataset.choice;
   if(key)change(key,e.target.value===''?null:typeof fields[key].answer==='number'?Number(e.target.value):e.target.value);
  });
  const choiceSelector='[data-number],[data-slot]';
  function activateChoice(choice){
   if(choice.hasAttribute('data-number')){
    selected=Number(choice.dataset.number);
    paint();announce(isArray?'Picture selected. Choose a square.':selected+' selected. Choose a landing pad.');
    return;
   }
   const key=choice.dataset.slot;
   const value=isArray?(selected||answers[key]===null?1:null):selected;
   selected=null;change(key,value);paint();
  }
  root.addEventListener('click',e=>{
   if(e.target.closest('.array-reset')){
    for(const key of Object.keys(answers))answers[key]=null;
    selected=null;checked='';done=false;
    stored();paint();signal('ml-reset');announce('Grid cleared.');return;
   }
   const choice=e.target.closest(choiceSelector);
   if(choice&&(e.detail===0||choice!==pointerHandledChoice))activateChoice(choice);
  });
  root.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&selected!==null){selected=null;paint();}
   if(isArray&&(e.key==='Delete'||e.key==='Backspace')&&e.target.dataset.slot){
    e.preventDefault();change(e.target.dataset.slot,null);
   }
  });
  root.addEventListener('pointerdown',e=>{
   const source=e.target.closest(choiceSelector);
   const key=source?.dataset.slot;
   if(!source||!e.isPrimary||e.button!==0||drag)return;
   pointerHandledChoice=null;
   const n=key?answers[key]:Number(source.dataset.number);
   if(n===null&&e.pointerType!=='touch')return;
   drag={source,key,id:e.pointerId,n,x:e.clientX,y:e.clientY};
   source.setPointerCapture(e.pointerId);
  });
  const moved=(event,start)=>Math.hypot(event.clientX-start.x,event.clientY-start.y)>5;
  function dropTarget(e){return document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');}
  root.addEventListener('pointermove',e=>{
   if(drag?.id!==e.pointerId||drag.n===null)return;
   if(!drag.ghost&&moved(e,drag)){
    drag.ghost=document.createElement('span');drag.ghost.className=isArray?'strategy-ghost array-ghost':'strategy-ghost';drag.ghost.innerHTML=isArray?art:piece(drag.n);root.append(drag.ghost);
   }
   if(!drag.ghost)return;
   drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
   drag.hover?.removeAttribute('data-hover');drag.hover=dropTarget(e);drag.hover?.setAttribute('data-hover','');
  });
  function end(e,cancelled){
   if(drag?.id!==e.pointerId)return;
   const d=drag;drag=null;
   d.ghost?.remove();d.hover?.removeAttribute('data-hover');
   if(cancelled)return;
   if(!d.ghost){
    // A browser can omit the synthetic click on a new tap immediately after dragging.
    if(e.pointerType==='touch'){
     pointerHandledChoice=d.source;
     if(!moved(e,d)&&document.elementFromPoint(e.clientX,e.clientY)?.closest(choiceSelector)===d.source)activateChoice(d.source);
    }
    return;
   }
   pointerHandledChoice=d.source;
   const target=dropTarget(e);
   if(target&&target.dataset.slot!==d.key){
    selected=null;
    if(d.key){
     answers[d.key]=answers[target.dataset.slot];
     answers[target.dataset.slot]=d.n;
     checked='';done=false;stored();paint();signal('ml-state');
    }else{change(target.dataset.slot,d.n);paint();}
    announce(d.n+' placed.');
   }
  }
  root.addEventListener('pointerup',e=>end(e,false));
  root.addEventListener('pointercancel',e=>end(e,true));
  root.addEventListener('lostpointercapture',e=>end(e,true));
  window.ML_ENGINE={get:snapshot,check(){checked=signature();stored();paint(true);const s=snapshot();announce(s.assessment.message);return s;},setDone(v){done=Boolean(v);stored();}};
  paint();
  signal('ml-ready');
 }
 window.ML_NOVEMBER_STRATEGY_ENGINE={styles,boot};
})();
