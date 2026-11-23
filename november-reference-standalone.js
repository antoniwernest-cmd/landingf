(() => {
 const requested=decodeURIComponent(location.pathname.split('/').pop()).toLowerCase();
 const doubles=requested==='doubles-problem-solving.html';
 const grade=doubles?({elevate:1,excite:2,inspire:3}[new URLSearchParams(location.search).get('path')]||2):3;
 const [file,task]=doubles?[requested+'-g'+grade,window.ML_NOVEMBER_DOUBLES_PRACTICE(grade,0)]:
  Object.entries(window.ML_NOVEMBER_REFERENCE_TASKS).find(([name])=>name.toLowerCase()===requested);
 const engine=task.layout==='vertical-addition'?window.ML_NOVEMBER_VERTICAL_ENGINE:window.ML_NOVEMBER_REFERENCE_ENGINE;
 const styles=document.createElement('style');
 styles.textContent=`
  *{box-sizing:border-box}
  html,body{height:100%;margin:0;overflow:hidden}
  body{display:grid;grid-template-rows:minmax(0,1fr) auto;background:#eaf4f8;color:#193b47;font:clamp(15px,2vw,22px)/1.18 "Trebuchet MS",sans-serif}
  h1,p{margin:0}
  h1{font-size:clamp(24px,4.2vw,53px);line-height:1.08;color:#174e4f}
  button{font:inherit;cursor:pointer}
  button:focus-visible,select:focus-visible{outline:3px solid #8250b5;outline-offset:2px}
  .activity{display:grid;grid-template-rows:auto auto minmax(0,1fr);min-height:0;padding-inline:clamp(6px,1.25vw,18px)}
  .prompt{font-size:clamp(15px,2.1vw,24px)}
  footer{display:flex;justify-content:flex-end;padding:5px clamp(7px,1.25vw,18px) 8px;background:#dcecf3;border-top:1px solid #abd0dc}
  #check{min-height:44px;border:1px solid #7c4c1b;border-radius:9px;background:#a94310;color:white;padding:3px 14px;font-weight:bold}
  #check[data-result="correct"]{background:#176f49;border-color:#155d40}
  @media print{
   @page{size:landscape;margin:10mm}
   html,body{height:auto;overflow:visible}
   body{display:block;print-color-adjust:exact;-webkit-print-color-adjust:exact}
   footer{display:none}
  }
 `+engine.styles;
 document.head.append(styles);
 window.ML_CONFIG={student:'guest',id:file,revision:'v1',grade,
  task:{...task,picture:new URL('assets/november-homework/'+(task.image||'object-'+task.art.slug+'.png'),location.href).href}};
 engine.boot();
 const check=document.getElementById('check');
 function showResult(assessment){
  check.dataset.result=assessment.correct?'correct':'';
  check.textContent=assessment.correct?'✓ Correct!':assessment.checked?'Check · '+assessment.score+'/'+assessment.total:'Check my work';
 }
 showResult(window.ML_ENGINE.get().assessment);
 check.addEventListener('click',()=>showResult(window.ML_ENGINE.check().assessment));
 window.addEventListener('message',event=>{
  if(event.source===window&&event.data?.id===file)showResult(window.ML_ENGINE.get().assessment);
 });
})();
