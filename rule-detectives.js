/* Five possible rules, one click response. Shares the existing checking, undo and saved-work engine. */
(() => {
  'use strict';
  const definitions=[
    {grade:2,slug:'grow',title:'Which rule grows this pattern?',values:[4,8,12,16,20],choices:['Add 2 each time','Add 6 each time','Add 4 each time','Subtract 4 each time','Double each time'],answer:'Add 4 each time'},
    {grade:2,slug:'shrink',title:'Which rule shrinks this pattern?',values:[30,27,24,21,18],choices:['Subtract 2 each time','Add 3 each time','Halve each time','Subtract 5 each time','Subtract 3 each time'],answer:'Subtract 3 each time'},
    {grade:2,slug:'colours',title:'Spot the repeating colour rule',values:['red','blue','red','blue','red','blue'],shape:true,choices:['Two red, one blue; repeat','Red, blue; repeat','Two blue, one red; repeat','Three red, one blue; repeat','Red, three blue; repeat'],answer:'Red, blue; repeat'},
    {grade:2,slug:'core',title:'Look closely at the pattern core',values:['red','red','blue','red','red','blue','red','red','blue'],shape:true,choices:['Red, blue; repeat','Red, two blue; repeat','Three red, one blue; repeat','Two red, one blue; repeat','Two red, two blue; repeat'],answer:'Two red, one blue; repeat'},
    {grade:3,slug:'grow',title:'Choose the team-score rule',values:[6,12,18,24,30],choices:['Add 6 each time','Add 3 each time','Double each time','Subtract 6 each time','Add 12 each time'],answer:'Add 6 each time'},
    {grade:3,slug:'shrink',title:'Choose the three-digit shrinking rule',values:[250,225,200,175,150],choices:['Subtract 50 each time','Add 25 each time','Subtract 5 each time','Subtract 25 each time','Halve each time'],answer:'Subtract 25 each time'},
    {grade:3,slug:'double',title:'Which operation repeats?',values:[3,6,12,24,48],choices:['Add 3 each time','Halve each time','Add 6 each time','Add 12 each time','Double each time'],answer:'Double each time'},
    {grade:3,slug:'alternate',title:'Two changes make one repeating rule',values:[4,6,9,11,14,16],choices:['Add 2 every time','Add 2, then add 3; repeat','Add 3 every time','Add 3, then add 2; repeat','Add 5 every time'],answer:'Add 2, then add 3; repeat'}
  ];
  const descriptions={'C1.1':'Identify and describe the repeating elements or operations in a pattern.','C1.3':'Determine the rule and check it against every term in a pattern.'};
  const pages=definitions.map((d,index)=>{
    const id='rule-detectives-g'+d.grade+'-'+d.slug,codes=['C1.1','C1.3'];
    const collection=(d.grade===2?'Excite':'Inspire')+' · Choose the rule';
    const goal='I can compare five possible rules and choose the one that fits the whole pattern.';
    const source='https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g'+d.grade+'-math/strand-c/c1';
    const details=codes.map(code=>({code,curriculumExplanation:descriptions[code],explanation:goal,url:source}));
    const task={id:'activity',type:'reason',kind:d.shape?'shape':'number',title:d.title,prompt:'Look at every term. Click the one rule that fits the whole pattern.',display:{kind:d.shape?'shape':'number',values:d.values},fields:[{id:'rule',label:'Which rule fits? Choose 1 of 5.',kind:'choice',options:d.choices,expected:d.answer}]};
    if(d.shape)task.tokens={red:{label:'Red circle',shape:'circle',color:'#d66761'},blue:{label:'Blue square',shape:'square',color:'#468aac'}};
    return {id,qid:id,grade:d.grade,engine:'rule-detectives',kind:'ruleChoice',category:'patterns',ontarioTopic:'algebra',patterning:true,group:'rule-detectives-g'+d.grade,groupTitle:collection,title:d.title,prompt:task.prompt,directions:'Look at the pattern. Click one of five possible rules, then press Check my work.',codes,details,guide:'rule-detectives',sourceTitle:collection+' · Page '+(index%4+1),config:{grade:d.grade,patterningTask:'activity',fiveRuleChoices:true,patterningWorksheet:{id,grade:d.grade,page:index%4+1,totalPages:4,title:collection,resourceCollection:true,tasks:[task],codes,goal},sourceStructure:'rule-detectives:five-choices',sourceStructureLabel:'Pattern rules · five choices',curriculumAlignment:{grade:d.grade,codes,goal,evidence:goal,details,source,verifiedOn:'2026-11-01'}}};
  });
  let html=ML_ENGINES['pattern-resources'];
  for(const name of ['fillSpace','fitPatterns'])html=html.replace(new RegExp('<script>\\(function '+name+'\\([\\s\\S]*?<\\/script>','g'),'');
  for(const id of ['patternSpaceLayout','patternDeviceFit'])html=html.replace(new RegExp('<style id="'+id+'">[\\s\\S]*?<\\/style>','g'),'');
  html=html.replace("$('tools').innerHTML=tools;", "$('tools').innerHTML=tools;document.querySelectorAll('[data-field]').forEach(b=>b.setAttribute('aria-label',b.dataset.value));");
  const anchor='function render(){';if(!html.includes(anchor))throw Error('Five-rule renderer anchor missing');
  html=html.replace(anchor,"function render(){document.body.classList.add('rule-choice-page');");
  html=html.replace('</style>',`
    .rule-choice-page .work{grid-template-columns:minmax(0,1.2fr) minmax(270px,1fr)}
    .rule-choice-page #main{justify-content:center;gap:15px}
    .rule-choice-page .display-label{font-size:17px;font-weight:bold;text-align:center}
    .rule-choice-page .sequence{grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:7px}
    .rule-choice-page .term{min-height:85px;font-size:clamp(23px,4vw,43px);padding:5px}
    .rule-choice-page .term small{font-size:12px}
    .rule-choice-page .symbol svg{width:clamp(26px,5vw,60px);height:clamp(26px,5vw,60px);max-width:100%}
    .rule-choice-page #tools{justify-content:center;display:flex}
    .rule-choice-page .extra-fields{display:block}
    .rule-choice-page .field{display:flex;flex-direction:column;gap:10px}
    .rule-choice-page .field>span{font-size:18px!important}
    .rule-choice-page .field-choices{display:grid;grid-template-columns:1fr;gap:10px;width:100%}
    .rule-choice-page .field-choices button{min-height:48px;width:100%;font-size:18px;line-height:1.15;padding:7px 11px;text-align:left;position:relative;padding-left:45px}
    .rule-choice-page .field-choices{counter-reset:rules}
    .rule-choice-page .field-choices button::before{counter-increment:rules;content:counter(rules,upper-alpha);position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:17px;color:#766044}
    .rule-choice-page .field-choices button[aria-pressed=true]{background:#d8e9c8;border-color:#568057}
    @media(max-height:460px){.rule-choice-page header h1{font-size:20px}.rule-choice-page header p{font-size:14px}.rule-choice-page .field-choices{gap:7px}.rule-choice-page .field-choices button{min-height:38px;font-size:15px}.rule-choice-page .field>span{font-size:15px!important}.rule-choice-page .term{min-height:65px}.rule-choice-page .display-label{font-size:14px}}
    @media(max-width:620px){.rule-choice-page .work{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(135px,1fr) minmax(0,1.8fr)!important}.rule-choice-page #tools{display:flex;min-height:0;padding:9px}.rule-choice-page #main{padding:7px;gap:5px}.rule-choice-page .term{min-height:55px;font-size:26px}.rule-choice-page .term small{font-size:10px}.rule-choice-page .sequence{gap:4px}.rule-choice-page .field{gap:7px}.rule-choice-page .field-choices{gap:7px}.rule-choice-page .field-choices button{min-height:39px;font-size:15px;padding:6px 9px 6px 39px}.rule-choice-page .field>span{font-size:15px!important}.rule-choice-page .display-label{font-size:13px;margin:0}.rule-choice-page .symbol svg{width:31px;height:31px}}
    @media print{.rule-choice-page .work{grid-template-columns:minmax(0,1.2fr) minmax(260px,1fr)!important;grid-template-rows:minmax(0,1fr)!important}.rule-choice-page .field-choices button{box-shadow:none}}
  </style>`);
  ML_ENGINES['rule-detectives']=html;
  const ids=new Set(ML_CATALOG.map(p=>p.id));ML_CATALOG.unshift(...pages.filter(p=>!ids.has(p.id)));
  ML_PICTURES['rule-detectives']={src:'assets/strands/patterns.webp',label:'Choose the rule',alt:'Patterns made with shapes and numbers',caption:'Look at the whole pattern. Compare five rules and click the one that fits.'};
  window.ML_RULE_DETECTIVES={pages};
})();
