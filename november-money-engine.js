/* Vector Canadian play money and pointer, touch and keyboard activities. */
(() => {
 'use strict';
 function moneyFactory() {
  const money={
   c5:{value:5,label:'5¢',name:'nickel',motif:'beaver',size:.90,colour:'#bcc7cd'},
   c10:{value:10,label:'10¢',name:'dime',motif:'sailboat',size:.77,colour:'#cbd7df'},
   c25:{value:25,label:'25¢',name:'quarter',motif:'caribou',size:.98,colour:'#bfcbd4'},
   c50:{value:50,label:'50¢',name:'50-cent coin',motif:'coat of arms',size:1,colour:'#c5ced4'},
   d1:{value:100,label:'$1',name:'loonie',motif:'loon',size:1,colour:'#e5b94c'},
   d2:{value:200,label:'$2',name:'toonie',motif:'polar bear',size:1,colour:'#c4cfd5'},
   b5:{value:500,label:'$5',name:'five-dollar bill',colour:'#6ab5e8'},
   b10:{value:1000,label:'$10',name:'ten-dollar bill',colour:'#b59ce5'},
   b20:{value:2000,label:'$20',name:'twenty-dollar bill',colour:'#83c797'},
   b50:{value:5000,label:'$50',name:'fifty-dollar bill',colour:'#ec9496'},
   b100:{value:10000,label:'$100',name:'hundred-dollar bill',colour:'#d8b17a'}
  };
  const total=pieces=>pieces.reduce((sum,key)=>sum+(money[key]?.value||0),0);
  const amount=(value,unit)=>unit==='cents'?value+'¢':'$'+value/100;
  const composition=pieces=>Object.keys(money).map(key=>pieces.filter(p=>p===key).length).join(',');
  function evaluateTask(task,state) {
   if(task.mode==='compare')return task.pairs.map((pair,index)=>({label:'Pair '+(index+1),entered:pair.includes(state.choices[index]),correct:state.choices[index]===pair.reduce((a,b)=>money[a].value>money[b].value?a:b)}));
   if(['match','order'].includes(task.mode)) {
    const expected=task.pieces.slice().sort((a,b)=>money[a].value-money[b].value);
    return expected.map((key,index)=>({label:task.mode==='match'?money[key].label:'Position '+(index+1),entered:state.slots[index]!=null,correct:state.slots[index]===key}));
   }
   if(task.mode==='equivalent')return [
    {label:'Way 1',entered:state.mats[0].length>0,correct:total(state.mats[0])===task.target},
    {label:'Way 2 is different',entered:state.mats[1].length>0,correct:total(state.mats[1])===task.target&&composition(state.mats[0])!==composition(state.mats[1])}
   ];
   const change=task.paid-task.cost,cut=task.unit==='cents'?25:1000,high=task.unit==='cents'?50:2000;
   return [{label:'Estimate',entered:state.estimate!==null,correct:state.estimate===(change<cut?0:change<=high?1:2)},
    {label:'Exact change',entered:state.mats[0].length>0,correct:total(state.mats[0])===change}];
  }
  function motif(key) {
   const common='fill="#46545a" stroke="#46545a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
   const shapes={
    c5:'<ellipse cx="56" cy="53" rx="24" ry="14"/><circle cx="76" cy="44" r="9"/><circle cx="77" cy="35" r="4"/><path d="M35 53L17 61 32 70 42 59"/><path d="M40 68H84M30 74H93" fill="none"/>',
    c10:'<path d="M24 66H98L82 79H41Z"/><path d="M59 20V65M54 27L31 58H54ZM64 30L88 59H64Z"/><path d="M20 84Q29 78 39 84T59 84T79 84T99 84" fill="none"/>',
    c25:'<path d="M53 79V55L44 42 53 31 72 34 76 48 65 56 66 79Z"/><path d="M51 37L36 26 32 12M37 27L25 24M34 19L25 12M69 36L81 24 84 11M79 26L96 23M84 18L94 11" fill="none" stroke-width="5"/><circle cx="68" cy="42" r="2" fill="#fff"/>',
    c50:'<path d="M43 31H78V58Q74 75 60 82 46 74 43 58Z"/><path d="M60 35V73M47 53H74" stroke="#ddd" fill="none"/><path d="M40 70L28 55 23 40 32 35 39 47M80 70L91 55 98 40 90 34 82 46" fill="none" stroke-width="6"/><path d="M47 21L50 12 60 19 69 12 73 21Z"/>',
    d1:'<ellipse cx="57" cy="60" rx="28" ry="12"/><path d="M74 58Q82 53 77 40Q73 30 81 28Q93 31 87 49L86 62Z"/><path d="M86 34L100 38 87 41Z"/><path d="M22 79Q37 74 50 79T80 79T101 79" fill="none"/>',
    d2:'<path d="M29 50Q32 39 52 40L77 43 90 39 98 45 98 56 88 60 83 78 75 78 75 60 51 61 43 78 34 78 37 57 27 58Z"/><circle cx="89" cy="38" r="5"/><path d="M19 83H102" fill="none"/>'
   };
   return '<g '+common+'>'+shapes[key]+'</g>';
  }
  function graphic(key,hideValue=false) {
   const m=money[key];
   if(key.startsWith('b'))return '<svg class="money-art bill-art" viewBox="0 0 210 112" aria-hidden="true"><rect x="3" y="3" width="204" height="106" rx="13" fill="'+m.colour+'" stroke="#405d6a" stroke-width="3"/><rect x="10" y="10" width="190" height="92" rx="8" fill="none" stroke="#fff" stroke-width="2"/><path d="M141 4H173V108H141Z" fill="#ffffff85"/><path d="M156 26L161 41 176 37 170 50 181 57 163 62 164 82 153 75 142 82 143 63 128 56 140 49 136 36 150 41Z" fill="#fff" stroke="#547184"/><text x="22" y="30" font-size="13" font-weight="bold" fill="#24434d">CANADA</text><text x="21" y="80" font-size="45" font-weight="bold" fill="#183a49">'+m.label+'</text><text x="21" y="96" font-size="9" fill="#24434d">MATH LANDING · PLAY MONEY</text></svg>';
   return '<svg class="money-art coin-art" style="--coin-scale:'+m.size+'" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="'+m.colour+'" stroke="#54676e" stroke-width="3"/><circle cx="60" cy="60" r="49" fill="'+(key==='d2'?'#e9bd58':'#ffffff26')+'" stroke="#ffffffb0" stroke-width="2"/>'+motif(key)+'<text x="60" y="'+(hideValue?100:103)+'" text-anchor="middle" font-size="'+(hideValue?10:20)+'" font-weight="bold" fill="#203c46">'+(hideValue?'CANADA':m.label)+'</text></svg>';
  }
  function shopArt(kind) {
   const shapes={
    pencil:'<g transform="rotate(25 100 80)"><path d="M80 28H120V126H80Z" fill="#f2c63f"/><path d="M80 126L100 164 120 126Z" fill="#eac19c"/><path d="M93 151L100 164 107 151Z" fill="#304652"/><rect x="80" y="15" width="40" height="28" rx="8" fill="#ed87aa"/><path d="M80 43H120V54H80Z" fill="#b7ced6"/></g>',
    eraser:'<g transform="rotate(-20 100 90)"><rect x="45" y="53" width="112" height="70" rx="16" fill="#ed88aa"/><path d="M100 53H145Q157 53 157 65V111Q157 123 145 123H100Z" fill="#91c9e8"/><path d="M100 54V121" stroke="#fff" stroke-width="4"/></g>',
    sticker:'<path d="M100 20L121 65 173 71 135 107 146 160 100 133 54 160 65 107 27 71 79 65Z" fill="#f7cd51" stroke="#cc9226" stroke-width="5"/><circle cx="84" cy="87" r="5" fill="#244957"/><circle cx="116" cy="87" r="5" fill="#244957"/><path d="M80 109Q100 128 120 109" fill="none" stroke="#244957" stroke-width="5"/>',
    ribbon:'<path d="M65 95L54 163 89 143 108 163 117 94" fill="#ed91bb" stroke="#ab4578" stroke-width="4"/><circle cx="100" cy="68" r="48" fill="#f2bf46" stroke="#b88221" stroke-width="5"/><path d="M100 36L110 56 135 60 117 77 121 101 100 89 79 101 83 77 65 60 90 56Z" fill="#fff2b5"/>',
    book:'<path d="M44 24H145Q160 24 160 39V154H44Q28 154 28 139V39Q28 24 44 24" fill="#9679c7" stroke="#584780" stroke-width="5"/><path d="M48 25V153M48 141H159" stroke="#d6c2ed" stroke-width="6"/><rect x="69" y="49" width="66" height="64" rx="7" fill="#fcf4de"/><path d="M78 96L98 64 122 96Z" fill="#7cb4bd"/>',
    puzzle:'<path d="M37 35H88Q75 13 100 13T112 35H162V85Q140 72 140 97T162 110V153H112Q127 130 102 130T89 153H37V110Q61 124 61 98T37 85Z" fill="#71c9be" stroke="#318b8c" stroke-width="5"/>',
    paint:'<path d="M34 52H165V143H34Z" fill="#67a9d4" stroke="#3d6d99" stroke-width="5"/><path d="M66 51V28H133V51" fill="none" stroke="#435d7a" stroke-width="10"/><circle cx="66" cy="86" r="15" fill="#ed90a9"/><circle cx="107" cy="86" r="15" fill="#f3cb42"/><circle cx="146" cy="86" r="15" fill="#88cf89"/><path d="M51 121H150" stroke="#e7f6fc" stroke-width="12"/>',
    telescope:'<g transform="rotate(-25 100 76)"><rect x="35" y="49" width="126" height="44" rx="10" fill="#a58bd4" stroke="#635388" stroke-width="5"/><rect x="150" y="43" width="23" height="56" rx="6" fill="#edbf54"/><path d="M25 58H39V84H25Z" fill="#477d95"/></g><path d="M101 102V155M101 113L63 166M101 113L141 166" stroke="#536b7d" stroke-width="8" fill="none"/>'
   };
   return '<svg viewBox="0 0 200 180" aria-hidden="true"><circle cx="100" cy="90" r="83" fill="#f2f4ff"/>'+shapes[kind]+'</svg>';
  }
  const styles=`
  *{box-sizing:border-box}html,body{height:100%;margin:0;overflow:hidden}body{font:clamp(17px,1.8vw,24px)/1.22 Andika,"Trebuchet MS",sans-serif;color:#173e4a;background:#f1f8f7}button{font:inherit;color:inherit;cursor:pointer}button:focus-visible{outline:4px solid #7354bd;outline-offset:2px}button:disabled{cursor:default}h1,h2,p{margin:0}.money-activity{height:100%;padding:clamp(8px,1.5vh,18px);display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;gap:clamp(6px,1.2vh,12px)}h1{font-size:clamp(27px,3.5vw,48px);line-height:1.1;color:#174f50}.money-prompt{font-size:clamp(17px,2vw,27px)}.money-work{min-height:0;display:grid;gap:clamp(8px,1.2vw,16px)}.money-footer{display:flex;align-items:center;gap:12px;font-size:clamp(14px,1.4vw,19px);min-height:44px}.money-footer p{flex:1}.reset-money{min-height:44px;padding:5px 18px;border:2px solid #749a94;background:#fff;border-radius:12px;font-weight:bold}.money-art{display:block;max-width:100%;max-height:100%;width:100%;height:100%;pointer-events:none;overflow:visible}.coin-art{transform:scale(var(--coin-scale,1))}.money-tile{border:0;background:none;display:grid;grid-template-rows:minmax(0,1fr) auto;justify-items:center;align-items:center;min-width:0;min-height:0;padding:4px;touch-action:none;border-radius:12px;position:relative}.money-tile:hover{background:#e7f2f8}.money-tile[aria-pressed=true]{outline:3px solid #8062bd;background:#ede7fb}.money-tile .piece-caption{font-size:clamp(13px,1.3vw,18px);font-weight:bold;line-height:1.1;text-align:center;pointer-events:none}.money-bank{display:grid;grid-template-columns:repeat(var(--money-count),minmax(0,1fr));gap:clamp(5px,1vw,14px);min-height:0;padding:8px;border:1px solid #b9d3ce;border-radius:16px;background:#fffefa}.money-bank .money-tile{height:100%}.money-bank-heading{font-size:clamp(14px,1.5vw,20px);font-weight:bold}.money-match{grid-template-rows:minmax(0,1fr) minmax(0,1.12fr)}.money-match .money-bank{padding:clamp(7px,1.3vh,14px)}.money-pads{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(7px,1.2vw,16px);min-height:0}.money-pad{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0;min-width:0;padding:8px;border:3px dashed #72a69f;border-radius:17px;background:#e3f2ee;text-align:center;position:relative}.pad-button{min-height:44px;min-width:0;padding:2px;border:0;background:none;font-weight:bold;font-size:clamp(20px,2.5vw,34px)}.pad-hint{display:grid;place-items:center;min-height:0;pointer-events:none;color:#547a78;font-size:clamp(14px,1.6vw,22px)}.money-pad.is-over,.money-mat.is-over{border-color:#8259ba;background:#eee4ff}.money-pad[data-mark=correct],.compare-card[data-mark=correct],.money-mat[data-mark=correct]{border-color:#3b8c57;background:#eff8e9}.money-pad[data-mark=retry],.compare-card[data-mark=retry],.money-mat[data-mark=retry]{border-color:#bb652e;background:#fff5e9}.part-mark{position:absolute;right:6px;top:5px;border-radius:50%;background:#fff;font-weight:bold;color:#286e48;font-size:21px;min-width:25px}.money-compare{grid-template-columns:repeat(3,minmax(0,1fr))}.compare-card{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;min-height:0;border:2px solid #b2cdc7;border-radius:17px;padding:10px;background:#fffefa;position:relative}.compare-card h2{font-size:clamp(16px,1.7vw,23px);text-align:center}.compare-pair{display:grid;grid-template-rows:repeat(2,minmax(0,1fr));gap:8px;min-height:0}.compare-pair .money-tile{border:2px solid transparent}.compare-pair .money-tile[aria-pressed=true]{border-color:#8062bd;outline:0}.money-lab{grid-template-rows:minmax(0,1fr) clamp(120px,23vh,150px)}.money-lab-board{min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1.3vw,18px)}.money-mat{display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:5px;min-height:0;min-width:0;padding:clamp(7px,1vw,13px);border:3px dashed #79a7a2;border-radius:18px;background:#e6f4ef;position:relative}.money-mat[data-active=true]{border-style:solid;border-color:#8164af;box-shadow:inset 0 0 0 2px #e5d6fb}.mat-select{background:#fff;border:1px solid #769991;border-radius:9px;min-height:44px;font-weight:bold}.money-mat-total{font-weight:bold;font-size:clamp(18px,2vw,28px);text-align:center;line-height:1.1}.money-pieces{min-height:0;display:grid;grid-template-columns:repeat(var(--piece-cols,3),minmax(0,1fr));grid-template-rows:repeat(var(--piece-rows,2),minmax(0,1fr));gap:4px;align-items:stretch}.money-pieces:empty:before{content:'Build here';grid-column:1/-1;grid-row:1/-1;align-self:center;text-align:center;font-size:clamp(18px,2.3vw,30px);color:#5f8280}.money-pieces .piece-caption{display:none}.money-pieces .money-tile{min-height:0;background:#ffffff65;border-radius:9px;padding:2px}.money-pieces .money-tile:hover:after{content:'Return';position:absolute;inset:auto 0 0;background:#fff;font-size:12px;text-align:center}.money-lab>.money-bank{grid-template-rows:auto minmax(0,1fr);grid-template-columns:minmax(0,1fr);gap:4px}.money-supply{display:grid;grid-template-columns:repeat(var(--money-count),minmax(0,1fr));min-height:0;gap:5px}.money-change-board{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}.shop-scene{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:6px;min-height:0;border:1px solid #b9ccd7;border-radius:18px;background:#fefcfa;padding:clamp(7px,1vw,14px)}.shop-product{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;min-height:0;gap:5px}.shop-product svg{height:100%;width:100%;min-height:0}.shop-price{font-size:clamp(25px,3.2vw,45px);font-weight:bold}.shop-name{font-size:clamp(15px,1.5vw,21px);font-weight:bold}.shop-payment{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:12px;padding:5px 9px;background:#e6eef9;border-radius:12px;min-height:74px;height:clamp(74px,15vh,120px)}.shop-payment .money-art{max-width:160px;margin:auto}.shop-payment strong{display:block;font-size:clamp(22px,2.4vw,33px)}.change-estimate{display:grid;gap:6px}.change-estimate h2{font-size:clamp(16px,1.7vw,23px)}.estimate-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.estimate-options button{min-height:44px;border:2px solid #9eb7c8;border-radius:10px;background:#fff;font-size:clamp(14px,1.3vw,18px);padding:5px;font-weight:bold}.estimate-options button[aria-pressed=true]{background:#e9def8;border-color:#805fb5}.change-right{display:grid;grid-template-rows:auto minmax(0,1fr);gap:8px;min-height:0}.change-right .money-mat{background:#e9f4fa}.money-ghost{position:fixed;z-index:20;pointer-events:none;transform:translate(-50%,-50%);width:110px;height:100px;padding:4px;background:#ffffffdb;border:2px solid #8062bd;border-radius:12px}.money-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
  @media(orientation:portrait) and (max-width:850px){.money-match{grid-template-rows:minmax(0,.75fr) minmax(0,1.25fr)}.money-match .money-bank{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr))}.money-pads{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr))}.money-compare{grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(3,minmax(0,1fr))}.compare-card{grid-template-columns:90px minmax(0,1fr);grid-template-rows:minmax(0,1fr);align-items:center}.compare-pair{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,1fr)}.money-lab{grid-template-rows:minmax(0,1fr) clamp(130px,20vh,180px)}.money-change-board{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(130px,.5fr) minmax(0,1fr)}.shop-scene{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.shop-payment{height:100%;min-height:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);text-align:center}.shop-payment .money-art{min-height:0;max-height:90px}.shop-payment strong{display:inline;margin-left:6px}.money-footer{font-size:14px;gap:6px}.money-prompt{font-size:19px}.money-supply .piece-caption{font-size:13px}.shop-price{font-size:29px}.shop-name{font-size:17px}}
  @media(max-height:540px){.money-activity{gap:5px;padding:7px}h1{font-size:29px}.money-prompt{font-size:18px}.money-lab{grid-template-rows:minmax(0,1fr) 100px}.money-footer{font-size:13px}.money-bank{padding:5px}.money-mat{gap:3px;padding:5px}.money-mat-total{font-size:19px}.shop-payment{height:72px}.shop-price{font-size:28px}.shop-scene{padding:6px}.money-pieces{gap:3px}.money-tile .piece-caption{font-size:13px}}
  @media(max-width:550px){.money-lab-board{gap:5px}.money-mat{padding:5px}.mat-select{font-size:16px}.money-footer{font-size:13px}.money-supply .piece-caption{display:none}.money-bank-heading{font-size:14px}.money-mat-total{font-size:17px}.money-lab{grid-template-rows:minmax(0,1fr) 100px}}
  @media print{@page{size:landscape;margin:10mm}html,body{height:auto;overflow:visible}.money-activity{height:166mm;break-inside:avoid}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.reset-money{display:none}}
  .pad-body{min-height:0;display:grid}.change-estimate{position:relative}.change-estimate[data-mark=correct] h2{color:#267344}.change-estimate[data-mark=retry] h2{color:#a64e28}
  .compare-pair{height:100%;align-self:stretch}.money-art{min-width:0;min-height:0;overflow:hidden}
  .shop-scene{grid-template-rows:minmax(0,1fr) auto}.shop-info{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:8px;min-height:0}.shop-payment{height:100%;min-height:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);text-align:center;padding:5px}.shop-payment .money-art{height:100%;min-height:0;max-height:100%;max-width:140px;align-self:stretch}.shop-payment p{font-size:clamp(14px,1.5vw,20px)}.shop-payment strong{font-size:clamp(20px,2.5vw,32px)}.change-right{grid-template-rows:minmax(0,1fr)}.money-mat-total{font-size:clamp(18px,1.8vw,25px)}
  @media(orientation:portrait) and (max-width:850px){.money-change-board{grid-template-rows:minmax(210px,.85fr) minmax(0,1fr)}.shop-scene{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto}.shop-info{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}.shop-payment .money-art{max-height:100%}}
  `;
  function boot() {
   const cfg=window.ML_CONFIG,task=cfg.task,root=document.querySelector('.money-activity');
   const storageKey='math-landing:november-money:'+cfg.student+':'+cfg.id+':'+cfg.revision;
   let saved={};if(!cfg.cataloguePreview)try{saved=JSON.parse(localStorage.getItem(storageKey))||{}}catch{}
   const valid=key=>Object.hasOwn(money,key);
   const pieces=task.pieces||[],expected=pieces.slice().sort((a,b)=>money[a].value-money[b].value);
   let state={slots:expected.map((_,i)=>pieces.includes(saved.slots?.[i])?saved.slots[i]:null),choices:(task.pairs||[]).map((pair,i)=>pair.includes(saved.choices?.[i])?saved.choices[i]:null),mats:[0,1].map(i=>(saved.mats?.[i]||[]).filter(key=>valid(key)&&task.denominations?.includes(key)).slice(0,12)),estimate:[0,1,2].includes(saved.estimate)?saved.estimate:null};
   // Disallow duplicate instances in a restored one-of-each picture match.
   state.slots=state.slots.map((key,i,list)=>key&&list.indexOf(key)===i?key:null);
   const signature=()=>JSON.stringify(state);
   let checked=saved.checked||'',done=saved.done===true,activeMat=0,selection=null,pointer=null,suppressClick=false;
   const signal=type=>{if(!cfg.cataloguePreview)parent.postMessage({type,id:cfg.id},'*');};
   const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   function tile(key,origin,position) {
    const hide=task.mode==='match'&&!key.startsWith('b'),m=money[key];
    const description=hide?m.name+' with '+m.motif:m.label+' '+m.name;
    return '<button class="money-tile" data-piece="'+key+'" data-origin="'+origin+'"'+(position===undefined?'':' data-position="'+position+'"')+' aria-label="'+esc(description+(origin==='supply'?', add to selected mat':origin.startsWith('mat')?', return to bank':''))+'" aria-pressed="false">'+graphic(key,hide)+'<span class="piece-caption">'+esc(hide?m.name:m.label)+'</span></button>';
   }
   const pad=i=>'<section class="money-pad" data-drop="slot-'+i+'"><button class="pad-button" data-pad="'+i+'" aria-label="Place money: '+(task.mode==='match'?money[expected[i]].label:['least value','second value','third value','greatest value'][i])+'">'+(task.mode==='match'?money[expected[i]].label:['Least','Next','Next','Greatest'][i])+'</button><div class="pad-body"></div></section>';
   const mat=i=>'<section class="money-mat" data-drop="mat-'+i+'"><button class="mat-select" data-mat="'+i+'" aria-pressed="'+(i===0)+'">'+(task.mode==='change'?'Change for customer':'Way '+(i+1))+'</button><div class="money-pieces"></div><p class="money-mat-total"></p></section>';
   const supply=()=>'<section class="money-bank" data-drop="bank"><p class="money-bank-heading">Money bank · '+(task.unit==='cents'?'Count in cents':'Count in whole dollars')+'</p><div class="money-supply" style="--money-count:'+task.denominations.length+'">'+task.denominations.map(key=>tile(key,'supply')).join('')+'</div></section>';
   let work;
   if(['match','order'].includes(task.mode))work='<div class="money-work money-match"><section class="money-bank" data-drop="bank" style="--money-count:4"></section><div class="money-pads">'+expected.map((_,i)=>pad(i)).join('')+'</div></div>';
   else if(task.mode==='compare')work='<div class="money-work money-compare">'+task.pairs.map((pair,i)=>'<section class="compare-card" data-compare="'+i+'"><h2>Pair '+(i+1)+'</h2><div class="compare-pair">'+pair.map(key=>tile(key,'pair-'+i)).join('')+'</div></section>').join('')+'</div>';
   else if(task.mode==='equivalent')work='<div class="money-work money-lab"><div class="money-lab-board">'+mat(0)+mat(1)+'</div>'+supply()+'</div>';
   else {
    const labels=task.unit==='cents'?['Under 25¢','25¢ to 50¢','Over 50¢']:['Under $10','$10 to $20','Over $20'];
    const paidKey=Object.keys(money).find(key=>money[key].value===task.paid);
    work='<div class="money-work money-lab"><div class="money-lab-board money-change-board"><section class="shop-scene"><div class="shop-info"><div class="shop-product">'+shopArt(task.item)+'<div><p class="shop-name">'+esc(task.name)+'</p><p class="shop-price">'+amount(task.cost,task.unit)+'</p></div></div><div class="shop-payment"><p>Customer pays<strong>'+amount(task.paid,task.unit)+'</strong></p>'+graphic(paidKey)+'</div></div><section class="change-estimate"><h2>About how much change?</h2><div class="estimate-options">'+labels.map((label,i)=>'<button data-estimate="'+i+'" aria-pressed="false">'+label+'</button>').join('')+'</div></section></section><div class="change-right">'+mat(0)+'</div></div>'+supply()+'</div>';
   }
   root.innerHTML='<h1>'+esc(task.title)+'</h1><p class="money-prompt">'+esc(task.prompt)+'</p>'+work+'<footer class="money-footer"><p>'+esc(task.directions)+'</p><button class="reset-money">Reset</button></footer><p class="money-live" role="status"></p>';
   function persist(){if(!cfg.cataloguePreview)try{localStorage.setItem(storageKey,JSON.stringify({...state,checked,done}));}catch{}}
   function speak(text){root.querySelector('.money-live').textContent=text;}
   function snapshot(){
    const checks=evaluateTask(task,state),score=checks.filter(c=>c.correct).length,isChecked=checked===signature(),complete=checks.every(c=>c.entered),correct=score===checks.length;
    return {done,response:{money:JSON.parse(JSON.stringify(state)),totals:state.mats.map(m=>amount(total(m),task.unit)),marks:checks},assessment:{checked:isChecked,signature:signature(),complete,correct:isChecked&&correct,answerCorrect:correct,score,total:checks.length,message:correct?'You got it!':!complete?'Finish each part, then check your work.':task.mode==='equivalent'?'Check both totals. The two combinations must be different.':'Review the highlighted parts and try again.',answerChecks:checks.map((c,i)=>({...c,field:'money-'+i})),partAssessment:{checked:isChecked,correct:score,total:checks.length}}};
   }
   function mark(holder,check) {
    holder.querySelector(':scope > .part-mark')?.remove();delete holder.dataset.mark;
    if(checked!==signature()||!check.entered)return;
    holder.dataset.mark=check.correct?'correct':'retry';
    const badge=document.createElement('span');badge.className='part-mark';badge.textContent=check.correct?'✓':'↻';badge.setAttribute('aria-label',check.correct?'Correct':'Try again');holder.append(badge);
   }
   function showSelection(){if(task.mode==='compare')return;root.querySelectorAll('[data-piece]').forEach(el=>el.setAttribute('aria-pressed',String(selection?.key===el.dataset.piece&&selection?.origin===el.dataset.origin&&selection?.position===(el.dataset.position===undefined?undefined:Number(el.dataset.position)))));}
   function paint(){
    const checks=evaluateTask(task,state);
    if(['match','order'].includes(task.mode)) {
     root.querySelector('.money-bank').innerHTML=pieces.filter(key=>!state.slots.includes(key)).map(key=>tile(key,'bank')).join('');
     root.querySelectorAll('.money-pad').forEach((el,i)=>{el.querySelector('.pad-body').innerHTML=state.slots[i]?tile(state.slots[i],'slot-'+i):'<span class="pad-hint">Place money here</span>';mark(el,checks[i]);});
    } else if(task.mode==='compare')root.querySelectorAll('.compare-card').forEach((el,i)=>{el.querySelectorAll('[data-piece]').forEach(button=>button.setAttribute('aria-pressed',String(state.choices[i]===button.dataset.piece)));mark(el,checks[i]);});
    else {
     root.querySelectorAll('.money-mat').forEach((el,i)=>{
      const count=state.mats[i].length,cols=count<=4?2:count<=9?3:4,rows=Math.ceil(Math.max(count,4)/cols);
      const list=el.querySelector('.money-pieces');list.style.setProperty('--piece-cols',cols);list.style.setProperty('--piece-rows',rows);list.innerHTML=state.mats[i].map((key,p)=>tile(key,'mat-'+i,p)).join('');
      el.dataset.active=String(activeMat===i);el.querySelector('.mat-select').setAttribute('aria-pressed',String(activeMat===i));el.querySelector('.money-mat-total').textContent='Your total: '+amount(total(state.mats[i]),task.unit);
      mark(el,checks[task.mode==='change'?1:i]);
     });
     root.querySelectorAll('[data-estimate]').forEach(el=>el.setAttribute('aria-pressed',String(state.estimate===Number(el.dataset.estimate))));
     if(task.mode==='change')mark(root.querySelector('.change-estimate'),checks[0]);
    }
    if(task.mode!=='compare')showSelection();
   }
   function changed(message,focusSelector){checked='';done=false;persist();paint();signal('ml-state');if(message)speak(message);if(focusSelector)root.querySelector(focusSelector)?.focus();}
   function put(piece,destination) {
    if(destination==='bank'&&piece.origin.startsWith('slot-')) {state.slots[Number(piece.origin.split('-')[1])]=null;selection=null;changed('Money returned to the bank.');return;}
    if(destination.startsWith('slot-')&&pieces.includes(piece.key)) {
     const target=Number(destination.split('-')[1]),old=state.slots.indexOf(piece.key),other=state.slots[target];
     if(old===target)return;if(old>=0)state.slots[old]=other;state.slots[target]=piece.key;selection=null;changed('Money placed.','[data-pad="'+target+'"]');return;
    }
    if(destination.startsWith('mat-')&&task.denominations?.includes(piece.key)) {
     const target=Number(destination.split('-')[1]);
     if(target>=(task.mode==='equivalent'?2:1))return;
     if(piece.origin===destination)return;
     if(state.mats[target].length>=12){speak('This mat holds 12 pieces. Return a piece before adding another.');return;}
     if(piece.origin.startsWith('mat-'))state.mats[Number(piece.origin.split('-')[1])].splice(piece.position,1);
     state.mats[target].push(piece.key);activeMat=target;selection=null;changed(money[piece.key].label+' added. Your total is '+amount(total(state.mats[target]),task.unit)+'.');
    } else if(destination==='bank'&&piece.origin.startsWith('mat-')) {state.mats[Number(piece.origin.split('-')[1])].splice(piece.position,1);changed('Money returned to the bank.');}
   }
   root.addEventListener('click',event=>{
    if(suppressClick){suppressClick=false;return;}
    const el=event.target.closest('button');if(!el)return;
    if(el.classList.contains('reset-money')){state={slots:expected.map(()=>null),choices:(task.pairs||[]).map(()=>null),mats:[[],[]],estimate:null};selection=null;changed('Money activity reset.','.reset-money');return;}
    if(el.dataset.estimate!==undefined){state.estimate=Number(el.dataset.estimate);changed('Estimate selected.');return;}
    if(el.dataset.mat!==undefined){activeMat=Number(el.dataset.mat);paint();root.querySelector('[data-mat="'+activeMat+'"]').focus();return;}
    if(el.dataset.pad!==undefined){if(selection)put(selection,'slot-'+el.dataset.pad);else{const key=state.slots[Number(el.dataset.pad)];if(key){selection={key,origin:'slot-'+el.dataset.pad};showSelection();speak('Money selected. Choose another pad.');}}return;}
    if(el.dataset.piece!==undefined) {
     const key=el.dataset.piece,origin=el.dataset.origin,position=el.dataset.position===undefined?undefined:Number(el.dataset.position);
     if(origin.startsWith('pair-')){const index=Number(origin.split('-')[1]);state.choices[index]=key;changed('Choice selected.');return;}
     if(origin==='supply'){put({key,origin},'mat-'+activeMat);return;}
     if(origin.startsWith('mat-')){const i=Number(origin.split('-')[1]);state.mats[i].splice(position,1);changed('Money returned.','[data-mat="'+i+'"]');return;}
     selection=selection?.key===key?null:{key,origin,position};showSelection();speak(selection?'Money selected. Choose a value pad.':'Selection cleared.');
    }
   });
   root.addEventListener('keydown',event=>{
    if(event.key==='Escape'){selection=null;showSelection();speak('Selection cleared.');}
    if(['Delete','Backspace'].includes(event.key)) {
     const el=event.target.closest('[data-piece]');if(!el||el.dataset.origin==='bank'||el.dataset.origin==='supply'||el.dataset.origin.startsWith('pair-'))return;
     event.preventDefault();put({key:el.dataset.piece,origin:el.dataset.origin,position:Number(el.dataset.position)},'bank');
    }
   });
   const hovered=(x,y)=>document.elementFromPoint(x,y)?.closest('[data-drop]');
   function stopDrag(){const p=pointer;if(!p)return;pointer=null;p.ghost?.remove();root.querySelectorAll('.is-over').forEach(el=>el.classList.remove('is-over'));if(p.element.hasPointerCapture(p.id))p.element.releasePointerCapture(p.id);}
   root.addEventListener('pointerdown',event=>{
    suppressClick=false;const el=event.target.closest('[data-piece]');if(!el||el.dataset.origin.startsWith('pair-')||event.button!==0||!event.isPrimary||pointer)return;
    pointer={id:event.pointerId,element:el,x:event.clientX,y:event.clientY,key:el.dataset.piece,origin:el.dataset.origin,position:el.dataset.position===undefined?undefined:Number(el.dataset.position)};el.setPointerCapture(event.pointerId);
   });
   root.addEventListener('pointermove',event=>{
    if(pointer?.id!==event.pointerId)return;
    if(!pointer.ghost){if(Math.hypot(event.clientX-pointer.x,event.clientY-pointer.y)<6)return;pointer.ghost=document.createElement('div');pointer.ghost.className='money-ghost';pointer.ghost.setAttribute('aria-hidden','true');pointer.ghost.innerHTML=graphic(pointer.key);document.body.append(pointer.ghost);}
    pointer.ghost.style.left=event.clientX+'px';pointer.ghost.style.top=event.clientY+'px';root.querySelectorAll('.is-over').forEach(el=>el.classList.remove('is-over'));hovered(event.clientX,event.clientY)?.classList.add('is-over');
   });
   root.addEventListener('pointerup',event=>{if(pointer?.id!==event.pointerId)return;const p=pointer,dest=p.ghost?hovered(event.clientX,event.clientY)?.dataset.drop:null;stopDrag();suppressClick=Boolean(p.ghost);if(dest)put(p,dest);setTimeout(()=>{suppressClick=false;},0);});
   for(const type of ['pointercancel','lostpointercapture'])root.addEventListener(type,event=>{if(pointer?.id===event.pointerId)stopDrag();});
   window.ML_ENGINE={get:snapshot,check(){checked=signature();persist();paint();const s=snapshot();speak(s.assessment.message);return s;},setDone(value){done=Boolean(value);persist();}};
   document.title=task.title;paint();signal('ml-ready');
  }
  return {money,total,amount,composition,evaluateTask,graphic,styles,boot};
 }
 window.ML_NOVEMBER_MONEY=moneyFactory;
 const factory=moneyFactory();
 ML_ENGINES['november-money']='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+factory.styles+'</style></head><body><main class="money-activity"></main><script>('+moneyFactory.toString()+')().boot();</'+'script></body></html>';
})();
