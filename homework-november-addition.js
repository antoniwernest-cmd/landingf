/* Two weeks of addition and subtraction homework for all three paths. */
(() => {
 'use strict';
 const source = 'https://assets-us-01.kc-usercontent.com/fbd574c4-da36-0066-a0c5-849ffb2de96e/c2dea171-e219-4ec0-b097-24c959fcc924/Number_AODA.pdf';
 const algebraSource = 'https://assets-us-01.kc-usercontent.com/fbd574c4-da36-0066-a0c5-849ffb2de96e/08f5a14f-576a-4282-af82-096dc302ed10/Algebra_AODA.pdf';
 const artBase = new URL('assets/november-homework/', document.currentScript.src);
 const paths = {1: 'Elevate', 2: 'Excite', 3: 'Inspire'};
 const weeks = [
  {id: '2026-11-16', label: 'November 16–21', dates: [16, 17, 18, 19, 20], catchUp: '2026-11-21'},
  {id: '2026-11-23', label: 'November 23–27', dates: [23, 24, 25, 26, 27]}
 ];
 const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
 const objects = [
  ['tennis balls', 'tennis-ball'], ['apples', 'apple'], ['building blocks', 'block'],
  ['toy dinosaurs', 'dinosaur'], ['rubber ducks', 'rubber-duck'], ['sailboats', 'sailboat'],
  ['toy planes', 'toy-plane'], ['toy trains', 'toy-train'], ['pencils', 'pencil'],
  ['erasers', 'eraser'], ['books', 'book'], ['backpacks', 'backpack']
 ];
 const names = ['Lina', 'Miles', 'Amara', 'Ben', 'Isla', 'Hugo', 'Leila', 'Finn', 'Tessa', 'Ravi', 'June', 'Felix',
  'Sofia', 'Ezra', 'Nora', 'Max', 'Kira', 'Luis', 'Ada', 'Zane', 'Anya', 'Nico', 'Elena', 'Cole'];
 const comparisons = {
  1: [[6, 2], [5, 4], [8, 5], [7, 6], [10, 3], [8, 4], [11, 5], [9, 7], [13, 5], [14, 2]],
  2: [[36, 22], [31, 17], [42, 29], [45, 28], [57, 24], [29, 35], [37, 26], [48, 16], [62, 25], [64, 21]],
  3: [[153, 36], [137, 64], [264, 57], [186, 92], [328, 79], [218, 47], [296, 85], [415, 98], [248, 76], [467, 145]]
 };
 const totals = {1: 20, 2: 50, 3: 1000};
 const modelMax = {1: 50, 2: 100, 3: 1000};
 const sequence = window.ML_NOVEMBER_STRATEGIES;
 const rotate = (values, by) => values.slice(by).concat(values.slice(0, by));
 const unique = values => [...new Set(values)];
 const dateId = day => '2026-11-' + day;
 const objectAt = index => objects[index % objects.length];
 const personAt = index => names[index % names.length];
 const pictureFor = slug => new URL('object-' + slug + '.png', artBase).href;
 function equation({title, prompt, operator = '+', answer, labels, art, seed, code}) {
  const value = answer[2];
  const values = unique([...answer, value + 1, value + 2, Math.max(0, value - 1)]).slice(0, 6);
  const tiles = rotate(values, seed % values.length).map(n => ({id: String(n), label: String(n)}));
  return {layout: 'equation', title, prompt, operator, answer: answer.map(String), labels, art, tiles, code,
   directions: 'Drag number tiles into the boxes to complete the equation.'};
 }
 function compare(grade, day, difference, seed) {
  const [item, slug] = objectAt(day);
  const first = personAt(2 * day), second = personAt(2 * day + 1);
  const [a, b] = comparisons[grade][day];
  const total = a + b;
  const prompt = difference
   ? first + ' collected ' + a + ' ' + item + '. ' + second + ' collected ' + total + '. How many more did ' + second + ' collect?'
   : first + ' collected ' + a + ' ' + item + '. ' + second + ' collected ' + b + ' more than ' + first + '. How many did ' + second + ' collect?';
  const art = {type: 'bars', labels: [first, second], first: a, extra: b, difference, slug};
  if (difference) {
   const numbers = [1, 2, 5, ...Array.from({length: 10}, (_, i) => (i + 1) * 10)];
   return {layout: 'difference', title: 'How many more?', prompt, art, code: grade === 3 ? 'B2.5' : 'B2.4',
    start: a, target: total,
    tiles: numbers.map(n => ({id: String(n), label: String(n)})),
    directions: 'Drag numbers onto the pad. Use each number as many times as you need.'};
  }
  return equation({title: 'Find the larger amount', prompt, answer: [a, b, total],
   labels: ['Same amount', 'Extra amount', 'Total'], art, seed, code: grade === 3 ? 'B2.5' : 'B2.4'});
 }
 function strategy(grade, a, b, seed, storyNumber = seed) {
  const sum = a + b;
  const [item, slug] = objectAt(storyNumber + 7);
  const name = personAt(storyNumber + 14);
  const numberedGroups = grade === 2;
  const individualErasers = slug === 'eraser' && !numberedGroups;
  const denominations = !numberedGroups && (sum <= 20 || individualErasers) ? [1] : [100, 50, 20, 10, 5, 2, 1];
  const tiles = [a, b].flatMap((amount, side) => {
   let remaining = amount;
   return denominations.flatMap(value => {
    const count = Math.floor(remaining / value);
    remaining %= value;
    return Array.from({length: count}, () => ({value, side}));
   });
  }).map((tile, i) => ({...tile, id: String(i), label: String(tile.value)}));
  return {layout: 'regroup', title: 'Make a new equation', choiceOffset: seed,
   prompt: name + ' has ' + a + ' ' + item + ' in one group and ' + b + ' in another. Move some to make a new equation with the same total.',
   art: {slug, item}, sum, addends: [a, b], code: numberedGroups && sum > totals[grade] ? 'B2.4' : 'B2.3',
   tiles, individualErasers, numberedGroups,
   directions: numberedGroups ? 'Drag the numbered tiles between pads.' :
    individualErasers ? 'Drag erasers between pads.' : 'Drag pictures to either landing pad.'};
 }
 const openingGroups = {1:[[3,5],[3,6]],3:[[24,26],[27,31]]};
 // Each Excite day starts with five different regrouping problems.
 const exciteGroups = [
  [[12,16],[6,7],[27,31],[16,22],[18,25]],
  [[14,23],[19,21],[32,16],[24,27],[17,36]],
  [[15,17],[21,23],[25,27],[28,30],[32,34]],
  [[12,29],[26,15],[34,18],[27,22],[38,25]],
  [[21,19],[13,26],[32,23],[18,31],[36,28]],
  [[15,26],[22,16],[37,21],[28,33],[19,27]],
  [[24,13],[21,25],[35,12],[28,17],[34,29]],
  [[11,24],[23,16],[31,27],[27,18],[42,16]],
  [[17,22],[32,15],[19,35],[24,38],[29,18]],
  [[14,26],[27,25],[33,18],[16,37],[28,36]]
 ];
 const arrayPractice = [
  {day:3,slot:7,object:4,sizes:[[2,3],[2,4],[2,4]]},
  {day:8,slot:6,object:5,sizes:[[2,4],[3,5],[5,6]]}
 ];
 const extraPractice = [
  ['on','back','blocks','parts','trade','placeWhy','on','back','estimateAdd','frontAdd','storyJoin','storyMissing','array','undoAdd','inverseWhy'],
  ['estimateAdd','frontAdd','estimateAdd','frontAdd','frontWhy','estimateAdd','frontAdd','compAdd','jumpAdd','double','near1','near2','array','storyJoin','twoAdd'],
  ['double','near1','near2','double','near1','near2','compAdd','compAdd','compAddWhy','frontAdd','estimateAdd','jumpAdd','array','storyJoin','frontWhy'],
  ['jumpAdd','jumpAdd','jumpAdd','frontAdd','lineWhy','jumpAdd','compAdd','jumpAdd','estimateAdd','storyJoin','undoAdd','frontWhy','array','frontAdd','twoAdd'],
  ['estimateSub','subParts','estimateSub','subParts','subPartsWhy','estimateSub','subParts','jumpSub','compSub','storyTake','storyMissing','storyCompare','array','estimateSub','twoSub'],
  ['jumpSub','compSub','jumpSub','compSub','compSubWhy','jumpSub','subParts','jumpSub','estimateSub','storyCompare','storyTake','subPartsWhy','array','compSub','twoSub'],
  ['addNoTrade','blocks','trade','addTrade','addTrade','addNoTrade','addTrade','addTrade','tradeAddWhy','estimateAdd','frontAdd','storyJoin','array','compAdd','twoAdd'],
  ['subNoTrade','blocks','trade','subTrade','subTrade','subNoTrade','subTrade','subTrade','tradeSubWhy','estimateSub','subParts','storyTake','array','compSub','checkTrade'],
  ['storyJoin','storyTake','storyMissing','storyCompare','undoAdd','storyJoin','storyTake','storyMissing','storyCompare','inverseWhy','estimateAdd','estimateSub','array','frontAdd','twoSub'],
  ['estimateAdd','frontAdd','estimateSub','subParts','compAdd','compSub','addTrade','subTrade','jumpAdd','jumpSub','storyMissing','storyCompare','array','twoAdd','balance']
 ];
 const extraArraySizes = {
  1:[[2,2],[2,3],[2,4],[3,2],[2,5],[3,3],[4,2],[5,2],[2,3],[3,2]],
  2:[[2,3],[3,4],[4,3],[2,6],[4,4],[3,5],[5,3],[4,5],[2,7],[5,4]],
  3:[[3,4],[4,4],[5,3],[4,5],[5,5],[4,6],[3,7],[5,6],[6,4],[6,5]]
 };
 const verticalAddends = {
  1: [
   [[3,4],[6,3],[7,3],[6,5],[8,4]],
   [[2,6],[5,4],[4,6],[7,5],[9,4]],
   [[5,2],[4,5],[2,8],[6,7],[8,6]],
   [[3,5],[7,2],[1,9],[9,5],[7,8]],
   [[4,3],[6,2],[5,5],[8,5],[9,7]],
   [[11,4],[12,5],[4,7],[8,8],[14,6]],
   [[13,5],[7,7],[3,8],[9,8],[13,7]],
   [[12,4],[4,8],[5,8],[8,9],[12,8]],
   [[15,3],[5,7],[6,8],[9,9],[11,9]],
   [[14,3],[8,3],[7,6],[7,9],[16,4]]
  ],
  2: [
   [[14,23],[35,12],[17,6],[26,15],[38,24]],
   [[21,35],[43,16],[24,8],[47,16],[32,39]],
   [[25,34],[52,14],[28,7],[19,26],[45,38]],
   [[42,15],[16,32],[47,5],[35,27],[56,18]],
   [[31,28],[53,25],[8,38],[27,29],[48,37]],
   [[24,60],[21,47],[19,7],[46,28],[59,34]],
   [[30,46],[44,23],[37,8],[28,36],[58,27]],
   [[36,43],[20,57],[9,52],[48,26],[39,53]],
   [[61,25],[50,18],[65,7],[28,57],[73,19]],
   [[63,24],[52,36],[78,6],[58,32],[64,36]]
  ],
  3: [
   [[213,146],[402,37],[326,157],[248,75],[168,257]],
   [[324,261],[541,38],[305,487],[430,286],[275,168]],
   [[424,152],[530,247],[237,456],[370,284],[384,249]],
   [[602,153],[531,266],[418,265],[280,341],[486,359]],
   [[351,128],[620,279],[245,238],[470,365],[367,458]],
   [[412,307],[580,219],[506,187],[183,263],[576,247]],
   [[260,438],[321,366],[714,179],[280,653],[486,476]],
   [[140,638],[510,287],[209,674],[182,264],[697,187]],
   [[713,254],[362,137],[307,286],[451,380],[493,368]],
   [[504,395],[324,472],[755,138],[589,36],[576,424]]
  ]
 };
 const verticalOpeners = verticalAddends[1][0].length;
 const verticalSlotsByWeek = [[0,2,4],[0,4]];
 function makeVerticalPage(grade, day, index) {
  const addends = verticalAddends[grade][day][index];
  const [item, slug] = objectAt(day * verticalOpeners + index + 4);
  const [first, second] = addends;
  return {
   layout:'vertical-addition', title:'Add in columns', art:{slug,item}, addends, code:'B2.4',
   prompt:personAt(day * 5 + index) + ' has ' + first + ' ' + item + ' and gets ' + second + ' more. How many altogether?',
   directions:'Start with the ones. Choose the full column total. If it is 10 or more, drag the 1 to the next carry box or tap the 1.'
  };
 }
 const catpaddle = {
  idSuffix:'-catpaddle', pageCode:'OP3-9151', layout:'vertical-addition', title:'Add 58 + 44',
  art:{slug:'block'}, addends:[58,44], code:'B2.4', blockRows:true,
  prompt:'Choose the full column total. Drag the 1 to the next carry box when you regroup.',
  directions:'Start with the ones. You can tap the 1 to carry it.'
 };
 const carGroups = {
  idSuffix:'-branch18', pageCode:'NS3-9152', layout:'car-groups', title:'Show 38 in two ways',
  target:38, code:'B1.1',
  prompt:'Drag groups of cars onto both landing pads. Make 38 a different way on each pad.',
  directions:'You can reuse each group.'
 };
 const inspireTenFrames = window.ML_NOVEMBER_REFERENCE_TASKS['panther10squares-inspire.html'];
 const addedReferences = Object.values(window.ML_NOVEMBER_REFERENCE_TASKS).filter(task=>task!==inspireTenFrames);
 const exciteReferences = window.ML_NOVEMBER_EXCITE_REFERENCES;
 const patternShapes = ['Circle','Square','Triangle','Star','Hexagon'];
 const patternLengths = {1:[2,3,3,4,4],2:[3,4,5,4,5],3:[4,5,6,6,5]};
 const patternOpeners = patternLengths[1].length;
 function makePatternPage(grade, day, index) {
  const targets = {
   1:[5+day%4,9+day%4,13+day%4,17+day%4,25],
   2:[13+day,19+day,25,28+day,34+day],
   3:[25,32+day,41+day,52+day,61+2*day]
  };
  const position = targets[grade][index];
  const length = patternLengths[grade][index];
  const rotated = rotate(patternShapes,(2*day+index+grade)%patternShapes.length);
  const core = rotated.slice(0,length-1);
  if (grade>1 && index>2) core[core.length-1] = core[0];
  core.push('Diamond');
  const choices = unique([...core,...rotated]).slice(0,Math.max(3,new Set(core).size));
  return {
   layout:'pattern-position', title:'Find the shape', code:'C1.3', core, position,
   choices:rotate(choices,(day+index)%choices.length),
   prompt:'The core ends with a diamond. If it keeps repeating, what shape is in position '+position+'?',
   directions:'Find the first diamond at or after the target. Count back to the target, then drag or tap its shape.'
  };
 }
 function makeExtraPage(grade, day, kind, extraIndex) {
  if (kind === 'balance') {
   const prompts = ['Balance all four objects.','Balance all four toys with two on each pan.','Balance one object against the other three.'];
   return {
    layout:'balance-lab',title:'Balance Lab',prompt:prompts[grade-1],
    directions:'Drag each object to a pan, or select it and then select a pan. Make the two totals equal.',
    code:grade===3?'B2.5':'B2.4',art:{slug:['apple','rubber-duck','book'][grade-1]},
    balanceChallenge:grade-1
   };
  }
  const extraDouble = kind === 'double' || kind.startsWith('near');
  const storyIndex = day * 16 + (extraDouble ? Math.floor(extraIndex/3)*3 : extraIndex) + grade + 3;
  const [item, slug] = objectAt(storyIndex);
  if (kind === 'array') return sequence.makeArray(grade, extraArraySizes[grade][day], {item,slug});
  // Keep the first six doubles slots in a matched double, plus one, plus two sequence.
  const slot = extraDouble ? extraIndex % 6 : extraIndex % 10;
  const name = personAt(storyIndex + 2);
  return sequence.make(grade, day, slot, {name,item,slug},kind,1+Math.floor(extraIndex/10));
 }
 function makeDay(grade, index) {
  return sequence.days[index].list.map((kind, slot) => {
   if (grade === 2 && slot < 5) {
    return strategy(grade,...exciteGroups[index][slot],slot,index * 5 + slot);
   }
   if (kind==='compareTotal') return compare(grade,index,false,index);
   if (kind==='moveGroups') return strategy(grade,...openingGroups[grade][slot-1],slot);
   if (kind==='compareGap') return compare(grade,index+2,true,4);
   const array = arrayPractice.find(page => page.day === index && page.slot === slot);
   if (array) {
    const [item, slug] = objectAt(array.object);
    return sequence.makeArray(grade, array.sizes[grade-1], {item,slug});
   }
   // Keep a complete guided doubles sequence after the five new tile questions.
   const lessonSlot = grade === 2 && index === 2 && slot < 8 ? slot-5 : slot;
   const story = index===2 && lessonSlot<6 ? Math.floor(lessonSlot/3) : lessonSlot;
   const [item, slug] = objectAt(index * 5 + story + grade);
   return sequence.make(grade, index, lessonSlot, {name:personAt(index * 7 + story + grade),item,slug});
  });
 }
 const gradeList = [1, 2, 3];
 const dailyShapeQuestions = 3;
 const omittedStrategyTitles = new Set([
  'Choose the operation', 'Read the base-ten blocks', 'Count on', 'Count back', 'Use the inverse', 'Regroup to add'
 ]);
 const omittedUpperGradeStrategyTitles = new Set(['Subtract in parts', 'Compensate to add', 'Add without regrouping']);
 const dailyEstimateAddLimit = 2;
 const revisedDayFocus = {2:'Doubles and near doubles',4:'Estimate and subtract',6:'Model addition in columns',8:'Estimate and represent'};
 const dayCardPictures = {
  2: ['Wind-up fox','Sailboat','Pencil cup','Pattern gems','Excavator',
   'Ladybug','Bee and blossom','Race car','Kite','Triceratops'],
  3: ['Moon rover','Telescope','Lunar greenhouse','Satellite','Ringed planet',
   'Astronaut helmet','Comet','Rocket','Astronaut cat','Crystal chest']
 };
 const newPages = [];
 const plans = {};
 for (const [weekIndex, week] of weeks.entries()) {
  const grades = {};
  const plan = {week: week.id, year: 2026, label: week.label, catchUp: week.catchUp, grades,
   planStyle: 'addition-practice', questionsPerDay: 26 + verticalSlotsByWeek[weekIndex].length + dailyShapeQuestions};
  plans[week.id] = plan;
  for (const grade of gradeList) {
   grades[grade] = week.dates.map((date, dayIndex) => {
    const day = weekIndex * 5 + dayIndex;
    const firstPage = newPages.length;
    const practice = extraPractice[day].map((kind, index) => makeExtraPage(grade, day, kind, index));
    const vertical = verticalAddends[grade][day].map((_, index) => makeVerticalPage(grade, day, index));
    const patterns = patternLengths[grade].map((_, index) => makePatternPage(grade, day, index));
    const supplement = [
     ...(grade === 2 ? exciteReferences.filter(question=>question.day===date && question.kind!=='missing-number-story') :
      grade === 3 && date === 16 ? [catpaddle,carGroups,...addedReferences] : []),
     ...(window.ML_NOVEMBER_PATTERN_LIBRARY[grade]||[]).filter(question=>question.day===date && question.pageCode!=='PA3-9204'),
     ...window.ML_NOVEMBER_FIVES[grade].filter(question=>question.day===date)
    ];
    const doubles = [window.ML_NOVEMBER_DOUBLES_PRACTICE(grade, day), window.ML_NOVEMBER_DOUBLES_PRACTICE(grade, day, true)];
    const inspirePractice = grade===3 && date===17 ? [inspireTenFrames] : [];
    let estimateAddPages = 0;
    const questions = [...vertical,...patterns,...supplement,...makeDay(grade, day),...practice,...doubles,...inspirePractice].flatMap((question, index) => {
     if (index < verticalOpeners && !verticalSlotsByWeek[weekIndex].includes(index)) return [];
     if (question.layout === 'strategy-lesson' && (omittedStrategyTitles.has(question.title) ||
       grade >= 2 && omittedUpperGradeStrategyTitles.has(question.title))) return [];
     if (grade >= 2 && question.layout === 'strategy-lesson' && question.title === 'Estimate, then add') {
      estimateAddPages += 1;
      if (estimateAddPages > dailyEstimateAddLimit) return [];
     }
     if (question.layout === 'pattern-position') {
      const slot = index - verticalOpeners;
      const keep = grade === 1 ? slot < dailyShapeQuestions - 1 || question.position === 25 : slot < dailyShapeQuestions;
      if (!keep) return [];
     }
     if (grade >= 2 && question.layout === 'regroup' && question.title === 'Make a new equation') return [];
     // Keep the original index for stable question IDs and use the visible position for navigation.
     const questionNumber = newPages.length - firstPage + 1;
     const opener = question.layout === 'vertical-addition';
     const pattern = question.layout === 'pattern-position';
     const story = question.kind === 'missing-number-story';
     const parity = question.kind?.startsWith('parity-');
     const patternLibrary = question.kind === 'pattern-lab';
     const fivesWorkshop = question.kind === 'five-lab';
     const doublesPractice = question.kind === 'doubles-practice';
     const algebra = question.code.startsWith('C');
     const legacyIndex = index - verticalOpeners - patternOpeners - supplement.length;
     const position = legacyIndex < 10 ? day * 10 + legacyIndex + 1 : 100 + day * practice.length + (legacyIndex - 10) + 1;
     const patternIndex = index - verticalOpeners;
     const id = 'hw-' + dateId(date) + '-g' + grade + (question.idSuffix ?? (opener ? '-vertical-addition-' + (index + 1)
      : pattern ? '-pattern-position-' + (patternIndex + 1) : '-addition-' + (legacyIndex + 1)));
     const pageCode = question.pageCode ?? ((pattern ? 'PA' : 'OP') + grade + '-' + (opener ? 9051 + day * verticalOpeners + index
      : pattern ? 9101 + day * patternOpeners + patternIndex : 8800 + position));
     const regrouping = question.layout === 'regroup';
     const lesson = question.layout === 'strategy-lesson';
     const keptDouble = grade !== 2 && day === 2 && legacyIndex < 6;
     const movedLesson = grade === 2 && day === 2 && legacyIndex >= 5 && legacyIndex < 8;
     const revisedSplit = question.model?.type === 'two-level-parts';
     const array = question.model?.type === 'object-array';
     const balance = question.layout === 'balance-lab';
     const buildCars = question.layout === 'car-groups';
     const reference = question.layout === 'reference-activity';
     const revision = reference ? 'reference-v1' : buildCars ? 'car-groups-v1' : opener ? 'vertical-addition-v1' : pattern ? 'pattern-position-v1' : balance ? 'balance-lab-v1' : lesson ? (array?'array-v1':movedLesson || revisedSplit?'unit-v5':keptDouble?'strategy-v3':'unit-v4') : regrouping ?
      (question.numberedGroups ? 'regroup-v4' : question.individualErasers && grade === 3 ? 'regroup-v3' : 'regroup-v2') : 'pictured-v2';
     const goal = fivesWorkshop ? (question.fives.rows?'I can count on or back by fives.':grade===3?
      'I can use groups of five to solve multiplication and related division problems.':'I can make equal groups of five and find the total.')
      : story ? 'I can write an equation for a story and find the missing number.'
      : parity ? 'I can use pairs and number patterns to tell whether a number is even or odd.'
      : doublesPractice ? 'I can use a double and one or two more to add.'
      : question.requireFullTen ? 'I can make a ten to find a sum.'
      : opener ? 'I can add by place value and trade a group of ten when I need to.'
      : buildCars ? 'I can use objects to represent the same number in different ways.'
      : reference ? 'I can use the model to ' + question.title.toLowerCase() + '.'
      : pattern ? 'I can count back from the end of a repeating core to find a shape.'
      : balance ? 'I can make two groups with equal totals.' : lesson ? 'I can use a model to ' + question.title.toLowerCase() + '.'
      : regrouping ? 'I can change the two groups and keep the same total.' : 'I can use a model to solve an addition or subtraction story.';
     const explanation = opener ? 'Connect the pictures to the stacked equation. Trade ten units of one place for one unit in the next place.'
      : buildCars ? 'Make 38 with two different combinations of pictured car groups.'
      : reference ? question.directions + (question.reference ? ' Adapted from '+question.reference+'.' : '')
      : pattern ? 'Find the first end of a core at or after the target. Count back from that position and match the target to its shape.'
      : array || balance ? question.directions : lesson ? sequence.days[day].focus + '. Adapted from the Grade 3 addition and subtraction unit, PDF pp. ' + sequence.days[day].pdf + '.'
      : regrouping ? 'Move objects between two groups and compare the two addition equations.' : 'Connect the quantities in a diagram to an equation.';
     const curriculumExplanation = question.expectation || (pattern ? 'Use a pattern rule to extend a pattern and predict and justify what comes at a given position.'
      : ['B1.1','B1.2'].includes(question.code) ? 'Represent, compose and decompose whole numbers using tools and strategies.'
      : question.code === 'B2.1' ? 'Use the relationship between addition and subtraction to solve problems.'
      : question.code === 'B2.4' && grade === 3 ? 'Connect addition and subtraction procedures to place value and the standard algorithms.'
      : question.code === 'B2.3' ? 'Use and explain mental strategies for addition and subtraction with totals of up to ' + totals[grade] + '.'
      : 'Use models and equations to solve addition and subtraction problems with totals of up to ' + modelMax[grade] + '.');
     const details = [{code: question.code, curriculumExplanation, explanation, url: question.code.startsWith('C') ? algebraSource : source}];
     if (grade === 3 && (opener || question.code === 'B2.4' && question.model?.type === 'columns')) details.push({code:'B2.5', url:source, explanation,
      curriculumExplanation:'Use tools and algorithms to solve addition and subtraction problems with sums up to 1,000.'});
     if (grade === 3 && question.title.startsWith('Estimate, then ')) details.push({code:'B1.3', url:source,
      explanation:question.directions,curriculumExplanation:'Round whole numbers to the nearest ten or hundred in context.'});
     const picture = question.image ? new URL(question.image,artBase).href
      : buildCars ? new URL('../audit-oct25-v9/toy-car-no-eyes.png',artBase).href
      : pattern ? null : pictureFor(question.art.slug);
     const strand = algebra ? 'algebra' : 'number';
     const section = doublesPractice ? 'Doubles practice' : fivesWorkshop ? 'Five at a time' : story ? 'Missing numbers' : parity ? 'Even and odd' : patternLibrary ? 'Pattern workshop' : pattern ? 'Repeating patterns'
      : algebra ? 'Number patterns' : question.kind==='stamp-array' ? 'Multiplication' : 'Addition and subtraction';
     const item = {
      id, qid: id, grade, pageCode, codes: details.map(detail => detail.code), title: question.title, prompt: question.prompt,
      directions: question.directions, homeworkOnly: true, homeworkWeek: week.id, homeworkDay: dayIndex,
      group: doublesPractice ? 'november-doubles' : fivesWorkshop ? 'november-fives-workshop' : story ? 'november-missing-numbers' : parity ? 'november-even-odd' : patternLibrary ? 'november-pattern-workshop' :
       algebra ? 'november-pattern-position' : 'november-addition',
      groupTitle: section, category: strand, ontarioTopic: strand,
      engine: balance ? 'november-balance-lab' : 'november-addition', kind: question.layout, details, learningGoal: goal,
      revision, config: {grade, pageCode, title: question.title, task: {...question, picture}, questionNumber,
       balanceChallenge:question.balanceChallenge, narratePrompt: !(story||parity||patternLibrary||fivesWorkshop), revision}
     };
     newPages.push(item);
     return [{id, title: item.title, number: questionNumber, codes: item.codes, section, sectionId: strand+':'+item.group}];
    });
    const illustration = dayCardPictures[grade]?.[day];
    const art = illustration
     ? new URL('day-cards/'+paths[grade].toLowerCase()+'-'+illustration.toLowerCase().replaceAll(' ','-')+'.webp',artBase).href
     : newPages[firstPage].config.task.picture;
    const focus = revisedDayFocus[day] ?? sequence.days[day].focus;
    return {date: dateId(date), weekday: weekdays[dayIndex], label: weekdays[dayIndex] + ' · Nov ' + date,
     focus, questions, picture: {src: art, alt: illustration || '', caption: focus}};
   });
  }
 }
 // Move reviewed practice by permanent page code. Keep the daily openers and guided sequences in place.
 const practiceTransfers = {
  1: {
   16: [8814,8818,8918,8919,8827,8829,8937,8939,8833],
   26: [8836,8950,8844,8847,8965,8859,8981,8864,8868,8995,8874,8877,9013]
  },
  2: {
   16: [8818,8919,8945,8942,8946], 20: [8950,8953],
   24: [8858,8980,8876,8877], 26: [8857,8978,8983,9011,9012,9037]
  },
  3: {
   20: [8940,8946,8950], 24: [8807,8905,8910,8919,8949,8858,8979,8878,9010],
   26: [8953,8857,8976,8983,8872,8876,9006,9012,9014,9037]
  }
 };
 const pagesById = new Map(newPages.map(page => [page.id, page]));
 for (const grade of gradeList) {
  const days = Object.values(plans).flatMap(plan => plan.grades[grade].map((day, index) => ({day,index,week:plan.week})));
  const transfers = new Map(Object.entries(practiceTransfers[grade]).map(([date, codes]) =>
   [Number(date), codes.map(code => 'OP'+grade+'-'+code)]));
  const moving = new Set([...transfers.values()].flat());
  const entriesByCode = new Map(days.flatMap(({day}) => day.questions.map(entry => [pagesById.get(entry.id).pageCode,entry])));
  for (const {day,index,week} of days) {
   const questions = day.questions.filter(entry => !moving.has(pagesById.get(entry.id).pageCode));
   const added = (transfers.get(Number(day.date.slice(-2))) || []).map(code => entriesByCode.get(code)).filter(Boolean);
   const doublesStart = questions.findIndex(entry => pagesById.get(entry.id).config.task.kind === 'doubles-practice');
   if (added.length) questions.splice(doublesStart < 0 ? questions.length : doublesStart,0,...added);
   day.questions = questions.map((entry, position) => {
    const page = pagesById.get(entry.id);
    const number = position + 1;
    page.homeworkWeek = week;
    page.homeworkDay = index;
    page.config.questionNumber = number;
    return {...entry,number};
   });
  }
 }
 // November 22 teacher review: remove the equation-dropdown strategy format
 // (estimation, compensation and front-end addition) from the assigned second week,
 // then balance its surviving pages over Monday through Thursday. Keep permanent
 // IDs and page codes so saved work and teacher notes follow each moved page.
 const reviewedPlan = plans['2026-11-23'];
 const removedStrategyIds = new Set();
 reviewedPlan.label = 'November 23–26';
 for (const grade of gradeList) {
  const originalDays = reviewedPlan.grades[grade];
  const remaining = originalDays.flatMap(day => day.questions).filter(entry => {
   const page = pagesById.get(entry.id);
   const remove = page.kind === 'strategy-lesson' &&
    ['equations','benchmarks'].includes(page.config.task.model?.type);
   if (remove) removedStrategyIds.add(page.id);
   return !remove;
  });
  const count = 4;
  const base = Math.floor(remaining.length / count), extra = remaining.length % count;
  let offset = 0;
  reviewedPlan.grades[grade] = originalDays.slice(0, count).map((day, index) => {
   const questions = remaining.slice(offset, offset + base + (index < extra ? 1 : 0));
   offset += questions.length;
   return {...day, focus:'Addition, subtraction and patterns',
    picture:{...day.picture,caption:'Addition, subtraction and patterns'},
    questions:questions.map((entry, position) => {
     const page = pagesById.get(entry.id), number = position + 1;
     page.homeworkWeek = reviewedPlan.week;
     page.homeworkDay = index;
     page.config.questionNumber = number;
     return {...entry,number};
    })};
  });
 }
 for (let index = newPages.length - 1; index >= 0; index--) {
  if (removedStrategyIds.has(newPages[index].id)) newPages.splice(index,1);
 }
 function structureFor(page) {
  const task=page.config?.task||page,model=task.model;
  let key,label;
  if(task.layout==='money') {
   key='money-'+task.mode;label={match:'Match Canadian money',compare:'Compare money values',order:'Order money values',equivalent:'Equivalent money amounts',change:'Estimate and make change'}[task.mode];
  } else if(model?.borrow||model?.type==='columns'&&model.symbol==='−'||model?.type==='ten'&&task.title==='Subtract ones') {
   key='subtraction-columns';label='Subtraction in columns';
  } else if(task.layout==='vertical-addition') {key='addition-columns';label='Addition in columns';
  } else if(task.layout==='pattern-position') {key='pattern-position';label='Find a shape position';
  } else if(task.layout==='difference') {key='difference-pad';label='Build a difference';
  } else if(task.layout==='balance-lab') {key='balance-lab';label='Balance Lab';
  } else if(task.layout==='strategy-lesson') {
   key=model.type;label={line:'Number-line jumps',parts:'Part-whole diagrams',blocks:'Base-ten trades',
    'object-array':'Build an array','two-ways':'Solve in two ways',ten:'Ten-frame addition',doubles:'Doubles and fives models'}[key]||task.title;
  } else if(task.kind==='pattern-lab') {
   key=task.table?'pattern-table':task.build?'pattern-build':task.newSquares?'pattern-growing':'pattern-rows';
   label={'pattern-table':'Pattern tables','pattern-build':'Build a growing pattern','pattern-growing':'Growing shape patterns','pattern-rows':'Read and extend pattern rows'}[key];
  } else if(task.kind==='five-lab') {
   key=task.fives.rows?'fives-rows':task.fives.pack?'fives-pack':task.fives.models?'fives-models':task.fives.hunt?'fives-hunt':'fives-facts';
   label={'fives-rows':'Count by fives','fives-pack':'Pack groups of five','fives-models':'Read groups of five','fives-hunt':'Find products of five','fives-facts':'Five-times facts'}[key];
  } else {
   key=task.kind||task.layout;
   label={'doubles-practice':'Doubles problem solving','parity-pair':'Pair objects','parity-digits':'Ones-digit patterns',
    'parity-sort':'Sort even and odd','parity-neighbours':'Even and odd neighbours'}[key]||task.title;
  }
  return {key:'november:'+key,label};
 }
 // November 23 review: trim three repeated examples per current day/structure,
 // keeping one, then spread both the page totals and structure mix evenly.
 const structureReview={perDay:3,minimum:1,removed:[],days:[]};
 const structureRemovedIds=new Set();
 for(const grade of gradeList) {
  const days=reviewedPlan.grades[grade];
  const survivors=[];
  for(const day of days) {
   const groups=new Map();
   for(const entry of day.questions) {
    const description=structureFor(pagesById.get(entry.id));
    if(!groups.has(description.key))groups.set(description.key,{...description,entries:[]});
    groups.get(description.key).entries.push(entry);
   }
   for(const group of groups.values()) {
    const removeCount=Math.min(3,Math.max(0,group.entries.length-1));
    const removed=group.entries.slice(group.entries.length-removeCount);
    for(const entry of removed) {
     structureRemovedIds.add(entry.id);
     structureReview.removed.push({id:entry.id,pageCode:pagesById.get(entry.id).pageCode,grade,date:day.date,structure:group.key});
    }
    structureReview.days.push({grade,date:day.date,structure:group.key,label:group.label,before:group.entries.length,removed:removeCount,kept:group.entries.length-removeCount});
   }
   survivors.push(...day.questions.filter(entry=>!structureRemovedIds.has(entry.id)));
  }
  const byStructure=new Map();
  for(const entry of survivors) {
   const key=structureFor(pagesById.get(entry.id)).key;
   if(!byStructure.has(key))byStructure.set(key,[]);
   byStructure.get(key).push(entry);
  }
  const buckets=days.map(()=>new Map());let cursor=0;
  for(const [key,entries] of byStructure) {
   const quotas=days.map(()=>Math.floor(entries.length/days.length));
   for(let extra=0;extra<entries.length%days.length;extra++)quotas[cursor++%days.length]++;
   let offset=0;
   quotas.forEach((quota,index)=>{buckets[index].set(key,entries.slice(offset,offset+quota));offset+=quota;});
  }
  reviewedPlan.grades[grade]=days.map((day,index)=>{
   const groups=[...buckets[index].values()],questions=[];
   for(let round=0;groups.some(group=>round<group.length);round++)for(const group of groups)if(group[round])questions.push(group[round]);
   return {...day,questions:questions.map((entry,position)=>{
    const page=pagesById.get(entry.id),number=position+1;
    page.homeworkWeek=reviewedPlan.week;page.homeworkDay=index;page.config.questionNumber=number;
    return {...entry,number};
   })};
  });
 }
 for(let index=newPages.length-1;index>=0;index--)if(structureRemovedIds.has(newPages[index].id))newPages.splice(index,1);
 // Two new money activities per day are added after the reviewed practice trim.
 // Keep all existing survivors, identities and ordering; alternate money with practice.
 for(const grade of gradeList) {
  reviewedPlan.grades[grade].forEach((day,dayIndex)=>{
   const additions=window.ML_NOVEMBER_MONEY_CONTENT.tasksFor(grade,dayIndex).map((money,index)=>{
    const task={...money,layout:'money'},id='hw-'+day.date+'-g'+grade+'-money-'+(index+1),pageCode='MO'+grade+'-'+(9301+dayIndex*2+index),revision='money-v1';
    const explanation=window.ML_NOVEMBER_MONEY_CONTENT.expectations[grade];
    const page={id,qid:id,grade,pageCode,codes:['F1.1'],title:task.title,prompt:task.prompt,directions:task.directions,
     homeworkOnly:true,homeworkWeek:reviewedPlan.week,homeworkDay:dayIndex,group:'november-money',groupTitle:'Canadian money',category:'financial',ontarioTopic:'financial',engine:'november-money',kind:'money',revision,
     details:[{code:'F1.1',curriculumExplanation:explanation,explanation:task.directions,url:'https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g'+grade+'-math/strand-f/f1'}],learningGoal:grade===1?'I can identify and compare Canadian money.':grade===2?'I can make the same amount of money in different ways.':'I can estimate and make the correct change.',
     config:{grade,pageCode,title:task.title,task,revision,narratePrompt:true}};
    newPages.push(page);pagesById.set(id,page);
    return {id,title:page.title,codes:page.codes,section:'Canadian money',sectionId:'financial:november-money'};
   });
   day.questions.splice(Math.ceil(day.questions.length/2),0,additions[0]);day.questions.push(additions[1]);
   day.focus='Number, patterns and money';day.picture.caption=day.focus;
   day.questions=day.questions.map((entry,position)=>{const number=position+1;pagesById.get(entry.id).config.questionNumber=number;return {...entry,number};});
  });
 }
 for(const page of newPages) {
  const structure=structureFor(page);
  page.config.sourceStructure=structure.key;page.config.sourceStructureLabel=structure.label;
 }
 reviewedPlan.questionsPerDay = Math.max(...Object.values(reviewedPlan.grades).flatMap(days => days.map(day => day.questions.length)));
 function register() {
  Object.assign(window.ML_HOMEWORK_WEEKS, plans);
  window.ML_HOMEWORK_PAGES.push(...newPages);
 }
 window.ML_NOVEMBER_ADDITION = {plans, paths, pages: newPages, register,structureFor,structureReview};
})();
