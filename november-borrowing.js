/* A linked base-ten model for subtraction, shared by all November paths. */
(() => {
 function borrowingFactory() {
  const names=['ones','tens','hundreds','thousands'];
  const singular=['one','ten','hundred','thousand'];
  const initial=a=>String(a).padStart(2,'0').split('').reverse().map(Number);
  function nextStep(digits,b) {
   for(let place=0;place<digits.length;place++) {
    if(digits[place]>=Math.floor(b/10**place)%10)continue;
    for(let donor=place+1;donor<digits.length;donor++)if(digits[donor]>0)return donor;
   }
   return null;
  }
  function exchange(digits,donor) {
   if(!Number.isInteger(donor)||donor<1||donor>=digits.length||digits[donor]<1)return digits.slice();
   const result=digits.slice();result[donor]--;result[donor-1]+=10;return result;
  }
  function replay(a,b,steps=[]) {
   let digits=initial(a);const trades=[];
   for(const donor of steps) {
    if(donor!==nextStep(digits,b))break;
    digits=exchange(digits,donor);trades.push(donor);
   }
   return {digits,trades};
  }
  const styles=`
  .borrowing-activity .strategy,.borrowing-activity .strategy.algorithm{grid-template-columns:minmax(0,1fr) minmax(80px,13%)}
  .borrowing-activity .strategy-model{grid-template-columns:minmax(0,1.65fr) minmax(165px,.85fr);grid-template-rows:minmax(0,1fr);gap:clamp(8px,1.4vw,20px)}
  .borrowing-activity .strategy-visual{align-self:stretch}
  .borrow-workspace{display:grid;grid-template-rows:auto minmax(76px,1fr) auto auto;gap:clamp(4px,.9vh,9px);width:100%;height:100%;min-height:0;min-width:0;color:#173f48}
  .borrow-instruction{margin:0;font-size:clamp(14px,1.4vw,19px);font-weight:bold;line-height:1.18}
  .borrow-chart{display:grid;grid-template-columns:repeat(var(--borrow-places),minmax(0,1fr));gap:clamp(5px,1vw,13px);min-height:0;margin-left:clamp(25px,3.3vw,46px)}
  .borrow-column{display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:4px;min-width:0;min-height:0;padding:5px;border:2px solid #a5c7bf;border-radius:12px;background:#eaf6f1;position:relative}
  .borrow-column:nth-child(even){background:#edf0ff;border-color:#b8bbda}
  .borrow-column h2{margin:0;text-align:center;font-size:clamp(14px,1.4vw,19px);line-height:1.15}
  .borrow-units{min-height:0;display:grid;place-items:center;position:relative}
  .borrow-units svg{width:100%;height:100%;min-height:0;max-height:180px}
  .borrow-zero{font-size:clamp(26px,5vh,52px);color:#5c7a7b}
  .borrow-trade,.borrow-target,.borrow-reset{font:700 clamp(13px,1.25vw,18px)/1.1 Andika,sans-serif;border:2px solid #518e80;border-radius:9px;min-height:44px;padding:4px;color:#164b47;background:#fffefa}
  .borrow-trade{width:100%;touch-action:none;cursor:grab;display:flex;align-items:center;justify-content:center;gap:4px}
  .borrow-trade svg{width:23px;height:30px;flex:none;pointer-events:none}
  .borrow-trade:disabled{opacity:.43;cursor:default;box-shadow:none!important}
  .borrow-trade:not(:disabled){background:#fff0aa;border-color:#9b690f;box-shadow:0 0 0 3px #ffdf714d}
  .borrow-target{display:grid;place-items:center;min-width:0;border-style:dashed;font-size:clamp(13px,1.2vw,17px);color:#486a67}
  .borrow-column[data-receive=true]{border-color:#c78c19;background:#fff6d6}
  .borrow-column[data-over]{outline:3px solid #5c49a6;outline-offset:-3px}
  .borrow-column[data-receive=true] .borrow-target{border-color:#b07915;background:#fff9df;color:#6e4b0c}
  .borrow-written{display:grid;grid-template-columns:1.1em repeat(var(--borrow-places),minmax(0,1fr));align-items:center;gap:2px;text-align:center;font-size:clamp(23px,3vw,42px);font-weight:bold;line-height:1.05}
  .borrow-written .borrow-new{min-height:1.05em;color:#a45a0a;font-size:.78em}
  .borrow-written .borrow-old[data-changed=true]{text-decoration:line-through;text-decoration-thickness:3px;text-decoration-color:#b44d22;color:#667f80}
  .borrow-written .borrow-result{border-top:2px solid #4d7677;padding-top:3px}
  .borrow-footer{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;min-height:44px}
  .borrow-status{font-size:clamp(13px,1.25vw,17px);font-weight:bold;line-height:1.15;margin:0;color:#245f51}
  .borrow-reset{font-size:clamp(13px,1.2vw,17px);white-space:nowrap}
  .borrow-ghost{position:fixed;z-index:50;pointer-events:none;width:70px;height:70px;background:#fff1b9;border:2px solid #a97719;border-radius:10px;transform:translate(-50%,-50%);padding:8px;box-shadow:0 3px 15px #274d4e44}
  .borrow-ghost svg{width:100%;height:100%}
  .borrow-flash .borrow-units{animation:borrow-appear .55s ease-out}
  .borrow-tool-switch{display:none}
  @keyframes borrow-appear{from{background:#ffe38f;transform:scale(.94)}to{background:transparent;transform:scale(1)}}
  @media(max-width:900px){
   .borrowing-activity .strategy,.borrowing-activity .strategy.algorithm{grid-template-columns:minmax(0,1fr)}
   .borrowing-activity .strategy-art{display:none}
   .borrowing-activity .strategy-model{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto}
   .borrowing-activity .strategy-rows{grid-template-columns:repeat(2,minmax(0,1fr));align-items:center;gap:5px}
   .borrowing-activity .strategy-rows>.strategy-row:last-of-type,.borrowing-activity .strategy-help{grid-column:1/-1}
   .borrowing-activity .strategy-row{font-size:clamp(16px,2.5vw,24px)}
   .borrowing-activity .strategy-row .phrase{font-size:clamp(14px,2vw,19px)}
   .borrow-units svg{max-height:none}
  }
  @media(max-width:480px){.borrow-column{padding:3px;gap:3px}.borrow-chart{gap:4px}.borrow-trade svg{display:none}.borrow-trade,.borrow-target{font-size:12px}.borrow-instruction{font-size:13px}.borrow-written{font-size:25px}.borrow-footer{gap:4px}.borrow-status{font-size:12px}.borrow-reset{font-size:12px;padding:3px}.borrowing-activity .strategy-rows{grid-template-columns:minmax(0,1fr)}.borrowing-activity .strategy-row{font-size:17px}.borrowing-activity .strategy-field select{font-size:17px;min-height:34px}}
  @media(max-width:480px){
   .borrowing-activity .strategy-model{grid-template-rows:auto minmax(0,1fr)}
   .borrow-tool-switch{display:flex;gap:6px;grid-row:1}
   .borrow-tool-switch button{flex:1;min-height:44px;font:700 14px Andika,sans-serif;border:2px solid #82aba2;border-radius:9px;background:#fffefa;color:#194d4b;padding:4px}
   .borrow-tool-switch button[aria-pressed=true]{background:#d5efe6;border-color:#2e7367}
   .borrowing-activity .strategy-visual,.borrowing-activity .strategy-rows{grid-row:2}
   .borrowing-activity:not([data-borrow-panel=answers]) .strategy-rows{display:none}
   .borrowing-activity[data-borrow-panel=answers] .strategy-visual{display:none}
   .borrowing-activity[data-borrow-panel=answers] .strategy-rows{display:grid;align-content:space-evenly;height:100%}
  }
  @media(prefers-reduced-motion:reduce){.borrow-flash .borrow-units{animation:none}}
  @media print{.borrow-trade,.borrow-reset{visibility:hidden}.borrow-workspace,.borrow-column{break-inside:avoid}.borrow-ghost,.borrow-tool-switch{display:none!important}.borrowing-activity .strategy-visual{display:flex!important}.borrowing-activity .strategy-rows{display:grid!important}.borrowing-activity .strategy-model{grid-template-columns:minmax(0,1.65fr) minmax(165px,.85fr)!important;grid-template-rows:minmax(0,1fr)!important}}
  `;
  function symbol(place) {
   if(place===0)return '<rect x="18" y="18" width="64" height="64" rx="5" fill="#e5ad3c" stroke="#a36b0d" stroke-width="2"/>';
   if(place===1)return '<rect x="36" y="3" width="28" height="94" rx="3" fill="#44b5a3" stroke="#237f73" stroke-width="2"/>'+Array.from({length:9},(_,i)=>'<path d="M36 '+(12.4+i*9.4)+'h28" stroke="#237f73" stroke-width="1.5"/>').join('');
   if(place===2)return '<rect x="5" y="5" width="90" height="90" rx="2" fill="#89aee7" stroke="#426b9f" stroke-width="2"/>'+Array.from({length:9},(_,i)=>'<path d="M'+(14+i*9)+' 5v90M5 '+(14+i*9)+'h90" stroke="#dcecff" stroke-width="1"/>').join('');
   return '<path d="M10 28 50 7 90 28 90 75 50 96 10 75Z" fill="#b09bdd" stroke="#6d58a1" stroke-width="2"/><path d="M10 28 50 49 90 28M50 49v47" fill="none" stroke="#6d58a1" stroke-width="2"/><text x="50" y="70" text-anchor="middle" fill="#fff" font-size="21" font-weight="bold">1000</text>';
  }
  const unitSvg=place=>'<svg viewBox="0 0 100 100" aria-hidden="true">'+symbol(place)+'</svg>';
  function units(place,count,aspect=1) {
   if(!count)return '<span class="borrow-zero" aria-label="0 '+names[place]+'">0</span>';
   const columns=Math.max(1,Math.min(5,count,Math.ceil(Math.sqrt(count*Math.max(.2,Math.min(5,aspect)))))),rows=Math.ceil(count/columns),cell=100;
   return '<svg viewBox="0 0 '+columns*cell+' '+rows*cell+'" role="img" aria-label="'+count+' '+(count===1?singular[place]:names[place])+'">'+
    Array.from({length:count},(_,i)=>'<g transform="translate('+(i%columns)*cell+' '+Math.floor(i/columns)*cell+')">'+symbol(place)+'</g>').join('')+'</svg>';
  }
  function mount(host,{a,b,saved=[],onChange=()=>{}}) {
   const original=initial(a),width=original.length,places=Array.from({length:width},(_,i)=>width-1-i);
   let {digits,trades}=replay(a,b,saved),drag=null,skipClick=null;
   host.style.setProperty('--borrow-places',width);
   host.innerHTML='<p class="borrow-instruction">Drag the highlighted block one column right, or tap Trade.</p><div class="borrow-chart">'+places.map(place=>
    '<section class="borrow-column" data-borrow-place="'+place+'" aria-label="'+names[place]+'"><h2>'+names[place][0].toUpperCase()+names[place].slice(1)+'</h2><div class="borrow-units"></div>'+
    (place?'<button type="button" class="borrow-trade" data-borrow-from="'+place+'" aria-label="Trade 1 '+singular[place]+' for 10 '+names[place-1]+'">'+unitSvg(place)+'<span>Trade 1 '+singular[place]+' →</span></button>':
     '<button type="button" class="borrow-target" data-borrow-target="0">Receive 10 ones</button>')+'</section>').join('')+
    '</div><div class="borrow-written" role="group" aria-label="Subtraction with regrouped digits"><span></span>'+places.map(p=>'<span class="borrow-new" data-borrow-new="'+p+'"></span>').join('')+
    '<span></span>'+places.map(p=>'<span class="borrow-old" data-borrow-old="'+p+'">'+original[p]+'</span>').join('')+
    '<span>−</span>'+places.map(p=>'<span>'+(p<String(b).length?Math.floor(b/10**p)%10:'')+'</span>').join('')+
    '<span></span>'+places.map(p=>'<span class="borrow-result" data-digit="total" data-position="'+p+'">□</span>').join('')+
    '</div><div class="borrow-footer"><p class="borrow-status" role="status" aria-live="polite"></p><button type="button" class="borrow-reset">Reset trades</button></div>';
   function reflowUnits() {
    host.querySelectorAll('[data-borrow-place]').forEach(column=>{
     const place=Number(column.dataset.borrowPlace),holder=column.querySelector('.borrow-units');
     holder.innerHTML=units(place,digits[place],holder.clientWidth/Math.max(1,holder.clientHeight));
    });
   }
   function paint(message='') {
    const donor=nextStep(digits,b);
    host.querySelectorAll('[data-borrow-place]').forEach(column=>{
     const place=Number(column.dataset.borrowPlace),receive=donor!==null&&place===donor-1;
     column.dataset.receive=receive;
     const button=column.querySelector('.borrow-trade');
     if(button)button.disabled=place!==donor;
     column.setAttribute('aria-label',digits[place]+' '+(digits[place]===1?singular[place]:names[place])+(receive?', receive 10 '+names[place]+'.':''));
    });
    host.querySelectorAll('[data-borrow-new]').forEach(el=>{const p=Number(el.dataset.borrowNew);el.textContent=digits[p]===original[p]?'':digits[p];});
    host.querySelectorAll('[data-borrow-old]').forEach(el=>{el.dataset.changed=digits[Number(el.dataset.borrowOld)]!==original[Number(el.dataset.borrowOld)];});
    const target=host.querySelector('.borrow-target');target.disabled=donor!==1;
    host.querySelector('.borrow-status').textContent=message||(donor===null?'The total stays '+a+'. Now subtract in each place.':'Trade 1 '+singular[donor]+' from the left for 10 '+names[donor-1]+'.');
    reflowUnits();
   }
   function trade(donor,focus=false) {
    if(donor!==nextStep(digits,b))return;
    digits=exchange(digits,donor);trades.push(donor);onChange(trades.slice());
    paint('1 '+singular[donor]+' became 10 '+names[donor-1]+'. The total is still '+a+'.');
    const receiving=host.querySelector('[data-borrow-place="'+(donor-1)+'"]');
    receiving.classList.remove('borrow-flash');void receiving.offsetWidth;receiving.classList.add('borrow-flash');
    if(focus)(host.querySelector('.borrow-trade:not(:disabled)')||host.querySelector('.borrow-reset')).focus();
   }
   host.addEventListener('click',e=>{
    const button=e.target.closest('[data-borrow-from],.borrow-target,.borrow-reset');if(!button)return;
    if(skipClick===button){skipClick=null;return;}skipClick=null;
    if(button.matches('.borrow-reset')){digits=initial(a);trades=[];onChange([]);paint('Trades reset. The starting amount is '+a+'.');return;}
    trade(button.matches('.borrow-target')?1:Number(button.dataset.borrowFrom),e.detail===0);
   });
   host.addEventListener('pointerdown',e=>{
    const source=e.target.closest('.borrow-trade:not(:disabled)');if(!source||!e.isPrimary||e.button!==0)return;
    skipClick=null;drag={id:e.pointerId,source,donor:Number(source.dataset.borrowFrom),x:e.clientX,y:e.clientY};source.setPointerCapture(e.pointerId);
   });
   host.addEventListener('pointermove',e=>{
    if(drag?.id!==e.pointerId)return;
    if(!drag.ghost&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5){drag.ghost=document.createElement('div');drag.ghost.className='borrow-ghost';drag.ghost.innerHTML=unitSvg(drag.donor);document.body.append(drag.ghost);}
    if(!drag.ghost)return;drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
    host.querySelectorAll('[data-over]').forEach(el=>el.removeAttribute('data-over'));
    const column=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-borrow-place="'+(drag.donor-1)+'"]');column?.setAttribute('data-over','');
   });
   function end(e,cancel=false) {
    if(drag?.id!==e.pointerId)return;const current=drag;drag=null;
    const moved=Boolean(current.ghost);current.ghost?.remove();host.querySelectorAll('[data-over]').forEach(el=>el.removeAttribute('data-over'));
    if(moved){skipClick=current.source;if(!cancel&&document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-borrow-place="'+(current.donor-1)+'"]'))trade(current.donor);}
   }
   host.addEventListener('pointerup',e=>end(e));host.addEventListener('pointercancel',e=>end(e,true));host.addEventListener('lostpointercapture',e=>end(e,true));
   paint();
   new ResizeObserver(reflowUnits).observe(host);
   return {get:()=>({digits:digits.slice(),trades:trades.slice()})};
  }
  return {styles,initial,nextStep,exchange,replay,mount};
 }
 window.ML_NOVEMBER_BORROWING=borrowingFactory;
})();
