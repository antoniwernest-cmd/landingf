/* Connect the written addition algorithm to drawings of place-value trades. */
(() => {
 'use strict';
 const styles = `
 .activity:has(.vertical-work){gap:clamp(4px,1vh,10px);padding-block:clamp(6px,1.35vh,16px)}
 .vertical-work{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(5px,1vw,16px);min-height:0}
 .vertical-model,.vertical-paper{display:grid;min-height:0;min-width:0;border:1px solid #afd1c9;border-radius:15px;padding:clamp(6px,1vw,15px);background:#fffefa}
 .vertical-model{grid-template-rows:auto minmax(0,1fr);gap:5px;background:#e8f5ef}
 .vertical-model header{display:flex;gap:8px;align-items:center;line-height:1.15;font-size:clamp(13px,1.6vw,22px);font-weight:bold}
 .vertical-model header img{width:clamp(26px,7vh,64px);height:clamp(26px,7vh,64px);object-fit:contain}
 .vertical-model header span{display:block;font-size:.83em;font-weight:400}
 .vertical-columns{display:grid;grid-template-columns:repeat(var(--places),minmax(0,1fr));gap:clamp(3px,.7vw,10px);min-height:0}
 .vertical-place{min-width:0;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;align-items:stretch;text-align:center;gap:3px;background:#fbfdf9;border:1px solid #bdd6cc;border-radius:10px;padding:3px}
 .vertical-place h2,.vertical-heading{font-size:clamp(11px,1.5vw,22px);line-height:1.12;margin:0;color:#255350}
 .vertical-pieces{width:100%;height:100%;min-height:0;touch-action:none;user-select:none}
 .vertical-pieces[data-ready]{cursor:grab}
 .vertical-piece{fill:#49b9ad;stroke:#157a74}
 .vertical-piece[data-group="1"]{fill:#a99ae0;stroke:#6b56a4}
 .vertical-piece[data-group="2"]{fill:#f4ce68;stroke:#966714}
 .vertical-frame{fill:none;stroke:#bfd5ca;stroke-width:1.6}
 .vertical-bundle{fill:#fff2c8;stroke:#a7701d;stroke-width:2.8;stroke-dasharray:5 3}
 .vertical-trade,.vertical-reset{min-width:0;min-height:38px;color:#174840;background:#fffefa;border:1px solid #6f9e90;border-radius:8px;padding:2px 4px;font-weight:bold;font-size:clamp(10px,1.18vw,17px);line-height:1.1}
 .vertical-trade:not(:disabled){background:#ffebaa;border-color:#98701f}
 .vertical-trade:disabled{cursor:default;opacity:.73}
 .vertical-paper{grid-template-rows:minmax(0,1fr) auto;gap:5px;background:linear-gradient(180deg,#fffefa,#fef9e8)}
 .vertical-equation{--carry-number-size:clamp(16px,.72em,52px);width:min(100%,620px);height:100%;min-height:0;position:relative;justify-self:center;display:grid;grid-template-columns:1em repeat(var(--places),minmax(0,1fr));grid-template-rows:auto repeat(4,minmax(0,1fr));gap:clamp(2px,.7vh,7px);align-items:center;text-align:center;font-size:clamp(21px,min(6vw,9vh),76px);font-weight:900;line-height:1}
 .vertical-equation[data-carry-open]{grid-template-rows:auto repeat(3,minmax(0,1fr)) clamp(25px,6vh,38px) minmax(34px,1fr)}
 .vertical-equation>*{min-width:0;min-height:0}
 .vertical-equation{column-gap:0}
 .vertical-heading{padding:4px 0;margin-inline:2px;background:#e5f2e9;border-radius:5px}
 .vertical-addend{font-variant-numeric:tabular-nums}
 .vertical-addend.first{color:#0f736e}
 .vertical-addend.second{color:#65529f}
 .vertical-carry{display:grid;place-content:center;position:relative;height:100%;max-height:62px;margin:0 2px;border:1px dashed #af9962;border-radius:8px;color:#78530d;background:#fff9e5;font-size:.6em}
 .vertical-carry[data-filled]{background:#ffe59b;border-style:solid}
 .vertical-carry[data-carry-cue]{border-color:#976416;background:#fff1b4;box-shadow:inset 0 0 0 1px #bc861f;animation:vertical-pad-pulse 1.4s ease-out 3}
 @keyframes vertical-pad-pulse{
  0%,100%{box-shadow:inset 0 0 0 1px #bc861f,0 0 0 0 #e6a92900}
  55%{box-shadow:inset 0 0 0 2px #bc861f,0 0 0 4px #e6a92970,0 0 12px #f4b637a6}
 }
 [data-carry-target][data-over]{outline:3px solid #b17a15;background:#ffd66c}
 .vertical-result{order:1;display:grid;grid-template-columns:minmax(0,1fr);position:relative;border-top:3px solid #26514d;align-content:center;height:100%;padding:2px 2px 0}
 .vertical-equation[data-carry-open] .vertical-result{grid-template-rows:minmax(0,1fr);align-items:center}
 .vertical-result select{min-width:0;width:100%;height:100%;min-height:36px;max-height:86px;text-align:center;text-align-last:center;color:#173f3b;background:#e8f5ee;border:1px solid #548477;border-radius:9px;font:inherit;font-size:.8em;padding:0}
 .vertical-result[data-carry-ready] select{appearance:none;font-size:var(--carry-number-size);font-variant-numeric:tabular-nums}
 .vertical-result[data-carry-ready]::after{content:"";position:absolute;right:9%;top:50%;width:5px;height:5px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-65%) rotate(45deg);pointer-events:none}
 .vertical-equation:not([data-carry-open]) .vertical-transfer-slot{display:none}
 .vertical-transfer-slot{height:100%;position:relative;left:-.5ch;font-size:var(--carry-number-size);font-variant-numeric:tabular-nums}
 .vertical-carry-chip{position:absolute;z-index:2;left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;gap:2px;width:clamp(38px,5.1vw,66px);max-width:100%;height:100%;padding:2px;border:1px solid #9c782a;border-radius:7px;background:#ffebaa;color:#67420b;font-size:clamp(12px,1.4vw,21px);font-weight:bold;cursor:grab;touch-action:none;box-shadow:0 0 8px #e8a82e8c}
 .vertical-carry-chip:active{cursor:grabbing}
 .vertical-carry-chip:focus-visible{outline:3px solid #205d94;outline-offset:2px}
 .vertical-carry-chip[hidden]{display:none}
 .vertical-carry-arrow{line-height:1}
 .vertical-ladder{position:absolute;grid-column:var(--ladder-column) / span 1;grid-row:2 / 6;inset:2px 2px 0 auto;width:clamp(8px,1vw,14px);color:#a87529;border-inline:2px solid currentColor;border-radius:2px;background:repeating-linear-gradient(to bottom,transparent 0 7px,currentColor 7px 9px,transparent 9px 12px);pointer-events:none}
 .vertical-grab-hand{display:inline-block;line-height:1;animation:vertical-hand-spin .72s ease-out}
 @keyframes vertical-hand-spin{from{transform:rotate(-360deg) scale(.6)}to{transform:rotate(0) scale(1)}}
 .vertical-actions{display:flex;justify-content:space-between;align-items:center;gap:5px}
 .vertical-actions p{font-size:clamp(10px,1.28vw,18px);font-weight:bold;line-height:1.15}
 .vertical-reset{white-space:nowrap;padding-inline:8px}
 .vertical-badge{display:none;position:absolute;right:-2px;top:-4px;z-index:1;pointer-events:none;place-items:center;width:clamp(17px,3vh,28px);aspect-ratio:1;border-radius:50%;font:bold clamp(11px,2.45vh,22px)/1 sans-serif;color:white;background:#167047;box-shadow:0 0 9px #48de81}
 [data-mark]>.vertical-badge{display:grid}
 [data-mark="retry"]>.vertical-badge{background:#a13930;box-shadow:none}
 [data-mark="correct"]>.vertical-badge[data-spin]{animation:vertical-check .5s ease-out}
 @keyframes vertical-check{from{transform:rotate(-360deg) scale(.6)}to{transform:rotate(0) scale(1)}}
 @media(prefers-reduced-motion:reduce){
  [data-mark="correct"]>.vertical-badge[data-spin],.vertical-grab-hand,.vertical-carry[data-carry-cue]{animation:none}
 }
 .vertical-ghost{display:grid;place-items:center;position:fixed;z-index:20;pointer-events:none;transform:translate(-50%,-50%);width:44px;height:44px;border:2px solid #95620e;border-radius:9px;background:#ffe39a;color:#493100;font-weight:bold}
 .vertical-work.vertical-block-rows{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
 .block-side{display:grid;min-width:0;min-height:0;grid-template-rows:minmax(0,1fr);gap:5px}
 .block-side.tens-side{grid-template-rows:minmax(0,1fr) clamp(50px,12vh,95px)}
 .block-side .vertical-place{padding:clamp(3px,.8vw,10px)}
 .block-side .vertical-place h2{font-size:clamp(12px,2vw,24px)}
 .tens-side .vertical-place:last-child{grid-template-rows:auto minmax(0,1fr)}
 .vertical-block-rows .vertical-paper{grid-column:2;grid-row:1;background:linear-gradient(#f4f9ff,#e3eeff);border-color:#a4bed7}
 .vertical-block-rows .vertical-equation{width:100%}
 .vertical-block-rows .vertical-heading{background:#dbe9fa}
 .vertical-block-rows .vertical-carry{border-color:#9c782a}
 @media(max-width:640px) and (orientation:portrait){
  .vertical-work.vertical-block-rows{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,1fr) minmax(0,1fr)}
  .vertical-block-rows .vertical-paper{grid-column:1/-1;grid-row:2}
  .block-side.tens-side{grid-template-rows:minmax(0,2.35fr) minmax(0,1fr)}
 }
 @media(max-width:600px) and (orientation:portrait){
  .vertical-work{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1.12fr) minmax(0,1fr)}
  .vertical-model header img{width:28px;height:28px}
  .vertical-model header span{display:inline;margin-left:5px}
  .vertical-paper{gap:3px}
  .vertical-equation{font-size:clamp(23px,7.5vw,44px)}
  .vertical-place h2,.vertical-heading{font-size:clamp(11px,3vw,17px)}
 }
 @media(max-height:440px){
  .vertical-model,.vertical-paper{padding:4px}
  .vertical-model header img{width:25px;height:25px}
  .vertical-trade,.vertical-reset{min-height:29px}
  .vertical-result select{min-height:30px}
 }
 @media(max-width:640px) and (orientation:portrait){
  .vertical-equation[data-carry-open]{font-size:clamp(21px,6vw,34px);grid-template-rows:auto repeat(3,minmax(0,1fr)) 25px minmax(34px,1fr);row-gap:3px}
  .vertical-equation[data-carry-open] .vertical-result select{min-height:0}
 }
 @media print{.activity:has(.vertical-work){height:166mm;overflow:hidden;break-inside:avoid}.vertical-actions{visibility:hidden}}
 `;
 function boot() {
  const cfg = window.ML_CONFIG, task = cfg.task;
  const root = document.querySelector('.activity');
  const [a,b] = task.addends, sum = a+b;
  const places = Math.max(cfg.grade === 3 ? 3 : 2, String(sum).length);
  const names = ['Ones','Tens','Hundreds','Thousands'];
  const values = Array.from({length:places}, (_, i) => 10 ** i);
  const digits = n => values.map(value => Math.floor(n/value) % 10);
  const first = digits(a), second = digits(b), result = digits(sum);
  const placesLeftToRight = values.map((_, i) => i).reverse();
  const requiredCarries = [];
  const firstResultPlace = String(sum).length-1;
  for (let i=0;i<places-1;i++) {
   if (first[i]+second[i]+Number(requiredCarries.includes(i-1)) >= 10) requiredCarries.push(i);
  }
  const key = 'math-landing:november-addition:' + cfg.student + ':' + cfg.id + ':' + cfg.revision;
  let saved = {};
  if (!cfg.cataloguePreview) {
   try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  }
  const carried = values.map((_,i) => requiredCarries.includes(i) && saved.carried?.[i] === true);
  const answers = values.map((_,i) => (/^[0-9]$/.test(saved.answers?.[i]) ||
   (i<places-1&&!carried[i]&&/^1[0-9]$/.test(saved.answers?.[i]))) ? String(saved.answers[i]) : '');
  let checked = saved.checked || '', done = saved.done === true, drag = null, suppressCarryClick = false;
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const signature = () => JSON.stringify({carried,answers});
  const signal = type => { if (!cfg.cataloguePreview) parent.postMessage({type,id:cfg.id},'*'); };
  function persist() {
   if (!cfg.cataloguePreview) {
    try { localStorage.setItem(key,JSON.stringify({carried,answers,checked,done})); } catch {}
   }
  }
  const each = callback => placesLeftToRight.map(callback).join('');
  const badge = '<span class="vertical-badge" aria-hidden="true"></span>';
  const blank = '<span></span>';
  function place(i) {
   const label = task.blockRows && i<2 ? names[i]+' blocks' : names[i];
   return '<section class="vertical-place"><h2>'+label+'</h2><svg class="vertical-pieces" data-source="'+i+
    '" role="img"></svg>'+ (i<places-1?'<button type="button" class="vertical-trade" data-trade="'+i+'"></button>':task.blockRows?'':blank)+'</section>';
  }
  const numberRow = (number,parts,style) => each(i => '<span class="vertical-addend '+style+'">'+(number>=values[i]?parts[i]:'')+'</span>');
  const totalOptions = length=>'<option value="">□</option>'+Array.from({length},(_,n)=>'<option value="'+n+'">'+n+'</option>').join('');
  const digitOptions=totalOptions(10), columnOptions=totalOptions(20);
  document.title = task.title;
  const models = task.blockRows
   ? '<div class="block-side tens-side">'+place(1)+place(2)+'</div><div class="block-side">'+place(0)+'</div>'
   : '<section class="vertical-model" aria-label="Place value model"><header><img src="'+escape(task.picture)+'" alt="" draggable="false"><div>Place value <span>'+
    'Choose a column total. Drag the 1 up to carry.</span></div></header><div class="vertical-columns">'+each(place)+'</div></section>';
  root.innerHTML = '<h1>'+escape(task.title)+'</h1><p class="prompt">'+escape(task.prompt)+'</p>'+
   '<div class="vertical-work'+(task.blockRows?' vertical-block-rows':'')+'" style="--places:'+places+'">'+models+
   '<section class="vertical-paper" aria-label="Stacked addition"><div class="vertical-equation">'+
   blank+each(i=>'<span class="vertical-heading"'+(i?' data-carry-target="'+i+'"':'')+'>'+names[i]+'</span>')+
   blank+each(i=>i?'<div class="vertical-carry" data-carry="'+i+'" data-carry-target="'+i+'" role="img"><span></span>'+badge+'</div>':blank)+
   blank+numberRow(a,first,'first')+'<span>+</span>'+numberRow(b,second,'second')+
   '<div class="vertical-result" aria-hidden="true"></div>'+each(i=>'<div class="vertical-result" data-result="'+i+'"><select></select>'+badge+'</div>')+
   '<span class="vertical-transfer-slot"></span>'+each(i=>'<div class="vertical-transfer-slot">'+
    (i<places-1?'<button type="button" class="vertical-carry-chip" data-carry-source="'+i+'" aria-label="Carry 1 to '+names[i+1].toLowerCase()+'" title="Drag or tap to carry 1 to '+names[i+1].toLowerCase()+'" hidden>1 <span class="vertical-grab-hand" aria-hidden="true">✋</span> <span class="vertical-carry-arrow" aria-hidden="true">↑</span></button>':'')+
    '</div>')+
   each(i=>i<places-1?'<span class="vertical-ladder" data-ladder-for="'+i+'" style="--ladder-column:'+(places-i)+'" aria-hidden="true" hidden></span>':'')+
   '</div><div class="vertical-actions"><p role="status" id="vertical-status">Choose the ones total first.</p><button type="button" class="vertical-reset">Reset</button></div></section></div>';
  const status = root.querySelector('#vertical-status');
  const equation = root.querySelector('.vertical-equation');
  const model = values.map((_,i)=>root.querySelector('[data-source="'+i+'"]'));
  const trade = values.map((_,i)=>root.querySelector('[data-trade="'+i+'"]'));
  const carryBox = values.map((_,i)=>root.querySelector('[data-carry="'+i+'"]'));
  const carryTargets = values.map((_,i)=>root.querySelectorAll('[data-carry-target="'+i+'"]'));
  const resultBox = values.map((_,i)=>root.querySelector('[data-result="'+i+'"]'));
  const picks = resultBox.map(box=>box.querySelector('select'));
  const chips = values.map((_,i)=>root.querySelector('[data-carry-source="'+i+'"]'));
  const ladders = values.map((_,i)=>root.querySelector('[data-ladder-for="'+i+'"]'));
  const addendRows = ['first','second'].map(style=>root.querySelector('.vertical-addend.'+style));
  const pieces = i => [...Array(first[i]).fill(0),...Array(second[i]).fill(1),...(carried[i-1]?[2]:[])].slice(carried[i]?10:0);
  const canTrade = i => i < places-1 && !carried[i] && pieces(i).length>=10;
  const tradeLabel = i => 'Trade 10 '+names[i].toLowerCase();
  const description = i => i===0?'one':i===1?'ten':i===2?'hundred':'thousand';
  const picture = escape(task.picture);
  function drawPiece(i, x, y, group) {
   let drawing;
   if (cfg.grade===1 && i===0) {
    drawing = '<rect width="42" height="42" rx="8"/><image href="'+picture+'" x="3" y="3" width="36" height="36"/>';
   } else if (i===1) {
    drawing = '<rect x="14" width="13" height="42" rx="2"/><path d="'+Array.from({length:9},(_,j)=>'M14 '+(j+1)*4.2+'h13').join(' ')+'"/>';
   } else if (i===2 || i===3) {
    const grid = Array.from({length:9},(_,j)=>'M'+(j+1)*4+' 0v40 M0 '+(j+1)*4+'h40').join(' ');
    const depth = i===3?'<path d="M0 0l5-5h40v40l-5 5V0Z"/>':'';
    drawing = depth+'<rect width="40" height="40"/><path d="'+grid+'" stroke-width=".65"/>';
   } else {
    drawing = '<path d="M8 14l9-7h24v24l-9 8H8z"/><path d="M8 14h24l9-7m-9 7v25" fill="none"/><path d="M13 18v14h13" fill="none" stroke="white" opacity=".45"/>';
   }
   return '<g class="vertical-piece" data-group="'+group+'" transform="translate('+x+' '+y+')">'+drawing+'</g>';
  }
  function drawAddendRows(svg, i, tokens, active) {
   const columns = Math.max(2,first[i],second[i]);
   const counts = [0,1,2].map(group=>tokens.filter(token=>token===group).length);
   const positions = [0,0,0];
   const bounds = svg.getBoundingClientRect();
   const width = Math.max(1,bounds.width), height = Math.max(1,bounds.height);
   const centers = addendRows.map(row=>{
    const rect = row.getBoundingClientRect();
    return rect.top+rect.height/2-bounds.top;
   });
   const matchesEquation = centers[0]>0 && centers[1]<height;
   const pictureSize = Math.min(width/columns, height/(counts[2]?3:2), 76);
   const [top,bottom] = matchesEquation ? centers : [height*(counts[2] ? .51 : .32), height*(counts[2] ? .83 : .69)];
   const rowCenters = [top,bottom,Math.max(pictureSize/2,top-pictureSize)];
   const size = pictureSize/48;
   svg.setAttribute('viewBox','0 0 '+width+' '+height);
   svg.innerHTML = tokens.map((group,index)=>{
    const inset = i===1?width-counts[group]*pictureSize:0;
    const x = inset+positions[group]++*pictureSize;
    const y = Math.min(height-pictureSize,Math.max(0,rowCenters[group]-pictureSize/2));
    const outline = active&&index<10 ? '<rect class="vertical-bundle" x="1" y="1" width="46" height="46" rx="7"/>' : '';
    return '<g transform="translate('+x+' '+y+') scale('+size+')">'+outline+drawPiece(i,3,3,group)+'</g>';
   }).join('');
  }
  function drawGrid(svg, i, tokens, active) {
   const tenFrame = i===0 && cfg.grade===1;
   const slots = tenFrame ? Math.max(10,Math.ceil(tokens.length/5)*5) : tokens.length;
   const {width,height}=svg.getBoundingClientRect();
   const fit = columns => Math.min(width/(columns*48+8),height/(Math.max(1,Math.ceil(slots/columns))*48+4));
   const candidates = tenFrame?[5]:active?[2,5]:[1,2,3,4,5].slice(0,Math.max(1,slots));
   const columns = candidates.reduce((best,n)=>fit(n)>fit(best)?n:best);
   const rows = Math.max(1,Math.ceil(slots/columns));
   const location = n => [7+n%columns*48,6+Math.floor(n/columns)*48];
   const gridWidth = columns*48+8;
   // Keep a lone unit cube from growing to fill the ones column.
   const viewWidth = i===0 ? Math.max(gridWidth,width/1.25) : gridWidth;
   svg.setAttribute('viewBox',((gridWidth-viewWidth)/2)+' 0 '+viewWidth+' '+(rows*48+4));
   let drawing = active?'<rect class="vertical-bundle" x="3" y="2" width="'+(columns*48+2)+'" height="'+(10/columns*48)+'" rx="9"/>':'';
   for (let n=0;n<slots;n++) {
    const [x,y] = location(n);
    if (n < tokens.length) drawing += drawPiece(i,x,y,tokens[n]);
    else drawing += '<rect class="vertical-frame" x="'+x+'" y="'+y+'" width="42" height="42" rx="8"/>';
   }
   svg.innerHTML = drawing;
  }
  function drawPlace(i) {
   const svg = model[i], tokens = pieces(i), active = canTrade(i);
   svg.setAttribute('aria-label',tokens.length+' '+names[i].toLowerCase()+(active?', a group of ten can be traded.':'.'));
   svg.toggleAttribute('data-ready',active);
   if (task.blockRows && i<2) drawAddendRows(svg,i,tokens,active);
   else drawGrid(svg,i,tokens,active);
   if (trade[i]) {
    trade[i].textContent = carried[i] ? 'Carried ✓' : tradeLabel(i);
    trade[i].disabled = !active;
   }
   if (carryBox[i]) {
    const hasCarry = carried[i-1];
    carryBox[i].firstElementChild.textContent = hasCarry?'1':'';
    carryBox[i].toggleAttribute('data-filled',hasCarry);
    carryBox[i].setAttribute('aria-label',(hasCarry?'Carried 1 to ':'Empty carry box for ')+names[i].toLowerCase());
   }
  }
  const isColumnTotal=i=>!carried[i]&&Number(answers[i])>=10;
  const expectedChoice=i=>String(isColumnTotal(i)?pieces(i).length:result[i]);
  function digitCorrect(i) {
   return i > firstResultPlace ? answers[i]==='' || answers[i]==='0' : answers[i]===expectedChoice(i);
  }
  function mark(box, correct, spin) {
   const symbol = box.querySelector('.vertical-badge');
   if (correct===null) { delete box.dataset.mark; return; }
   box.dataset.mark = correct?'correct':'retry';
   symbol.textContent = correct?'✓':'↻';
   symbol.toggleAttribute('data-spin',spin && correct);
  }
  function snapshot() {
   const marks = [
    ...requiredCarries.map(i=>({field:'trade-'+i,label:'Trade '+names[i].toLowerCase(),answer:carried[i]?'1 '+description(i+1):'',expected:'1 '+description(i+1),correct:carried[i]})),
    ...values.flatMap((_,i)=>i>firstResultPlace && answers[i]===''?[]:[{field:'digit-'+i,label:names[i]+(isColumnTotal(i)?' column total':' digit'),answer:answers[i],expected:expectedChoice(i),correct:digitCorrect(i)}])
   ];
   const score=marks.filter(item=>item.correct).length;
   const complete=requiredCarries.every(i=>carried[i]) && answers.slice(0,firstResultPlace+1).every(value=>value!=='');
   const correct=complete&&score===marks.length, isChecked=checked===signature();
   const message=correct?'Your trades and sum are correct.':!complete?'Check each column total, then finish any carries.':'Check the marked digits and try again.';
   const items=marks.map(m=>({...m,id:m.field,actual:m.answer,entered:m.answer!=='',counted:true,checked:isChecked}));
   return {done,response:{answers:Object.fromEntries(marks.map(({label,answer})=>[label,answer])),marks},
    assessment:{signature:signature(),checked:isChecked,complete,correct:isChecked&&correct,answerCorrect:correct,message,score,total:marks.length,answerChecks:items,
     partAssessment:{version:2,checked:isChecked,correct:isChecked?score:0,total:marks.length,items}}};
  }
  function paint(spin=false) {
   const isChecked = checked===signature();
   for (let i=0;i<places;i++) {
    drawPlace(i);
    const allowsTotal=i<places-1&&!carried[i], showChip=allowsTotal&&isColumnTotal(i);
    const options=allowsTotal?columnOptions:digitOptions;
    if(picks[i].options.length!==(allowsTotal?21:11))picks[i].innerHTML=options;
    picks[i].setAttribute('aria-label',names[i]+(allowsTotal?' column total':' digit of the sum'));
    picks[i].value = answers[i];
    resultBox[i].toggleAttribute('data-carry-ready',showChip);
    if(chips[i]){
     chips[i].hidden=!showChip;
     ladders[i].hidden=!showChip;
    }
    mark(resultBox[i],isChecked&&(i<=firstResultPlace||answers[i]!=='')?digitCorrect(i):null,spin);
    if (carryBox[i]) {
     carryBox[i].toggleAttribute('data-carry-cue',!chips[i-1].hidden&&canTrade(i-1));
     mark(carryBox[i],isChecked&&requiredCarries.includes(i-1)?carried[i-1]:null,spin);
    }
   }
   equation.toggleAttribute('data-carry-open',chips.some(chip=>chip&&!chip.hidden));
  }
  function change(message,type='ml-state') {
   checked='';done=false;persist();paint();status.textContent=message;signal(type);
  }
  function exchange(i) {
   if (!canTrade(i)) {
    status.textContent='You need a group of ten in the '+names[i].toLowerCase()+' column to carry.';
    return false;
   }
   const total=isColumnTotal(i)?Number(answers[i]):pieces(i).length;
   carried[i]=true;
   answers[i]=String(total-10);
   change('Carried 1 '+description(i+1)+'. '+answers[i]+' stays in the '+names[i].toLowerCase()+' column.');
   return true;
  }
  root.addEventListener('click',event=>{
   const button=event.target.closest('[data-trade],[data-carry-source]');
   if (button && !(suppressCarryClick&&event.detail!==0)) {
    const i=Number(button.dataset.carrySource??button.dataset.trade);
    if(exchange(i)&&event.detail===0)picks[i+1].focus();
   }
   if (event.target.closest('.vertical-reset')) {
    carried.fill(false);answers.fill('');change('Choose the ones total first.','ml-reset');
   }
  });
  root.addEventListener('change',event=>{
   const i=picks.indexOf(event.target);
   if (i<0) return;
   answers[i]=picks[i].value;
   change(isColumnTotal(i)?'Drag 1 up to '+names[i+1]+', or tap the hand.':'Column value entered.');
  });
  function moveGhost(event) {
   drag.ghost.style.left=event.clientX+'px';
   drag.ghost.style.top=event.clientY+'px';
  }
  function overDestination(event,i) {
   const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-carry-target]');
   return target?.dataset.carryTarget===String(i+1);
  }
  function highlightDestination(i,highlight) {
   for(const target of carryTargets[i+1])target.toggleAttribute('data-over',highlight);
  }
  root.addEventListener('pointerdown',event=>{
   const source=event.target.closest('[data-carry-source]:not([hidden]),[data-source][data-ready]');
   if (!source || drag || event.button!==0) return;
   const fromChip=source.hasAttribute('data-carry-source');
   const i=Number(source.dataset.carrySource??source.dataset.source);
   drag={id:event.pointerId,i,fromChip,x:event.clientX,y:event.clientY};
   source.setPointerCapture(event.pointerId);
  });
  root.addEventListener('pointermove',event=>{
   if (drag?.id!==event.pointerId) return;
   if (!drag.ghost && Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>5) {
    drag.ghost=document.createElement('span');drag.ghost.className='vertical-ghost';
    drag.ghost.textContent=drag.fromChip?'1':'10';drag.ghost.setAttribute('aria-hidden','true');root.append(drag.ghost);
   }
   if (!drag.ghost) return;
   moveGhost(event);
   highlightDestination(drag.i,overDestination(event,drag.i));
  });
  function endDrag(event,cancelled=false) {
   if (drag?.id!==event.pointerId) return;
   const {i,ghost,fromChip}=drag;
   drag=null;
   ghost?.remove();
   highlightDestination(i,false);
   if (ghost && !cancelled) {
    if(fromChip){
     suppressCarryClick=true;
     setTimeout(()=>{suppressCarryClick=false;},0);
    }
    if (overDestination(event,i)) exchange(i);
    else status.textContent='Drop '+(fromChip?'the 1':'the group')+' at the top of the '+names[i+1].toLowerCase()+' column.';
   }
  }
  root.addEventListener('pointerup',event=>endDrag(event));
  for (const event of ['pointercancel','lostpointercapture']) root.addEventListener(event,e=>endDrag(e,true));
  window.ML_ENGINE = {
   get:snapshot,
   check(){checked=signature();persist();paint(true);const current=snapshot();status.textContent=current.assessment.message;return current;},
   setDone(value){done=Boolean(value);persist();}
  };
  paint();
  const observer = new ResizeObserver(()=>{ for (const i of values.keys()) drawPlace(i); });
  model.forEach(svg=>observer.observe(svg));
  if (checked===signature()) status.textContent=snapshot().assessment.message;
  signal('ml-ready');
 }
 window.ML_NOVEMBER_VERTICAL_ENGINE = {styles,boot};
})();
