/* Tangible manipulatives: visual depth and drag feedback preserve the existing maths state. */
(() => {
  'use strict';
  function installDepth(){
    if(window.ML_PATTERN_DEPTH)return;
    const NS='http://www.w3.org/2000/svg';let serial=0,pending=false,gesture=null,over=null;
    const rgb=s=>{const v=String(s).match(/[\d.]+/g);return v&&v.length>=3?v.slice(0,3).map(Number):null};
    const shade=(c,f)=>'rgb('+c.map(v=>Math.round(f>1?v+(255-v)*(f-1):v*f)).join(',')+')';
    function paint(){pending=false;
      for(const svg of document.querySelectorAll('.symbol svg,svg.symbol,[data-token]>svg,.tangible-dot-ghost svg,.dot-supply svg')){
        if(svg.dataset.patternDepth||svg.matches('.block-svg')||svg.querySelector('[data-ml-block-face]'))continue;
        svg.dataset.patternDepth='true';const defs=document.createElementNS(NS,'defs');svg.prepend(defs);
        for(const face of [...svg.querySelectorAll('circle,ellipse,rect,path,polygon')]){
          if(face.closest('defs')||face.dataset.patternDepthFace||face.getAttribute('fill')==='none')continue;
          const fill=getComputedStyle(face).fill,c=rgb(fill);if(!c||fill==='none'||fill==='transparent')continue;
          const id='pattern-material-'+(++serial),round=face.matches('circle,ellipse'),gradient=document.createElementNS(NS,round?'radialGradient':'linearGradient');gradient.id=id;
          if(round){gradient.setAttribute('cx','32%');gradient.setAttribute('cy','25%');gradient.setAttribute('r','78%');}
          else{gradient.setAttribute('x1','0%');gradient.setAttribute('y1','0%');gradient.setAttribute('x2','75%');gradient.setAttribute('y2','100%');}
          for(const [offset,color]of [[0,shade(c,1.52)],[.45,shade(c,1.04)],[1,shade(c,.68)]]){const stop=document.createElementNS(NS,'stop');stop.setAttribute('offset',String(offset));stop.setAttribute('stop-color',color);gradient.append(stop);}defs.append(gradient);
          if(!round){const side=face.cloneNode(true);side.removeAttribute('id');side.setAttribute('fill',shade(c,.56));side.style.fill=shade(c,.56);side.setAttribute('transform',(face.getAttribute('transform')||'')+' translate(1.4 2.2)');side.setAttribute('data-pattern-depth-face','side');side.setAttribute('pointer-events','none');face.before(side);}
          face.setAttribute('data-pattern-depth-face','front');face.style.fill='url(#'+id+')';face.style.strokeLinejoin='round';
        }
      }
    }
    function schedule(){if(!pending){pending=true;requestAnimationFrame(paint)}}
    const sources='[data-token],[data-slot],[data-sort-item],[data-growth-piece],[data-unit-token],[data-piece],[data-dot-supply],[data-dot][aria-pressed=true],.block-piece,.bank-block,.draggable,[draggable=true]';
    const targets='[data-slot],[data-dot],[data-sort-bin],[data-unit-answer-pad],[data-block-drop],[data-frame-slot],[data-answer-drop],[data-sort-canvas]';
    document.addEventListener('pointerdown',e=>{const node=e.target.closest(sources);if(!node||e.button!==0||e.target.matches('input,textarea,select'))return;gesture={node,x:e.clientX,y:e.clientY,moved:false};},true);
    document.addEventListener('pointermove',e=>{if(!gesture)return;if(!gesture.moved&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>6){gesture.moved=true;gesture.node.classList.add('tangible-source');document.body.classList.add('tangible-dragging');}if(!gesture.moved)return;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest(targets);if(target!==over){over?.removeAttribute('data-tangible-over');over=target;over?.setAttribute('data-tangible-over','true');}},true);
    function finish(){if(!gesture)return;const target=over,wasMoved=gesture.moved;gesture.node.classList.remove('tangible-source');document.body.classList.remove('tangible-dragging');over?.removeAttribute('data-tangible-over');over=null;gesture=null;if(wasMoved&&target)requestAnimationFrame(()=>{const identity=[...target.attributes].find(a=>['data-slot','data-dot','data-sort-bin','data-unit-answer-pad','data-block-drop','data-frame-slot','data-answer-drop'].includes(a.name)),current=target.isConnected?target:identity?document.querySelector('['+identity.name+'="'+CSS.escape(identity.value)+'"]'):null;if(!current)return;current.classList.add('tangible-settle');setTimeout(()=>current.classList.remove('tangible-settle'),200);});}
    document.addEventListener('pointerup',finish);document.addEventListener('pointercancel',finish);
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});paint();window.ML_PATTERN_DEPTH={refresh:paint,version:1};
  }
  // Installed inside the existing pattern engine closure so moving a counter is one saved action.
  function installDotDrag(){
    let dotDrag=null;
    function dotSupply(){
      if(t.type!=='dots')return;
      const boards=[...document.querySelectorAll('.dot-board,.play-block-board')];
      boards.forEach((board,i)=>{const panel=board.parentElement;if(panel.querySelector('[data-dot-supply]'))return;const b=document.createElement('button');b.type='button';b.className='dot-supply';b.dataset.dotSupply=i;b.setAttribute('aria-label',t.blockTarget?'Drag a cube to the model':'Drag a counter to the model');b.innerHTML=t.blockTarget?'<svg class="block-svg" viewBox="0 0 34 34" aria-hidden="true"><rect x="5" y="9" width="22" height="22" fill="#78b0bc" stroke="#35586b"/></svg>':'<svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="18" fill="#71ad95" stroke="#39735f" stroke-width="2"/></svg>';panel.classList.add('has-dot-supply');panel.insertBefore(b,board);});
    }
    document.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary)return;const supply=e.target.closest('[data-dot-supply]'),placed=e.target.closest('[data-dot]');if(!supply&&(!placed||placed.getAttribute('aria-pressed')!=='true'))return;dotDrag={id:e.pointerId,x:e.clientX,y:e.clientY,source:supply||placed,from:placed?.dataset.dot?.split(':').map(Number)||null,moved:false};dotDrag.source.setPointerCapture?.(e.pointerId);});
    document.addEventListener('pointermove',e=>{const d=dotDrag;if(!d||d.id!==e.pointerId)return;if(!d.moved&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<6)return;e.preventDefault();if(!d.moved){d.moved=true;d.ghost=document.createElement('div');d.ghost.className='drag-ghost tangible-dot-ghost';d.ghost.innerHTML=d.source.querySelector('svg')?.outerHTML||'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="18" fill="#71ad95" stroke="#39735f" stroke-width="2"/></svg>';d.ghost.querySelectorAll('[data-pattern-depth]').forEach(n=>n.removeAttribute('data-pattern-depth'));document.body.append(d.ghost);}d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';},{passive:false});
    document.addEventListener('pointerup',e=>{const d=dotDrag;if(!d||d.id!==e.pointerId)return;dotDrag=null;d.ghost?.remove();if(!d.moved)return;suppress=performance.now()+400;const el=document.elementFromPoint(e.clientX,e.clientY),target=el?.closest('[data-dot]'),bank=el?.closest('[data-dot-supply]');if(!target&&!bank)return;action(()=>{if(d.from){const[i,j]=d.from;s.dots[i]=(s.dots[i]||[]).filter(v=>v!==j);}if(target){const[i,j]=target.dataset.dot.split(':').map(Number);s.dots[i]||=[];if(!s.dots[i].includes(j))s.dots[i].push(j);}});});
    document.addEventListener('pointercancel',()=>{dotDrag?.ghost?.remove();dotDrag=null;});
  }
  const css=`
    .symbol svg,.dot-supply svg{overflow:visible;filter:drop-shadow(1px 3px 2px #213d443b)}
    .play-counter-model i,.figure-dots i,.dots i,.dot-cell[aria-pressed=true]{background:radial-gradient(circle at 29% 24%,#c4ecdc 0%,#7dbba1 33%,#4c8d76 69%,#2e6554 100%)!important;box-shadow:inset 1px 1px 2px #ffffff9c,inset -2px -3px 3px #173d482b,2px 4px 3px #294b4c36}
    [data-token],[data-sort-item],[data-dot-supply],[data-slot]:not(.given),[data-dot][aria-pressed=true]{cursor:grab;touch-action:none}
    [data-token]:active,[data-sort-item]:active,[data-dot-supply]:active{cursor:grabbing}
    .tangible-source{opacity:.42!important}.tangible-dragging,.tangible-dragging *{cursor:grabbing!important}
    .drag-ghost{pointer-events:none!important;transform:translate(-50%,-65%) rotate(-3deg) scale(1.08)!important;filter:drop-shadow(3px 13px 8px #16313f66)!important;z-index:2147483000!important}
    .drag-ghost:has(.symbol){background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;width:76px!important;height:76px!important;min-height:0!important;opacity:1!important;display:grid;place-items:center}.drag-ghost .symbol,.drag-ghost .symbol svg{width:66px!important;height:66px!important;max-width:none!important;max-height:none!important}
    .drag-ghost .symbol svg{filter:none}.tangible-dot-ghost{position:fixed;width:64px;height:64px;background:transparent!important;border:0!important;box-shadow:none!important;padding:4px!important}.tangible-dot-ghost>svg{width:100%;height:100%;overflow:visible}
    [data-tangible-over=true]{outline:3px solid #aa79c7!important;outline-offset:-2px;background-color:#f3e9fa!important}
    .tangible-settle{animation:tangible-settle .18s ease-out}@keyframes tangible-settle{0%{transform:translateY(-3px)}65%{transform:translateY(1px)}100%{transform:translateY(0)}}
    .has-dot-supply{position:relative}.dot-supply{position:absolute!important;right:7px;top:5px;width:39px!important;height:39px!important;min-height:39px!important;min-width:39px!important;padding:2px!important;background:#fafcf8!important;border:1px solid #acc0b9!important;box-shadow:0 3px 0 #9bb0a7!important;border-radius:9px!important;z-index:1}.dot-supply svg{width:100%;height:100%}.dot-panel.has-dot-supply>h3{padding-right:40px}.play-build.has-dot-supply>h2{padding-right:34px;min-height:38px}.play-build.has-dot-supply .dot-supply{top:7px;right:5px;width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important}
    @media(prefers-reduced-motion:reduce){.tangible-settle{animation:none}.drag-ghost{transform:translate(-50%,-50%)!important}}
    @media print{.dot-supply{display:none!important}.symbol svg{filter:drop-shadow(1px 2px 1px #213d4430)}.play-counter-model i,.dot-cell[aria-pressed=true]{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  `;
  const privateCode=installDotDrag.toString().slice(installDotDrag.toString().indexOf('{')+1,-1);
  for(const [name,source]of Object.entries(ML_ENGINES)){
    if(typeof source!=='string')continue;let html=source;
    if(['patterning-pdf','pattern-resources','pattern-play','term-tables','rule-detectives'].includes(name)&&html.includes('window.ML_ENGINE={')&&html.includes('function render(){')){
      html=html.replace('window.ML_ENGINE={',privateCode+'\nwindow.ML_ENGINE={');
      html=html.replace("$('status').textContent=a.message;","$('status').textContent=a.message;dotSupply();");
    }
    html=html.replace('</head>','<style id="patternObjectDepth">'+css+'</style><script>if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",'+installDepth.toString()+',{once:true});else('+installDepth.toString()+')();<\/script></head>');
    ML_ENGINES[name]=html;
  }
  window.ML_PATTERN_DEPTH_PROJECT={version:1};
})();
