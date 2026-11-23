/* Keep a single week picker and offer only weeks available for the selected path. */
(() => {
 const app = window.ML_APP;
 if (!app) return;
 const label = document.getElementById('homeworkWeekPicker');
 const select = label.querySelector('select');
 let kind, grade, restricted;
 function sync() {
  const nextKind = app.assignmentKind();
  const nextGrade = Number(document.body.dataset.grade) || 2;
  const nextRestricted=window.ML_STUDENT_HOMEWORK_ACCESS?.restricted()===true;
  if (nextKind !== kind || nextGrade !== grade || restricted!==nextRestricted) {
   kind = nextKind;
   grade = nextGrade;
   restricted=nextRestricted;
   label.querySelector('span').textContent = kind === 'classwork' ? 'Classwork week' : 'Homework week';
   const plans = kind === 'classwork' ? ML_CLASSWORK_WEEKS : ML_HOMEWORK_WEEKS;
   const range = new Intl.DateTimeFormat('en-CA', {month: 'short', day: 'numeric', timeZone: 'UTC'});
   const options = Object.keys(plans).sort().reverse().flatMap(week => {
    if(window.ML_STUDENT_HOMEWORK_ACCESS&&!window.ML_STUDENT_HOMEWORK_ACCESS.allowsWeek(kind,week))return [];
    const plan = plans[week], days = plan.grades[grade];
    if (!days?.length) return [];
    const first = new Date(days[0].date + 'T12:00Z');
    const last = new Date((plan.catchUp || days.at(-1).date) + 'T12:00Z');
    const name = plan.label || range.formatRange(first, last);
    const closed = week === '2026-11-09' && (kind === 'classwork' || ML_HOMEWORK_RELEASES[week] !== true);
    return new Option(name + (closed ? ' · Not open yet' : ''), week);
   });
   select.replaceChildren(...options);
  }
  select.value = app.homeworkWeek();
 }
 select.onchange = () => { app.homework(null, null, kind, select.value); sync(); };
 new MutationObserver(sync).observe(document.body, {attributes:true, attributeFilter:['data-view','data-grade','data-teacher-admin']});
 sync();
})();
