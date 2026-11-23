'use strict';
const data=window.ML_PATTERN20,storage=assessmentStorage(),$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mathWording=s=>String(s??'').replace(/\bnext number after the trail\b/gi,'Next number in the pattern').replace(/\btrail\b/gi,s=>s[0]==='T'?'Number pattern':'number pattern');
let grade=2,db={runs:{}},active=null,activeKey='',index=0,pending=Promise.resolve(),pendingCount=0,history=[],storageError=false,teacherUnlocked=false;
let selectedTile=null,chartPad=null,gesture=null,suppressClick=false,voice=null,exporting=false,reportPosition=0,auditGrade=2,auditIndex=0;
const pendingChartMarks=new Set();
const shapes={Circle:['#52b6ab','<circle cx="36" cy="36" r="24"/>'],Square:['#77a8df','<rect x="12" y="12" width="48" height="48" rx="5"/>'],Triangle:['#edaa56','<path d="M36 9 65 60H7Z"/>'],Star:['#e9c14c','<path d="m36 6 9 18 20 3-14 15 3 21-18-10-18 10 3-21L7 27l20-3Z"/>'],Hexagon:['#8abd72','<path d="M21 10h30l15 26-15 26H21L6 36Z"/>'],Diamond:['#ba8bdb','<path d="M36 6 64 36 36 66 8 36Z"/>']};
function shape(value){
 if(value==='Loonie'||value==='Nickel'){const gold=value==='Loonie';return '<svg class="shape coin" viewBox="0 0 72 72" role="img" aria-label="'+(gold?'One-dollar coin':'Five-cent coin')+'"><circle cx="36" cy="36" r="30" fill="'+(gold?'#e7be58':'#d9e1e3')+'" stroke="'+(gold?'#9a752c':'#7f9197')+'" stroke-width="3"/><circle cx="36" cy="36" r="24" fill="none" stroke="'+(gold?'#bd923a':'#a7b5ba')+'" stroke-width="1.5" stroke-dasharray="2 2"/><text x="36" y="42" text-anchor="middle" font-family="Andika, sans-serif" font-size="25" font-weight="700" fill="#435352">'+(gold?'$1':'5¢')+'</text></svg>';}
 const s=shapes[value];return s?'<svg class="shape" viewBox="0 0 72 72" role="img" aria-label="'+esc(value)+'"><g fill="'+s[0]+'" stroke="#34585e" stroke-width="2.5" stroke-linejoin="round">'+s[1]+'</g></svg>':esc(value);
}
function displayChoice(q,value){return q.type==='doubles'&&typeof value==='string'&&value.includes('=')?value.slice(value.lastIndexOf('=')+1).trim():value;}
function cubeBody(){return '<path d="M4 7 11 0h21l-7 7Z" fill="#b2d6dc" stroke="#457886"/><path d="M25 7 32 0v21l-7 7Z" fill="#4b8392" stroke="#457886"/><path d="M4 7h21v21H4Z" fill="#75afbe" stroke="#345d69" stroke-width="1.5"/>';}
function cubeIcon(){return '<svg viewBox="0 0 36 32" class="cube-icon" aria-hidden="true">'+cubeBody()+'</svg>';}
function cubeFigure(cells,cols,rows){return '<svg class="cube-figure" viewBox="0 0 '+(cols*24+6)+' '+(rows*24+5)+'" role="img" aria-label="'+cells.length+' cubes">'+cells.map(n=>'<g transform="translate('+(n%cols*24)+' '+(Math.floor(n/cols)*24)+') scale(.7)">'+cubeBody()+'</g>').join('')+'</svg>';}
function attributeShape(item){return '<svg class="shape" viewBox="0 0 72 72" aria-hidden="true"><g fill="'+item.colour+'" stroke="#34585e" stroke-width="2.5" stroke-linejoin="round" transform="translate(36 36) rotate('+(item.rotation??0)+') scale('+(item.scale??1)+') translate(-36 -36)">'+shapes[item.shape][1]+'</g></svg>';}
const questions=()=>active?.questions??data.sets[grade].questions;
const task=()=>questions()[index];
const filled=v=>v!==null&&v!==undefined&&v!=='';
function fieldEntered(q,f,value){if(q.model.kind==='amount-workshop'&&f===q.fields[q.model.answerField])return Number.isInteger(value)&&value>=0&&value<=999;return f.type==='grid'?Array.isArray(value)&&value.length>0&&new Set(value).size===value.length&&value.every(n=>Number.isInteger(n)&&n>=0&&n<q.model.rows*q.model.columns):filled(value)&&(f.type==='tile'?q.tiles.includes(value):f.options.includes(value));}
function isComplete(q,answers){return q.fields.every((f,i)=>fieldEntered(q,f,answers?.[i]));}
function gridSignature(cells,width){if(!Array.isArray(cells)||!cells.length)return '';const r=Math.min(...cells.map(n=>Math.floor(n/width))),c=Math.min(...cells.map(n=>n%width));return cells.map(n=>(Math.floor(n/width)-r)+':'+(n%width-c)).sort().join('|');}
function fieldMatches(f,value){return f.type==='grid'?gridSignature(value,f.width)===gridSignature(f.answer,f.width):value===f.answer;}
function missingAnswerMessage(q,values){
 if(q.type==='doubles'){const equation=filled(values?.[0])&&q.fields[0].options.includes(values[0]),sum=filled(values?.[1])&&q.fields[1].options.includes(values[1]);return !equation&&!sum?'Choose an equation and a sum to unlock Next.':!equation?'Choose an equation above to unlock Next.':'Choose the sum to unlock Next.';}
 const missing=q.fields.find((f,i)=>!fieldEntered(q,f,values?.[i]));
 return missing?'Complete '+mathWording(missing.label)+' to unlock Next.':'Complete every answer part to unlock Next.';
}
function countComplete(run){return run.questions.filter((q,i)=>isComplete(q,run.answers[i])).length;}
function allComplete(run){return run.questions.length>0&&run.answers.length===run.questions.length&&countComplete(run)===run.questions.length;}
function status(id,message,error=false){$(id).textContent=message;$(id).toggleAttribute('data-error',error);}
function stopVoice(){window.speechSynthesis?.cancel();voice=null;$('listen').hidden=false;$('stopVoice').hidden=true;}
function show(id){stopVoice();for(const view of ['entry','student','complete'])$(view).hidden=view!==id;}
function dialog(title,html){stopVoice();$('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;if(!$('dialog').open)$('dialog').showModal();}
function closeDialog(){if(exporting)return;$('dialog').close();stopVoice();}
function keyFor(g=grade,name=$('studentName').value){return g+':'+name.trim().normalize('NFKC').toLocaleLowerCase('en-CA');}
function setGrade(g){grade=g;document.querySelectorAll('[data-grade]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.grade===g)));$('blankPDF').href='pdf/Math-Landing-'+data.sets[g].name+'-Patterning-'+data.total+'-Assessment.pdf';updateStart();}
function updateStart(){const run=db.runs[keyFor()];$('startButton').textContent=run?.status==='locked'?'Open saved assessment':run?'Continue assessment →':'Start assessment →';}
async function commit(next){
 if(storage.temporary())throw Error('Browser storage is unavailable. Keep this tab open and call your teacher.');
 const saved=await storage.save(activeKey,active?.revision,next);
 if(!saved)throw Error('This assessment changed in another tab. Reload and enter the same student ID to continue.');
 if(storage.temporary())throw Error('The assessment could not be saved on this device. Keep this tab open and call your teacher.');
 db=saved;active=db.runs[activeKey];storageError=false;return active;
}
async function begin(event){
 event.preventDefault();if(!$('studentName').value.trim())return;
 $('startButton').disabled=true;
 try{
  db=await storage.load();activeKey=keyFor();active=db.runs[activeKey]??null;
  if(!active){const qs=structuredClone(data.sets[grade].questions);await commit({student:$('studentName').value.trim(),grade,name:data.sets[grade].name,version:data.version,questions:qs,answers:qs.map(q=>q.fields.map(()=>null)),eliminated:{},locked:[],status:'draft',position:0,startedAt:new Date().toISOString(),savedAt:new Date().toISOString()});}
  if(active.status!=='locked'&&((active.version??1)<data.version||active.questions.length<data.sets[active.grade].questions.length)){
   const revised=structuredClone(active);revised.previousVersions=[...(revised.previousVersions??[]),{version:active.version??1,questions:active.questions,answers:active.answers,eliminated:active.eliminated,amountWork:active.amountWork,chartMarks:active.chartMarks,savedAt:active.savedAt}];
   const replacements=new Set();revised.eliminated={...revised.eliminated};
   for(const revision of data.revisions??[])if((active.version??1)<revision.version){for(const n of revision.replaceByGrade?.[active.grade]??revision.replace??[])replacements.add(n);}
   for(const n of replacements){revised.questions[n]=structuredClone(data.sets[revised.grade].questions[n]);revised.answers[n]=revised.questions[n].fields.map(()=>null);delete revised.eliminated[n];if(revised.amountWork)delete revised.amountWork[n];if(revised.chartMarks)delete revised.chartMarks[n];}
   for(const revision of data.revisions??[])if((active.version??1)<revision.version)for(const [n,fields] of Object.entries(revision.retainFields??{}))if(Number(n)<revised.questions.length){revised.answers[n]=fields.map(i=>revised.answers[n]?.[i]??null);}
   for(let n=revised.questions.length;n<data.sets[revised.grade].questions.length;n++){revised.questions.push(structuredClone(data.sets[revised.grade].questions[n]));revised.answers.push(revised.questions[n].fields.map(()=>null));}
   revised.questions=structuredClone(data.sets[revised.grade].questions);revised.version=data.version;revised.revisionNotice='Updated to '+revised.questions.length+' questions from November 9–16 homework. Unchanged answers are saved.';await commit(revised);
  }
  grade=active.grade;index=Math.min(active.questions.length-1,Math.max(0,active.position??0));history=[];storageError=false;
  if(active.status==='locked')complete();else{show('student');renderStudent();}
 }catch(e){status('entryStatus',e.message,true);}finally{$('startButton').disabled=false;}
}
function modelHTML(q,values,readOnly=false,chartMarks=[]){
 const m={...q.model,label:mathWording(q.model.label)};
 if(m.kind==='amount-workshop')return ML_AMOUNT_TOOLS.reference(q);
 if(m.kind==='bar-graph'){
  const maximum=Math.max(...m.items),baseline=230,scale=180/maximum;
  return '<p class="model-label">'+esc(m.label)+'</p><svg class="homework-bar-graph" viewBox="0 0 520 280" role="img" aria-label="'+esc(m.items.map((n,i)=>m.labels[i]+': '+n+' books').join(', '))+'">'+Array.from({length:5},(_,i)=>{const value=i*maximum/4,y=baseline-value*scale;return '<path d="M45 '+y+'H500" stroke="#d2dce3"/><text x="35" y="'+(y+5)+'" text-anchor="end">'+value+'</text>';}).join('')+m.items.map((n,i)=>{const x=68+i*112,h=n*scale;return '<rect x="'+x+'" y="'+(baseline-h)+'" width="70" height="'+h+'" rx="4" fill="'+(i%2?'#a78ac8':'#62b8ac')+'" stroke="#4e7381"/><text x="'+(x+35)+'" y="'+(baseline-h-10)+'" text-anchor="middle">'+n+'</text><text x="'+(x+35)+'" y="258" text-anchor="middle">'+esc(m.labels[i])+'</text>';}).join('')+'</svg>';
 }
 if(m.kind==='attributes')return '<div class="attribute-model">'+m.rows.map((items,i)=>'<section class="attribute-row"><strong>Row '+(i+1)+'</strong><div>'+items.map(attributeShape).join('')+'</div></section>').join('')+'</div>';
 if(m.kind==='equation')return '<p class="model-label">'+esc(m.label)+'</p><div class="algebra-equation" aria-label="Equation">'+m.items.map(v=>v?.slot!==undefined?'<span class="unknown-value">'+esc(filled(values[v.slot])?values[v.slot]:'?')+'</span>':'<span>'+esc(v)+'</span>').join('')+'</div>';
 if(m.kind==='cube-build')return '<div class="cube-workshop"><div class="cube-examples">'+m.figures.map((cells,i)=>'<div class="cube-example"><strong>Figure '+(i+1)+'</strong>'+cubeFigure(cells,m.columns,m.rows)+'<span>'+cells.length+' cubes</span></div>').join('')+'</div><section class="cube-build"><strong>Build Figure 4</strong><button type="button" class="cube-bank" data-cube-bank aria-label="Drag a cube to the grid, or tap a grid cell" '+(readOnly?'disabled':'')+'>'+cubeIcon()+'</button><div class="cube-grid" style="--cube-columns:'+m.columns+';--cube-rows:'+m.rows+'">'+Array.from({length:m.columns*m.rows},(_,i)=>'<button type="button" data-cell="'+i+'" aria-label="Row '+(Math.floor(i/m.columns)+1)+', column '+(i%m.columns+1)+(values[0]?.includes(i)?', cube. Tap to remove.':', empty. Tap to place a cube.')+'" '+(values[0]?.includes(i)?'data-filled':'')+' '+(readOnly?'disabled':'')+'>'+(values[0]?.includes(i)?cubeIcon():'+')+'</button>').join('')+'</div><p class="cube-count">'+(values[0]?.length??0)+' cubes placed · Tap a square to add or remove.</p></section></div>';
 if(m.kind==='chart-hops'){
  const used=new Set([...m.items.filter(v=>typeof v==='number'),...values.slice(0,6).filter(filled)]);
  const lit=new Set([...used,...(Array.isArray(chartMarks)?chartMarks.filter(n=>Number.isInteger(n)&&n>=m.chartStart&&n<m.chartStart+m.chartLength):[])]);
  return '<div class="chart-workspace"><section class="chart-part"><p class="model-label">Pressed numbers stay lit. Choose a pad to place a number.</p><div class="number-chart" style="--chart-rows:'+(m.chartLength/10)+'">'+Array.from({length:m.chartLength},(_,i)=>{const n=m.chartStart+i;return '<button type="button" data-tile="'+n+'" aria-pressed="'+lit.has(n)+'" aria-label="Chart number '+n+(lit.has(n)?', highlighted':'')+'" '+(used.has(n)?'data-used':'')+' '+(lit.has(n)?'data-lit':'')+' '+(readOnly?'disabled':'')+'>'+n+'</button>';}).join('')+'</div></section><section class="chart-sequence">'+modelHTML({...q,model:{...m,kind:'numbers'}},values,readOnly)+'</section></div>';
 }
 if(m.kind==='addition')return '<div class="model-label">Use a known double</div><div class="addition">'+m.items.join(' + ')+'</div><p class="addition-subtitle">Choose the strategy. Then find the sum.</p>';
 if(m.kind==='vertical-addition'){
  const places=String(m.items[0]+m.items[1]).length,headers=['Hundreds','Tens','Ones'].slice(-places),digits=value=>String(value).padStart(places,' ').split('').map(v=>'<span>'+esc(v)+'</span>').join('');
  return '<div class="vertical-homework"><div class="vertical-block-model">'+m.items.map((v,i)=>'<section class="quantity-card"><header><strong>'+(i?'Add this amount':'First amount')+'</strong><output>'+v+'</output></header>'+ML_AMOUNT_TOOLS.blocks(v,i?'purple':'teal')+'</section>').join('')+'</div><div class="vertical-addition" style="--places:'+places+'" aria-label="'+m.items.join(' plus ')+' in columns"><div class="vertical-labels"><span></span>'+headers.map(h=>'<span>'+h+'</span>').join('')+'</div><div class="vertical-row"><span></span>'+digits(m.items[0])+'</div><div class="vertical-row"><span>+</span>'+digits(m.items[1])+'</div><div class="vertical-answer"><span></span>'+digits(values[0]??'?')+'</div></div></div>';
 }
 if(m.kind==='table')return '<p class="model-label">'+esc(m.label)+'</p><table class="term-table"><tr><th scope="row">'+esc(m.headers[0])+'</th>'+m.items.map((_,i)=>'<td>'+(m.books?'<span class="book-symbol" aria-hidden="true">📖</span>':'')+(m.positions?esc(m.positions[i]):beacon(i+1))+'</td>').join('')+'</tr><tr><th scope="row">'+esc(m.headers[1])+'</th>'+m.items.map(v=>'<td>'+(v?.slot!==undefined?'<button type="button" class="landing-pad" data-pad="'+v.slot+'" aria-label="'+esc(q.fields[v.slot].label+(filled(values[v.slot])?': '+values[v.slot]:', empty'))+'" '+(filled(values[v.slot])?'data-filled':'')+' '+(readOnly?'disabled':'')+'>'+(filled(values[v.slot])?esc(values[v.slot]):'?')+'</button>':esc(v))+'</td>').join('')+'</tr></table><span class="ellipsis" aria-label="The pattern continues">…</span>';
 const columns=m.items.length<=6?m.items.length:Math.ceil(m.items.length/2);
 return '<p class="model-label">'+esc(m.label)+'</p><div class="pattern-strip" style="--columns:'+columns+'">'+m.items.map((v,i)=>{
  const value=v?.slot!==undefined?values[v.slot]:v;
  const content=v?.slot!==undefined?'<button type="button" class="landing-pad" data-pad="'+v.slot+'" aria-label="'+esc(q.fields[v.slot].label+(filled(value)?': '+value:', empty'))+'" '+(filled(value)?'data-filled':'')+' '+(m.chartLength&&chartPad===v.slot?'data-target':'')+' '+(readOnly?'disabled':'')+'>'+(filled(value)?shape(value):'?')+'</button>':shape(value);
  return '<div class="term">'+(m.positionLabels?'<span class="beacon code-letter" aria-label="Letter '+esc(m.positionLabels[i])+'">'+esc(m.positionLabels[i])+'</span>':beacon(i+1))+'<div class="term-value">'+content+'</div></div>';
 }).join('')+'</div>'+(m.answerPad!==undefined?'<section class="sort-response"><strong>'+esc(q.fields[m.answerPad].label)+'</strong><button type="button" class="landing-pad" data-pad="'+m.answerPad+'" aria-label="'+esc(q.fields[m.answerPad].label+(filled(values[m.answerPad])?': '+values[m.answerPad]:', empty'))+'" '+(filled(values[m.answerPad])?'data-filled':'')+' '+(readOnly?'disabled':'')+'>'+(filled(values[m.answerPad])?shape(values[m.answerPad]):'?')+'</button></section>':'<span class="ellipsis" aria-label="The pattern continues">…</span>');
}
function beacon(n){return '<span class="beacon" aria-label="Position '+n+'">'+n+'</span>';}
function fieldsHTML(q,values,readOnly=false,eliminated=[]){
 return q.fields.map((f,i)=>{
  f={...f,label:mathWording(f.label)};
  if(f.type==='tile'||f.type==='grid'||q.model.kind==='amount-workshop'&&i===q.model.answerField)return '';
  if(f.type==='number')return '<label class="numeric-answer"><span>'+esc((q.type==='doubles'?'2. Find the sum: ':'')+f.label)+'</span><select data-field="'+i+'" aria-label="'+esc(f.label)+'" '+(readOnly?'disabled':'')+'><option value="">Choose</option>'+f.options.map((v,j)=>'<option value="'+j+'" '+(values[i]===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label>';
  return '<fieldset><legend>'+esc(q.type==='doubles'?'1. Choose one doubles equation':f.label)+'</legend>'+(q.type==='doubles'?'<p class="choice-help">Tap an equation to select it.</p>':'')+'<div class="options '+(q.type==='doubles'?'equations':f.options.some(v=>String(v).length>14)?'text-options':'')+'" role="radiogroup" aria-label="'+esc(f.label)+'">'+f.options.map((v,j)=>{
   return '<div class="choice-wrap"><button type="button" class="choice" role="radio" data-field="'+i+'" data-option="'+j+'" aria-checked="'+(values[i]===v)+'" '+(readOnly?'disabled':'')+'>'+shape(displayChoice(q,v))+(shapes[v]?'<span class="shape-name">'+esc(v)+'</span>':'')+'</button></div>';
  }).join('')+'</div></fieldset>';
 }).join('');
}
function homeworkPicture(q){
 if(q.type==='doubles')return '../assets/november-homework/doubles-student.jpg';
 const file=q.model.kind==='attributes'?'pattern-detectives.png':q.skill==='translation'?'pattern-translations.png':q.model.kind==='cube-build'||q.model.kind==='chart-hops'||q.model.kind==='vertical-addition'||q.type==='algebra'?'growing-patterns.png':q.title.includes('shrinking')?'shrinking-patterns.png':q.model.kind==='letters'?'pattern-translations.png':'pattern-predictions.png';
 return '../assets/pattern-play/'+file;
}
function questionHTML(q,values,readOnly=false,eliminated=[],work=null,chartMarks=[]){
 q={...q,title:mathWording(q.title),prompt:mathWording(q.prompt),directions:mathWording(q.directions)};
 const path=data.sets[q.grade]?.name??'Math Landing',picture='<img src="'+homeworkPicture(q)+'" alt="" class="'+(q.type==='doubles'?'':'homework-illustration')+'">';
 const heading='<div class="question-copy"><p class="question-code"><strong class="path-badge" data-path="'+esc(q.grade)+'">'+esc(path)+'</strong> Grade '+esc(q.grade)+' · '+esc(q.code)+' · '+esc(q.curriculum)+'</p><h1 id="questionTitle">'+esc(q.title)+'</h1><p class="prompt">'+esc(q.prompt)+'</p></div>';
 const cue='<p class="homework-coach"><img src="../assets/sports/rocky-tapping.webp" alt=""><span aria-hidden="true">☟</span><strong>'+(q.model.kind==='amount-workshop'?'Drag amounts onto the pad.':q.tiles?'Drag a tile onto a pad.':'Tap the answer for each part.')+'</strong></p>';
 return '<div class="question-title-row">'+(q.type==='doubles'?picture+heading:heading+picture)+'</div><div class="question-content" data-model="'+esc(q.model.kind)+'"><section class="model-panel" aria-label="Question model">'+modelHTML(q,values,readOnly,chartMarks)+(q.model.kind==='amount-workshop'&&q.model.mode==='compare'?'<div class="amount-compare-choice">'+fieldsHTML(q,values,readOnly,eliminated)+'</div>':'')+'</section><section class="answer-panel" aria-label="Your answers">'+(q.type==='doubles'?'':cue)+(q.model.kind==='amount-workshop'&&q.model.mode==='compare'?'':fieldsHTML(q,values,readOnly,eliminated))+(q.model.kind==='amount-workshop'?ML_AMOUNT_TOOLS.controls(q,values,work,readOnly):'')+(q.tiles&&q.model.kind!=='chart-hops'?'<p class="tile-hint">'+esc(q.directions)+'</p><div class="tile-bank '+(typeof q.tiles[0]==='number'?'numeric-bank':'')+'" aria-label="Reusable tiles">'+q.tiles.map(v=>'<button type="button" class="tile" data-tile="'+esc(v)+'" aria-label="'+esc(v)+' tile" aria-pressed="false" '+(readOnly?'disabled':'')+'>'+shape(v)+'</button>').join('')+'</div>':'')+'</section></div>';
}
function renderStudent(){
 const focused=document.activeElement;let focusSelector='';
 if(focused?.closest('#questionCard')){if(focused.dataset.option!==undefined)focusSelector='[data-field="'+focused.dataset.field+'"][data-option="'+focused.dataset.option+'"]';else if(focused.dataset.field!==undefined)focusSelector='select[data-field="'+focused.dataset.field+'"]';else if(focused.dataset.pad!==undefined)focusSelector='[data-pad="'+focused.dataset.pad+'"]';else if(focused.dataset.tile)focusSelector='[data-tile="'+focused.dataset.tile+'"]';else if(focused.hasAttribute('data-amount-target'))focusSelector='[data-amount-target]';else if(focused.dataset.amount!==undefined)focusSelector='[data-amount="'+focused.dataset.amount+'"]';else if(focused.dataset.amountPiece!==undefined)focusSelector='[data-amount-target]';}
 const q=task();selectedTile=null;$('questionCard').dataset.type=q.type;$('questionCard').innerHTML=questionHTML(q,active.answers[index],false,active.eliminated[index]??[],active.amountWork?.[index],active.chartMarks?.[index]);
 if(q.model.kind!=='chart-hops')chartPad=null;
 $('studentLabel').textContent=active.name+' · '+active.student;$('questionCount').textContent='Question '+(index+1)+' of '+questions().length;
 if(focusSelector)$('questionCard').querySelector(focusSelector)?.focus({preventScroll:true});
 updateNav();
}
function updateNav(){
 if(!active||active.status==='locked')return;
 const complete=isComplete(task(),active.answers[index]),count=countComplete(active);
 $('previous').disabled=index===0||pendingCount>0||exporting;
 $('next').textContent=index===questions().length-1?'Lock and save 🔒':'Next →';
 $('next').toggleAttribute('data-lock',index===questions().length-1);
 $('next').disabled=pendingCount>0||exporting||storageError||!complete||(index===questions().length-1&&!allComplete(active));
 $('undo').disabled=!history.length||pendingCount>0||exporting;
 $('completionCount').textContent=count+' of '+questions().length+' complete';$('progress').max=questions().length;$('progress').value=count;
 if(storageError)return;
 const firstMissing=active.questions.findIndex((q,i)=>!isComplete(q,active.answers[i]));
 const message=pendingCount?'Saving…':complete?(index===questions().length-1?(firstMissing<0?'All '+questions().length+' are complete. Lock and save when ready.':'Complete Question '+(firstMissing+1)+' before Lock and save.'):'Saved. You can go to the next question.'):missingAnswerMessage(task(),active.answers[index]);
 status('studentStatus',message+(active.revisionNotice?' '+active.revisionNotice:''));$('next').title=message;$('next').setAttribute('aria-describedby','studentStatus');
}
function queueChange(mutator,redraw=true){
 const editingKey=activeKey,editingIndex=index;pendingCount++;updateNav();
 const result=pending.then(async()=>{
  if(!active||active.status==='locked'||editingKey!==activeKey)return;
  const before=structuredClone(active),next=structuredClone(active);mutator(next,editingIndex);next.savedAt=new Date().toISOString();
  await commit(next);history.push({index:editingIndex,answers:before.answers[editingIndex],eliminated:before.eliminated[editingIndex]??[],amountWork:before.amountWork?.[editingIndex]??null,chartMarks:before.chartMarks?.[editingIndex]??[]});
  if(redraw&&index===editingIndex)renderStudent();
 });
 pending=result.catch(e=>{storageError=true;status('studentStatus',e.message,true);}).finally(()=>{pendingCount--;updateNav();});
 return pending;
}
function answer(i,value){return queueChange((run,n)=>{if(!run.questions[n].fields[i])return;run.answers[n][i]=value;});}
async function move(delta){
 await pending;if(storageError||!active||active.status==='locked')return;
 if(delta>0&&!isComplete(task(),active.answers[index]))return;
 const nextIndex=index+delta;if(nextIndex<0||nextIndex>=questions().length)return;
 pendingCount++;updateNav();
 try{await commit({...active,position:nextIndex,savedAt:new Date().toISOString()});stopVoice();index=nextIndex;history=[];renderStudent();$('questionTitle').setAttribute('tabindex','-1');$('questionTitle').focus({preventScroll:true});}catch(e){storageError=true;status('studentStatus',e.message,true);}finally{pendingCount--;updateNav();}
}
async function undo(){
 await pending;const last=history.pop();if(!last||active.status==='locked')return;
 pendingCount++;updateNav();
 try{const next=structuredClone(active);next.answers[last.index]=last.answers;next.eliminated[last.index]=last.eliminated;next.amountWork={...next.amountWork,[last.index]:last.amountWork};next.chartMarks={...next.chartMarks,[last.index]:last.chartMarks};next.savedAt=new Date().toISOString();await commit(next);renderStudent();}catch(e){storageError=true;status('studentStatus',e.message,true);}finally{pendingCount--;updateNav();}
}
async function lock(){
 await pending;if(exporting||storageError||!active||active.status==='locked'||!allComplete(active)||index!==questions().length-1)return;
 pendingCount++;updateNav();stopVoice();
 try{
  const lockedAt=new Date().toISOString();await commit({...active,status:'locked',locked:structuredClone(active.answers),lockedAt,savedAt:lockedAt,position:questions().length-1});
  complete();await saveCopy(active);
 }catch(e){storageError=true;status('studentStatus',e.message,true);}finally{pendingCount--;updateNav();}
}
function complete(){show('complete');$('complete').querySelector('.eyebrow').textContent=active.questions.length+' OF '+active.questions.length+' QUESTIONS COMPLETE';$('savedMessage').textContent=active.name+' · '+active.student+' · Saved '+new Intl.DateTimeFormat('en-CA',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Toronto'}).format(new Date(active.lockedAt));status('completeStatus','Saved in this browser. Save a results copy for your teacher.');}
function download(filename,type,value){const blob=value instanceof Blob?value:new Blob([value],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
const safeName=s=>s.replace(/[^a-z0-9 -]/gi,'').slice(0,45)||'student';
async function saveCopy(run=active){const current=run===active;await pending;if(current)run=active;if(!run)return;download('Math-Landing-'+safeName(run.student)+'-'+run.name+'-'+(run.status==='locked'?'Locked':'Draft')+'.json','application/json',JSON.stringify({format:'Math-Landing-Patterning-20',version:1,exportedAt:new Date().toISOString(),run},null,2));}
function listen(){
 stopVoice();if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status('studentStatus','Voice directions are unavailable on this device.');return;}
 voice=new SpeechSynthesisUtterance(mathWording(task().directions));voice.lang='en-CA';voice.rate=.88;voice.onend=()=>{voice=null;$('listen').hidden=false;$('stopVoice').hidden=true;};voice.onerror=()=>{stopVoice();status('studentStatus','Voice directions are unavailable on this device.');};$('listen').hidden=true;$('stopVoice').hidden=false;speechSynthesis.speak(voice);
}
function changeAmount(action){
 if(active.status==='locked'||task().model.kind!=='amount-workshop')return;selectedTile=null;
 return queueChange((run,n)=>{const q=run.questions[n],pieces=[...ML_AMOUNT_TOOLS.pieces(q,run.answers[n],run.amountWork?.[n])];if(action.remove!==undefined)pieces.splice(action.remove,1);else if(ML_AMOUNT_TOOLS.bank(q).includes(action.add)&&pieces.length<q.model.maxPieces&&ML_AMOUNT_TOOLS.sum(pieces)+action.add<=999)pieces.push(action.add);run.amountWork={...run.amountWork,[n]:pieces};run.answers[n][q.model.answerField]=pieces.length?ML_AMOUNT_TOOLS.sum(pieces):null;});
}
function amountClick(e){
 if(task().model.kind!=='amount-workshop')return false;
 const amount=e.target.closest('[data-amount]'),piece=e.target.closest('[data-amount-piece]'),target=e.target.closest('[data-amount-target]');
 if(amount){selectedTile={amount:Number(amount.dataset.amount)};$('questionCard').querySelectorAll('[data-amount]').forEach(b=>b.setAttribute('aria-pressed',String(b===amount)));status('studentStatus',amount.dataset.amount+' selected. Choose the landing pad.');return true;}
 if(piece){changeAmount({remove:Number(piece.dataset.amountPiece)});return true;}
 if(target){if(selectedTile?.amount!==undefined)changeAmount({add:selectedTile.amount});else status('studentStatus','Choose an amount from the supply, then choose the landing pad.');return true;}return false;
}
function placeTile(pad,source){
 if(active.status==='locked')return;const n=Number(pad),q=task(),values=active.answers[index],v=source.pad!==undefined?values[source.pad]:source.tile;
 if(!q.tiles?.includes(v))return;
 selectedTile=null;queueChange((run,i)=>{const a=run.answers[i];if(source.pad!==undefined)[a[n],a[source.pad]]=[a[source.pad],a[n]];else a[n]=v;if(run.questions[i].model.kind==='chart-hops')addChartMark(run,i,v);});
}
function addChartMark(run,n,value){const q=run.questions[n];if(q.model.kind!=='chart-hops'||!Number.isInteger(value)||!q.tiles.includes(value))return;run.chartMarks={...run.chartMarks,[n]:[...new Set([...(run.chartMarks?.[n]??[]),value])]};}
function lightChartNumber(value){
 for(const button of $('questionCard').querySelectorAll('.number-chart [data-tile]')){button.toggleAttribute('data-selected',Number(button.dataset.tile)===value);if(Number(button.dataset.tile)===value){button.setAttribute('data-lit','');button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Chart number '+value+', highlighted');}}
}
function markChartNumber(value){
 if(active?.status==='locked'||task().model.kind!=='chart-hops'||!Number.isInteger(value)||!task().tiles.includes(value))return;
 selectedTile={tile:value};lightChartNumber(value);const key=activeKey+':'+index+':'+value;if(active.chartMarks?.[index]?.includes(value)||pendingChartMarks.has(key))return;
 pendingChartMarks.add(key);return queueChange((run,n)=>addChartMark(run,n,value),false).finally(()=>pendingChartMarks.delete(key));
}
function placeCube(cell,source){
 if(active.status==='locked'||task().model.kind!=='cube-build')return;const target=Number(cell);
 queueChange((run,n)=>{const cells=[...(run.answers[n][0]??[])];if(source!==undefined){if(cells.includes(target)||source===target)return;const old=cells.indexOf(source);if(old>=0)cells.splice(old,1);cells.push(target);}else{const old=cells.indexOf(target);if(old>=0)cells.splice(old,1);else cells.push(target);}run.answers[n][0]=cells.sort((a,b)=>a-b);});
}
function bankValue(raw){return task().tiles?.find(v=>String(v)===String(raw));}
function tileClick(event){
 if(suppressClick){suppressClick=false;return;}
 const tile=event.target.closest('[data-tile]'),pad=event.target.closest('[data-pad]');
 if(tile){const value=bankValue(tile.dataset.tile);if(task().model.kind==='chart-hops'&&chartPad!==null){lightChartNumber(value);placeTile(chartPad,{tile:value});chartPad=null;return;}selectedTile={tile:value};if(task().model.kind==='chart-hops')markChartNumber(value);else document.querySelectorAll('[data-tile]').forEach(b=>b.setAttribute('aria-pressed',String(b===tile)));status('studentStatus',tile.dataset.tile+' selected. Choose a pad.');}
 if(pad){if(selectedTile)placeTile(pad.dataset.pad,selectedTile);else if(task().model.kind==='chart-hops'){chartPad=Number(pad.dataset.pad);document.querySelectorAll('[data-pad]').forEach(b=>b.toggleAttribute('data-target',b===pad));status('studentStatus',task().fields[chartPad].label+' selected. Choose its chart number.');}else if(filled(active.answers[index][pad.dataset.pad])){selectedTile={pad:Number(pad.dataset.pad)};status('studentStatus','Placed tile selected. Choose another pad to move it.');}}
}
function pointerDown(e){
 const amountNode=e.target.closest('[data-amount],[data-amount-piece]');
 if(amountNode&&!amountNode.disabled&&e.button===0){const source={amount:true,value:amountNode.dataset.amount===undefined?undefined:Number(amountNode.dataset.amount),piece:amountNode.dataset.amountPiece===undefined?undefined:Number(amountNode.dataset.amountPiece)};gesture={id:e.pointerId,x:e.clientX,y:e.clientY,source,node:amountNode,dragged:false,ghost:null};amountNode.setPointerCapture?.(e.pointerId);return;}
 const node=e.target.closest('[data-tile],[data-pad],[data-cube-bank],[data-cell]');if(!node||node.disabled||e.button!==0)return;
 const cube=node.hasAttribute('data-cube-bank')||node.dataset.cell!==undefined;
 if(node.dataset.cell!==undefined&&!active.answers[index][0]?.includes(Number(node.dataset.cell)))return;
 const source=cube?{cube:true,cell:node.dataset.cell===undefined?undefined:Number(node.dataset.cell)}:node.dataset.pad!==undefined?{pad:Number(node.dataset.pad)}:{tile:bankValue(node.dataset.tile)};
 if(source.pad!==undefined&&!filled(active.answers[index][source.pad]))return;
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY,source,node,dragged:false,ghost:null};node.setPointerCapture?.(e.pointerId);
}
function pointerMove(e){
 if(!gesture||gesture.id!==e.pointerId)return;
 if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>7){gesture.dragged=true;e.preventDefault();if(!gesture.ghost){const g=document.createElement('div');g.className='tile-ghost';g.innerHTML=gesture.source.amount?esc(gesture.source.value??ML_AMOUNT_TOOLS.pieces(task(),active.answers[index],active.amountWork?.[index])[gesture.source.piece]):gesture.source.cube?cubeIcon():shape(gesture.source.tile??active.answers[index][gesture.source.pad]);document.body.append(g);gesture.ghost=g;}gesture.ghost.style.left=e.clientX+'px';gesture.ghost.style.top=e.clientY+'px';
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-pad],[data-cell],[data-amount-pad],[data-amount-bank]');document.querySelectorAll('[data-pad],[data-cell],[data-amount-pad],[data-amount-bank]').forEach(p=>p.toggleAttribute('data-over',p===target));
 }
}
function pointerEnd(e){
 if(!gesture||e.pointerId!==gesture.id)return;
 const g=gesture;gesture=null;g.ghost?.remove();document.querySelectorAll('[data-over]').forEach(p=>p.removeAttribute('data-over'));
 if(g.dragged&&g.source.amount){suppressClick=true;setTimeout(()=>{suppressClick=false;},150);const target=document.elementFromPoint(e.clientX,e.clientY);if(g.source.piece!==undefined&&target?.closest('[data-amount-bank]'))changeAmount({remove:g.source.piece});else if(g.source.piece===undefined&&target?.closest('[data-amount-pad]'))changeAmount({add:g.source.value});return;}
 if(g.dragged){suppressClick=true;setTimeout(()=>{suppressClick=false;},150);const pad=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-pad],[data-cell]');if(g.source.cube&&pad?.dataset.cell!==undefined)placeCube(pad.dataset.cell,g.source.cell);else if(pad?.dataset.pad!==undefined)placeTile(pad.dataset.pad,g.source);else if(task().model.kind==='chart-hops'&&g.source.tile!==undefined)markChartNumber(g.source.tile);}
}
async function gate(target){
 await pending;if(teacherUnlocked){target==='audit'?openAudit():openReport();return;}
 dialog('Teacher '+(target==='audit'?'Audit':'assessment'),'<form id="teacherForm" class="gate"><p>Enter your existing Math Landing assessment code.</p><div><input id="teacherCode" type="password" required autocomplete="off" aria-label="Math Landing assessment code"><button class="primary">Open</button></div><p id="gateStatus" class="status" role="status"></p></form>');
 $('teacherForm').onsubmit=async e=>{e.preventDefault();try{const bytes=new TextEncoder().encode($('teacherCode').value.trim()),hash=await crypto.subtle.digest('SHA-256',bytes),digest=[...new Uint8Array(hash)].map(v=>v.toString(16).padStart(2,'0')).join('');if(digest!==teacherDigest){status('gateStatus','That code did not match.',true);return;}teacherUnlocked=true;target==='audit'?openAudit():openReport();}catch{status('gateStatus','The teacher screen is unavailable in this browser context.',true);}};$('teacherCode').focus();
}
const answerText=(q,a)=>q.skill==='translation'?'Shapes in order: '+q.fields.map((f,i)=>filled(a?.[i])?a[i]:'Not answered').join(' · '):q.fields.map((f,i)=>mathWording(f.label)+': '+(f.type==='grid'?(a?.[i]?.length??0)+' cubes placed':filled(a?.[i])?displayChoice(q,a[i]):'Not answered')).join(' · ');
const expectedText=q=>q.skill==='translation'?'Shapes in order: '+q.fields.map(f=>f.answer).join(' · '):q.fields.map(f=>mathWording(f.label)+': '+(f.type==='grid'?f.answer.length+' cubes in the Figure 4 arrangement':displayChoice(q,f.answer))).join(' · ');
const scoreQuestion=(q,a)=>q.fields.every((f,i)=>fieldMatches(f,a?.[i]));
const auditKey=(g,n)=>storeKey+':audit:'+data.sets[g].questions[n].code;
function getNote(g,n){try{return localStorage.getItem(auditKey(g,n))||'';}catch{return '';}}
function openAudit(g=(!$('student').hidden?grade:auditGrade),n=(!$('student').hidden?index:auditIndex)){
 auditGrade=g;auditIndex=n;
 const q=data.sets[g].questions[n];
 dialog('Teacher Audit','<nav class="audit-tools"><label>Path <select id="auditGrade">'+Object.values(data.sets).map(s=>'<option value="'+s.grade+'" '+(s.grade===g?'selected':'')+'>'+s.name+' · Grade '+s.grade+'</option>').join('')+'</select></label><label>Question <select id="auditQuestion">'+data.sets[g].questions.map((v,i)=>'<option value="'+i+'" '+(i===n?'selected':'')+'>'+(i+1)+'. '+esc(v.title)+'</option>').join('')+'</select></label><button id="auditPrev" '+(g===1&&n===0?'disabled':'')+'>← Previous page</button><span class="audit-meta">'+((g-1)*data.total+n+1)+' / '+(data.total*3)+'</span><button id="auditNext" '+(g===3&&n===data.total-1?'disabled':'')+'>Next page →</button><button id="savedNotes">Saved notes</button></nav><p class="audit-meta">'+esc(q.code+' · Grade '+g+' · '+q.curriculum+' · Source '+q.source.date+' · '+q.source.code+' · '+q.source.title)+'<br>'+esc(q.source.adaptation)+'</p><div class="audit-layout"><article class="question-card" data-type="'+q.type+'">'+questionHTML(q,q.fields.map(()=>null),true)+'</article><section class="audit-side"><h3>Directions</h3><p class="audit-meta">'+esc(q.directions)+'</p><div class="audit-key"><strong>Answer key</strong><br>'+esc(expectedText(q))+'</div><label for="auditNotes">Audit notes for '+q.code+'</label><textarea id="auditNotes" maxlength="2000"></textarea><button id="saveAudit" class="primary">Save audit notes</button><button id="downloadAudit">Download audit Markdown</button><p id="auditStatus" class="status" role="status"></p></section></div>');
 $('auditNotes').value=getNote(g,n);$('auditGrade').onchange=()=>openAudit(+$('auditGrade').value,0);$('auditQuestion').onchange=()=>openAudit(g,+$('auditQuestion').value);
 const step=delta=>{let global=(g-1)*data.total+n+delta;openAudit(Math.floor(global/data.total)+1,global%data.total);};$('auditPrev').onclick=()=>step(-1);$('auditNext').onclick=()=>step(1);$('savedNotes').onclick=savedNotes;
 const linkButton=document.createElement('button');linkButton.textContent='Link audit Markdown';$('saveAudit').after(linkButton);
 linkButton.onclick=async()=>status('auditStatus',await window.ML_HOMEWORK_AUDIT_MARKDOWN.link(()=>{}));
 $('saveAudit').onclick=()=>{try{localStorage.setItem(auditKey(g,n),$('auditNotes').value);window.ML_HOMEWORK_AUDIT_MARKDOWN.recordAssessment({pageCode:q.code,title:q.title,grade:g,question:n+1,sourceCode:q.source.code,sourceDate:q.source.date,savedAt:new Date().toISOString(),comment:$('auditNotes').value});status('auditStatus','Audit saved. '+window.ML_HOMEWORK_AUDIT_MARKDOWN.status());}catch{status('auditStatus','Notes could not be saved. Download audit Markdown before closing.',true);}};
 $('downloadAudit').onclick=()=>{const note=$('auditNotes').value;download('Math-Landing-Patterning-Assessments-Audit.md','text/markdown','# Math Landing · Assessment audit\n\n'+Object.values(data.sets).flatMap(s=>s.questions.map((p,i)=>{const text=s.grade===g&&i===n?note:getNote(s.grade,i);return text?'## '+p.code+' · '+s.name+' · Question '+(i+1)+'\n\nSource: '+p.source.code+' · '+p.source.date+'\n\n'+text+'\n':'';})).filter(Boolean).join('\n'));};
}
function savedNotes(page=0){
 page=Number.isInteger(page)?page:0;
 const notes=Object.values(data.sets).flatMap(s=>s.questions.map((q,i)=>({g:s.grade,n:i,q,note:getNote(s.grade,i)}))).filter(r=>r.note);
 dialog('Saved audit notes','<nav class="audit-tools"><button id="backAudit">← Audit pages</button><button id="notesPrevious" '+(page===0?'disabled':'')+'>← Previous notes</button><span>Page '+(page+1)+' of '+Math.max(1,Math.ceil(notes.length/8))+'</span><button id="notesNext" '+((page+1)*8>=notes.length?'disabled':'')+'>Next notes →</button></nav><div class="saved-notes">'+(notes.length?notes.slice(page*8,page*8+8).map(r=>'<button data-note="'+r.g+':'+r.n+'"><strong>'+r.q.code+' · '+data.sets[r.g].name+'</strong><br>'+esc(r.note)+'</button>').join(''):'<p>No audit notes have been saved.</p>')+'</div>');$('backAudit').onclick=()=>openAudit(auditGrade,auditIndex);$('notesPrevious').onclick=()=>savedNotes(page-1);$('notesNext').onclick=()=>savedNotes(page+1);$('dialogBody').querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>openAudit(...b.dataset.note.split(':').map(Number)));
}
async function openReport(key=activeKey,n=reportPosition){
 db=await storage.load();const entries=Object.entries(db.runs);if(!entries.length){dialog('Teacher assessment','<p>No student assessments have been started in this browser.</p><label class="pdf-link">Restore a saved results copy <input id="restoreCopy" type="file" accept=".json"></label><p class="status" id="restoreStatus"></p>');$('restoreCopy').onchange=restoreCopy;return;}
 const run=db.runs[key]??entries[0][1];key=db.runs[key]?key:entries[0][0];n=Math.max(0,Math.min(run.questions.length-1,n));reportPosition=n;const q=run.questions[n],marks=run.questions.filter((q,i)=>scoreQuestion(q,run.answers[i])).length;
 dialog('Teacher assessment','<nav class="report-tools"><label>Student <select id="reportStudent">'+entries.map(([k,r])=>'<option value="'+esc(k)+'" '+(k===key?'selected':'')+'>'+esc(r.student+' · '+r.name+' · '+r.status)+'</option>').join('')+'</select></label><label>Question <select id="reportQuestion">'+run.questions.map((q,i)=>'<option value="'+i+'" '+(i===n?'selected':'')+'>'+(i+1)+'. '+esc(q.title)+'</option>').join('')+'</select></label><button id="reportJSON">Save results copy</button><button id="reportPDF">Save results PDF</button><a href="pdf/Math-Landing-Patterning-'+data.total+'-Teacher-Key.pdf" download>Teacher key PDF</a><label class="pdf-link">Restore copy <input id="restoreCopy" type="file" accept=".json" hidden></label></nav><p class="report-summary">'+countComplete(run)+' / '+run.questions.length+' complete · '+marks+' / '+run.questions.length+' questions correct · '+esc(run.status==='locked'?'Locked and saved':'Draft - not locked')+'</p><div class="audit-layout"><article class="question-card" data-type="'+q.type+'">'+questionHTML(q,run.answers[n],true,[],run.amountWork?.[n],run.chartMarks?.[n])+'</article><section class="audit-side"><h3>Question '+(n+1)+' · '+esc(q.code)+'</h3><div class="report-answer"><p>'+esc(answerText(q,run.answers[n]))+'</p><p><strong>Expected:</strong> '+esc(expectedText(q))+'</p></div><p class="audit-meta">'+esc(q.source.code+' · '+q.source.date+' · '+q.source.adaptation)+'</p><label for="teacherNotes">Teacher notes</label><textarea id="teacherNotes" maxlength="2000"></textarea><button id="saveTeacherNotes">Save teacher notes</button><p class="status" id="reportStatus"></p><p class="status" id="restoreStatus"></p></section></div>');
 $('teacherNotes').value=run.teacherNotes?.[n]??'';$('reportStudent').onchange=()=>openReport($('reportStudent').value,0);$('reportQuestion').onchange=()=>openReport(key,+$('reportQuestion').value);$('reportJSON').onclick=()=>saveCopy(run);$('reportPDF').onclick=()=>resultsPDF(run,'reportStatus');$('restoreCopy').onchange=restoreCopy;
 $('saveTeacherNotes').onclick=async()=>{try{const next={...run,teacherNotes:{...run.teacherNotes,[n]:$('teacherNotes').value}},saved=await storage.save(key,run.revision,next);if(!saved||storage.temporary())throw Error('The notes could not be saved. Reopen the assessment and try again.');db=saved;if(key===activeKey)active=db.runs[key];status('reportStatus','Teacher notes saved.');run.revision=db.runs[key].revision;run.teacherNotes=next.teacherNotes;}catch(e){status('reportStatus',e.message,true);}};
}
async function restoreCopy(e){
 try{const file=e.target.files[0];if(!file)return;const incoming=JSON.parse(await file.text()),r=incoming.run;
  if(incoming.format!=='Math-Landing-Patterning-20'||!r||![1,2,3].includes(r.grade)||!Array.isArray(r.questions)||![20,27,data.total].includes(r.questions.length)||!Array.isArray(r.answers)||r.answers.length!==r.questions.length||typeof r.student!=='string'||!r.student.trim()||!['draft','locked'].includes(r.status)||r.status==='locked'&&!allComplete(r))throw Error('Choose a valid Math Landing assessment results copy.');
  db=await storage.load();const key=keyFor(r.grade,r.student);if(db.runs[key])throw Error('This student already has an assessment here. Their saved work has been kept.');
  const restored={...r,revision:undefined,locked:Array.isArray(r.locked)?r.locked:[]};const saved=await storage.save(key,undefined,restored);if(!saved||storage.temporary())throw Error('The results copy could not be saved on this device.');db=saved;openReport(key,0);
 }catch(err){status('restoreStatus',err.message,true);}
}
async function resultsPDF(run=active,messageId='completeStatus'){
 if(exporting||!run)return;exporting=true;updateNav();stopVoice();const host=$('captureHost'),pdf=new ML_SCREEN_PDF();
 try{
  if(!window.ML_ASSESSMENT_ART)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='assessment-art.js?v=20261118-v5';script.onload=resolve;script.onerror=()=>reject(Error('The assessment pictures could not be loaded.'));document.head.append(script);});
  const captureArt={...data.art,...window.ML_ASSESSMENT_ART};
  for(let i=0;i<run.questions.length;i++){
   status(messageId,'Creating results PDF · '+(i+1)+' of '+run.questions.length+'…');
   host.innerHTML='<article class="question-card" data-type="'+run.questions[i].type+'">'+questionHTML(run.questions[i],run.answers[i],true,[],run.amountWork?.[i],run.chartMarks?.[i])+'</article><div class="capture-footer">'+esc(run.student+' · '+run.name+' · Question '+(i+1)+' of '+run.questions.length+' · '+run.status+' · '+(run.savedAt||''))+'</div>';
   await Promise.all([...host.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));
  const canvas=await html2canvas(host,{backgroundColor:'#fffef8',scale:1,logging:false,allowTaint:false,useCORS:true,width:1120,height:670,windowWidth:1366,windowHeight:768,onclone:doc=>{for(const img of doc.querySelectorAll('#captureHost img')){const file=img.getAttribute('src')?.split('/').pop();if(captureArt[file])img.src=captureArt[file];}}});
   const png=canvas.toDataURL('image/png');await pdf.addPNG(png);await storage.evidence(storeKey+':'+keyFor(run.grade,run.student)+':'+run.questions[i].code,png);
  }
  download('Math-Landing-'+safeName(run.student)+'-'+run.name+'-Results.pdf','application/pdf',pdf.finish());status(messageId,'Results PDF saved · '+run.questions.length+' pages.');
 }catch(e){status(messageId,'The PDF could not be created. Save a results copy and try again. '+e.message,true);}finally{host.innerHTML='';exporting=false;updateNav();}
}
$('startForm').onsubmit=begin;$('studentName').oninput=updateStart;document.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>setGrade(+b.dataset.grade));
$('previous').onclick=()=>move(-1);$('next').onclick=()=>index===questions().length-1?lock():move(1);$('undo').onclick=undo;$('saveCopy').onclick=()=>saveCopy();$('listen').onclick=listen;$('stopVoice').onclick=stopVoice;
$('questionCard').onclick=e=>{if(suppressClick){suppressClick=false;return;}if(exporting||active?.status==='locked')return;if(amountClick(e))return;if(e.target.closest('[data-cell]')){placeCube(e.target.closest('[data-cell]').dataset.cell);return;}if(e.target.closest('[data-cube-bank]')){status('studentStatus','Drag a cube to the grid, or tap an empty square.');return;}const b=e.target.closest('[data-option]');if(b)answer(+b.dataset.field,task().fields[b.dataset.field].options[b.dataset.option]);else tileClick(e);};
$('questionCard').onchange=e=>{if(exporting||active?.status==='locked')return;if(e.target.matches('select[data-field]')){const i=+e.target.dataset.field;answer(i,e.target.value===''?null:task().fields[i].options[+e.target.value]);}};
$('questionCard').addEventListener('pointerdown',pointerDown);document.addEventListener('pointermove',pointerMove,{passive:false});document.addEventListener('pointerup',pointerEnd);document.addEventListener('pointercancel',e=>{if(gesture?.id===e.pointerId){gesture.ghost?.remove();gesture=null;document.querySelectorAll('[data-over]').forEach(p=>p.removeAttribute('data-over'));}});
$('questionCard').addEventListener('keydown',e=>{const piece=e.target.closest('[data-amount-piece]');if(piece&&['Delete','Backspace'].includes(e.key)){e.preventDefault();changeAmount({remove:Number(piece.dataset.amountPiece)});return;}const radio=e.target.closest('[role="radio"]');if(!radio||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const choices=[...radio.closest('[role="radiogroup"]').querySelectorAll('[role="radio"]:not(:disabled)')],current=choices.indexOf(radio),delta=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1,next=e.key==='Home'?0:e.key==='End'?choices.length-1:(current+delta+choices.length)%choices.length;choices[next].focus();choices[next].click();});
$('auditOpen').onclick=()=>gate('audit');$('resultsOpen').onclick=()=>gate('report');$('completeTeacher').onclick=()=>gate('report');$('closeDialog').onclick=closeDialog;$('dialog').addEventListener('close',stopVoice);$('dialog').addEventListener('cancel',e=>{if(exporting)e.preventDefault();});
$('downloadResults').onclick=()=>saveCopy();$('resultsPDF').onclick=()=>resultsPDF();$('backEntry').onclick=()=>{active=null;activeKey='';show('entry');updateStart();};window.addEventListener('pagehide',stopVoice);
(async()=>{try{db=await storage.load();const params=new URLSearchParams(location.search),g=+params.get('grade');$('studentName').value=(params.get('student')??'').slice(0,60);setGrade([1,2,3].includes(g)?g:2);if(storage.temporary())status('entryStatus','Browser storage is unavailable. Open in Chrome or Edge with storage enabled.',true);$('startButton').disabled=false;}catch(e){status('entryStatus','Saved work could not be read. '+e.message,true);}})();
