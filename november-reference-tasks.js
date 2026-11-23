/* Questions adapted from the supplied Math Landing activity references. */
(() => {
 const questions = {
  'CondorMoreLessA.html':{
   idSuffix:'-condor-more-less',pageCode:'OP3-9153',kind:'compare-blocks',code:'B2.5',
   title:'How many more blocks?',prompt:'Mike has 47 blocks. Dana has 122 blocks. How many more blocks does Dana have?',
   directions:'Drag or tap blocks to build the difference. Then choose an answer.',
   first:47,second:122,values:[50,10,5,1],choices:[65,74,75,76,85]
  },
  'DreamB3.html':{
   idSuffix:'-dream-b3',pageCode:'OP3-9154',kind:'subtract-blocks',code:'B2.5',
   title:'Subtract 47 − 8',prompt:'Use the blocks to solve 47 − 8.',
   directions:'Select a ten to trade it for ten ones. Select a one to take it away or put it back.',first:47,second:8
  },
  'DreamB4.html':{
   idSuffix:'-dream-b4',pageCode:'OP3-9155',kind:'subtract-blocks',code:'B2.5',
   title:'Subtract 23 − 5',prompt:'Use the blocks to solve 23 − 5.',
   directions:'Select a square labelled 10 to trade it. Select a one to take it away or put it back.',first:23,second:5,compactTens:true
  },
  'panther10squares1.html':{
   idSuffix:'-ten-frames-9-plus-7',pageCode:'OP3-9156',kind:'ten-frames',code:'B2.5',
   title:'Add with ten frames',prompt:'Use the ten frames to show 9 + 7. What is the sum?',
   directions:'Move the discs, then add.',first:9,second:7
  },
  'panther10squares-inspire.html':{
   idSuffix:'-inspire-ten-frames',pageCode:'OP3-9321',kind:'ten-frames',code:'B2.3',requireFullTen:true,
   title:'Add with ten frames · Inspire',prompt:'Show 8 + 6. Fill one ten frame to make the addition easier.',
   directions:'Move the discs, then add.',first:8,second:6,
   expectation:'Use a mental math strategy such as making ten to add whole numbers.'
  },
  'pantheramitandmara.html':{
   idSuffix:'-amit-and-mara',pageCode:'PA3-9157',kind:'shared-patterns',code:'C1.3',
   title:'Find the shared numbers',prompt:'Amit starts at 2 and adds 3. Mara starts at 5 and adds 4.',
   directions:'Complete 12 terms in each pattern. Then select the circles above every number the patterns share.',
   expectation:'Use pattern rules to extend patterns and determine missing numbers.',
   patterns:[{name:'Amit',start:2,step:3},{name:'Mara',start:5,step:4}],length:12
  },
  'pantherarraya.html':{
   idSuffix:'-stamp-array',pageCode:'OP3-9158',kind:'stamp-array',code:'B2.6',
   title:'Read the stamp array',prompt:'Which multiplication sentence describes these stamps?',
   directions:'Count the rows, then the stamps in each row. Select a stamp if counting it helps.',
   expectation:'Represent multiplication using tools and drawings, including arrays.',
   rows:4,columns:6
  },
  'panthernumberbondsa.html':{
   idSuffix:'-card-number-bond',pageCode:'NS3-9159',kind:'number-bond',code:'B1.1',
   title:'Complete the number bond',prompt:'There are 6 blue cards and 5 green cards. Complete the number bond.',
   directions:'Choose the two parts and the whole.',first:6,second:5,choices:[5,6,10,11,12]
  },
  'pantherverticaladd.html':{
   idSuffix:'-add-278-and-365',pageCode:'OP3-9160',layout:'vertical-addition',code:'B2.4',
   title:'Add 278 + 365',prompt:'Use place-value blocks to add 278 and 365.',
   directions:'Choose the full ones total first. Drag the 1 to the next carry box, or tap the 1.',addends:[278,365]
  }
 };
 const tenFrameArt={image:'ten-frame-student.jpg',alt:'A student moves a silver counting disc into an empty ten-frame space.'};
 window.ML_NOVEMBER_REFERENCE_TASKS=Object.fromEntries(Object.entries(questions).map(([file,task])=>[file,{
  layout:'reference-activity',...task,art:{slug:task.kind==='stamp-array'?'sailboat':'block'},
  ...(task.kind==='ten-frames'?tenFrameArt:{})
 }]));
 const story=(id,number,title,prompt,values,blank,imagePosition,alt)=>({
  idSuffix:'-missing-'+id,pageCode:'EQ2-'+number,kind:'missing-number-story',day:16,code:'C2.3',title,prompt,
  values,blank,imagePosition,alt,image:'lantern-festival.jpg',reference:'JUMP Math 2.1, p. 105',
  directions:'Choose the sign and the missing number to make the equation match the story.',
  expectation:'Use equivalent relationships for whole numbers up to 100 in different contexts.'
 });
 const parity=(id,number,day,kind,title,prompt,directions,task)=>({
  idSuffix:'-even-odd-'+id,pageCode:'PA2-'+number,day,kind,code:id==='pair'||id==='sort'?'B1.5':'C1.3',title,prompt,directions,
  expectation:id==='pair'||id==='sort'?'Describe what makes a whole number even or odd.':
   'Use pattern rules to extend number patterns and find missing elements.',
  image:'firefly-express.jpg',alt:'A mint and gold woodland train at a firefly festival.',
  reference:'JUMP Math 2.2, pp. 17–20',...task
 });
 window.ML_NOVEMBER_EXCITE_REFERENCES=[
  story('lanterns',9161,'How many lanterns at first?','Mina sent 6 lanterns into the sky. She still has 13 lanterns. How many lanterns did she start with?',
   [19,6,13],0,'left','Mina releases a glowing paper lantern at a garden festival.'),
  story('kites',9162,'Find the number of blue kites','Theo has 27 kites. Of those, 12 are yellow and the rest are blue. How many are blue?',
   [27,12,15],2,'center','Theo sorts yellow and blue kites at the festival.'),
  story('boats',9163,'How many boats went in?','Asha had 34 toy sailboats. She put some in the pond. There are 19 still on the dock. How many did she put in the pond?',
   [34,15,19],1,'right','Asha sets toy sailboats afloat on the festival pond.'),
  parity('pair',9164,23,'parity-pair','Give each firefly a partner','The Firefly Express has two groups of riders. Which group can all sit in pairs?',
   'Select two fireflies to make a pair. Select a paired firefly to undo.',{groups:[11,12]}),
  parity('digits',9165,23,'parity-digits','Find the ones-digit pattern','Read the train car numbers. What happens to the ones digits as you count by 2?',
   'Fill in the missing ones digits on both trains.',{rows:[[24,26,28,30,32,34],[25,27,29,31,33,35]],blanks:[2,3,5]}),
  parity('sort',9166,24,'parity-sort','Sort the train cars','Is each car number even or odd? Look at its ones digit.',
   'Choose Even or Odd for each car.',{numbers:[35,40,45,50,60,70,83,96]}),
  parity('neighbours',9167,24,'parity-neighbours','Count back and count on by 2','Find the even or odd number before and after each train car.',
   'Stay on the same pattern. Count back 2 and count on 2.',{numbers:[48,73]})
 ].map(task=>({layout:'reference-activity',...task}));

 const fiveField=(label,answer,options)=>({label,answer,options});
 const product=(label,n)=>fiveField(label,n,[n-10,n-5,n,n+5,n+10].filter(v=>v>=0&&v<=50));
 const missing=answer=>({answer,options:[answer-5,answer-1,answer,answer+1,answer+5].filter(n=>n>=0&&n<=50)});
 const rail=(label,values)=>({label,values});
 const twoWays=(groups,size)=>[groups+' × '+size,size+' × '+groups,groups+' + '+size];
 const schoolFives={
  1:[
   [24,'NS1-9251','B1.5','Count on by fives','The workshop sends out five star parcels at a time. Fill in the running totals.',
    {rows:[rail('From 0 to 25',[0,5,10,missing(15),20,missing(25)]),rail('From 25 to 50',[25,30,missing(35),40,missing(45),50])]}],
   [25,'PA1-9252','C1.3','Count back by fives','The workshop uses five parcels at each stop. Count back to find how many are left.',
    {rows:[rail('Start at 45',[45,40,missing(35),30,missing(25),20]),rail('Start at 25',[25,missing(20),15,missing(10),5,0])]}],
   [26,'OP1-9253','B2.5','Pack two trays','Put five star parcels in each of two trays. How many parcels are there altogether?',
    {pack:{slots:3,groups:2},questions:[fiveField('Parcels altogether',10)]}]
  ],
  2:[
   [24,'OP2-9251','B2.5','Make three equal groups','Three riders each need a tray of five star parcels. Fill one tray for each rider.',
    {pack:{slots:5,groups:3},questions:[fiveField('Parcels altogether',15)]}],
   [25,'OP2-9252','B2.5','Match the trays to a sum','Four trays each hold five parcels. Which sum shows the equal groups?',
    {models:[[4,5]],questions:[fiveField('Repeated addition','5 + 5 + 5 + 5',['4 + 5','4 + 4 + 4 + 4','5 + 5 + 5 + 5']),fiveField('Parcels altogether',20)]}],
   [26,'OP2-9253','B2.5','How many trays hold 30?','Pack 30 star parcels. Each full tray holds five. How many trays do you need?',
    {pack:{slots:8,groups:6},questions:[fiveField('Full trays',6)]}],
   [27,'PA2-9254','C1.3','A different start, the same jump','The workshop already has 13 parcels. Five more arrive each minute. Complete the pattern.',
    {rows:[rail('Running total',[13,18,missing(23),28,missing(33),missing(38)])],
     questions:[fiveField('What is the rule?','Add 5',['Add 3','Add 5','Subtract 5'])]}]
  ],
  3:[
   [23,'OP3-9251','B2.2','Multiply by five in either order','Complete the workshop’s order totals. Think of familiar groups of five.',
    {quiz:[product('7 × 5',35),product('5 × 8',40),product('4 × 5',20),product('5 × 0',0)]}],
   [24,'OP3-9252','B2.2','Find the five-times products','Select every tag that can be made with zero to ten groups of five.',
    {hunt:[36,15,50,7,0,45,55,25,32,10,42,40]}],
   [25,'OP3-9253','B2.2','Find the missing factor','An order slip gives the total. Find the number that goes in the empty box.',
    {quiz:[fiveField('5 × □ = 45',9),fiveField('□ × 5 = 30',6),fiveField('5 × □ = 0',0),fiveField('□ × 5 = 50',10)]}],
   [26,'OP3-9254','B2.6','Turn the array','Both arrays have the same parcels. Read each as number of rows × parcels in each row.',
    {models:[[4,5],[5,4]],questions:[fiveField('Array A',twoWays(4,5)[0],twoWays(4,5)),fiveField('Array B',twoWays(5,4)[0],twoWays(5,4)),fiveField('Parcels in either array',20)]}],
   [27,'OP3-9255','B2.2','Connect multiplication and division','Seven trays of five parcels make 35. Use those same three numbers to complete the fact family.',
    {quiz:[fiveField('7 × 5',35),fiveField('35 ÷ 5',7),fiveField('35 ÷ 7',5)],reflection:true}]
  ]
 };
 const fivesExpectations={
  'B1.5':'Count to 50 by fives using tools and strategies.',
  'C1.3':'Use a pattern rule to extend a pattern and find missing elements.',
  '1-B2.5':'Use tools and drawings to solve equal-group problems with up to 10 items altogether.',
  '2-B2.5':'Use tools and drawings to describe and solve multiplication as repeated equal groups.',
  'B2.2':'Recall and demonstrate multiplication facts for five and their related division facts.',
  'B2.6':'Represent multiplication up to 10 × 10 using tools and drawings, including arrays.'
 };
 const doublesByDay={
  1:[[6,3,4,5,8],[2,5,7,4,6],[5,8,3,7,4],[4,6,9,3,5],[8,5,7,6,9],
     [7,2,6,3,8],[6,4,9,2,7],[5,9,4,8,6],[3,7,8,5,9],[9,6,5,7,8]],
  2:[[6,9,12,8,10],[8,10,13,9,11],[7,14,11,10,15],[9,15,16,12,14],[13,16,11,14,18],
     [14,9,19,15,16],[18,15,16,17,20],[17,22,20,18,21],[19,23,17,20,24],[24,21,22,23,19]],
  3:[[6,15,24,20,35],[12,25,32,40,46],[21,48,60,50,75],[35,64,80,68,90],[55,75,105,85,110],
     [80,120,150,95,180],[99,175,200,160,225],[150,249,300,250,350],[205,299,400,325,450],[275,399,475,425,499]]
 };
 const extraDoublesByDay={
  1:[[2,7,9,8,4],[8,6,3,7,5],[6,9,2,5,8],[7,2,5,9,6],[3,9,6,4,7],
     [5,4,9,8,2],[8,3,5,7,4],[7,2,6,9,5],[4,6,2,7,8],[2,8,4,6,9]],
  2:[[7,11,13,6,12],[9,12,14,10,13],[8,13,16,11,12],[10,14,17,13,15],[12,17,15,16,19],
     [15,18,17,20,13],[16,19,21,22,18],[20,18,23,19,22],[22,21,24,23,18],[23,20,24,21,22]],
  3:[[8,17,28,23,31],[19,27,36,41,48],[26,45,58,65,72],[38,62,76,87,92],[59,79,98,103,119],
     [85,125,149,163,190],[105,169,198,214,231],[159,245,295,305,340],[209,298,395,417,449],[279,397,469,486,498]]
 };
 window.ML_NOVEMBER_DOUBLES_PRACTICE=(grade,day,second=false)=>({
  pageCode:'OP'+grade+'-'+((second?9311:9301)+day),idSuffix:second?'-doubles-practice-2':'-doubles-practice',layout:'reference-activity',
  kind:'doubles-practice',code:'B2.3',title:'Doubles problem solving',
  prompt:'Solve the double first. Then add 1 or 2 to find the new sum.',
  directions:'Select a problem number to see how the student splits the larger addend.',
  image:'doubles-student.jpg',alt:'A student in a teal hoodie thinks through an addition problem.',
  problems:(second?extraDoublesByDay:doublesByDay)[grade][day].map((small,index)=>({small,extra:index<(second?2:3)?1:2})),
  expectation:'Use and explain mental math strategies for addition with sums to '+({1:'20',2:'50',3:'1,000'}[grade])+'.'
 });
 window.ML_NOVEMBER_FIVES=Object.fromEntries(Object.entries(schoolFives).map(([grade,tasks])=>[grade,
  tasks.map(([day,pageCode,code,title,prompt,fives],i)=>({
   day,pageCode,code,title,prompt,fives,idSuffix:'-fives-workshop-'+(i+1),layout:'reference-activity',kind:'five-lab',
   image:'star-parcel-workshop.jpg',alt:'An otter packs golden star parcels in a colourful workshop.',
   reference:'My Five Times Table Activity Booklet',
   directions:fives.pack?'Select a tray to pack it. Select it again to empty it. Then answer the question.':
    fives.hunt?'Select a number tag to mark it. Select it again to unmark it.':
    fives.quiz?'Choose the number that makes each equation true.':'Use the model or number pattern to complete each part.',
   expectation:fivesExpectations[grade+'-'+code]||fivesExpectations[code]
  }))
 ]));
})();
