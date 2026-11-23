/* Teacher's November 1 PDF: preserve permanent pages and native per-part checking. */
(()=>{'use strict';
 const changed=new Set(),objects=new Set();
 const rows=[...(window.ML_CATALOG||[]),...(window.ML_HOMEWORK_PAGES||[])];
 function help(t,id,text){const f=t.fields?.find(f=>f.id===id);if(f)f.nov1Help=text;}
 for(const q of rows){if(objects.has(q))continue;objects.add(q);const cfg=q.config,t=cfg?.patterningWorksheet?.tasks?.find(t=>t.id===cfg.patterningTask);if(!t)continue;if(t.nov1Tags){cfg.nov1Edits=t.nov1Tags;q.title=t.title;q.prompt=t.prompt;changed.add(q.id);continue;}
  const tags=[]; const tag=x=>{if(!tags.includes(x))tags.push(x);};
  if(t.cardKind==='table')tag('notebook');
  if(t.table?.heading==='Input'&&t.cardKind==='table'){
   const d=t.values[0]-t.table.positions[0],amount=Math.abs(d),operation=d<0?'subtract':'add';
   t.title='Input → output: '+operation+' '+amount;
   t.prompt='In every row, '+operation+' '+amount+(d<0?' from':' to')+' the input to get its output. Complete the blank outputs.';
   t.nov1Example=t.table.positions[0]+(d<0?' − ':' + ')+amount+' = '+t.values[0];
   t.nov1Rule=(d<0?'Subtract ':'Add ')+amount+' for each input';
   help(t,'why','Compare across each row: input → output. Use the same operation in every row.');
  }
  if(t.weeklyPractice){tag('weekly');t.prompt='Look across the three weeks. Choose the event that happens again each week, then explain what repeats.';}
  if(t.numberRows?.length>1&&t.fields?.some(field=>field.id==='winner')){tag('comparison');t.prompt='1. Continue both rows using their rules. 2. Count the starting number as term 1. 3. Compare the first terms with values below 5.';}
  if(t.equationRows){tag('equations');help(t,'box','Choose what the empty box means in these equations.');help(t,'rule','Read the missing values from top to bottom. Choose how they change.');}
  if(t.kind==='shape'&&t.cardKind==='shapes')tag('large-shapes');
  if(t.shapeRow)tag('large-source');
  if(t.playMode==='attributes')tag('attributes');
  if(t.playMode==='chart-hops'){
   tag('chart');t.prompt='1. Start at '+t.values[0]+'. 2. Add '+t.hop+' for each jump. 3. Fill the empty boxes, then predict the next number.';
   if(t.table)t.prompt+=' “Table of values” shows the same pattern.';
  }
  if(t.family==='mathology-near-doubles'){
   tag('doubles');const [a,b]=t.expectedDots,extra=b-a;
   t.prompt='Build '+a+' counters for Rocky and '+b+' for Luna. Find the double, the extra counters, and the total.';
   t.nov1Lesson={base:a,extra};
   help(t,'double','First find two equal groups: '+a+' + '+a+'. Drag or tap its total.');
   help(t,'extra','Compare Luna’s group with Rocky’s. How many counters are extra?');
   help(t,'total','Add the extras to your double. Choose the total of both groups.');
   help(t,'why','Choose the explanation for doubling the smaller group and adding the extras.');
  }
  if(t.mathologyKind==='claimNumber'&&t.display?.values){
   tag('claim');const f=t.fields.find(f=>f.id==='correct');
   t.prompt+=' Choose the rule, decide Yes or No, then enter the correct value for the named figure.';
   help(t,'rule','Compare the first three figures. Choose the change from one figure to the next.');
   help(t,'agree','Extend the pattern to the named figure. Does its value match the scorekeeper’s claim?');
   help(t,'correct','Enter the value for the figure named above, even if the claim is wrong.');
  }
  if(t.family==='operations-join'){
   tag('join');t.prompt+=' Choose a plan, find the total, then choose why the model fits.';
   help(t,'plan','Read the story. Choose the operation that combines the two groups.');
   help(t,'answer','Find the whole by combining both amounts. Drag a number or type your total.');
   help(t,'why','Choose the statement that explains the relationship between the parts and the whole.');
  }
  if(t.kind==='number'&&['table','line'].includes(t.cardKind)){
   let options=[...new Set(t.values.filter((_,i)=>!t.given?.includes(i)).map(String))];
   const n=Number(options[0]),step=Math.abs(Number(t.rule))||1;
   for(const candidate of [n-step,n+step,n+1,n-1,n+2,n+step*2])if(Number.isFinite(candidate)&&candidate>=0&&!options.includes(String(candidate))&&options.length<4)options.push(String(candidate));
   t.nov1Choices=options.sort((a,b)=>Number(a)-Number(b));
  }
  if(!tags.length&&!t.nov1Choices)continue;
  t.nov1Tags=tags;cfg.nov1Edits=tags;q.title=t.title;q.prompt=t.prompt;changed.add(q.id);
 }
 const css=String.raw`
 .nov1-help{display:block!important;flex:none!important;font-size:clamp(12px,1vw,18px)!important;line-height:1.22!important;margin:4px 0 0!important;color:#31576d;font-weight:normal!important}
 .nov1-lesson{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;flex:none;padding:8px;border:2px solid #a7c7da;border-radius:12px;background:#edf5ff}
 .nov1-lesson>strong{font-size:clamp(15px,1.5vw,28px);text-align:center;padding:6px;background:#fff;border-radius:8px;line-height:1.2}
 .nov1-lesson small{display:block;font-size:12px;font-weight:normal;color:#3c5e70;margin-bottom:3px}
 .nov1-lesson .nov1-transfer{grid-column:1/-1;font-size:14px;margin:0;text-align:center}
 .nov1-page .nov1-notebook-art{width:100%;height:clamp(75px,18vh,220px);object-fit:contain;min-height:0}
 .nov1-rule-example{font-size:clamp(21px,2vw,38px)!important;font-weight:bold;color:#345d80;margin:8px 0!important}
 html body.nov1-notebook .card-table-wrap{background:repeating-linear-gradient(#fffdf5 0px,#fffdf5 29px,#d7e5ef 30px,#fffdf5 31px);border:2px solid #c9c2ac;border-left:5px solid #df9d95;border-radius:7px;padding:10px;gap:14px}
 html body.nov1-notebook .card-table-panes .card-value-table{gap:0!important;border:2px solid #36586e;grid-template-rows:24px 38px repeat(var(--card-value-rows),minmax(0,1fr))!important;background:#fffdf5}
 html body.nov1-notebook .card-value-table :is(th,td){border:1.5px solid #36586e!important;border-radius:0!important;background:#fffdf5!important;font-size:clamp(17px,1.7vw,30px)!important}
 html body.nov1-notebook .card-value-table caption{background:#f6e7ba;padding:4px;box-sizing:border-box;border-bottom:2px solid #36586e;font-size:13px!important}
 html body.nov1-notebook .card-value-table thead th{background:#dbeaf4!important}
 html body.nov1-notebook .card-value-table td>.term{border:0!important;border-radius:0!important;box-shadow:none!important;background:#fffdf5!important}
 html body.nov1-notebook .card-value-table .term>strong{font-size:clamp(24px,3vw,52px)!important}
 html body.nov1-notebook .card-table-tip{padding:7px!important;background:#fffdf5dd!important;border:0!important;border-radius:0!important;justify-content:center!important;gap:5px!important}
 html body.nov1-notebook .card-table-tip p{margin:0!important;text-align:center;line-height:1.2}
 html body.nov1-weekly .card-week-pattern,html body.nov1-comparison .card-number-rows{justify-content:stretch!important;display:grid!important;grid-template-rows:repeat(3,minmax(0,1fr));gap:12px}
 html body.nov1-comparison .card-number-rows{grid-template-rows:repeat(2,minmax(0,1fr))}
 html body.nov1-weekly .card-week-pattern article,html body.nov1-comparison .card-number-rows article{display:flex;flex-direction:column;justify-content:center;gap:10px;padding:12px}
 html body.nov1-weekly .card-week-pattern article>div,html body.nov1-comparison .card-number-rows article>div{flex:1;min-height:0;align-items:stretch}
 html body.nov1-weekly .card-week-pattern span,html body.nov1-comparison .card-number-rows strong{display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:clamp(16px,2vw,34px)!important;line-height:1.2}
 html body.nov1-comparison .card-number-rows strong:after{content:'term ' attr(data-term);font-size:13px;font-weight:normal;color:#57717b;margin-top:8px}
 html body.nov1-equations .card-equation-pattern{flex:1!important;min-height:0;justify-content:stretch!important;display:grid!important;grid-template-rows:repeat(3,minmax(0,1fr));gap:12px}
 html body.nov1-equations .card-equation-pattern>div,html body.nov1-equations .card-equation-pattern>article{display:flex;align-items:center;justify-content:center;background:#f1f5f0;border:2px solid #c2d5cf;border-radius:12px;gap:12px;font-size:clamp(22px,3vw,52px)!important;min-height:0}
 html body.nov1-equations .card-equation-pattern .term{height:75%;width:clamp(65px,12vw,180px);min-height:40px!important;display:flex;justify-content:center;align-items:center}
 html body.nov1-equations .card-equation-pattern .term>strong{font-size:clamp(25px,4vw,70px)!important}
 @media screen{
 html body.nov1-page header{padding:6px 100px 6px 12px!important;min-height:0!important}
 html body.nov1-page .mathology-header{grid-template-columns:minmax(0,1fr) 80px!important;min-height:0!important;padding:6px 12px!important}
 html body.nov1-page .mathology-header .mathology-story{width:80px!important;height:66px!important;min-height:0!important;grid-template-rows:minmax(0,1fr) 14px!important;align-self:center}
 html body.nov1-page .mathology-header .mathology-story img{width:100%!important;height:100%!important;min-height:0;object-fit:cover}
 html body.nov1-page .mathology-header .mathology-story figcaption{font-size:9px!important}
 html body.nov1-page header .mathology-visual{display:none!important}
 html body.nov1-page header h1{font-size:clamp(21px,2vw,30px)!important;margin:2px 0!important;line-height:1.1}
 html body.nov1-page header p{font-size:clamp(14px,1.3vw,21px)!important;line-height:1.2!important;margin:2px 0 0!important}
 html body.nov1-page header small,html body.nov1-page #alignment{font-size:10px!important;line-height:1.15!important}
 html body.nov1-page .ml-learning-art{width:82px!important;height:68px!important}
 html body.nov1-page #tools{justify-content:flex-start!important;align-content:start!important}
 html body.nov1-page #tools .extra-fields{align-content:start!important;justify-content:flex-start!important}
 html body.nov1-page #tools .field{justify-content:flex-start!important}
 html body.nov1-page.nov1-all-fields #tools>.engaging-answer-tabs{display:none!important}
 html body.nov1-page.nov1-all-fields #tools>.extra-fields{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:repeat(var(--nov1-field-count,4),minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:10px!important;flex:1!important;min-height:0}
 html body.nov1-page.nov1-all-fields #tools>.extra-fields>.field[hidden]{display:flex!important}
 html body.nov1-page #tools .field>span{font-size:clamp(15px,1.2vw,25px)!important;line-height:1.15!important}
 html body.nov1-page #tools .field-choices button{font-size:clamp(14px,1vw,22px)!important;min-height:44px!important;line-height:1.15!important}
 html body.nov1-page .dot-panel{display:flex!important;flex-direction:column!important;min-height:0;gap:7px}
 html body.nov1-page .dot-board{flex:1!important;min-height:0;grid-template-rows:repeat(var(--nov1-dot-rows,4),minmax(0,1fr))!important}
 html body.nov1-page .dot-board .dot-cell{min-height:0!important;min-width:0!important;width:var(--nov1-dot-size,36px)!important;height:var(--nov1-dot-size,36px)!important;max-height:none!important;aspect-ratio:1!important;place-self:center;padding:0!important}
 html body.nov1-page #main>.sequence{flex:1 1 0%!important;min-height:0!important}
 html body.nov1-page #tools .field-choices{min-width:0!important;max-width:100%;box-sizing:border-box}
 html body.nov1-page #tools .field-choices button{min-width:0!important;max-width:100%!important;box-sizing:border-box;overflow-wrap:anywhere;white-space:normal!important}
 html body.nov1-notebook .card-table-tip .nov1-rule-example{font-size:clamp(22px,2vw,36px)!important}
 html body.nov1-page .dot-panel .nov1-help{font-size:13px!important;text-align:center}
 html body.nov1-attributes .play-symbol-row{height:var(--nov1-attribute-size,64px);align-items:center!important;gap:8px!important}
 html body.nov1-attributes .play-symbol-row>.symbol{width:var(--nov1-attribute-size,64px)!important;height:var(--nov1-attribute-size,64px)!important;display:flex;align-items:center;justify-content:center;min-width:0}
 html body.nov1-attributes .play-attribute-rows .symbol svg{width:var(--nov1-attribute-size,64px)!important;height:var(--nov1-attribute-size,64px)!important;max-width:100%;max-height:100%}
 html body.nov1-attributes .play-pattern-row h2{font-size:clamp(13px,1.2vw,23px)!important}
 html body.nov1-large-shapes #main>.sequence .symbol svg,html body.nov1-large-source #main .card-shape-source .sequence .symbol svg{width:var(--nov1-shape-size,90px)!important;height:var(--nov1-shape-size,90px)!important;max-width:100%;max-height:100%}
 html body.nov1-large-shapes #main>.sequence .symbol{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:0}
 html body.nov1-large-source .card-shape-source{flex:1!important;min-height:0;display:flex!important;flex-direction:column}
 html body.nov1-large-source .card-shape-source>.sequence{flex:1!important;min-height:0}
 html body.nov1-chart .play-hop-side .play-model-content{flex:1;min-height:0;display:flex;flex-direction:column}
 html body.nov1-chart .play-table-wrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:12px}
 html body.nov1-chart .play-model-content .play-trail{min-height:0;height:100%}
 @media(min-width:1050px) and (min-height:500px){
 html body.nov1-page.nov1-all-fields #tools>.extra-fields{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important}
 html body.nov1-doubles.nov1-all-fields #tools>.extra-fields{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:minmax(0,.8fr) minmax(0,1fr)!important}
 html body.nov1-doubles.nov1-all-fields #tools>.extra-fields>.field:last-child{grid-column:1/-1}
 html body.nov1-doubles.nov1-all-fields #tools .unit-numeric-answer{grid-template-columns:50px minmax(0,1fr)!important;gap:4px}
 html body.nov1-doubles.nov1-all-fields #tools .unit-number-options button{font-size:14px!important;padding:1px!important}
 html body.nov1-doubles.nov1-all-fields #tools .field-choices:not(.unit-number-options){display:flex!important;flex-direction:row!important;gap:5px}
 html body.nov1-doubles.nov1-all-fields #tools .field-choices:not(.unit-number-options)>button{flex:1;min-width:0!important}
 }
 @media(min-width:1700px) and (min-height:700px){
 html body.nov1-page #tools .field-choices:not(.unit-number-options){display:flex!important;flex-direction:column;gap:8px}
 html body.nov1-page #tools .field-choices:not(.unit-number-options)>button{width:100%!important;flex:none!important;align-self:stretch!important}
 html body.nov1-page #tools .unit-answer-pad{min-height:50px!important}
 }
 .nov1-pane-tabs{display:none}
 html body.nov1-page.nov1-pane-mode .nov1-pane-tabs{display:flex;grid-column:1/-1;gap:6px;margin-top:5px}
 .nov1-pane-tabs button{flex:1;min-height:36px!important;font-size:14px!important;padding:4px!important}
 .nov1-pane-tabs [aria-pressed=true]{background:#e7ddf4!important}
 html body.nov1-page.nov1-pane-mode .pattern-device-tabs{display:none!important}
 html body.nov1-page.nov1-pane-mode .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}
 html body.nov1-page.nov1-pane-mode .work>#main,html body.nov1-page.nov1-pane-mode .work>#tools{grid-column:1!important;grid-row:1!important;display:flex!important;flex-direction:column;min-height:0!important;align-content:start!important}
 html body.nov1-page.nov1-pane-mode[data-nov1-pane=model] .work>#tools,html body.nov1-page.nov1-pane-mode[data-nov1-pane=answers] .work>#main{display:none!important}
 html body.nov1-page.nov1-pane-mode #tools>.extra-fields{display:flex!important;flex-direction:column;flex:1!important;min-height:0!important}
 html body.nov1-page.nov1-pane-mode #tools>.extra-fields>.field{flex:none!important}
 html body.nov1-page.nov1-pane-mode .nov1-lesson{min-height:max-content!important;flex:none!important;grid-template-rows:auto auto}
 html body.nov1-page.nov1-pane-mode .mathology-header .mathology-story{display:none!important}
 html body.nov1-page.nov1-pane-mode .mathology-header{grid-template-columns:minmax(0,1fr)!important}
 html body.nov1-page.nov1-pane-mode .dot-panel .nov1-help{font-size:12px!important}
 @media(max-height:500px),(max-width:680px){
 html body.nov1-page header{padding:4px 8px!important}
 html body.nov1-page .ml-learning-art{display:none!important}
 html body.nov1-page header h1{font-size:21px!important}
 html body.nov1-page header p{font-size:14px!important}
 html body.nov1-page #tools .nov1-help{font-size:13px!important}
 html body.nov1-page .nov1-lesson{padding:4px;gap:3px}
 html body.nov1-page .nov1-lesson strong{font-size:15px;padding:3px}
 html body.nov1-page .nov1-lesson small{font-size:10px}
 html body.nov1-page .nov1-transfer{font-size:11px}
 html body.nov1-page .dot-panel .nov1-help{font-size:11px!important}
 html body.nov1-weekly .card-week-pattern,html body.nov1-comparison .card-number-rows{gap:6px}
 html body.nov1-weekly .card-week-pattern article,html body.nov1-comparison .card-number-rows article{padding:5px;gap:4px}
 html body.nov1-weekly .card-week-pattern span{font-size:11px!important}
 html body.nov1-comparison .card-number-rows strong{font-size:24px!important}
 html body.nov1-equations .card-equation-pattern{gap:6px}
 html body.nov1-equations .card-equation-pattern>div{font-size:21px!important;gap:5px}
 html body.nov1-notebook .card-table-wrap{padding:5px;gap:5px}
 html body.nov1-notebook .card-table-panes .card-value-table{grid-template-rows:20px 30px repeat(var(--card-value-rows),minmax(0,1fr))!important}
 html body.nov1-notebook .card-value-table :is(th,td){font-size:18px!important}
 html body.nov1-notebook .card-value-table .term>strong{font-size:24px!important}
 }
 }
 @media print{.nov1-page .nov1-help{font-size:10px!important}.nov1-lesson{padding:3px}.nov1-lesson strong{font-size:16px}.nov1-lesson small{font-size:10px}.nov1-notebook-art{height:90px!important}.nov1-rule-example{font-size:22px!important}.nov1-page .card-value-table :is(th,td){font-size:16px!important}.nov1-page .card-value-table .term>strong{font-size:22px!important}.nov1-page .card-week-pattern span{font-size:15px!important}.nov1-page .card-equation-pattern>div{font-size:24px!important}}
 @media screen{
 @layer doubles-homework-layout{
  html body.nov1-doubles .nov1-pane-tabs{justify-content:center!important;gap:5px}
  html body.nov1-doubles .nov1-pane-tabs button{flex:0 0 auto!important;width:auto!important;padding:4px 14px!important}
  html body.nov1-doubles .work>#main{display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important;gap:6px!important;padding:8px!important}
  html body.nov1-doubles.nov1-pane-mode[data-nov1-pane=answers] .work>#main{display:none!important}
  html body.nov1-doubles .work>#main>.unit-counter-bank{grid-column:1!important;grid-row:1!important;align-self:center!important}
  html body.nov1-doubles .unit-counter-bank>span,html body.nov1-doubles .dot-panel>.dot-supply{display:none!important}
  html body.nov1-doubles .work>#main>.nov1-lesson{grid-column:2!important;grid-row:1!important;min-height:0!important;grid-template-rows:auto auto!important;gap:3px;padding:4px}
  html body.nov1-doubles .nov1-lesson strong{font-size:clamp(14px,1.6vw,22px);padding:3px 5px;line-height:1.15!important}
  html body.nov1-doubles .nov1-lesson small{font-size:clamp(10px,1.05vw,14px);margin-bottom:2px}
  html body.nov1-doubles .nov1-transfer{font-size:clamp(11px,1.05vw,14px);margin:0;line-height:1.15!important}
  html body.nov1-doubles .work>#main>.dots-layout{grid-column:1/-1!important;grid-row:2!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:minmax(0,1fr)!important;gap:7px;min-height:0}
  html body.nov1-doubles .dots-layout>.dot-panel{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) auto!important;gap:4px!important;padding:6px!important;min-width:0;min-height:0}
  html body.nov1-doubles .dot-panel>h3{grid-column:1!important;grid-row:1!important;margin:0;font-size:clamp(14px,1.45vw,21px);line-height:1.15!important}
  html body.nov1-doubles .dot-panel>h3>.nov1-help{display:inline-block;font-size:clamp(11px,1.05vw,14px)!important;color:#3e6172;font-weight:normal;margin-left:6px}
  html body.nov1-doubles .dot-panel>.dot-board{grid-column:1!important;grid-row:2!important;align-self:stretch!important;justify-self:center!important;width:min(100%,320px)!important;height:100%!important;min-height:0!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(var(--nov1-dot-rows,2),minmax(0,1fr))!important;gap:4px!important}
  html body.nov1-doubles .dot-board>.dot-cell{width:var(--nov1-dot-size,28px)!important;height:var(--nov1-dot-size,28px)!important;min-height:0!important;max-height:none!important;align-self:center!important;justify-self:center!important;border-radius:50%}
  html body.nov1-doubles .dot-panel>.dot-controls{grid-column:1!important;grid-row:3!important;justify-content:center!important;align-items:center!important;flex-wrap:nowrap!important;gap:5px}
  html body.nov1-doubles .dot-controls button{width:auto!important;min-width:0!important;min-height:34px!important;padding:3px 8px!important;font-size:clamp(11px,1.05vw,15px)!important;white-space:nowrap}
  @media(max-height:500px){
   html body.nov1-doubles .mathology-header{gap:2px 6px!important;padding:4px 7px!important;min-height:0!important}
   html body.nov1-doubles .mathology-header h1,html body.nov1-doubles .mathology-header p{margin:0!important}
   html body.nov1-doubles .nov1-pane-tabs{margin-top:1px!important;row-gap:2px!important}
   html body.nov1-doubles .nov1-pane-tabs button{min-height:30px!important}
   html body.nov1-doubles .work>#main{padding:4px!important;gap:4px!important}
   html body.nov1-doubles .unit-counter-bank button{min-height:32px;padding:2px 6px}
   html body.nov1-doubles .work>#main>.nov1-lesson{grid-template-rows:auto!important;min-height:0!important}
   html body.nov1-doubles .nov1-transfer{display:none}
   html body.nov1-doubles .dots-layout>.dot-panel{padding:4px!important;grid-template-rows:auto minmax(0,1fr)!important;grid-template-columns:minmax(0,1fr) auto!important;column-gap:3px!important}
   html body.nov1-doubles .dot-panel>h3{font-size:13px;align-self:center!important}
   html body.nov1-doubles .dot-panel>h3>.nov1-help{font-size:11px!important;margin-left:4px}
   html body.nov1-doubles .dot-panel>.dot-board{grid-column:1/-1!important}
   html body.nov1-doubles .dot-panel>.dot-controls{grid-column:2!important;grid-row:1!important;gap:3px}
   html body.nov1-doubles .dot-controls button{min-height:29px!important;padding:2px 5px!important}
  }
  @media(min-width:650px) and (max-height:500px){
   html body.nov1-doubles .mathology-header{grid-template-columns:minmax(0,1fr) minmax(240px,.5fr)!important;grid-template-rows:auto auto auto!important}
   html body.nov1-doubles .mathology-header>#title{grid-row:1!important}
   html body.nov1-doubles .mathology-header>#alignment{grid-row:2!important}
   html body.nov1-doubles .mathology-header>#prompt{grid-row:3!important}
   html body.nov1-doubles .mathology-header>.nov1-pane-tabs{grid-column:2!important;grid-row:1/-1!important;align-self:center!important}
   html body.nov1-doubles .nov1-lesson>strong{padding:1px 4px!important;line-height:1.1!important}
   html body.nov1-doubles .nov1-lesson small{margin-bottom:0!important}
   html body.nov1-doubles .dot-panel>.dot-board{gap:3px!important}
  }
 }
 }
 `;
 function install(){
  const cfg=window.ML_CONFIG,t=cfg?.patterningWorksheet?.tasks?.find(t=>t.id===cfg.patterningTask);if(!t?.nov1Tags)return;
  document.body.classList.add('nov1-page',...t.nov1Tags.map(s=>'nov1-'+s));let pending=false,printing=false;
  const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function apply(){pending=false;if(printing)return;const main=document.getElementById('main'),tools=document.getElementById('tools');if(!main||!tools)return;
   if(t.nov1Lesson&&!main.querySelector('.nov1-lesson')){const {base:a}=t.nov1Lesson,n=document.createElement('aside');n.className='nov1-lesson';n.setAttribute('aria-label','Learn doubles and near doubles');
    n.innerHTML=[0,1,2].map(e=>'<strong><small>'+(e?'Double, plus '+e:'A double: equal groups')+'</small>6 + 6'+(e?' + '+e:'')+' = '+(12+e)+'</strong>').join('')+(a!==6?'<p class="nov1-transfer">Use the same idea here: start with '+a+' + '+a+' = '+(a*2)+'. Then add the extras.</p>':'');main.prepend(n);
   }
   for(const [i,p] of [...main.querySelectorAll('.dot-panel')].entries()){
    if(!p.querySelector('.nov1-help')){const n=document.createElement('p');n.className='nov1-help';n.textContent='Make '+t.expectedDots[i]+' counters. Tap spaces, drag counters, or use + Add and − Remove.';if(t.nov1Lesson){const target=document.createElement('small');target.className='nov1-help';target.textContent='Make '+t.expectedDots[i];p.querySelector('h3').append(target);}else{p.append(n);}}
    const cells=[...p.querySelectorAll('.dot-cell')],s=ML_ENGINE.get(),selected=s.response?.dots?.[i]||[],count=Math.min(24,Math.max(Math.ceil((t.expectedDots[i]+2)/6)*6,...selected.map(n=>n+1)));
    cells.forEach((c,j)=>c.hidden=j>=count);p.style.setProperty('--nov1-dot-rows',Math.ceil(count/6));const board=p.querySelector('.dot-board');if(board){const rows=Math.ceil(count/6),gap=parseFloat(getComputedStyle(board).rowGap)||0;const size=t.nov1Lesson?Math.floor(Math.max(1,Math.min(95,(board.clientWidth-5*gap)/6,(board.clientHeight-gap*(rows-1))/rows))):Math.floor(Math.max(12,Math.min(95,(board.clientWidth-25)/6,(board.clientHeight-5*(rows-1))/rows)));p.style.setProperty('--nov1-dot-size',size+'px');}
   }
   for(const tip of main.querySelectorAll('.card-table-tip'))if(!tip.dataset.nov1){tip.dataset.nov1='true';tip.innerHTML='<img class="nov1-notebook-art" src="assets/audit-nov1/rocky-clipboard.png" alt="Rocky holds a clipboard"><p><b>'+esc(t.nov1Rule||'Match the place to its value')+'</b></p>'+(t.nov1Example?'<p class="nov1-rule-example">'+esc(t.nov1Example)+'</p>':'')+'<p>'+esc(t.nov1Example?'Read across each row. The same rule connects every input to its output.':'Read across each row. The left column tells the place or quantity. The right column gives its matching value.')+'</p>';}
   for(const row of main.querySelectorAll('.card-number-rows article>div'))[...row.children].forEach((n,i)=>n.dataset.term=i+1);
   for(const row of main.querySelectorAll('.play-attribute-rows>article')){const symbols=row.querySelector('.play-symbol-row');if(!symbols)continue;const n=symbols.children.length||6,h=row.clientHeight-(innerWidth<=480?72:35),w=(symbols.clientWidth-8*(n-1))/n,size=Math.floor(Math.max(26,Math.min(170,h,w)));row.style.setProperty('--nov1-attribute-size',size+'px');}
   const shape=main.querySelector(':scope>.sequence>.term,.card-shape-source>.sequence>.term');if(shape){const size=Math.floor(Math.max(30,Math.min(220,shape.clientHeight-25,shape.clientWidth-20)));main.style.setProperty('--nov1-shape-size',size+'px');}
   if(t.nov1Tags.some(s=>['doubles','join','claim'].includes(s))){
    const compact=innerWidth<=850||innerHeight<=500;document.body.classList.toggle('nov1-pane-mode',compact);document.body.dataset.nov1Pane||='model';
    let nav=document.getElementById('nov1PaneTabs');if(!nav){nav=document.createElement('nav');nav.id='nov1PaneTabs';nav.className='nov1-pane-tabs';nav.setAttribute('aria-label','Choose model or answers');nav.innerHTML='<button type="button" data-nov1-pane="model">Model</button><button type="button" data-nov1-pane="answers">Answer the parts</button>';document.querySelector('header').append(nav);nav.onclick=e=>{const b=e.target.closest('[data-nov1-pane]');if(b){document.body.dataset.nov1Pane=b.dataset.nov1Pane;schedule();}};}
    for(const b of nav.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.nov1Pane===document.body.dataset.nov1Pane));
   }
   const fields=[...tools.querySelectorAll(':scope>.extra-fields>.field')];
   if(fields.length&&t.fields?.some(f=>f.nov1Help)){
    document.body.classList.remove('nov1-all-fields');
    if(innerWidth>850&&innerHeight>500){document.body.classList.add('nov1-all-fields');tools.style.setProperty('--nov1-field-count',fields.length);
     if(tools.scrollHeight>tools.clientHeight+3||fields.some(f=>f.scrollHeight>f.clientHeight+3))document.body.classList.remove('nov1-all-fields');
    }
   }
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(apply);}}
  new MutationObserver(schedule).observe(document.querySelector('.work'),{childList:true,subtree:true});const ro=new ResizeObserver(schedule);ro.observe(document.body);ro.observe(document.getElementById('main'));addEventListener('resize',schedule);addEventListener('beforeprint',()=>printing=true);addEventListener('afterprint',()=>{printing=false;schedule()});document.fonts.ready.then(schedule);schedule();window.ML_NOV1_EDITS={refresh:schedule};
 }
 for(const [name,original]of Object.entries(ML_ENGINES)){
  if(!original.includes('function fieldUI('))continue;let html=original;
  html=html.replace('function tokenOptions(){','function tokenOptions(){if(t.nov1Choices)return t.nov1Choices;');
  html=html.replace('function unitFieldUI(f){','function nov1BaseUnitFieldUI(f){');
  if(html!==original||html.includes('function nov1BaseUnitFieldUI')){
   const wrapper='function unitFieldUI(f){let h=nov1BaseUnitFieldUI(f);if(f.nov1Help)h=h.replace(/<\\/section>$/,\'<p class="nov1-help">\'+esc(f.nov1Help)+\'</p></section>\');return h;}\n';
   if(html.includes('function nov1BaseUnitFieldUI'))html=html.replace('function nov1BaseUnitFieldUI',wrapper+'function nov1BaseUnitFieldUI');
  }
  html=html.replace('function fieldUI(f){','function nov1BaseFieldUI(f){');
  html=html.replace('function nov1BaseFieldUI','function fieldUI(f){let h=nov1BaseFieldUI(f);if(f.nov1Help&&!h.includes("nov1-help"))h=h.replace(/<\\/(label|section)>$/,\'<small class="nov1-help">\'+esc(f.nov1Help)+\'</small></$1>\');return h;}\nfunction nov1BaseFieldUI');
  html=html.replace(/playModel=t\.table&&t\.playMode==='chart-hops'\?'table':'trail'/g,"playModel=t.nov1Tags?.includes('chart')?'trail':(t.table&&t.playMode==='chart-hops'?'table':'trail')");
  html=html.replace('>Term table</button>','>Table of values</button>');
  html=html.replace('</head>','<style id="nov1PageEdits">'+css+'</style></head>').replace('</body>','<script>('+install.toString()+')();</'+'script></body>');ML_ENGINES[name]=html;
 }
 window.ML_NOV1_EDITS={ids:[...changed],version:1};
})();
