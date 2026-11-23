/* Explain shared letter tabs wherever a question has several answer parts. */
(()=>{'use strict';
 const css=String.raw`
 .ml-letter-parts{flex-wrap:wrap!important;row-gap:6px!important;min-height:0!important}
 .ml-letter-parts>.ml-letter-part-help{grid-column:1/-1;flex:0 0 100%;box-sizing:border-box;width:100%;min-width:0;margin:0!important;padding:0!important;border:0!important;background:transparent!important;color:#254e6b!important;font:400 clamp(14px,1.05vw,18px)/1.3 Andika,sans-serif!important;text-align:left!important;white-space:normal!important;overflow-wrap:break-word}
 html body #tools:has(>.core-tools):has(>.engaging-answer-tabs.ml-letter-parts){grid-template-rows:auto minmax(0,1fr)!important}
 @media screen and (max-height:500px){
  .ml-letter-parts{row-gap:3px!important}
  .ml-letter-parts>.ml-letter-part-help{line-height:1.15!important}
  html body.engaging-page #tools:has(>.ml-letter-parts) .field{gap:2px!important;padding:4px!important}
  html body.engaging-page #tools:has(>.ml-letter-parts) .field>span{font-size:15px!important;line-height:1.1!important}
  html body.engaging-page #tools:has(>.ml-letter-parts) .field-choices button{font-size:14px!important;line-height:1.1!important;padding:3px!important;min-height:44px!important}
  html body.engaging-page #tools:has(>.ml-letter-parts) .nov1-help{font-size:12px!important;line-height:1.1!important;margin:0!important}
 }
 @media print{.ml-letter-part-help{display:none!important}}
 `;
 function install(){
  if(window.ML_LETTER_PART_INSTRUCTIONS)return;
  let queued=false,serial=0;
  const letterLabel=/^(?:Question\s+)?([A-Z])(?:\s*[·:—–].*|\s*[✓↻])?$/;
  const message='Tap a question button to show that part. Complete all parts, then press Check my work.';
  function update(){
   queued=false;
   const parents=new Set([...document.querySelectorAll('[data-engaging-field],[data-strategy-part],[data-local-field],[data-machine-view],[data-word-view],[data-skill-view]')].map(b=>b.parentElement));
   for(const nav of document.querySelectorAll('nav[aria-label*="part" i],nav[aria-label*="answer" i],.a13-field-tabs,.a13-word-tabs,.a13-machine-tabs'))parents.add(nav);
   for(const nav of parents){
    const buttons=[...nav.querySelectorAll(':scope>button')];
    if(buttons.length<2||!buttons.every(b=>letterLabel.test(b.textContent.trim())))continue;
    for(const button of buttons){
     const label=button.textContent.trim();
     if(!label.startsWith('Question '))button.prepend('Question ');
     const name=button.getAttribute('aria-label');
     if(name&&/^(?:Part\s+)?[A-Z]$/i.test(name))button.setAttribute('aria-label','Question '+letterLabel.exec(label)[1]);
    }
    nav.classList.add('ml-letter-parts');
    let help=nav.querySelector(':scope>.ml-letter-part-help');
    if(!help){help=document.createElement('p');help.className='ml-letter-part-help';help.id='ml-letter-part-help-'+(++serial);help.textContent=message;nav.append(help);}
    const described=new Set((nav.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));described.add(help.id);
    const value=[...described].join(' ');if(nav.getAttribute('aria-describedby')!==value)nav.setAttribute('aria-describedby',value);
   }
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.ML_LETTER_PART_INSTRUCTIONS={refresh:schedule};update();
 }
 function wrap(html){
  if(html.includes('data-ml-letter-part-instructions'))return html;
  return html.replace(/<\/head>/i,'<style data-ml-letter-part-instructions>'+css+'</style><script data-ml-letter-part-instructions>document.addEventListener("DOMContentLoaded",()=>requestAnimationFrame('+install.toString()+'),{once:true});</'+'script></head>');
 }
 for(const[name,html]of Object.entries(ML_ENGINES))ML_ENGINES[name]=wrap(html);
 const prior=window.ML_STORAGE?.wrapEngine;if(prior)ML_STORAGE.wrapEngine=html=>wrap(prior(html));
 window.ML_LETTER_PART_INSTRUCTIONS={wrap};
})();
