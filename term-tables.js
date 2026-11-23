/* Grade 3 tables of values. Uses the existing pattern engine, storage and assessment bridge. */
(() => {
  'use strict';
  const source = 'https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g3-math/strand-c/c1';
  const collection = 'Inspire · Term tables';
  const choice = (id, label, options, expected) => ({id, label, kind:'choice', options, expected});
  const tasks = [
    {slug:'read', title:'Meet the term table',
      prompt:'The values are 4, 7, 10, 13, … Complete term 5, then read the table and choose its rule.',
      values:[4,7,10,13,16], given:[0,1,2,3],
      fields:[choice('rule','Start at 4. What changes each time?',['Add 3','Add 4','Add 7'],'Add 3'),choice('position','Which term number has value 10?',['2','3','10'],'3'),choice('value','What is the value at term 4?',['4','10','13'],'13')],
      goal:'I can tell a term number from its value and complete a table.'},
    {slug:'grow', title:'Grow the team score',
      prompt:'Each round adds the same score. Fill the table, name the change, and predict the value at term 10.',
      values:[6,12,18,24,30,36], given:[0,1,2],
      fields:[choice('rule','Change from one term to the next',['Add 3','Add 6','Add 12'],'Add 6'),choice('far','Value at term 10',['54','60','66'],'60'),choice('why','Why does your prediction work?',['10 groups of 6','10 + 6','6 + 6'],'10 groups of 6')],
      goal:'I can extend a growing pattern and justify a prediction.'},
    {slug:'shrink', title:'Shrink the training total',
      prompt:'The total starts at 90 and shrinks by the same amount each round. Complete the gaps and predict term 8.',
      values:[90,80,70,60,50,40], given:[0,1,3],
      fields:[choice('rule','Change from one term to the next',['Subtract 5','Subtract 10','Subtract 20'],'Subtract 10'),choice('far','Value at term 8',['20','30','80'],'20'),choice('why','From term 6 to term 8, I…',['subtract 10 twice','subtract 8','add 10 twice'],'subtract 10 twice')],
      goal:'I can complete a shrinking table and explain a prediction.'},
    {slug:'hundreds', title:'A table across the hundreds',
      prompt:'The table grows by a constant amount. Complete both missing values, then use the rule to predict term 10.',
      values:[125,150,175,200,225,250], given:[0,1,2,4],
      fields:[choice('rule','Start at 125. Change each time:',['Add 25','Add 50','Add 125'],'Add 25'),choice('far','Value at term 10',['325','350','375'],'350'),choice('why','From term 6 to term 10, I…',['add four lots of 25','add ten lots of 25','add 10'],'add four lots of 25')],
      goal:'I can use a table and repeated addition to predict a later term.'},
    {slug:'represent', title:'From figures to a term table',
      prompt:'Count the dots in figures 1–3 and record their values. Keep the same growing rule for figures 4 and 5.',
      values:[3,5,7,9,11], given:[], termFigures:[3,5,7],
      fields:[choice('rule','What changes in each new figure?',['Add 1 dot','Add 2 dots','Add 3 dots'],'Add 2 dots'),choice('position','Term number tells me…',['the figure position','the dot total'],'the figure position'),choice('value','Term value tells me…',['the figure position','the dot total'],'the dot total')],
      goal:'I can translate a growing shape pattern into a table of values.'},
    {slug:'create', title:'Create a number-relationship table',
      prompt:'Choose a start and add 1 ten (+10) or 1 hundred (+100) each time. Build five terms to show your number relationship.',
      type:'numericCreate', length:5, min:0, max:1000, startChoices:[200,500], ruleChoices:[10,100],
      codes:['C1.2','C1.4'],
      goal:'I can create and describe a pattern showing how tens and hundreds change a number.'}
  ];
  const explanations = {
    'C1.2':'Represent and translate patterns, including using a table of values.',
    'C1.3':'Use a pattern rule to extend a pattern, explain predictions and find missing elements.',
    'C1.4':'Create and describe number patterns showing relationships up to 1,000.'
  };
  const pages = tasks.map((item,index) => {
    const {slug, goal, codes=['C1.2','C1.3'], ...task} = item;
    const id = 'term-tables-g3-' + slug;
    const pageCode = window.ML_PAGE_CODES?.get(id) || '';
    const details = codes.map(code=>({code,curriculumExplanation:explanations[code],explanation:goal,url:source}));
    const alignment = {grade:3,codes,goal,evidence:goal,verifiedOn:'2026-11-01',source,details};
    const count = task.length || task.values.length;
    const activity = {id:'activity',type:'sequence',kind:'number',...task,table:{heading:'Term number',row:'Term value',positions:Array.from({length:count},(_,i)=>i+1)}};
    return {id,qid:id,grade:3,pageCode,engine:'term-tables',kind:task.type||'sequence',category:'patterns',ontarioTopic:'algebra',patterning:true,group:'term-tables-g3',groupTitle:collection,title:task.title,prompt:task.prompt,
      directions:'Tap a table space, then a number tile, or drag a tile into the table. Use the answer buttons and check your work.',codes,details,guide:'term-tables',sourceTitle:collection+' · Page '+(index+1),
      config:{grade:3,pageCode,termTable:true,patterningTask:'activity',patterningWorksheet:{id,grade:3,page:index+1,totalPages:tasks.length,title:collection,resourceCollection:true,tasks:[activity],codes,goal},sourceStructure:'term-tables:'+(task.type||'sequence'),sourceStructureLabel:'Term tables · '+(task.type||'sequence'),curriculumAlignment:alignment}};
  });

  let html = ML_ENGINES['pattern-resources'];
  // These pages provide their own measured layout and panel switch.
  for(const name of ['fillSpace','fitPatterns'])html=html.replace(new RegExp('<script>\\(function '+name+'\\([\\s\\S]*?<\\/script>','g'),'');
  for(const id of ['patternSpaceLayout','patternDeviceFit'])html=html.replace(new RegExp('<style id="'+id+'">[\\s\\S]*?<\\/style>','g'),'');
  const replace = (anchor,value) => {if(!html.includes(anchor))throw Error('Term tables: missing engine anchor '+anchor.slice(0,45));html=html.replace(anchor,()=>value);};
  const simpleTermMarkup=String.raw `
const simpleTermTable=/^homework-hands-on-2026-11-09-g[23]-d5-term-table$/.test(cfg.id);
if(simpleTermTable){
 document.body.dataset.simpleTermTable='';
 document.querySelector('.term-view-tabs')?.remove();
}
function createTermTable(){
 const vals=valuesOf();
 function setting(id,label,options){
  return '<label class="term-create-setting"><span>'+label+'</span><select data-create="'+id+'" aria-label="'+label+'">'+
   '<option value="">Choose</option>'+options.map(v=>'<option value="'+v+'" '+(String(s.fields[id])===String(v)?'selected':'')+'>'+
    (id==='rule'?(v<0?'Subtract '+Math.abs(v):'Add '+v):v)+'</option>').join('')+
   '</select>'+mark('f:'+id)+'</label>';
 }
 return '<div class="term-create-flow">'+
  '<section class="term-create-step"><h2>1. Pick a start and rule</h2><div class="term-create-settings">'+setting('start','Start at',t.startChoices)+setting('rule','Change each time',t.ruleChoices)+
  '<p class="term-create-range">Keep terms 1–5 between '+t.min+' and '+t.max.toLocaleString('en-CA')+'.</p></div></section>'+
  '<section class="term-create-step"><h2>2. Fill the first five terms</h2><table class="term-create-values" aria-label="Your number pattern">'+
   '<thead><tr><th scope="col">Term</th>'+t.table.positions.map(i=>'<th scope="col">'+i+'</th>').join('')+'</tr></thead>'+
   '<tbody><tr><th scope="row">Value</th>'+vals.map((v,i)=>'<td>'+cell(v,i,false,'number',t.table.positions[i])+'</td>').join('')+'</tr></tbody></table></section>'+
  '<section class="term-create-step term-create-prediction"><div><h2>3. Predict term 8</h2>'+
   '<p class="term-create-jumps"><b>Term 5</b><span aria-hidden="true">→</span><b>6</b><span aria-hidden="true">→</span><b>7</b><span aria-hidden="true">→</span><b>8</b></p></div>'+
   fieldUI({...t.fields[0],label:'Term 8 value'})+'</section>'+
 '</div>';
}
`;

  const tableStart = html.indexOf('function table(){');
  const tableEnd = html.indexOf('function display(', tableStart);
  if(tableStart<0 || tableEnd<0)throw Error('Term tables: table renderer not found');
  html = html.slice(0,tableStart) + simpleTermMarkup + `function table(){if(simpleTermTable)return createTermTable();const vals=valuesOf();return '<table class="term-table" style="--homework-term-columns:'+vals.length+'"><caption>Term number = position. Term value = amount.</caption><thead><tr><th scope="col">Term number</th><th scope="col">Term value</th></tr></thead><tbody>'+vals.map((v,i)=>'<tr><th scope="row">'+esc(t.table.positions[i])+'</th><td>'+cell(v,i,(t.given||[]).includes(i),'number',t.table.positions[i])+'</td></tr>').join('')+'</tbody></table>'}\n` + html.slice(tableEnd);
  replace("if(t.type==='numericCreate'){tools+=","if(t.type==='numericCreate'&&!simpleTermTable){tools+=");
  replace("if(t.fields)tools+=","tools+=coreUI();if(t.fields&&!simpleTermTable)tools+=");
  replace("if(!['dots','reason','sort'].includes(t.type)){const model=models();","if(!simpleTermTable&&!['dots','reason','sort'].includes(t.type)){const model=models();");
  replace('function models(){', `function models(){if(t.termFigures)return '<div class="term-figures">'+t.termFigures.map((n,i)=>'<section><h3>Figure '+(i+1)+'</h3><div class="figure-dots" role="img" aria-label="Figure '+(i+1)+': count the dots">'+Array.from({length:n},()=>'<i aria-hidden="true"></i>').join('')+'</div></section>').join('')+'</div>';`);
  replace("const vals=valuesOf(),i=active??vals.findIndex((v,j)=>!t.given?.includes(j)&&!has(v)),current=", "const vals=valuesOf(),firstEmpty=vals.findIndex((v,j)=>!t.given?.includes(j)&&!has(v)),i=active??(firstEmpty<0?Math.max(0,vals.length-1):firstEmpty),current=");
  replace("$('tools').innerHTML=tools;", "$('tools').innerHTML=tools;document.querySelectorAll('[data-field]').forEach(b=>b.setAttribute('aria-label',b.dataset.value));");
  replace('function render(){',`function render(){document.body.classList.add('term-table-page');document.body.dataset.termPanel=termPanel;`);
  replace('function render(){document.body', `let termPanel='table';document.addEventListener('click',e=>{const button=e.target.closest('[data-term-panel]');if(!button||button===document.body)return;termPanel=button.dataset.termPanel;document.body.dataset.termPanel=termPanel;document.querySelectorAll('.term-view-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});\nfunction render(){document.body`);
  replace('</header>','<nav class="term-view-tabs" aria-label="Activity panels"><button type="button" data-term-panel="table" aria-pressed="true">Table & models</button><button type="button" data-term-panel="answers" aria-pressed="false">Rule & predictions</button></nav></header>');
  replace('</style>',`
  .term-table-page .work{grid-template-columns:minmax(0,1.5fr) minmax(250px,1fr)}
  .term-table-page #main{display:grid;grid-template-columns:minmax(155px,.8fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;align-items:center;gap:9px}
  .term-table{width:100%;border-collapse:separate;border-spacing:0;border:2px solid #9c7750;border-radius:12px;overflow:hidden;background:#fffdf5;align-self:stretch;table-layout:fixed}
  .term-table caption{font-size:12px;line-height:1.2;padding:0 0 6px;color:#654b36;text-align:left}
  .term-table th,.term-table td{text-align:center;padding:3px;border-bottom:1px solid #decbaa}
  .term-table thead th{font-size:14px;background:#e7d3a7;height:38px}
  .term-table tbody th{font-size:23px;width:50%;background:#f5ecd5}
  .term-table tbody tr:last-child>*{border-bottom:0}
  .term-table .term{min-height:35px!important;height:100%;padding:1px 4px!important;border:0;border-radius:7px;box-shadow:none;background:transparent;font-size:25px}
  .term-table .term input{font-size:24px!important;min-height:32px;text-align:center;width:100%;background:#fff5da;border:2px dashed #aa8558}
  .term-table .term small{display:none}
  .term-table-page .model-region{min-height:0;align-self:stretch;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
  .term-table-page .models{display:grid;grid-template-columns:1fr;gap:6px;min-height:0}
  .term-table-page .model{min-height:0;padding:6px}
  .term-table-page .model svg{max-height:96px;width:100%}
  .term-table-page .model h3{font-size:12px;line-height:1.15;margin:2px}
  .term-table-page .model-tabs{gap:5px;margin-bottom:5px;display:flex;flex-wrap:wrap}
  .term-table-page .model-tabs button{font-size:12px;padding:3px 7px;min-height:34px}
  .term-table-page .tile-bank{grid-column:1/-1;margin:0}
  .term-table-page .bank{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px}
  .term-table-page .bank button{font-size:22px;min-height:36px;padding:2px 5px}
  .term-table-page .tile-bank .hint{font-size:11px;margin:0 0 5px}
  .term-table-page #tools{display:flex;flex-direction:column;justify-content:center;gap:8px}
  .term-table-page .extra-fields{display:flex;flex-direction:column;gap:12px}
  .term-table-page .field{gap:5px;font-size:14px}
  .term-table-page .field>span{font-size:14px!important;line-height:1.2}
  .term-table-page .field-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
  .term-table-page .field-choices button{font-size:14px;line-height:1.15;padding:5px;min-height:44px;overflow-wrap:anywhere}
  .term-table-page .field select{min-height:42px;font-size:19px}
  .term-figures{display:flex;flex-direction:column;gap:10px;min-height:0}
  .term-figures section{padding:8px;border:1px solid #d2b98d;border-radius:10px;background:#fffcf2}
  .term-figures h3{font-size:14px;margin:0 0 5px}
  .figure-dots{display:flex;gap:6px;flex-wrap:wrap;max-width:155px}
  .figure-dots i{width:21px;height:21px;border-radius:50%;background:#417e97;border:2px solid #24546b}
  .term-view-tabs{display:none}
  @media(max-height:460px){.term-table-page header h1{font-size:21px}.term-table-page header p{font-size:14px}.term-table-page header small{font-size:10px}.term-table-page .term-table thead th{height:30px;font-size:12px}.term-table-page .term-table tbody th{font-size:21px}.term-table-page .term-table .term{min-height:28px!important;font-size:22px}.term-table-page .term-table input{min-height:27px;font-size:21px!important}.term-table-page .model svg{max-height:70px}.term-table-page .bank button{min-height:31px;font-size:20px}.term-table-page .extra-fields{gap:9px}.term-table-page .field-choices button{min-height:38px;font-size:13px}.term-table-page .tile-bank .hint{font-size:10px}}
  @media(max-width:650px){.term-table-page .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}.term-view-tabs{display:flex;gap:7px;margin-top:5px}.term-view-tabs button{font-size:13px;min-height:36px}.term-table-page[data-term-panel=table] #tools,.term-table-page[data-term-panel=answers] #main{display:none!important}.term-table-page[data-term-panel=answers] #tools{display:flex!important}.term-table-page #main{grid-template-columns:minmax(135px,.8fr) minmax(0,1fr)}.term-table-page #tools .extra-fields{gap:14px}.term-table-page #tools .field-choices button{min-height:44px;font-size:16px}.term-table-page .term-table caption{font-size:11px}.term-table-page .term-table thead th{font-size:13px}.term-table-page .models{grid-template-columns:1fr}.term-table-page .bank button{min-height:38px}.term-table-page .model-tabs button{min-height:36px}}
  @media print{.term-view-tabs{display:none!important}.term-table-page .work{display:grid!important;grid-template-columns:minmax(0,1.5fr) minmax(220px,1fr)!important;grid-template-rows:minmax(0,1fr)!important}.term-table-page #main{display:grid!important}.term-table-page #tools{display:flex!important}.term-table-page .term-table{max-height:125mm}.term-table-page .tile-bank{display:none}.term-table-page #main{grid-template-rows:minmax(0,1fr)}.term-table-page .field-choices button{box-shadow:none}}

  html body.term-table-page[data-simple-term-table] .work{
   display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;
  }
  html body.term-table-page[data-simple-term-table] .work>#main{
   display:flex!important;grid-area:1/1!important;min-height:0!important;min-width:0;
   flex-direction:column;align-items:center!important;justify-content:center!important;padding:clamp(4px,1.6vh,12px)!important;
  }
  html body.term-table-page[data-simple-term-table] .work>#tools{display:none!important}
  html body.term-table-page[data-simple-term-table] .term-create-flow{
   width:min(100%,1100px);min-width:0;display:grid;gap:clamp(4px,1.5vh,12px);color:#493324;
  }
  .term-create-step{
   box-sizing:border-box;min-width:0;position:relative;border:1px solid #ccb384;border-radius:12px;
   background:#fffdf6;padding:clamp(5px,1.65vh,13px) clamp(6px,1.7vw,16px);display:grid;gap:clamp(3px,1vh,8px);
  }
  html body[data-simple-term-table] .term-create-step h2{font-size:clamp(14px,3.8vh,23px)!important;line-height:1.15;margin:0!important}
  .term-create-settings{display:flex;flex-wrap:wrap;gap:4px clamp(9px,2vw,24px)}
  .term-create-setting{position:relative;display:flex;align-items:center;gap:6px;font-weight:700}
  html body[data-simple-term-table] .term-create-setting select{
   min-width:clamp(66px,12vw,145px);max-width:100%;min-height:clamp(27px,7vh,43px);padding:3px 5px;
   font-size:clamp(14px,3.7vh,20px);border:1px solid #b59161;border-radius:7px;background:#fffaf0;color:inherit;
  }
  .term-create-range{align-self:center;margin:0;font-size:clamp(11px,2.6vh,15px);line-height:1.2}
  .term-create-values{border-collapse:separate;border-spacing:3px;width:100%;table-layout:fixed;text-align:center}
  .term-create-values :is(th,td){padding:0;min-width:0}
  .term-create-values th{background:#ead9b5;border-radius:6px;font-size:clamp(14px,3.8vh,22px)}
  .term-create-values thead th{height:clamp(23px,6vh,38px)}
  .term-create-values :is(thead,tbody) th:first-child{width:clamp(48px,11vw,90px)}
  html body.term-table-page[data-simple-term-table] .term-create-values .term{
   min-height:0!important;padding:0!important;display:block!important;position:relative;overflow:visible!important;
  }
  html body.term-table-page[data-simple-term-table] .term-create-values .term small{display:none!important}
  html body.term-table-page[data-simple-term-table] .term-create-values input[data-cell-input]{
   box-sizing:border-box;width:100%;min-height:clamp(31px,9.5vh,54px)!important;height:auto!important;padding:2px!important;
   border:2px dashed #31738a!important;border-radius:7px;background:#e2f3f5!important;color:#163b50;text-align:center;
   font-size:clamp(16px,min(5.5vh,4vw),30px)!important;
  }
  .term-create-prediction{grid-template-columns:auto auto;justify-content:start;align-items:center;column-gap:clamp(9px,3vw,36px)}
  .term-create-jumps{display:flex;align-items:center;gap:clamp(3px,.7vw,10px);margin:4px 0 0;line-height:1.2}
  .term-create-jumps b{background:#f5e9ca;border-radius:5px;padding:2px 5px;white-space:nowrap}
  .term-create-jumps span{color:#246b7a;font-weight:800}
  html body.term-table-page[data-simple-term-table] .term-create-prediction .field{position:relative;display:flex!important;align-items:center;gap:6px;padding:2px 4px!important}
  html body.term-table-page[data-simple-term-table] .term-create-prediction .field>span:first-child{font-size:clamp(13px,3.1vh,17px)!important}
  html body.term-table-page[data-simple-term-table] .term-create-prediction input{
   box-sizing:border-box;width:clamp(60px,11vw,120px)!important;min-height:clamp(30px,8vh,48px)!important;height:auto!important;
   font-size:clamp(16px,4.5vh,24px)!important;text-align:center;padding:3px!important;
  }
  html body[data-simple-term-table] .term-create-flow .part-mark{position:absolute;right:0;top:0;pointer-events:none}
  @media screen and (max-height:480px){
   html body.term-table-page[data-simple-term-table] .work>#main{padding:4px!important}
   html body.term-table-page[data-simple-term-table] .term-create-flow{gap:4px}
   .term-create-step{padding-block:4px;gap:3px}
   html body[data-simple-term-table] .term-create-step h2{font-size:15px!important}
   html body[data-simple-term-table] .term-create-setting select{min-height:26px}
   .term-create-values{border-spacing:2px}
   .term-create-values thead th{height:21px}
   html body.term-table-page[data-simple-term-table] .term-create-values input[data-cell-input]{min-height:32px!important}
   html body.term-table-page[data-simple-term-table] .term-create-prediction input{min-height:29px!important}
   .term-create-jumps{margin-top:2px}
  }
  @media(max-width:480px){.term-create-setting{font-size:12px}.term-create-prediction{grid-template-columns:minmax(0,1fr) auto}.term-create-jumps{font-size:12px}}
  @media print{.term-create-flow{break-inside:avoid}.term-create-step{padding:6px}}

  </style>`);
  ML_ENGINES['term-tables'] = html;
  const known = new Set(ML_CATALOG.map(q=>q.id));
  ML_CATALOG.unshift(...pages.filter(q=>!known.has(q.id)));
  ML_PICTURES['term-tables'] = {src:'assets/strands/patterns.webp',label:'Term tables',alt:'Shapes and blocks in growing patterns',caption:'Match each term number to its value. Find the rule, fill gaps and predict.'};
  window.ML_TERM_TABLES = {pages};
})();
