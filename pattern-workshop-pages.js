/* Navigation and checking for the standalone workshop activities. */
(() => {
 'use strict';
 const library=window.ML_NOVEMBER_PATTERN_LIBRARY;
 const path=(grade,page)=>'grade-'+grade+'-p'+String(page).padStart(3,'0')+'.html';
 const libraryHome=document.querySelector('#workshop-library');
 if(libraryHome){
  for(const grade of [2,3]){
   const list=document.createElement('ol');
   for(const item of library[grade]){
    const li=document.createElement('li'),link=document.createElement('a');
    link.textContent=item.title;
    link.href=path(grade,item.sourcePage);
    li.append(link);
    list.append(li);
   }
   libraryHome.querySelector('[data-grade="'+grade+'"]').append(list);
  }
  return;
 }
 const grade=Number(document.body.dataset.grade), page=Number(document.body.dataset.page);
 const index=library[grade].findIndex(item=>item.sourcePage===page), task=library[grade][index];
 const style=document.createElement('style');
 style.textContent=window.ML_NOVEMBER_REFERENCE_ENGINE.styles;
 document.head.append(style);
 const picture=new URL('../assets/november-homework/'+task.image,location.href).href;
 const id='workshop-'+grade+'-'+page;
 window.ML_CONFIG={student:'guest',id,revision:'v1',grade,task:{...task,picture}};
 window.ML_NOVEMBER_REFERENCE_ENGINE.boot();
 const check=document.querySelector('#check');
 const progress=document.querySelector('#workshop-progress');
 progress.textContent=(grade===2?'Excite':'Inspire')+' · '+(index+1)+' / '+library[grade].length;
 for(const [selector,offset] of [['#previous',-1],['#next',1]]){
  const link=document.querySelector(selector), target=library[grade][index+offset];
  if(target)link.href=path(grade,target.sourcePage);
  else link.hidden=true;
 }
 function showResult(assessment){
  check.dataset.result=assessment.correct?'correct':'';
  check.textContent=assessment.correct?'✓ Correct!':assessment.checked?'Check · '+assessment.score+'/'+assessment.total:'Check my work';
 }
 showResult(window.ML_ENGINE.get().assessment);
 check.addEventListener('click',()=>showResult(window.ML_ENGINE.check().assessment));
 window.addEventListener('message',e=>{if(e.source===window&&e.data?.id===id)showResult(window.ML_ENGINE.get().assessment);});
})();
