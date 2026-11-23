/* Count up from the smaller score using reusable point tiles. */
(()=>{
 'use strict';
 const id='mathology-hw-2026-11-09-g3-d2-q12';
 const page=ML_CATALOG.find(q=>q.id===id);
 const task=page.config.patterningWorksheet.tasks[0];
 task.countUpScores=true;
 page.directions='Drag a point tile to Theodore’s score, or tap a tile. Watch his total grow until it matches Ace’s. Use the points you added to answer the question.';

 function teamArt(){
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 154" role="img" aria-label="Three teammates on a playing field, with pennants above them">'+
   '<rect x="1" y="1" width="238" height="152" rx="16" fill="#e1f5f3"/>'+
   '<path d="M1 117Q119 93 239 117V153H1Z" fill="#aad694"/><path d="M1 133H239" fill="none" stroke="#f7fff4" stroke-width="3"/>'+
   '<path d="M20 12Q120 58 220 12" fill="none" stroke="#486877" stroke-width="2"/>'+
   '<path d="m44 22 23 8-17 13Z" fill="#e28c45"/><path d="m89 35 23 2-12 17Z" fill="#488ca0"/>'+
   '<path d="m130 37 23-3-8 19Z" fill="#9566aa"/><path d="m176 29 22-7-5 20Z" fill="#e28c45"/>'+
   teammate(58,87,'#3d7897','#965b41','#2e2431')+
   teammate(182,87,'#9657a3','#e3ad76','#5b392c')+
   teammate(120,77,'#35786c','#b87755','#3a2b30')+
   '<path d="M194 131a14 14 0 1 1 28 0 14 14 0 0 1-28 0Z" fill="#fff7de" stroke="#87512d" stroke-width="2"/>'+
   '<path d="M194 131h28m-14-14v28m-10-24q12 10 0 20m20-20q-12 10 0 20" stroke="#87512d" fill="none" stroke-width="1.5"/></svg>';
 }
 function teammate(x,y,kit,skin,hair){
  return '<g transform="translate('+x+' '+y+')" stroke="#284252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
   '<path d="M-20 11-32 27l10 7 9-9v29h26V25l9 9 10-7-12-16-10-4h-20Z" fill="'+kit+'"/>'+
   '<path d="m-7 24 7 6 7-6M-7 31l7 6 7-6" stroke="#fff2cb" stroke-width="2.5" fill="none"/>'+
   '<circle cy="-7" r="20" fill="'+skin+'"/><path d="M-20-8q-2-22 20-22 21 0 20 22-8 1-13-11-8 9-27 11Z" fill="'+hair+'"/>'+
   '<path d="M-7-6v1M7-6v1m-12 7q5 6 10 0" fill="none"/></g>';
 }
 const team=teamArt();
 page.guide='homework-team-scoreboard';
 ML_PICTURES[page.guide]={
  src:'data:image/svg+xml,'+encodeURIComponent(team),label:'Count up on the team scoreboard',
  alt:'Three teammates on a playing field',
  caption:'Start with Theodore’s 229 points. Drag or tap point tiles to count up to Ace’s 400. The points you added tell you how much more Ace has.'
 };

 function countUpMarkup(){
  const d=t.mathologyDiagram;
  const added=s.scoreAdded||0;
  const total=d.bottom+added;
  const matched=total===d.top;
  const over=total>d.top;
  const note=over?'Past Ace’s score. Undo the last tile and try a smaller one.':matched?'The scores match! Use the points added to answer.':'Drag a tile to the blue pad, or tap it to add.';
  return '<section class="score-count-up" aria-label="Team scoreboard">'+teamPicture+
   '<div class="score-count-up-work">'+
    '<div class="team-scoreboard"><div><span>Ace</span><b>'+d.top+'</b></div><div><span>Theodore now</span><b data-score-total>'+total+'</b></div></div>'+
    '<div class="score-tile-pad" data-score-pad data-matched="'+matched+'"><strong>'+(added?d.bottom+' + '+added+' = '+total:'Drop point tiles here')+'</strong><span data-score-added>'+added+' points added</span></div>'+
    '<div class="score-point-tiles" role="group" aria-label="Point tiles">'+[1,10,100].map(points=>'<button type="button" data-score-tile="'+points+'" aria-label="Add '+points+(points===1?' point':' points')+'" '+(matched||over?'disabled':'')+'>+'+points+'</button>').join('')+'</div>'+
    '<p class="score-tile-note">'+note+'</p>'+
   '</div></section>';
 }

 function bindScoreTiles(){
  document.body.dataset.scoreCountUp='true';
  const announcer=document.createElement('span');
  announcer.className='score-tile-announcer';
  announcer.setAttribute('role','status');
  document.body.append(announcer);
  let drag=null,suppressDragClick=false;
  function place(points){
   const d=t.mathologyDiagram;
   if(d.bottom+(s.scoreAdded||0)>=d.top)return;
   action(()=>{s.scoreAdded=(s.scoreAdded||0)+points;});
   const total=d.bottom+s.scoreAdded;
   announcer.textContent='Theodore has '+total+' points. '+s.scoreAdded+' points added.'+
    (total===d.top?' The scores match.':total>d.top?' Undo the last tile to try again.':'');
  }
  function clearDrag(){
   drag?.ghost?.remove();
   document.querySelector('[data-score-pad]')?.removeAttribute('data-score-hover');
   drag=null;
  }
  const tile=e=>e.target.closest('[data-score-tile]:enabled');
  document.addEventListener('click',e=>{
   const button=tile(e);
   if(!button||(e.detail&&suppressDragClick))return;
   place(Number(button.dataset.scoreTile));
   if(!e.detail){
    const replacement=document.querySelector('[data-score-tile="'+button.dataset.scoreTile+'"]:enabled');
    (replacement||$('undo')).focus();
   }
  });
  document.addEventListener('pointerdown',e=>{
   const button=tile(e);
   if(!button||e.button!==0||!e.isPrimary)return;
   suppressDragClick=false;
   drag={id:e.pointerId,x:e.clientX,y:e.clientY,points:Number(button.dataset.scoreTile)};
   button.setPointerCapture(e.pointerId);
  });
  document.addEventListener('pointermove',e=>{
   if(drag?.id!==e.pointerId)return;
   if(!drag.ghost){
    if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;
    drag.ghost=document.createElement('span');
    drag.ghost.className='score-tile-ghost';
    drag.ghost.textContent='+'+drag.points;
    document.body.append(drag.ghost);
   }
   drag.ghost.style.left=e.clientX+'px';
   drag.ghost.style.top=e.clientY+'px';
   const pad=document.querySelector('[data-score-pad]');
   pad?.toggleAttribute('data-score-hover',!!document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-score-pad]'));
  });
  document.addEventListener('pointerup',e=>{
   if(drag?.id!==e.pointerId)return;
   const {points,ghost}=drag;
   const drop=ghost&&document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-score-pad]');
   clearDrag();
   if(!ghost)return;
   suppressDragClick=true;
   if(drop)place(points);
  });
  document.addEventListener('pointercancel',clearDrag);
  addEventListener('blur',clearDrag);
 }

 const style=String.raw `
 html body[data-score-count-up] #main{justify-content:flex-start!important;align-content:start!important}
 .score-count-up{display:grid;grid-template-columns:minmax(100px,1fr) minmax(0,1.6fr);gap:clamp(6px,2vw,22px);align-items:center;width:min(100%,730px);align-self:center;margin:0 auto;color:#163b50}
 .score-count-up>svg{display:block;width:100%;max-height:clamp(74px,42vh,185px)}
 .score-count-up-work{display:grid;gap:5px;min-width:0}
 .team-scoreboard{display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#163b50;color:#fff8db;border-radius:12px;padding:5px;text-align:center}
 .team-scoreboard>div{background:#284e61;border-radius:7px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px;padding:2px 7px;font-weight:700;font-size:clamp(12px,2vw,17px);line-height:1.1}
 .team-scoreboard b{font-size:clamp(20px,4vh,35px);font-variant-numeric:tabular-nums}
 .score-tile-pad{display:flex;gap:4px 10px;justify-content:center;align-items:center;flex-wrap:wrap;min-height:40px;padding:3px 7px;background:#d4f1f7;border:2px dashed #23627b;border-radius:10px;text-align:center;box-sizing:border-box}
 .score-tile-pad[data-score-hover],.score-tile-pad[data-matched=true]{background:#e1f5db;border-color:#40744d}
 .score-tile-pad>strong{font-size:clamp(14px,2.7vh,21px)}
 .score-tile-pad>span,.score-tile-note{font-size:clamp(11px,2.1vh,15px)}
 .score-point-tiles{display:flex;gap:6px;justify-content:center}
 html body[data-score-count-up] .score-point-tiles>button{width:auto!important;min-width:49px!important;min-height:35px!important;padding:3px 10px!important;font-size:clamp(15px,3vh,22px)!important;touch-action:none;cursor:grab}
 .score-tile-note{text-align:center;margin:3px 0 0;line-height:1.15}
 .score-tile-ghost{position:fixed;z-index:999;transform:translate(-50%,-50%);pointer-events:none;background:#fff6d6;color:#163b50;border:2px solid #23627b;border-radius:8px;padding:5px 10px;font-weight:700}
 .score-tile-announcer{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden}
 @media(max-width:480px){.score-count-up{grid-template-columns:minmax(65px,.55fr) minmax(0,1.45fr)}.team-scoreboard>div{grid-template-columns:1fr}.score-tile-pad{gap:2px}}
 @media(max-height:320px){.score-count-up-work{gap:3px}.score-tile-pad{min-height:32px}.score-tile-note{margin-top:1px}.team-scoreboard{padding:3px}}
 @media print{.score-count-up{break-inside:avoid}.score-tile-ghost{display:none}}
 `;
 const injection='const teamPicture='+JSON.stringify(team)+';'+countUpMarkup.toString()+';'+bindScoreTiles.toString()+';if(t.countUpScores)bindScoreTiles();';
 const engine=ML_ENGINES['pattern-resources'];
 ML_ENGINES['pattern-resources']=engine
  .replace('function render(){',injection+'\nfunction render(){')
  .replace("if(d.type==='compare'){","if(t.countUpScores)return countUpMarkup();\n if(d.type==='compare'){")
  .replace('</head>','<style>'+style+'</style></head>');
})();
