/* One aligned subtraction, with the response directly below its digits. */
(() => {
 function subtractionFactory() {
  const placeNames=['Ones','Tens','Hundreds','Thousands'];
  function numbers(task) {
   const model=task.model;
   if(model?.type==='columns'&&model.symbol==='−')return {a:model.a,b:model.b};
   if(model?.borrow)return model.borrow;
   if(model?.type==='ten'&&task.title==='Subtract ones')return {a:model.start,b:model.rows[0][2]};
   return null;
  }
  const expectedDigits=(a,b)=>String(a-b).padStart(Math.max(2,String(a).length),'0').split('').reverse().map(Number);
  function restoreDigits(saved,expected) {
   if(Array.isArray(saved.columnDigits))return expected.map((_,p)=>Number.isInteger(saved.columnDigits[p])&&saved.columnDigits[p]>=0&&saved.columnDigits[p]<=9?saved.columnDigits[p]:null);
   const total=saved.answers?.total;
   return typeof total==='number'&&Number.isInteger(total)&&total>=0&&total<10**expected.length
    ? expected.map((_,p)=>Math.floor(total/10**p)%10):expected.map(()=>null);
  }
  const styles=`
  .simple-subtraction-activity{gap:clamp(5px,1.2vh,12px);padding:clamp(7px,1.5vh,17px) clamp(7px,1.2vw,19px)}
  .simple-subtraction-activity h1{font-size:clamp(27px,4.1vw,49px)}
  .simple-subtraction-activity>.prompt{font-size:clamp(17px,2.3vw,30px);line-height:1.2}
  .simple-subtraction-stage{display:grid;grid-template-columns:minmax(0,1fr) minmax(100px,23%);gap:clamp(8px,1.3vw,20px);min-height:0}
  .simple-subtraction-stage.has-borrow{grid-template-columns:minmax(0,1fr) minmax(80px,14%)}
  .subtraction-answer-panel,.simple-subtraction-art{min-width:0;min-height:0;border:1px solid #b5d3cd;border-radius:16px;background:#fffefa;padding:clamp(9px,1.7vh,21px)}
  .subtraction-answer-panel{display:grid;grid-template-rows:auto minmax(0,1fr);gap:clamp(6px,1.3vh,15px)}
  .subtraction-answer-panel.with-borrow{grid-template-rows:minmax(0,1fr)}
  .subtraction-direction{font-size:clamp(15px,1.6vw,22px);font-weight:bold;color:#315a59;margin:0}
  .simple-subtraction-art{display:grid;place-items:stretch;background:radial-gradient(ellipse at 50% 60%,#fcfffd,#e0f0ec);margin:0}
  .simple-subtraction-art img{width:100%;height:100%;min-height:0;object-fit:contain;padding:clamp(5px,1.3vw,20px)}
  .simple-subtraction-grid{display:grid;grid-template-columns:1em repeat(var(--subtraction-places),minmax(0,1fr));grid-template-rows:auto repeat(2,minmax(0,1fr)) minmax(60px,1.1fr);gap:clamp(4px,1vh,12px) 4px;align-items:center;text-align:center;min-height:0;font-size:clamp(39px,min(8vw,13vh),92px);font-weight:bold;line-height:1.05}
  .simple-subtraction-grid .place-heading{font-size:clamp(15px,1.9vw,25px);color:#365e5b;background:#e6f3ed;border-radius:7px;padding:4px 2px}
  .subtraction-result{border-top:3px solid #477577;align-self:stretch;display:grid;place-items:center;min-height:0;padding-top:clamp(6px,1.4vh,16px)}
  .subtraction-choice{position:relative;display:inline-flex;justify-content:center;max-width:100%;min-width:0}
  .subtraction-choice select{font:700 clamp(30px,min(6vw,9vh),65px)/1 Andika,sans-serif;color:#194e51;background:#edf8f3;border:2px solid #78a69a;border-radius:11px;width:clamp(64px,9vw,123px);max-width:100%;min-height:clamp(52px,12vh,100px);padding:4px 6px;text-align:center}
  .subtraction-choice select:focus-visible{outline:3px solid #7150b1;outline-offset:2px}
  .subtraction-choice[data-mark=correct] select{border-color:#2c8c52;background:#eef9e9}
  .subtraction-choice[data-mark=retry] select{border-color:#bd582b;background:#fff5e9}
  .subtraction-choice .digit-mark{position:absolute;right:-8px;top:-7px;border-radius:50%;background:#fffefa;font:700 22px Andika,sans-serif;color:#26844d;pointer-events:none}
  .subtraction-choice[data-mark=retry] .digit-mark{color:#ae4f27}
  .simple-subtraction-stage .borrow-result{display:grid;place-items:center;min-width:0}
  .simple-subtraction-stage .borrow-result select{font-size:clamp(25px,min(5vw,7vh),48px);min-height:clamp(44px,9vh,74px);width:clamp(60px,8vw,108px)}
  .simple-subtraction-stage .borrow-written{font-size:clamp(26px,min(4vw,8.5vh),54px)}
  .simple-subtraction-stage .borrow-chart{margin-left:clamp(29px,min(4.4vw,9.35vh),59px)}
  @media(max-width:760px){
   .simple-subtraction-stage,.simple-subtraction-stage.has-borrow{grid-template-columns:minmax(0,1fr)}
   .simple-subtraction-art{display:none}
   .subtraction-answer-panel{padding:8px}
   .simple-subtraction-grid .place-heading{font-size:clamp(13px,3.1vw,22px)}
  }
  @media(max-width:480px){
   .simple-subtraction-activity h1{font-size:clamp(24px,6.4vw,32px)}
   .simple-subtraction-activity>.prompt{font-size:17px}
   .simple-subtraction-grid{font-size:clamp(42px,12vw,60px)}
   .subtraction-choice select{font-size:33px;min-height:54px;width:69px}
   .simple-subtraction-stage .borrow-written{font-size:28px}
   .simple-subtraction-stage .borrow-result select{font-size:25px;min-height:45px;width:52px;padding:2px}
   .simple-subtraction-stage .borrow-column h2{font-size:13px;letter-spacing:-.2px}
  }
  @media(max-height:550px){
   .simple-subtraction-stage .borrow-workspace{grid-template-rows:auto minmax(126px,1fr) auto auto;gap:4px}
   .simple-subtraction-stage .borrow-written{font-size:clamp(25px,5.5vh,30px)}
   .simple-subtraction-stage .borrow-result select{font-size:28px;min-height:44px}
   .simple-subtraction-stage .borrow-instruction,.simple-subtraction-stage .borrow-status{font-size:14px}
  }
  @media print{.simple-subtraction-activity{break-inside:avoid;contain:layout}.subtraction-choice select{appearance:none;-webkit-appearance:none}}
  `;
  function boot() {
   const cfg=window.ML_CONFIG,task=cfg.task,{a,b}=numbers(task),expected=expectedDigits(a,b),width=expected.length;
   const root=document.querySelector('.activity'),key='math-landing:november-addition:'+cfg.student+':'+cfg.id+':'+cfg.revision;
   const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   const signal=type=>{if(!cfg.cataloguePreview)parent.postMessage({type,id:cfg.id},'*');};
   let saved={};if(!cfg.cataloguePreview)try{saved=JSON.parse(localStorage.getItem(key))||{}}catch{}
   let digits=restoreDigits(saved,expected),trades=Array.isArray(saved.borrowTrades)?saved.borrowTrades:[];
   const signature=()=>JSON.stringify(digits);
   let checked=typeof saved.columnChecked==='string'?saved.columnChecked:saved.checked&&typeof saved.answers?.total==='number'?signature():'';
   let done=saved.done===true&&digits.every((n,p)=>n===expected[p]);
   function stored() {
    if(cfg.cataloguePreview)return;
    const total=digits.every(n=>n!==null)?digits.reduce((sum,n,p)=>sum+n*10**p,0):null;
    try{localStorage.setItem(key,JSON.stringify({...saved,answers:{...saved.answers,total},checked:'',columnDigits:digits,columnChecked:checked,borrowTrades:trades,done}));}catch{}
   }
   const positions=Array.from({length:width},(_,i)=>width-1-i);
   const needsBorrow=window.ML_BORROWING.nextStep(window.ML_BORROWING.initial(a),b)!==null;
   const choice=p=>'<span class="subtraction-choice" data-result-field="'+p+'"><select data-result-place="'+p+'" aria-label="'+placeNames[p]+' answer digit"><option value="">□</option>'+Array.from({length:10},(_,n)=>'<option value="'+n+'">'+n+'</option>').join('')+'</select></span>';
   const numberRow=(value,op)=>'<span>'+op+'</span>'+positions.map(p=>'<span>'+(p<String(value).length?Math.floor(value/10**p)%10:'')+'</span>').join('');
   const grid='<div id="subtraction-answer" class="simple-subtraction-grid" role="group" aria-label="'+a+' minus '+b+'" style="--subtraction-places:'+width+'"><span></span>'+positions.map(p=>'<span class="place-heading">'+placeNames[p]+'</span>').join('')+
    numberRow(a,'')+numberRow(b,'−')+'<span></span>'+positions.map(p=>'<span class="subtraction-result">'+choice(p)+'</span>').join('')+'</div>';
   const story=task.prompt.replace(/\s+(?:Use the place-value columns|Keep the ten|Get to 10 first)\.[\s\S]*$/,'').replace(/\s+Use the place-value columns to show your steps\.$/,'');
   const prompt=story.endsWith('How many are left?')?story:story+' How many are left?';
   root.classList.add('simple-subtraction-activity');
   root.innerHTML='<h1>Subtract</h1><p class="prompt">'+esc(prompt)+'</p><div class="simple-subtraction-stage'+(needsBorrow?' has-borrow':'')+'"><section class="subtraction-answer-panel'+(needsBorrow?' with-borrow':'')+'">'+
    (needsBorrow?'<div id="subtraction-answer" class="borrow-workspace"></div>':'<p class="subtraction-direction">Start with the ones. Choose each answer digit below.</p>'+grid)+
    '</section><figure class="simple-subtraction-art"><img src="'+esc(task.picture)+'" alt="" draggable="false"></figure></div><span class="sr-only" id="subtraction-status" role="status"></span>';
   document.title=task.title;
   if(needsBorrow) {
    window.ML_BORROWING.mount(root.querySelector('.borrow-workspace'),{a,b,saved:trades,onChange:next=>{trades=next;stored();signal('ml-state');}});
    root.querySelectorAll('.borrow-result').forEach(cell=>{
     const p=Number(cell.dataset.position);cell.removeAttribute('data-digit');cell.innerHTML=choice(p);
    });
   }
   function marks(){return expected.map((n,p)=>({key:'digit-'+p,label:placeNames[p]+' answer digit',answer:digits[p],expected:n,correct:digits[p]===n}));}
   function snapshot(){
    const m=marks(),score=m.filter(x=>x.correct).length,complete=digits.every(n=>n!==null),isChecked=checked===signature(),all=score===m.length;
    return {done,response:{answers:Object.fromEntries(m.filter(x=>x.answer!==null).map(x=>[x.label,x.answer])),marks:m},assessment:{checked:isChecked,signature:signature(),complete,correct:isChecked&&all,answerCorrect:all,message:all?'You got it!':complete?'Check the highlighted digits.':'Choose a digit in each answer box.',score,total:m.length,
     answerChecks:m.map(x=>({field:x.key,label:x.label,actual:x.answer,expected:x.expected,entered:x.answer!==null,correct:x.correct})),partAssessment:{checked:isChecked,correct:score,total:m.length}}};
   }
   function paint(){
    root.querySelectorAll('[data-result-place]').forEach(el=>el.value=digits[Number(el.dataset.resultPlace)]??'');
    root.querySelectorAll('[data-result-field]').forEach(holder=>{
     const p=Number(holder.dataset.resultField);holder.querySelector('.digit-mark')?.remove();delete holder.dataset.mark;
     if(checked!==signature()||digits[p]===null)return;
     const correct=digits[p]===expected[p],badge=document.createElement('span');
     holder.dataset.mark=correct?'correct':'retry';badge.className='digit-mark';badge.textContent=correct?'✓':'↻';badge.setAttribute('aria-label',correct?'Correct':'Try again');holder.append(badge);
    });
   }
   root.addEventListener('change',event=>{
    const p=event.target.dataset.resultPlace;if(p===undefined)return;
    digits[Number(p)]=event.target.value===''?null:Number(event.target.value);checked='';done=false;stored();paint();signal('ml-state');
   });
   window.ML_ENGINE={get:snapshot,check(){checked=signature();stored();paint();const s=snapshot();root.querySelector('#subtraction-status').textContent=s.assessment.message;return s;},setDone(value){done=Boolean(value);stored();}};
   paint();signal('ml-ready');
  }
  return {styles,numbers,expectedDigits,restoreDigits,boot};
 }
 window.ML_NOVEMBER_SUBTRACTION=subtractionFactory;
})();
