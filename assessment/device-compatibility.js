/* Adapt existing controls to touch screens; all math actions still use the shared engines. */
window.ML_DEVICE_COMPATIBILITY=(()=>{
 function touchTargets(){
  if(!matchMedia('(any-pointer:coarse)').matches)return;const selector='.rv-answers button,.item-choices button,.pattern-tiles button,.pattern-slot,.rv-bank button,.rv-trades button,.shape-view-tabs button,[data-shape-pad],.skills-tabs button,.estimate-tool-tabs button,.assessment-model-tabs button,button[data-pencil-adjust],button[data-jump],.rv-activity>footer button';let queued=false;
  function paint(){queued=false;for(const button of document.querySelectorAll(selector)){if(!button.getClientRects().length)continue;const r=button.getBoundingClientRect();if(r.height<44&&button.style.getPropertyValue('min-height')!=='44px')button.style.setProperty('min-height','44px','important');if(r.width<44&&button.style.getPropertyValue('min-width')!=='44px')button.style.setProperty('min-width','44px','important')}}
  new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(paint)}}).observe(document.body,{childList:true,subtree:true});addEventListener('resize',paint);paint();
 }
 function keyboardFocus(){
  const attributes=['data-pattern-key','data-pattern-value','data-answer','data-field','data-card','data-bank','data-piece','data-number','data-part','data-shape-pad','data-group','data-split','data-step','data-jump'];let keyboard=false,saved=null,queued=false;
  function remember(el){if(!el?.matches('button,input,select,textarea'))return;const attrs=attributes.filter(a=>el.hasAttribute(a)).map(a=>[a,el.getAttribute(a)]);saved={id:el.id,tag:el.tagName,attrs,text:attrs.length?'':el.textContent.trim()}}
  document.addEventListener('keydown',e=>{if(['Tab','Enter',' '].includes(e.key)){keyboard=true;remember(e.target)}},true);document.addEventListener('pointerdown',()=>{keyboard=false;saved=null},true);document.addEventListener('focusin',e=>{if(keyboard)remember(e.target)},true);
  new MutationObserver(()=>{if(queued||!keyboard||!saved)return;queued=true;requestAnimationFrame(()=>{queued=false;if(!keyboard||!saved||!document.hasFocus()||document.activeElement!==document.body)return;const target=saved.id?document.getElementById(saved.id):[...document.querySelectorAll(saved.tag)].find(el=>!el.disabled&&el.getClientRects().length&&saved.attrs.every(([a,v])=>el.getAttribute(a)===v)&&(saved.attrs.length||el.textContent.trim()===saved.text));target?.focus({preventScroll:true})})}).observe(document.body,{childList:true,subtree:true});
 }
 const engineCSS=`
 @media(any-pointer:coarse){
  html body .rv-activity .rv-answers button,html body .rv-activity .item-choices button,html body .rv-activity .pattern-tiles button,html body .rv-activity .rv-bank button,html body .rv-activity .rv-trades button,html body .rv-activity .shape-view-tabs button,html body .rv-activity [data-shape-pad],html body .rv-activity>footer button{min-height:44px!important;min-width:44px!important}
  html body .rv-activity .pattern-slot{min-height:48px!important;min-width:48px!important}
  html body button:focus-visible,html body [tabindex]:focus-visible{outline:3px solid #ad651e!important;outline-offset:3px}
  html body .rv-activity .rv-trades{gap:5px!important}
  html body .pencil-token span{font-size:.85em!important}
 }
 @media(any-pointer:coarse) and (min-width:650px) and (min-height:500px){body.assessment-reader .a9-read-work{grid-template-rows:minmax(0,1fr) 44px auto!important}}
 `;
 const name=document.getElementById('studentName');if(name){name.setAttribute('enterkeyhint','done');name.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();name.blur()}})}
 return{inject(html){return html.replace('</head>','<style id="mlDeviceControls">'+engineCSS+'</style></head>').replace('</body>','<script>('+keyboardFocus.toString()+')();('+touchTargets.toString()+')();</'+'script></body>')}};
})();
