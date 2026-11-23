/* Show the current homework board before the activity scripts finish loading. */
(() => {
 'use strict';
 const {plans, paths, pages} = window.ML_NOVEMBER_ADDITION;
 const prefix = 'math-landing:v1:';
 const dateLabel = new Intl.DateTimeFormat('en-CA', {month:'short', day:'numeric', timeZone:'UTC'});
 const featured = window.ML_STADIUM_LANDING.week;
 const element = id => document.getElementById(id);
 const weekPicker = element('homeworkWeekPicker').querySelector('select');
 const dayCards = element('homeworkWeek');
 const pathPicker = element('homeworkClassPicker');
 const status = element('homeworkBootStatus');
 const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(prefix+key)) ?? fallback; }
  catch { return fallback; }
 };
 const records = read('records', {});
 const learner = read('student', 'guest');
 const byId = new Map(pages.map(page => [page.id,page]));
 const entry = new URLSearchParams(location.search);
 const entryGrade = Number(entry.get('grade'));
 const entryWeek = entry.get('homeworkWeek');
 const savedWeek = read('homeworkWeek', featured);
 const savedGrade = read('grade', 2);
 let grade = paths[savedGrade] ? Number(savedGrade) : 2;
 let week = plans[savedWeek] && (savedWeek >= featured || read('featuredHomeworkSeen', null) === featured) ? savedWeek : featured;
 if (plans[entryWeek]?.grades[entryGrade]) { week = entryWeek; grade = entryGrade; }
 if(window.ML_STUDENT_HOMEWORK_ACCESS?.restricted())week=window.ML_STUDENT_HOMEWORK_ACCESS.week;
 let queued = null, loadFailed = false;

 function dailyRange(days) {
  const counts = days.map(day => day.questions.length);
  const low = Math.min(...counts), high = Math.max(...counts);
  return (low === high ? low : low+'–'+high) + ' pages a day';
 }

 function renderDays(days, countComplete) {
  dayCards.style.setProperty('--homework-days', days.length);
  dayCards.dataset.dayCount = days.length;
  dayCards.setAttribute('aria-label', days.length+' homework days');
  const cards = days.map((day,index) => {
   const card = document.createElement('article');
   card.className = 'homework-day simple-homework-day';
   card.innerHTML = '<button type="button" class="homework-day-link"><span class="homework-day-art"><img alt="" draggable="false"></span>'+
    '<span class="homework-day-copy"><strong></strong><span></span><span class="homework-day-focus"></span><small></small><b></b></span></button>';
   const button = card.firstElementChild;
   const date = dateLabel.format(new Date(day.date+'T12:00Z'));
   const total = day.questions.length, done = countComplete(day);
   button.dataset.assignmentCard = index;
   button.setAttribute('aria-label', day.weekday+' homework, '+date);
   button.querySelector('img').src = day.picture.src;
   const [weekday, when, focus, progress, action] = button.querySelector('.homework-day-copy').children;
   weekday.textContent = day.weekday;
   when.textContent = date;
   focus.textContent = day.focus;
   progress.textContent = done+' of '+total+' complete';
   const dayName = document.createElement('span');
   dayName.className = 'homework-day-action-name';
   dayName.textContent = ' '+day.weekday;
   action.append(done===total?'Review':done?'Continue':'Start',dayName,' →');
   return card;
  });
  dayCards.replaceChildren(...cards);
 }

 function showBoard() {
  if (!loadFailed) status.textContent = '';
  const plan = plans[week];
  const days = plan.grades[grade].map(day => ({...day,questions:day.questions.filter(q => !read('page-deleted:'+q.id,false))}));
  document.body.dataset.grade = grade;
  element('homeworkTitle').textContent = 'Homework · '+plan.label;
  element('homeworkLevel').textContent = dailyRange(days);
  element('pathGuide').textContent = grade===1?'Elevate':grade===2?'Rocky · Excite guide':'Luna · Inspire guide';
  weekPicker.value = week;
  for (const button of pathPicker.querySelectorAll('button')) {
   button.setAttribute('aria-pressed',String(Number(button.dataset.homeworkGrade) === grade));
  }
  renderDays(days, day => day.questions.filter(({id}) => records[learner+':'+id+':'+byId.get(id).revision]?.done).length);
 }

 window.ML_HOMEWORK_BOARD = {renderDays,dailyRange,queuedSelection:()=>queued};
 weekPicker.replaceChildren(...Object.values(plans).filter(plan=>!window.ML_STUDENT_HOMEWORK_ACCESS||window.ML_STUDENT_HOMEWORK_ACCESS.allowsWeek('homework',plan.week)).map(plan => new Option(plan.label, plan.week)));
 weekPicker.addEventListener('change', () => {
  if (window.ML_APP) return;
  week = weekPicker.value;
  queued = {grade,week,day:null};
  showBoard();
 });
 pathPicker.addEventListener('click', event => {
  const button = event.target.closest('[data-homework-grade]');
  if (window.ML_APP || !button) return;
  grade = Number(button.dataset.homeworkGrade);
  queued = {grade,week,day:null};
  showBoard();
 });
 dayCards.addEventListener('click', event => {
  const button = event.target.closest('[data-assignment-card]');
  if (window.ML_APP || !button || loadFailed) return;
  queued = {grade,week,day:Number(button.dataset.assignmentCard)};
  for (const card of dayCards.querySelectorAll('[aria-busy]')) card.removeAttribute('aria-busy');
  button.setAttribute('aria-busy','true');
  status.textContent = 'Opening '+plans[week].grades[grade][queued.day].weekday+'…';
 });
 addEventListener('load', () => {
  if (window.ML_APP) return;
  loadFailed = true;
  for (const card of dayCards.querySelectorAll('[aria-busy]')) card.removeAttribute('aria-busy');
  status.textContent = 'The activities could not finish loading. Reload Math Landing to try again.';
 }, {once:true});
 showBoard();
})();
