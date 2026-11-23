/* Four days of Canadian money, with two distinct activities per path and day. */
(() => {
 'use strict';
 const expectations={
  1:'Identify Canadian coins up to 50¢ and coins and bills up to $50, and compare their values.',
  2:'Represent the same amount in different ways, up to 200¢ in coins and $200 in dollar coins and bills.',
  3:'Estimate and calculate change for simple cash transactions using whole dollars or amounts below one dollar.'
 };
 function tasksFor(grade,day) {
  if(grade===1) {
   const sets=[['c25','c5','c50','c10'],['b10','d2','b5','d1'],['d1','c25','b5','c10'],['b20','b5','b50','b10']];
   const matches={mode:'match',title:'Meet Canadian money',prompt:'Match each picture to its value.',pieces:sets[day],
    directions:'Drag a money picture onto its value. You can also tap a picture, then a pad.'};
   const comparisons=[
    [['c10','c5'],['c25','c50'],['d2','d1']],
    [['d2','b5'],['b20','b10'],['b20','b50']]
   ];
   const other=day<2?{mode:'compare',title:'Which is worth more?',prompt:'Choose the money with the greater value in each pair.',pairs:comparisons[day],directions:'Tap one money picture in each pair. Compare the values, not the sizes.'}
    :{mode:'order',title:'Money in order',prompt:'Put the money in order from least value to greatest value.',pieces:day===2?['c25','c5','c50','c10']:['b10','d1','b5','d2'],directions:'Drag the money onto the four pads. Start with the least value on the left.'};
   return [matches,other];
  }
  if(grade===2) {
   const cents=[50,75,125,200][day],dollars=[10,20,50,200][day];
   return [
    {mode:'equivalent',unit:'cents',target:cents,denominations:day<2?['c5','c10','c25']:day===2?['c5','c10','c25','d1']:['c5','c10','c25','d1','d2'],title:'Two ways with coins'},
    {mode:'equivalent',unit:'dollars',target:dollars*100,denominations:day===0?['d1','d2','b5']:day===1?['d1','d2','b5','b10']:day===2?['d1','d2','b5','b10','b20']:['d1','d2','b5','b10','b20','b50','b100'],title:'Two ways with dollars'}
   ].map(t=>({...t,prompt:'Make '+(t.unit==='cents'?t.target+'¢':'$'+t.target/100)+' in two different ways.',directions:'Drag money into each mat. Or choose a mat, then tap money to add it. Tap a placed piece to return it. Use up to 12 pieces per mat.'}));
  }
  const cents=[{cost:45,paid:50,item:'pencil',name:'Pencil'},{cost:35,paid:100,item:'eraser',name:'Eraser'},{cost:65,paid:100,item:'sticker',name:'Star sticker'},{cost:80,paid:100,item:'ribbon',name:'Ribbon'}][day];
  const dollars=[{cost:700,paid:1000,item:'book',name:'Sketchbook'},{cost:1400,paid:2000,item:'puzzle',name:'Puzzle'},{cost:2300,paid:5000,item:'paint',name:'Art kit'},{cost:3600,paid:5000,item:'telescope',name:'Telescope'}][day];
  return [{...cents,unit:'cents',denominations:['c5','c10','c25']},{...dollars,unit:'dollars',denominations:['d1','d2','b5','b10','b20']}].map(t=>({...t,mode:'change',title:'Make the change',
   prompt:'Estimate the change. Then build the exact change for the customer.',directions:'Choose an estimate. Drag money to the change mat, or tap money to add it. Tap a placed piece to return it. Use up to 12 pieces.'}));
 }
 window.ML_NOVEMBER_MONEY_CONTENT={tasksFor,expectations};
})();
