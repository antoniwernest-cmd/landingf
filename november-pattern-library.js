/* Original Math Landing activities that follow the supplied JUMP Math pattern lessons. */
(() => {
 'use strict';
 const range=(n,start=0)=>Array.from({length:n},(_,i)=>i+start);
 const row=(label,values,core)=>({label,values,core});
 const ask=(label,answer,options)=>({label,answer,options});
 const blank=(answer,options)=>({answer,options});
 const repeat=(core,n)=>range(n).map(i=>core[i%core.length]);
 const fill=(core,start,n)=>range(n,start).map(i=>blank(core[i%core.length],[...new Set(core)]));
 const rail=(core,n=9,gaps=0,shown=0)=>row('Pattern strip',[...repeat(core,n-gaps),...fill(core,n-gaps,gaps)],shown);
 const coreQ=n=>ask('How many terms are in the shortest core?',n,[2,3,4,5,6]);
 const direction=(answer)=>ask('What changes?',answer,['Shape','Size','Colour','Direction','Shape and colour','Size and colour','Size and direction']);
 const yn=(label,answer)=>ask(label,answer,['Yes','No']);
 const eq='JUMP Math';
 const [C,Q,D,S,T,R]=['@oa','@qb','@dc','@sd','@tc','@rb'];
 const gc='@od', small='@oas', purple='@oc', emerald='@qd', goldArrow='@ra', leftArrow='@ral2';
 const pattern=(title,prompt,rows=[],questions=[],options={})=>({title,prompt,rows,questions,...options});
 const repeatPage=(title,prompt,core,n,gaps=0,questions=[])=>pattern(title,prompt,[rail(core,n,gaps)],questions);
 const sameEnds=(core,n=8)=>repeatPage('Watch the ends of the core','Find the smallest unit that repeats. Do the first and last pieces in that unit match?',core,n,0,
  [coreQ(core.length),yn('Do the ends match?',core.at(0)===core.at(-1)?'Yes':'No')]);
 const reading=(title,prompt,core,cols,length,missing,question)=> {
  const values=[...repeat(core,length-missing),...fill(core,length-missing,missing)];
  return pattern(title,prompt,range(length/cols).map(i=>row('Row '+(i+1),values.slice(i*cols,(i+1)*cols))),question?[question]:[]);
 };
 const predict=(core,position)=>repeatPage('Predict a faraway term','Find the core, then use it to predict the term in position '+position+'.',core,core.length*2,0,
  [coreQ(core.length),ask('Term at position '+position,core[(position-1)%core.length],[...new Set([...core,S,D,T])])]);
 const g2=[
  repeatPage('Find the repeating core','What is the shortest group that repeats on the workshop shelf?', [C,C,D],9,0,[coreQ(3)]),
  pattern('Spot one change','The toymaker turns the arrows to make a pattern.',[rail([goldArrow,leftArrow],8)],[direction('Direction')]),
  repeatPage('Finish the decoration strip','Find the core. Then choose the next three decorations.',[Q,C,T],9,3,[coreQ(3)]),
  pattern('Spot two changes','Compare the decorations in each repeating core.',[rail([C,D,C],9,0,3)],[direction('Shape and colour')]),
  repeatPage('Carry on the size pattern','Large and small pieces make a pattern. Find the core and finish the strip.',[C,small,small],9,3,[coreQ(3)]),
  pattern('Make a colour-and-size pattern','Finish a new copy of the model. Only colour and size should change.',[
   row('Model core',[C,'@ocs','@ocs'],3),row('Build two repeats',fill([C,'@ocs','@ocs'],0,6))],[],{code:'C1.2'}),
  pattern('Compare the ends','Look at the first and last decorations in each highlighted core.',[
   row('Shelf A',[Q,C,Q,Q,C,Q],3),row('Shelf B',[D,S,T,D,S,T],3)],[yn('Do shelf A’s ends match?','Yes'),yn('Do shelf B’s ends match?','No')]),
  repeatPage('Do two neighbours belong to one core?','Two matching pieces may touch when one core ends and the next starts.',[T,Q,Q,T],8,0,[coreQ(4)]),
  sameEnds([D,C,C,D],8),
  pattern('Say the repeating rule','Choose the rule that tells someone how to rebuild the strip.',[rail([C,gc,gc],9)],[
   ask('Colour rule','Gold, green, green, repeat',['Gold, gold, green, repeat','Gold, green, green, repeat','Gold, green, repeat'])]),
  pattern('Describe both rules','Read the first three pieces. Describe what happens to size and colour.',[rail([C,'@obs','@ocs'],9,0,3)],[
   ask('Size rule','Large, small, small',['Small, large, large','Large, small, small','Large, large, small']),
   ask('Colour rule','Gold, teal, pink',['Gold, pink, teal','Gold, teal, pink','Teal, gold, pink'])]),
  pattern('Read the long rule','Look at the shape and size in the order they repeat.',[rail([D,'@qbs','@dcs',Q],8)],[
   ask('Shape order','Diamond, square, diamond, square',['Square, square, diamond, diamond','Diamond, square, diamond, square','Diamond, diamond, square, square']),
   ask('Size order','Large, small, small, large',['Large, large, small, small','Large, small, large, small','Large, small, small, large'])]),
  pattern('Turn pictures into letters','Let A stand for the first kind of piece. Use B for the second and C for the third.',[
   rail([D,Q,Q,T],8),row('Letter code',fill(['A','B','B','C'],0,8))],[],{code:'C1.2'}),
  pattern('Show the same pattern two ways','Circle means 4, square means 6, and star means 8. Finish the picture and number strips.',[
   row('Pictures',[C,Q,S,Q,...fill([C,Q,S,Q],0,4)]),row('Numbers',[4,6,8,6,...fill([4,6,8,6],0,4)])],[],{code:'C1.2'}),
  reading('Read across the rows','Read left to right, then move down to the next row. Count each full core.',[S,C,D],5,15,0,ask('How many full cores are shown?',5,[3,4,5,6])),
  reading('Continue onto the next row','Keep the pattern going from the end of the first row into the next.',[6,9,4],5,10,4,coreQ(3)),
  reading('Explain a grid pattern','Read the picture grid like a book. Choose the shortest rule that describes all the pieces.',[T,D,D],5,15,0,
   ask('Repeating rule','Triangle, diamond, diamond',['Diamond, triangle','Triangle, diamond, diamond','Triangle, triangle, diamond'])),
  predict([C,Q,D,S],13),
  predict([C,C,T,D,S],19),
  repeatPage('Repair the bead garland','The workshop garland has three empty places. Continue its repeating bead design.',[purple,Q,S,Q],12,3,[coreQ(4)]),
  pattern('Crack the mail pattern','The Canadian postal-code format alternates a letter and a digit. Read the character pattern and choose the label with that format.',[
   row('Sample label',['K','7','L','4','B','2'])],[
   ask('Repeating character core','Letter, digit',['Digit, letter','Letter, digit','Letter, letter']),
   ask('Which uses that format?','P4N 3K6',['H64 N2T','P4N 3K6','4M2 6E5'])])
 ];
 const path=(a,b)=>row('Number path',range(Math.abs(b-a)+1).map(i=>a+i*Math.sign(b-a)));
 const count=(title,prompt,a,b,questions)=>pattern(title,prompt,[path(a,b)],questions,
  {code:'B2.3',directions:'Follow the beacons on the number path, then choose your answer.'});
 const linear=(title,prompt,start,step,gaps=2,shown=3,questions=[])=>pattern(title,prompt,[row('Number sequence',range(gaps+shown).map(i=>
  i<shown?start+i*step:blank(start+i*step)))],questions);
 const ruleQ=(start,step)=>ask('Which rule matches?',(step>0?'Add ':'Subtract ')+Math.abs(step),[
  'Add '+Math.abs(step),'Add '+(Math.abs(step)+1),'Subtract '+Math.abs(step),'Subtract '+(Math.abs(step)+1)]);
 const ttable=(head,values)=>({head,values:values.map((value,i)=>[i+1,value])});
 const A=[10,11,12],B=[7,10,11,12],E=[2,7,10,11,12];
 const L1=[0],L2=[0,1,5],L3=[0,1,2,5,10],L4=[0,1,2,3,5,10,15];
 const P1=[7],P2=[2,6,7,8,12],P3=[2,5,6,7,8,9,11,12,13];
 const g3=[
  count('Count the hops','A rover moves forward from beacon 26 to beacon 32. Count the spaces between them.',26,32,[ask('Number of hops',6)]),
  count('Fill in the missing jump','Start at 46 and count up to 54. How much was added?',46,54,[ask('46 + □ = 54',8)]),
  count('Compare two beacons','Use the path to find how much farther the last beacon is.',117,124,[ask('124 is how much more than 117?',7)]),
  count('Move forward by five','The rover is parked at 68. It drives forward 5 spaces.',68,75,[ask('Where does it stop?',73)]),
  linear('Extend an increasing sequence','Find how much is added each time. Then fill the empty spaces.',36,4,3,3,[ruleQ(36,4)]),
  linear('Track the rover’s distance','The rover travels the same extra distance every hour. Forecast its distance at the next stops.',18,7,3,3,[ruleQ(18,7)]),
  count('Count back on the path','The astronaut backs up from 32 to 25. Count each backward jump of one.',32,25,[ask('Number of backward jumps',7)]),
  count('Find a gap across a hundred','A rover goes backward from 105 to 98. How many spaces does it travel?',105,98,[ask('Number of spaces',7)]),
  count('Find the number in the subtraction','The shuttle dropped from position 245 to position 239. How many spaces did it move?',245,239,[ask('245 − □ = 239',6)]),
  count('Take six steps back','Start at beacon 102 and go back six spaces. Which beacon do you land on?',102,94,[ask('Landing beacon',96)]),
  linear('Extend a decreasing sequence','Find the same change from one term to the next. Complete the sequence.',96,-7,3,3,[ruleQ(96,-7)]),
  pattern('Follow two opposite rules','One sequence adds. The other subtracts. Fill the landing spaces.',[
   row('Add 8 each time',[42,50,blank(58),blank(66)]),row('Subtract 6 each time',[93,87,blank(81),blank(75)])]),
  linear('Work out the gap first','Find the gap between neighbouring numbers. Use it to extend the pattern.',642,-12,2,3,[ruleQ(642,-12)]),
  pattern('Identify the changing attribute','Name the one attribute that changes in each line of space badges.',[
   rail([C,small],8),row('Badge shelf B',repeat([Q,emerald],8))],[
   ask('First shelf','Size',['Size','Colour','Shape']),ask('Shelf B','Colour',['Size','Colour','Shape'])],{code:'C1.1'}),
  pattern('Track two changes','Compare the size, colour and shape of these cargo badges.',[rail([Q,'@qcs'],8)],[
   ask('Which attributes change?','Size and colour',['Shape and size','Shape and colour','Size and colour'])],{code:'C1.1'}),
  pattern('Track size and direction','Describe how the shuttle signs change. Leave the colour and shape the same.',[rail([R,'@rbs2',R],9)],[
   ask('Which attributes change?','Size and direction',['Colour and size','Shape and direction','Size and direction'])],{code:'C1.1'}),
  repeatPage('Find a core in space badges','Find the smallest set of badges that repeats.',[S,Q,Q,D],8,0,[coreQ(4)]),
  repeatPage('Find a core in numbers','The numbers are labels on a repeating string of satellites. Find its shortest core.',[4,7,4,9,9],10,0,[coreQ(5)]),
  repeatPage('Extend the satellite signal','Continue the repeating signal. Watch the position of the two diamonds.',[D,T,D,S,C],10,3,[coreQ(5)]),
  pattern('Repair a pattern mistake','The highlighted badges give the core. The second run has one incorrect badge.',[
   row('Cargo badges',[Q,T,T,Q,D,T,Q,T,T],3)],[
   ask('Which position is wrong?',5,[4,5,6,7]),ask('Which badge should go there?',T,[Q,T,D,S])]),
  predict([S,C,C,D,D],27),
  pattern('Add a square to a panel','A gold tile marks the new square. Where was it added?',[row('Figure 1 → Figure 2',[A,B])],[
   ask('Where does the new square go?', 'Above the right tile',['Below the middle tile','Above the right tile','Left of the first tile'])],{newSquares:[[],[7]]}),
  pattern('Build the next staircase','One square is added above the right column each time. Rebuild Figure 3 in the grid.',[row('Figures 1 and 2',[A,B])],[],
   {build:E,code:'C1.2',newSquares:[[],[7]]}),
  pattern('Grow a double arm','The right arm and lower arm each gain a tile. Rebuild Figure 4 in the grid.',[row('Figures 1, 2 and 3',[L1,L2,L3])],[],
   {build:L4,code:'C1.2'}),
  linear('Follow the given rule','Start at 131 and add 15 each time.',131,15,3,2),
  linear('Keep subtracting the same amount','A capsule uses 18 units of power per stage. Complete the power sequence.',836,-18,3,2),
  linear('Identify the pattern rule','Two crew members suggest different rules. Find the rule that fits every shown term.',242,13,2,4,[ruleQ(242,13)]),
  pattern('Connect figures to a T-table','Compare the square panels and record the number of tiles in the third figure.',[
   row('Panels 1, 2 and 3',[P1,P2,P3])],[ruleQ(1,4)],{table:ttable(['Figure','Squares'],[1,5,blank(9)])}),
  pattern('Predict with a T-table','A solar wing starts with 7 tiles and gains the same number each time. Complete the table and predict Figure 6.',[],[
   ask('Tiles in Figure 6',32)],{table:ttable(['Figure','Tiles'],[7,12,17,blank(22),blank(27)])}),
  pattern('Plan supplies with a T-table','Each launch pack has 6 batteries. How many are needed for five packs?',[],[
   ask('How many batteries for five packs?',30)],{table:ttable(['Packs','Batteries'],[6,12,blank(18),blank(24)])}),
  pattern('Read and extend a figure table','A stair pattern grows by two squares each step. Use the table to predict future stages.',[],[
   ask('How many squares in Figure 8?',18), ask('Will Figure 8 be even or odd?','Even',['Even','Odd'])],
   {table:ttable(['Figure','Squares'],[4,6,8,blank(10)])}),
  pattern('Solve the connected-square puzzle','The crew builds square windows in a row. Neighbouring windows share one side.',[
   row('Windows that share a side',['▢','▢▢','▢▢▢'])],[
   ask('Rods for 5 connected windows',16),yn('Will 18 rods make 6 windows?','No')],
   {table:ttable(['Windows','Rods'],[4,7,10,blank(13)])})
 ];
 // Spread each grade’s sequence across both weeks while keeping existing openers and page IDs.
 const schoolDays=[16,17,18,19,20,23,24,25,26,27];
 const schedules={2:[2,2,2,2,2,2,2,2,2,3],3:[3,3,3,3,3,3,3,4,3,4]};
 function build(grade,tasks,sourceStart){
  let i=0;
  return schoolDays.flatMap((day,d)=>range(schedules[grade][d]).map(()=>{
   const task=tasks[i],page=sourceStart+i++;
   const p=String(page).padStart(3,'0');
   return {
    kind:'pattern-lab',layout:'reference-activity',day,grade,sourcePage:page,idSuffix:'-jump-pattern-'+p,
    pageCode:'PA'+grade+'-'+(9200+i),title:task.title,prompt:task.prompt,rows:task.rows,questions:task.questions,
    directions:task.build?'Tap grid squares to build the figure. Tap again to remove a square.':'Study the model, then fill the spaces or choose your answers.',
    image:grade===2?'pattern-workshop.jpg':'orbital-patterns.jpg',
    alt:grade===2?'A rabbit toymaker arranges colourful wooden decorations.':'A fox astronaut explores a colourful observatory.',
    ...task,code:task.code||'C1.3',reference:eq+' '+grade+'.1, p. '+page,
    expectation:task.code==='B2.3'?'Use counting forward or backward on a number path to reason about addition and subtraction.':
     task.code==='C1.1'?'Identify patterns and describe the attributes that change.':
     task.code==='C1.2'?'Create or translate patterns with tools and visual representations.':
     'Use pattern rules to extend patterns and find missing elements.'
   };
  }));
 }
 window.ML_NOVEMBER_PATTERN_LIBRARY={2:build(2,g2,121),3:build(3,g3,1)};
})();
