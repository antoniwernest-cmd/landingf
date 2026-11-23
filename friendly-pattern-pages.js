/* Friendly presentation and task-specific curriculum evidence for the existing PDF activities. */
(() => {
  'use strict';
  const artNames=['pattern-detectives','pattern-translations','growing-patterns','shrinking-patterns','pattern-predictions','pattern-design-lab'];
  const updated=[];
  for(const q of ML_CATALOG.filter(q=>q.id.startsWith('patterning-pdf-'))){
    const book=q.config.patterningWorksheet,t=book.tasks.find(t=>t.id===q.config.patterningTask),codes=new Set(q.codes);
    let goal='I can find a rule, keep it going and explain my prediction.';
    if(t.type==='flex'||t.display&&t.kind==='letter'){codes.add('C1.2');goal='I can show the same pattern with shapes, letters or numbers.';}
    if(t.type==='dots'&&t.table){if(q.grade===3)codes.add('C1.2');goal='I can count the figures, finish the table and describe the change.';}
    if(t.type==='createShape'){codes.add('C1.2');goal='I can create a repeating core, show full repeats and explain my design.';}
    if(t.type==='numericCreate'){codes.add('C1.2');codes.add('C1.4');goal='I can create a growing or shrinking number pattern and describe its rule.';if(q.grade===3){t.max=1000;t.prompt=t.prompt.replace(/0[–-]100\b|0 to 100\b/g,'0 to 1,000');}}
    if(t.type==='dependentTable'){codes.add('C1.2');goal='I can put my own number pattern in a table and use its rule to predict.';}
    if(t.type==='reason')goal='I can use the pattern’s core or rule to explain why a prediction fits.';
    if(t.table&&q.grade===3)codes.add('C1.2');
    q.codes=[...codes].sort();
    const source=`https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g${q.grade}-math/strand-c/c1`;
    const text={'C1.1':q.grade===2?'Identify and describe geometric patterns in designs and everyday contexts.':'Identify and describe repeating elements and operations in patterns.','C1.2':q.grade===2?'Create and translate patterns using shapes, numbers and other representations.':'Create and translate patterns using representations that include tables of values.','C1.3':'Use pattern rules to extend patterns, justify predictions and find missing elements.','C1.4':`Create and describe whole-number relationships up to ${q.grade===2?'100':'1,000'}.`};
    q.details=q.codes.map(code=>({code,curriculumExplanation:text[code],explanation:goal,url:source}));
    q.config.curriculumAlignment={...q.config.curriculumAlignment,codes:q.codes,goal,evidence:goal,details:q.details,source,verifiedOn:'2026-11-01'};
    q.directions='Look at the model. Build or choose your answer, then check your work. Tell how you know when asked.';
    updated.push({id:q.id,codes:q.codes,goal,source});
  }
  function friendlyArt(){
    const cfg=window.ML_CONFIG,book=cfg?.patterningWorksheet;if(!book)return;
    const t=book.tasks.find(t=>t.id===cfg.patterningTask),isPlay=cfg.engine==='pattern-play',isTerms=cfg.engine==='term-tables';
    let name=artNames[Math.min(5,Math.max(0,book.page-1))];
    if(isPlay){const names={lines:'growing-patterns',blocks:'growing-patterns','chart-table':'pattern-translations',letters:'pattern-predictions',sports:'pattern-design-lab',hops:'growing-patterns',attributes:'pattern-translations','chart-hops':'growing-patterns',compare:'pattern-detectives','figures-table':'growing-patterns','next-three':'pattern-detectives','hops-table':'pattern-translations','complete-cores':'pattern-predictions'};name=names[t.playMode]||'pattern-detectives';}
    if(isTerms)name='pattern-translations';document.body.classList.add('friendly-pattern-page');if(!isPlay&&!isTerms)document.body.classList.add('friendly-pdf-page');
    const header=document.querySelector('header');if(!header||header.querySelector('.ml-learning-art'))return;
    const img=document.createElement('img');img.className='ml-learning-art';img.src='assets/pattern-play/'+name+'.png';img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';header.append(img);
    if(!isPlay&&!isTerms){document.body.dataset.pdfPane='model';const nav=document.createElement('nav');nav.className='friendly-pdf-pane';nav.setAttribute('aria-label','Activity panels');nav.innerHTML='<button type="button" data-pdf-pane="model" aria-pressed="true">Build & look</button><button type="button" data-pdf-pane="answers" aria-pressed="false">My answers</button>';header.append(nav);nav.addEventListener('click',e=>{const b=e.target.closest('[data-pdf-pane]');if(!b)return;document.body.dataset.pdfPane=b.dataset.pdfPane;nav.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));});}
  }
  const css=`
    body.friendly-pattern-page header{position:relative;padding-right:128px!important}
    .ml-learning-art{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:112px;height:92px;object-fit:contain;pointer-events:none}
    body.friendly-pdf-page{background:#f7faf5;color:#29454b}
    .friendly-pdf-page header{background:#eaf3e9;border:1px solid #c9ddcc;border-radius:15px;padding:10px 128px 10px 14px}
    .friendly-pdf-page header h1{color:#2b555b}.friendly-pdf-page header p{line-height:1.25}
    .friendly-pdf-page .main-panel,.friendly-pdf-page .tools{background:#fff;border-color:#c5d9ce;border-radius:15px}
    .friendly-pdf-page .term.given{background:#edf5e6;border-color:#c8d9bb}
    .friendly-pdf-page button{border-color:#a8bdb6;border-radius:10px}
    .friendly-pdf-page button[aria-pressed=true]{background:#e7d9f2;border-color:#9674b4}
    .friendly-pdf-page input,.friendly-pdf-page textarea{border-color:#80a6a2;background:#fbfefd}
    .friendly-pdf-page .tile-bank{background:#f1ebf7;border-radius:12px;padding:8px}
    .friendly-pdf-page .field>span{color:#375d62}
    .friendly-pdf-pane{display:none}.no-tools .friendly-pdf-pane{display:none!important}
    @media(max-height:500px){.ml-learning-art{width:98px;height:74px}body.friendly-pattern-page header{padding-right:111px!important}.friendly-pdf-page header{padding-top:6px;padding-bottom:6px}}
    @media(max-width:680px){.ml-learning-art{width:76px;height:74px;right:5px;top:8px;transform:none}body.friendly-pattern-page header{padding-right:88px!important}.play-pane-switch{margin-right:-77px}.friendly-pdf-page header h1{font-size:21px}.friendly-pdf-page header p{font-size:14px}.friendly-pdf-pane{display:flex;gap:7px;margin:8px -77px 0 0}.friendly-pdf-pane button{flex:1;min-height:32px;font-size:13px;padding:4px}.friendly-pdf-page .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}.friendly-pdf-page #main,.friendly-pdf-page #tools{grid-row:auto!important;grid-column:auto!important}.friendly-pdf-page:not(.no-tools)[data-pdf-pane=model] #tools{display:none!important}.friendly-pdf-page:not(.no-tools)[data-pdf-pane=answers] #main{display:none!important}.friendly-pdf-page #main{min-height:0}.friendly-pdf-page .dots-layout{min-height:0}}
    .term-table-page #main>.term-table{grid-column:1;grid-row:1/-1;min-height:0}.term-table-page #main>.model-region{grid-column:2;grid-row:1}.term-table-page #main>.tile-bank{grid-column:2;grid-row:2;padding:6px;min-height:0}.term-table-page .term-figures{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.term-table-page .term-figures section{padding:5px;min-width:0}.term-table-page .term-figures h3{font-size:11px}.term-table-page .figure-dots{gap:4px;max-width:100%}.term-table-page .figure-dots i{width:17px;height:17px}.term-table-page .part-mark{font:12px/18px system-ui,sans-serif!important;height:18px!important}
    @media(max-height:500px){.term-table-page .term-table .term{height:28px!important;min-height:28px!important;font-size:20px}.term-table-page .term-table .term input{height:25px;min-height:25px;font-size:18px!important;padding:1px}.term-table-page .term-table th,.term-table-page .term-table td{padding:1px}.term-table-page .term-table thead th{height:28px;font-size:12px}.term-table-page .term-table caption{font-size:10px;padding-bottom:4px}.term-table-page .tile-bank .bank button{min-height:29px;font-size:16px;padding:2px}.term-table-page .tile-bank .hint{font-size:10px}.term-table-page .term-figures section{padding:4px}.term-table-page .model-region .model svg{max-height:64px}.term-table-page .model-tabs button{min-height:28px;font-size:11px}}
    @media(max-width:480px){.term-table-page #main{gap:6px;grid-template-columns:minmax(130px,.8fr) minmax(0,1fr)}.term-table-page .tile-bank .bank{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px}.term-table-page .tile-bank .bank button{min-height:30px;font-size:16px;padding:2px}.term-table-page .tile-bank .hint{font-size:10px;line-height:1.15}.term-table-page .term-figures{gap:3px}.term-table-page .term-figures section{padding:3px}.term-table-page .term-figures h3{font-size:9px;margin-bottom:3px}.term-table-page .figure-dots{gap:3px}.term-table-page .figure-dots i{width:10px;height:10px;border-width:1px}.term-table-page .term-table .term{height:31px!important;min-height:31px!important;font-size:20px}.term-table-page .term-table .term input{min-height:28px;font-size:18px!important}.term-table-page .term-table thead th{font-size:11px;height:30px}.term-table-page .model-tabs button{min-height:29px;font-size:10px;padding:3px}.term-table-page .model svg{max-height:65px}}
    @media(max-width:480px){.term-table-page .term-table th,.term-table-page .term-table td{padding:1px!important}.term-table-page .term-table thead th{font-size:10px;line-height:1.2;height:27px}.term-table-page .term-table tbody th{font-size:18px;line-height:1.2}.term-table-page .term-table .term strong{font:18px/1.3 Andika,sans-serif!important}.term-table-page .term-table caption{font-size:10px;line-height:1.2;padding-bottom:3px}.term-table-page .model-tabs button{min-height:26px;font-size:10px;padding:2px}.term-table-page .model svg{max-height:55px!important}.term-table-page .model h3{font-size:10px;line-height:1.2}.term-table-page .model{padding:4px}}
    @media print{.ml-learning-art{width:105px;height:85px}body.friendly-pattern-page header{padding-right:120px!important}.friendly-pdf-pane{display:none!important}.friendly-pdf-page #main,.friendly-pdf-page #tools{display:flex!important}.term-table-page #main>.term-table{grid-row:1}.term-table-page #main>.model-region{grid-row:1}}
  `;
  for(const name of ['patterning-pdf','pattern-play','term-tables']){
    let html=ML_ENGINES[name];if(!html)continue;
    if(name==='patterning-pdf'||name==='term-tables'){
      html=html.replace('function render(){','let friendlyRendering=false;\nfunction render(){if(friendlyRendering)return;friendlyRendering=true;try{');
      html=html.replace("$('status').textContent=a.message;\n}","$('status').textContent=a.message;\n}finally{friendlyRendering=false;}\n}");
      html=html.replace('function inputValue(el,commit=false){','function inputValue(el,commit=false){if(friendlyRendering)return;');
      // Input events already save each change. Avoid rebuilding the next input during blur.
      html=html.replace('if(commit)render();else{','{');
    }
    ML_ENGINES[name]=html.replace('</head>','<style id="friendlyPatternArtwork">'+css+'</style><script>document.addEventListener("DOMContentLoaded",'+friendlyArt.toString()+',{once:true});<\/script></head>');
    // friendlyArt is serialized into the child document, so provide its topic list there.
    ML_ENGINES[name]=ML_ENGINES[name].replace('const cfg=window.ML_CONFIG,book=cfg?.patterningWorksheet;', 'const artNames='+JSON.stringify(artNames)+';const cfg=window.ML_CONFIG,book=cfg?.patterningWorksheet;');
  }
  window.ML_FRIENDLY_PATTERN_PAGES={updated,artNames};
})();
