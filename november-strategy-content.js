/* Original interactive practice sequenced from the supplied Grade 3 unit. */
(() => {
 'use strict';
 const days = [
  {focus:'Place value and number relationships', pdf:'4, 11, 51–52', list:['compareTotal','moveGroups','moveGroups','blocks','parts','compareGap','trade','on','back','placeWhy']},
  {focus:'Estimate and add by place value', pdf:'12–17', list:['estimateAdd','estimateAdd','estimateAdd','frontAdd','frontAdd','estimateAdd','frontAdd','frontAdd','estimateAdd','frontWhy']},
  {focus:'Doubles and compensation for addition', pdf:'4, 18–20', list:['double','near1','near2','double','near1','near2','compAdd','compAdd','compAdd','compAddWhy']},
  {focus:'Add on an open number line', pdf:'21–26, 44–48', list:['jumpAdd','jumpAdd','jumpAdd','frontAdd','jumpAdd','compAdd','estimateAdd','jumpAdd','lineWhy','twoAdd']},
  {focus:'Estimate and subtract in parts', pdf:'28–33', list:['estimateSub','estimateSub','estimateSub','subParts','subParts','estimateSub','subParts','subParts','estimateSub','subPartsWhy']},
  {focus:'Subtract by compensation and jumps', pdf:'34–42', list:['compSub','compSub','compSub','jumpSub','jumpSub','compareGap','jumpSub','compSub','compSubWhy','lineWhy']},
  {focus:'Add with and without regrouping', pdf:'51–53, 55–62, 79–81', list:['addNoTrade','addNoTrade','trade','addTrade','addTrade','addNoTrade','addTrade','addTrade','tradeAddWhy','twoAdd']},
  {focus:'Subtract with and without regrouping', pdf:'52, 54, 63–69, 79–81', list:['subNoTrade','subNoTrade','trade','subTrade','subTrade','subNoTrade','subTrade','subTrade','tradeSubWhy','checkTrade']},
  {focus:'Solve stories with part-whole models', pdf:'70–77, 82–86', list:['storyJoin','storyTake','storyMissing','undoAdd','storyCompare','storyJoin','storyTake','storyMissing','storyCompare','inverseWhy']},
  {focus:'Mixed review and two strategies', pdf:'44–48, 70–73, 87–88', list:['frontAdd','estimateSub','compAdd','compSub','addTrade','subTrade','storyJoin','storyMissing','twoAdd','twoSub']}
 ];
 const field = (label, answer, options = []) => ({label, answer, options});
 const fill = (key) => ({key});
 const eq = (...parts) => parts;
 const choices = (label, right, ...wrong) => field(label, right, wrong);
 function make(grade, day, slot, story, kind = days[day].list[slot], variant = 0) {
  const {name,item,slug} = story;
  const i = (slot * 3 + day + grade + variant) % 10;
  const low = grade === 1, high = grade === 3;
  const task = {title:days[day].focus, layout:'strategy-lesson', code:'B2.3', art:{slug}, fields:{},
   directions:'Use the picture and model. Make your choices, then check your work.'};
  const add = (key, title, answer, options) => { task.fields[key] = field(title,answer,options); return fill(key); };
  const why = (correct, ...wrong) => { task.fields.why = choices('Why does it work?',correct,...wrong); };
  function setup(title,prompt,model,code = 'B2.3') { Object.assign(task,{title,prompt,model,code}); }
  function additionStory(a,b,subtract=false) {
   return name + ' has ' + a + ' ' + item + ' and ' + (subtract ? 'gives away ' : 'gets ') + b + '.';
  }
  function placeParts(n) {
   return [100,10,1].map(unit => Math.floor(n/unit)%10*unit);
  }
  function line(a,b,jumps,subtract,testReason = false) {
   const dir = subtract ? -1 : 1;
   const end = a + dir * b;
   let point = a;
   const steps = jumps || [b];
   const ends = steps.map((n,k) => {
    point += dir*n;
    return k === steps.length-1 ? add('end','Where do you finish?',end,[a,b,a-dir*b]) :
     add('middle'+k,'Landing after jump '+(k+1),point,[a,b,end]);
   });
   if (testReason) why(subtract ? 'Move left (to smaller numbers).' : 'Move right (to larger numbers).',
    subtract ? 'Move right (to larger numbers).' : 'Move left (to smaller numbers).','Stay on the starting number.');
   return {type:'line', subtract, start:a, jumps:steps, ends, unitHops:jumps===null};
  }
  if (['on','back','countWhy','jumpAdd','jumpSub','lineWhy'].includes(kind)) {
   const counting = ['on','back','countWhy'].includes(kind);
   const subtract = kind === 'back' || kind === 'jumpSub' || (kind==='lineWhy' && day===5);
   const a = counting ? (low ? 6+i : high ? 189+43*i : 18+2*i)
    : (low ? (subtract?12:6)+i%5 : high ? 246+41*i : (subtract?28:17)+i);
   const b = counting ? 1+(slot+grade)%4 : low ? 3+slot%4 : high ? 122+3*i : 11+slot%7;
   const first = low ? (subtract ? a-10 : a<10 ? 10-a : 2) : null;
   const jumps = counting ? null : low ? [Math.min(first,b),Math.max(0,b-first)].filter(Boolean) : placeParts(b).filter(Boolean);
   const mode = subtract ? 'back' : 'on';
   setup(counting ? 'Count ' + mode : 'Show the jumps', additionStory(a,b,subtract) + ' ' +
    (counting ? 'Start at ' + a + ' and count ' + mode + ' ' + b + '.' : 'Follow the jumps. Mark where each jump lands.'),
    line(a,b,jumps,subtract,kind.endsWith('Why')));
  } else if (kind.startsWith('estimate')) {
   const subtract = kind==='estimateSub';
   const unit = low?5:high&&slot>=5?100:10;
   const twoDigits = high && slot < 3;
   const a = low ? (subtract?12:6)+i%4 : twoDigits ? 43+3*i : high ? 326+31*i : (subtract?29:17)+i;
   const b = low ? 3+slot%6 : twoDigits ? 14+2*i : high ? 114+9*i : 12+slot%8;
   const roundedA = Math.round(a/unit)*unit, roundedB = Math.round(b/unit)*unit;
   const sign = subtract?'−':'+';
   const estimate = subtract?roundedA-roundedB:roundedA+roundedB;
   const exact = subtract?a-b:a+b;
   const distances = n => {
    const start=Math.max(0,Math.floor(n/unit)-2);
    return Array.from({length:6},(_,j)=>(start+j)*unit);
   };
   const benchmarks = low ? 'Use the nearest multiple of 5. The benchmarks are 0, 5, 10, 15 and 20.' :
    high ? 'Round each number to the nearest '+(unit===100?'hundred':'ten')+'.' : 'Choose a nearby ten for each number.';
   const nearLabel = low || high ? 'Rounded' : 'Nearby ten for the';
   setup('Estimate, then '+(subtract?'subtract':'add'),additionStory(a,b,subtract)+' '+benchmarks,
    {type:low?'benchmarks':'equations',rows:[
     eq(a,'is close to',add('roundedA',nearLabel+' first number',roundedA,distances(a))),
     eq(b,'is close to',add('roundedB',nearLabel+' second number',roundedB,distances(b))),
     eq('Estimate',fill('roundedA'),sign,fill('roundedB'),'=',add('estimate','Estimated result',estimate,[exact,estimate+unit,estimate-unit])),
     eq('Exact',a,sign,b,'=',add('total','Exact result',exact,[estimate,a,b]))]});
   if (low) {
    for (const key of ['roundedA','roundedB']) {
     task.fields[key].options=[0,5,10,15,20];
     task.fields[key].optionLimit=5;
    }
   } else {
    task.directions = 'Choose the closest '+(unit===100?'hundred':'ten')+' to each number. Find the estimate, then the exact '+(subtract?'difference':'sum')+'.';
    why('Nearby numbers are easier to work with and give an idea of the answer.',
     'The estimate always gives the exact answer.','The original numbers have to be multiples of '+unit+'.');
   }
  } else if (kind.startsWith('front')) {
   const a=low?6+i%4:high?218+36*i:13+i, b=low?5+slot%5:high?125+7*i:12+slot%7;
   const split = n => low?[5,n-5]:placeParts(n).slice(high?0:1);
   const partsA=split(a), partsB=split(b);
   const names=low?['Fives','Extras']:high?['Hundreds','Tens','Ones']:['Tens','Ones'];
   const sums=partsA.map((value,k)=>value+partsB[k]);
   const rows=partsA.map((value,k)=>eq(names[k],value,'+',partsB[k],'=',add('part'+k,names[k]+' combined',sums[k],[value,partsB[k]])));
   rows.push(eq(...sums.flatMap((_,k)=>k?['+',fill('part'+k)]:[fill('part0')]),'=',add('total','Exact sum',a+b,[a,b])));
   setup(low?'Add the fives first':'Front-end addition',additionStory(a,b)+' Add '+(low?'the fives, then the extras.':'the largest place first, then combine the sums.'),
    {type:low?'doubles':'equations',amount:5,extra:0,rows});
   if (kind==='frontWhy') why('Each number was split into parts. All the parts are still counted.','The first parts are the whole answer.','Add just the smallest parts.');
  } else if (kind === 'double' || kind.startsWith('near')) {
   const series = low ? [4,6,3,5] : high ? [28,46,57,79] : [7,9,11,16];
   const n = series[Math.floor(slot/3)];
   const extra = kind === 'near1' ? 1 : kind === 'near2' ? 2 : 0;
   const bigger = n+extra;
   const left = extra && [6,7,8].includes(slot) ? bigger : n;
   if (extra === 0) {
    setup('Solve the double', name + ' makes two equal groups of ' + item + '. Each group has ' + n + '. How many altogether?',
     {type:'doubles',amount:n,extra,rows:[eq(n,'+',n,'=',add('sum','Double total',2*n,[n,2*n+1,2*n+2]))]},'B2.3');
   } else {
    const right = left === n ? bigger : n;
    setup('Doubles plus ' + extra, name + ' puts ' + item + ' in two groups: ' + left + ' and ' + right +
     '. Find the smaller number. Drag tiles to split ' + bigger + ' into that number and what is left.',
     {type:'doubles',amount:n,extra,left,right,independent:slot>=6,rows:[
      slot<6 ? eq('Start with the double:',n,'+',n,'=',2*n) : eq('Use the smaller number to make a double.'),
     eq('Smaller number:',add('small','Smaller addend',n,[bigger,extra,2*n])),
      eq(left,'+',right,'=',add('a','First number in the double',n),'+',add('b','Second number in the double',n),'+',add('extra','Amount left over',extra)),
      eq(slot<6?2*n:add('double','Total of the double',2*n,[n,2*bigger,2*n+extra]),'+',fill('extra'),'=',add('sum','New total',2*n+extra,[2*n,2*bigger,bigger]))]});
    task.drag = {keys:['a','b','extra'],numbers:[...new Set([n,bigger,extra,extra===1?2:1,n-1,2*n])].sort((a,b)=>a-b)};
    task.directions = 'Choose the smaller number. Drag tiles to make the double and add what is left. You can also select a tile, then a pad. Find the total.';
   }
  } else if (kind.startsWith('story')) {
   const a=low?6+i%7:high?214+34*i:23+4*i, b=low?2+slot%6:high?128+13*i:12+2*i;
   const whole=a+b;
   const stories={
    storyJoin:[additionStory(a,b)+' How many are there now?','+',a,b,whole,null,[a,b]],
    storyTake:[additionStory(whole,b,true)+' How many are left?','−',whole,b,a,whole,[null,b]],
    storyMissing:[name+' has '+whole+' '+item+' in two bins. One bin has '+a+'. How many are in the other bin?','−',whole,a,b,whole,[a,null]],
    storyCompare:[name+' counts '+whole+' '+item+' on one shelf and '+a+' on another. How many more are on the first shelf?','−',whole,a,b,whole,[a,null]]
   };
   const [prompt,operator,left,right,total,modelWhole,modelParts]=stories[kind];
   setup('Choose the operation',prompt,{type:'parts',whole:modelWhole,parts:modelParts,
    resultPart:kind==='storyTake'?0:1,rows:[eq(left,add('operation','Add or subtract?',operator,['+','−']),right,'=',add('total','Answer to the story',total,[left,right])),
     eq(kind==='storyJoin'?'Whole':'Missing part', '=',fill('total'))]},high?'B2.5':'B2.4');
  } else if (['undoAdd','inverseWhy'].includes(kind)) {
   const a = low ? 4+i%6 : high ? 128+41*i : 14+i*2, b = low ? 2+i%4 : high ? 32+9*i : 5+slot%10;
   const total = a+b;
   const rows=kind==='undoAdd' ? [eq(a,'+',b,'=',total),eq(total,'−',b,'=',add('part','Missing difference',a,[b,total]))] :
    [eq(a,'+',b,'=',add('whole','Whole',total,[a,b])),eq(fill('whole'),'−',a,'=',add('part','Missing part',b,[a,total]))];
   setup('Use the inverse',name + ' sorts ' + item + ' into two groups, ' + a + ' and ' + b + '. Use the same numbers in an addition and a subtraction equation.',
    {type:'parts',whole:kind.startsWith('undo')?total:null,parts:[a,b],rows},low?'B2.1':high?'B2.5':'B2.4');
   if (kind === 'inverseWhy') why('Taking away one part leaves the other part.','Adding and subtracting always give the same answer.','The whole becomes smaller than both parts.');
  } else if (high && day === 0 && kind === 'parts' && variant === 0) {
   add('hundreds','Hundreds in 533',500,[50,300,400,530,600]);
   add('rest','What is left after splitting off the hundreds?',33,[3,30,37,53,63]);
   add('leftTens','Tens in the leftover part of 533',30,[3,10,20,33,40]);
   add('leftOnes','Ones in the leftover part of 533',3,[0,2,5,7,30]);
   add('rightTens','Tens in 37',30,[3,10,20,37,40]);
   add('rightOnes','Ones in 37',7,[0,3,5,9,30]);
   setup('Split the whole',name+' counts 533 '+item+' and finds 37 more. Split off the hundreds. Then split the rest and 37 into tens and ones.',
    {type:'two-level-parts',left:533,right:37,rows:[
     eq(533,'+',37,'=',add('total','Total after adding the parts',570,[560,563,567,573,580]))
    ]},'B2.3');
   task.directions='Choose the hundreds and the part left over. Split that leftover part and 37 into tens and ones. Add the parts to find the total.';
  } else if (['blocks','parts','trade','placeWhy'].includes(kind)) {
   const placeCode=low?'B1.2':'B1.1';
   const initial = low ? 11+2*i : high ? 218+63*i : 23+7*i;
   const n = kind==='trade' && initial%100<10 ? initial+20 : initial;
   const [h,t,o] = [Math.floor(n/100),Math.floor(n/10)%10,n%10];
   const placeFields = [];
   if (high) placeFields.push(add('hundreds','Hundreds',h,[t,o]));
   placeFields.push(add('tens','Tens',t,[h,o]),add('ones','Ones',o,[h,t]));
   if (kind === 'parts') {
    const main = n-o;
    task.fields = {};
    setup('Split the whole',name + ' counts ' + n + ' ' + item + '. Split the number into ' + (high ? 'hundreds, tens and ones.' : 'tens and ones.'),
     {type:'parts',whole:n,parts:high?[null,null,null]:[null,null],
      rows:[high ? eq(n,'=',add('h','Value of the hundreds',h*100),'+',add('t','Value of the tens',t*10),'+',add('o','Value of the ones',o))
       : eq(n,'=',add('t','Value of the tens',main),'+',add('o','Value of the ones',o))]},placeCode);
   } else if (kind === 'trade') {
    task.fields = {};
    const tradeHundred = high && slot >= 5;
    setup(tradeHundred?'Trade a hundred':'Trade a ten',name + ' has ' + n + ' ' + item + '. Show the same amount after trading one ' +
     (tradeHundred?'hundred for ten tens.':'ten for ten ones.'),{type:'blocks',values:[h,t,o],trade:tradeHundred?'hundred':'ten',
      tradeFields:tradeHundred?['h','t']:['t','o'],
      rows:[tradeHundred ? eq(add('h','Hundreds after trade',h-1,[h,h+1]),'hundreds +',add('t','Tens after trade',t+10,[t,t+1]),'tens +',o,'ones')
       : eq(add('t','Tens after trade',t-1,[t,t+1]),'tens +',add('o','Ones after trade',o+10,[o,o+1]),'ones')]},placeCode);
   } else {
    setup('Read the base-ten blocks',name + ' shows a number of ' + item + ' with base-ten blocks. Count the blocks in each place.',
     {type:'blocks',values:[h,t,o],rows:[eq(...placeFields.flatMap((p,k)=>[p,high?['hundreds','tens','ones'][k]:['tens','ones'][k]]))]},placeCode);
    if (kind === 'placeWhy') why('A ten rod stands for 10 ones.','A ten rod stands for one one.','A ten rod always stands for 100 ones.');
   }
  } else if (kind.startsWith('subParts') || kind.startsWith('comp')) {
   const subtract = !kind.startsWith('compAdd');
   const comp = kind.startsWith('comp');
   const unit = low?5:high && slot%3===0?100:10;
   const b = comp ? (high?(unit===100?200:130):low?5:10+slot%2*10)-(1+i%2)
    : high?126+7*i:low?6+slot%3:13+i%5;
   const a = low?(subtract?12:6)+i%5:high?246+41*i:subtract?31+i:16+i;
   const opTotal = subtract?a-b:a+b;
   if (comp) {
    const friendly=Math.ceil(b/unit)*unit, adjustment=friendly-b, sign=subtract?'−':'+';
    const adjustedA=subtract?a+adjustment:a-adjustment;
    const rows = [
     eq(b,'+',add('shift','Amount to make a friendly number',adjustment,[b,unit]),'=',add('friendly','Friendly number',friendly,[b,friendly+unit])),
     eq(a,subtract?'+':'−',fill('shift'),'=',add('other','Adjusted first number',adjustedA,[a,subtract?a-adjustment:a+adjustment])),
     eq(fill('other'),sign,fill('friendly'),'=',add('total','Exact result',opTotal,[a,b]))];
    setup('Compensate to ' + (subtract?'subtract':'add'),additionStory(a,b,subtract) +
     ' Move '+b+' up to a friendly number. '+(subtract?'Add the same amount to the first number.':'Take the same amount from the first number.'),
     {type:'equations',rows});
    if (kind.endsWith('Why')) why(subtract?'Moving both numbers equally keeps the gap the same.':'Moving the same amount between addends keeps the total the same.',
     'Change only the friendly number.','Round both numbers to the nearest ten.');
   } else {
    const amounts=low?[Math.min(a-10,b-1),b-Math.min(a-10,b-1)]:placeParts(b).slice(high?0:1);
    const parts=amounts.map((value,k)=>add('part'+k,'Size of part '+(k+1),value,[b,amounts[(k+1)%amounts.length]]));
    const rows=[eq(b,'=',...parts.flatMap((p,k)=>k?['+',p]:[p]))];
    let remaining=a;
    parts.forEach((part,k)=>{
     remaining-=amounts[k];
     const last=k===parts.length-1;
     rows.push(eq(k?fill('step'+(k-1)):a,'−',part, '=',add(last?'total':'step'+k,last?'Exact difference':'After part '+(k+1),remaining,[a,b])));
    });
    setup('Subtract in parts',additionStory(a,b,true)+' Split '+b+' into '+(low?'two small parts.':'its place-value parts.'),{type:'parts',whole:b,parts:parts.map(p=>p.key),rows});
    if (kind.endsWith('Why')) why('The parts add up to '+b+'.','Subtract just the first part.','Split the number that stays at the start.');
   }
  } else if (kind==='twoAdd' || kind==='twoSub') {
   const subtract=kind==='twoSub';
   const a=low?(subtract?16:7+day%3):high?(subtract?612:334+7*day):(subtract?48:24+day%6);
   const b=low?(subtract?7:6+day%2):high?(subtract?298:197+day%3):(subtract?19:17+day%3);
   const friendly=low?(subtract?10:5):high?(subtract?300:200):20;
   const offset=friendly-b;
   const adjusted=subtract?a+offset:a-offset;
   const sign=subtract?'−':'+', result=subtract?a-b:a+b;
   const split=low?(subtract?6:2):high?(subtract?200:100):10;
   const landing=subtract?a-split:a+split;
   const shift=Math.abs(offset), firstChange=adjusted-a;
   const move=subtract
    ? (offset>0?'Add ':'Subtract ')+shift+(offset>0?' to both numbers.':' from both numbers.')
    : 'Move '+shift+' from '+(offset>0?a:b)+' to '+(offset>0?b:a)+'.';
   const parts = [
    eq(b,'=',split,'+',add('part','Part left over',b-split,[split,b])),
    eq(a,sign,split,'=',add('landing','After the first part',landing,[a,result])),
    eq(fill('landing'),sign,fill('part'),'=',add('total','Result from parts',result,[a,b]))
   ];
   const compensation = [
    eq(b,offset>0?'+':'−',shift,'=',friendly),
    eq(a,firstChange>0?'+':'−',shift,'=',add('adjusted','Adjusted first number',adjusted,[a,a+Math.abs(offset)])),
    eq(fill('adjusted'),sign,friendly,'=',add('otherTotal','Result from compensation',result,[a,b]))
   ];
   setup('Solve it two ways',additionStory(a,b,subtract)+(subtract?' How many are left?':' How many are there now?'),
    {type:'two-ways',equation:eq(a,sign,b),methods:[
     {title:'1. Break apart '+b,hint:(subtract?'Subtract':'Add')+' '+split+' first, then the rest.',rows:parts},
     {title:'2. Use '+friendly,hint:move,rows:compensation}
    ]});
   task.directions='Solve in parts, then make a friendly number. Find the total or difference both ways.';
  } else {
   const subtract = kind.startsWith('sub') || kind.startsWith('tradeSub') || kind==='checkTrade';
   const noTrade = kind.endsWith('NoTrade');
   if (low) {
    if (noTrade) {
     const a=11+i%5, ones=a%10, b=subtract?Math.min(ones,1+slot%3):1+slot%3, result=subtract?a-b:a+b;
     setup(subtract?'Subtract ones':'Add ones',additionStory(a,b,subtract)+' Keep the ten. Work with the ones.',
      {type:'ten',start:a,rows:[eq(ones,subtract?'−':'+',b,'=',add('ones','Ones in the result',result-10,[ones,b])),
       eq(10,'+',fill('ones'),'=',add('total','Exact result',result,[a,b]))]});
    } else {
    const a = subtract?12+i%6:6+i%4, b = subtract?7+i%3:5+slot%3;
    const h = subtract?a-10:10-a, rest=b-h, total=subtract?a-b:a+b;
    setup(subtract?'Break apart a ten':'Make a ten',additionStory(a,b,subtract) + ' Get to 10 first. Then use the rest.',
     {type:'ten',start:a,borrow:subtract?{a,b}:undefined,rows:[eq(b,'=',add('bridge','Part to get to ten',h,[a,10]),'+',add('rest','Part left over',rest,[b,h])),
      eq(10,subtract?'−':'+',fill('rest'),'=',add('total','Final answer',total,[10,b]))]});
    if (kind.includes('Why')) why('I used both parts of '+b+'.','Getting to 10 ends every problem.','I can ignore the part left over.');
    if (kind==='checkTrade') task.model.rows.push(eq(fill('total'),'+',b,'=',add('verify','Check by adding',a,[total,b])));
    }
   } else {
    // Keep the exchanges visible in the model, including through zero in Inspire.
    const addA = [268,476,584,246,537,328,695,487,568,628][slot];
    const addB = [417,147,219,128,386,579,298,395,317,372][slot];
    const subA = [462,604,510,452,702,840,472,900,630,1000][slot];
    const subB = [127,287,176,127,386,595,227,462,284,468][slot];
    const showBlocks=!noTrade&&slot===3;
    const useHundreds = high && !(noTrade && slot===0);
    const a = noTrade ? (useHundreds?342+110*(i%4):42+10*(i%4))+i%3 :
     high ? (subtract ? subA : addA) : subtract? 40+i%5*10+i%6 : 17+i%3;
    const aOnes = a%10;
    const b = noTrade ? (useHundreds?121:11)+slot%2 :
     high ? (subtract?subB:addB) : subtract? 10+aOnes+1+slot%2 : 20+10-aOnes+slot%3;
    const symbol = subtract?'−':'+', total = subtract?a-b:a+b;
    const tensA = Math.floor(a/10)%10, tensB = Math.floor(b/10)%10;
    const onesOut = subtract && a%10 < b%10, onesIn = !subtract && a%10+b%10 >=10;
    const tensTrade = subtract ? tensA-Number(onesOut) < tensB : tensA+tensB+Number(onesIn)>=10;
    const rows = [], hundredsA = Math.floor(a/100)%10;
    const throughHundred = subtract && tensTrade && hundredsA===0;
    const place = subtract ? a%10+10*Number(onesOut) : a%10+b%10;
    rows.push(eq(add('ones',subtract?'Ones available before subtracting':'Ones before regrouping',place,[a%10,b%10,total%10]),subtract?'ones to start':'ones before the trade'));
    if (useHundreds || tensTrade || showBlocks) {
     const tradeTens = subtract ? tensA - Number(onesOut) + 10*Number(tensTrade) : tensA + tensB + Number(onesIn);
     rows.push(eq(add('tens',subtract?'Tens available before subtracting':'Tens before regrouping',tradeTens,[tensA,tensB,Math.floor(total/10)%10]),subtract?'tens to start':'tens before the trade'));
    }
    if (high && subtract && tensTrade) {
     const hundredsLeft = hundredsA + (throughHundred?10:0) - 1;
     rows.push(eq(add('hundreds','Hundreds available before subtracting',hundredsLeft,[hundredsA,Math.floor(b/100)%10]),'hundreds to start'));
    }
    if (!subtract) {
     const carried=onesIn?1:0;
     rows.splice(1,0,eq(add('carry','Tens carried from the ones',carried,[0,2,10]),'new ten'+(carried===1?'':'s')));
     if (tensTrade) rows.push(eq(add('carryHundreds','Hundreds carried from the tens',1,[0,2,10]),'new hundred'));
     if (a+b===1000) rows.push(eq(add('carryThousands','Thousands carried from the hundreds',1,[0,2,10]),'new thousand'));
     if (showBlocks) rows.push(eq(add('remainingOnes','Ones left after trading',place%10,[place,10]),'ones left after trade'));
    }
    rows.push(eq(a,symbol,b,'=',add('total','Final answer',total,[a,b,Math.abs(total-10)])));
    const title = noTrade ? (subtract?'Subtract':'Add')+' without regrouping' : subtract?'Regroup to subtract':'Regroup to add';
    setup(title,additionStory(a,b,subtract) + ' Use the place-value columns to show your steps.',
     {type:'columns',a,b,symbol,rows,high:useHundreds,showBlocks,places:!subtract&&a+b===1000?4:undefined},high&&!showBlocks?'B2.5':'B2.4');
    if(showBlocks){
     const start=placeParts(a);
     const next=placeParts(b);
     task.model.blocksBefore=start.map((value,k)=>(value+(subtract?0:next[k]))/[100,10,1][k]);
     task.model.blockFields=['tens',subtract?'ones':'remainingOnes'];
    }
    if (kind==='checkTrade') {
     const verify = a-b;
     task.fields.verify = field('Check: what do you get when you add the difference back?',a,[b,verify,b+a]);
     task.model.rows.push(eq(fill('total'),'+',b,'=',fill('verify')));
    } else if (kind.includes('Why')) why(subtract?'1 ten can be traded for 10 ones.':'10 ones can be traded for 1 ten.',
     subtract?'1 ten is the same as 1 one.':'10 ones can be traded for 10 tens.','A trade changes the whole amount.');
   }
  }
  if(task.model.borrow || task.model.type==='columns'&&task.model.symbol==='−'||task.model.type==='ten'&&task.title==='Subtract ones') {
   task.prompt=task.prompt.replace(/\s+(?:Use the place-value columns to show your steps\.|Keep the ten\. Work with the ones\.|Get to 10 first\. Then use the rest\.)$/,'')+' How many are left?';
   task.directions='Start with the ones. Choose the answer digit below each column.'+
    (task.model.borrow||task.title==='Regroup to subtract'?' Drag the highlighted block one column right to trade it for ten smaller units, or tap Trade.':'');
  }
  task.choiceSeed = grade * 29 + day * 13 + slot * 7 + variant;
  return task;
 }
 function makeArray(grade, [rows, columns], {item,slug}) {
  const total=rows*columns;
  const gridRows=rows+1, gridColumns=columns+1;
  const fields={};
  const keys=[];
  for(let r=0;r<gridRows;r++) {
   for(let c=0;c<gridColumns;c++) {
    const key='cell'+r+'_'+c;
    keys.push(key);
    fields[key]={...field('Row '+(r+1)+', column '+(c+1),1),cell:true};
   }
  }
  fields.total=field('Total '+item,total,[total-1,total+1,total-columns,total+columns,rows+columns]);
  const sum=Array(rows).fill(columns).flatMap((n,i)=>i?['+',n]:[n]);
  if(grade>1) fields.repeated=field('Repeated addition that matches the rows',sum.join(' '),[
   Array(columns).fill(rows).join(' + '),Array(rows+1).fill(columns).join(' + '),rows+' + '+columns
  ].filter(answer=>answer!==sum.join(' ')));
  const expectations={
   1:'Represent and solve equal-group problems with up to 10 objects using tools and drawings.',
   2:'Represent multiplication as repeated equal groups and solve problems using tools and drawings.',
   3:'Represent multiplication through 10 × 10 using tools and drawings, including arrays.'
  };
  return {
   layout:'strategy-lesson',title:grade===1?'Build equal rows':'Build a multiplication array',
   prompt:'Make '+rows+' rows with '+columns+' '+item+' in each row. Drag pictures or tap the grid.',
   directions:'Fill equal rows with no gaps and find the total.',
   code:grade===3?'B2.6':'B2.5',expectation:expectations[grade],art:{slug,item},
   fields,choiceSeed:rows+columns+grade,drag:{keys,numbers:[1]},
   model:{type:'object-array',targetRows:rows,targetColumns:columns,gridRows,gridColumns,keys,
    rows:[grade===1?eq(...sum,'=',fill('total')):eq(rows,'×',columns,'=',fill('total'))]}
  };
 }
 window.ML_NOVEMBER_STRATEGIES = {days,make,makeArray};
})();
