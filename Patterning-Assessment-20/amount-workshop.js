/* Countable homework blocks and reusable amount tiles. */
window.ML_AMOUNT_TOOLS=(()=>{
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sum=pieces=>pieces.reduce((a,b)=>a+b,0);
 function bank(q){return q.model.bank.filter(n=>n<=Math.max(q.model.fixed,q.model.goal));}
 function split(q,value){if(!Number.isInteger(value)||value<0)return [];if(value===0)return [0];const result=[];for(const n of bank(q).filter(n=>n>0)){while(value>=n){result.push(n);value-=n;}}return result;}
 function pieces(q,values,work){return Array.isArray(work)&&work.every(v=>bank(q).includes(v))?work:split(q,values?.[q.model.answerField]);}
 function blocks(value,tone='teal'){
  if(!Number.isFinite(value))return '<svg class="quantity-blocks" viewBox="0 0 320 106" aria-hidden="true"></svg>';
  if(value<0)return '<div class="negative-amount">'+value+'</div>';
  const h=Math.floor(value/100),t=Math.floor(value%100/10),o=value%10,color=tone==='purple'?'#a58bd0':'#4ba9a0',edge=tone==='purple'?'#6f5799':'#327a78';let drawing='';
  const square=(x,y,w,lines=false)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+w+'" rx="1" fill="'+color+'" stroke="'+edge+'"/>'+(lines?Array.from({length:9},(_,i)=>'<path d="M'+(x+w*(i+1)/10)+' '+y+'v'+w+'M'+x+' '+(y+w*(i+1)/10)+'h'+w+'" stroke="#fffef9" stroke-width=".5"/>').join(''):'');
  for(let i=0;i<h;i++)drawing+=square(4+i%5*29,17+Math.floor(i/5)*31,27,true);
  for(let i=0;i<t;i++){const x=156+i*9;drawing+='<rect x="'+x+'" y="19" width="7" height="61" rx="1" fill="'+color+'" stroke="'+edge+'"/>'+Array.from({length:9},(_,j)=>'<path d="M'+x+' '+(19+(j+1)*6.1)+'h7" stroke="#fffef9" stroke-width=".8"/>').join('');}
  for(let i=0;i<o;i++)drawing+=square(249+i%5*13,32+Math.floor(i/5)*16,10);
  if(value===0)drawing='<text x="160" y="62" text-anchor="middle" font-size="37" fill="'+edge+'">0</text>';
  const labels=[h?'Hundreds':'',t?'Tens':'',o?'Ones':''];
  return '<svg class="quantity-blocks" viewBox="0 0 320 106" role="img" aria-label="'+value+': '+h+' hundreds, '+t+' tens, '+o+' ones">'+drawing+labels.map((text,i)=>'<text x="'+[73,195,278][i]+'" y="100" text-anchor="middle" font-size="11" fill="#34585e">'+text+'</text>').join('')+'</svg>';
 }
 function reference(q){return '<div class="amount-references">'+q.model.reference.map((v,i)=>'<section class="quantity-card"><header><strong>'+escape(v.label)+'</strong><output>'+escape(v.amount)+'</output></header>'+blocks(v.amount,i?'purple':'teal')+'</section>').join('')+'</div>';}
 function controls(q,values,work,readOnly=false){
  const m=q.model,placed=pieces(q,values,work),entered=placed.length>0,total=sum(placed),now=entered?(m.mode==='subtract'?m.fixed-total:m.fixed+total):m.fixed;
  return '<div class="amount-tools"><div class="amount-supply" style="--amount-count:'+bank(q).length+'" data-amount-bank role="group" aria-label="Amount supply. Drag placed amounts back here to return them.">'+bank(q).map(n=>'<button type="button" data-amount="'+n+'" aria-pressed="false" aria-label="'+n+' amount tile" '+(readOnly?'disabled':'')+'><strong>'+n+'</strong><span aria-hidden="true">'+(n===0?'Nothing':n>=100?'hundreds':n>=10?'tens':n===1?'one':'ones')+'</span></button>').join('')+'</div><section class="amount-pad" data-amount-pad aria-label="'+escape(m.padLabel)+' landing pad"><header><strong>'+escape(m.padLabel)+'</strong><output>'+(entered?total:'?')+'</output></header><div class="amount-pieces" aria-label="Placed amounts">'+placed.map((n,i)=>'<button type="button" data-amount-piece="'+i+'" aria-label="Placed '+n+'. Tap to return it, or drag it back to the supply." '+(readOnly?'disabled':'')+'>'+n+'<small aria-hidden="true">×</small></button>').join('')+'</div><button type="button" class="amount-target" data-amount-target '+(readOnly?'disabled':'')+'>'+(entered?'Drop another amount here':'Drag amounts here')+'</button></section><section class="amount-result" aria-label="Working block model"><div><strong>'+escape(m.resultLabel)+'</strong><output>'+escape(now)+'</output></div>'+blocks(now,'purple')+'</section><p class="amount-help">Tap a placed amount to return it. A hundred is 10 tens; a ten is 10 ones.</p></div>';
 }
 return {sum,bank,split,pieces,blocks,reference,controls};
})();
