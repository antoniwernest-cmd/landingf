/* Student entry stays in the assigned November 23 homework week. */
(() => {
 'use strict';
 const week='2026-11-23',script=document.currentScript;
 const home=new URL('index.html',script.src);
 function isTeacher(){
  if(window.ML_TEACHER_ADMIN)return window.ML_TEACHER_ADMIN.isUnlocked()===true;
  try{return sessionStorage.getItem('math-landing:teacher-admin-unlocked')==='yes'}catch{return false}
 }
 const restricted=()=>!isTeacher();
 const allowsWeek=(kind,requested)=>!restricted()||kind==='homework'&&requested===week;
 function allowsQuestion(question){
  if(!restricted())return true;
  if(!question?.homeworkOnly||question.homeworkWeek!==week)return false;
  const days=window.ML_NOVEMBER_ADDITION?.plans[week]?.grades[question.grade];
  return days?.[question.homeworkDay]?.questions.some(entry=>entry.id===question.id)===true;
 }
 function assignedURL(){
  const url=new URL(home),grade=Number(new URLSearchParams(location.search).get('grade'));
  url.searchParams.set('homeworkWeek',week);
  if([1,2,3].includes(grade))url.searchParams.set('grade',grade);
  return url;
 }
 window.ML_STUDENT_HOMEWORK_ACCESS={week,restricted,allowsWeek,allowsQuestion};
 if(script.dataset.homeworkEntry==='archive'){
  if(restricted()){
   document.documentElement.style.visibility='hidden';
   location.replace(assignedURL().href);
  }
  return;
 }
 const style=document.createElement('style');style.id='student-homework-access-style';
 style.textContent=`
 [data-student-homework-only] #grownUpTools,
 [data-student-homework-only] #grownUpMenu,
 [data-student-homework-only] #pageReviewTick,
 [data-student-homework-only] .page-review-toggle,
 [data-student-homework-only] #homeworkWeekPicker,
 [data-student-homework-only] #homeworkActivities,
 [data-student-homework-only] #patternAssessmentOpen,
 [data-student-homework-only] #classworkButton,
 [data-student-homework-only] #teacherPageMenu,
 [data-student-homework-only] #homeworkTeacherPreview,
 [data-student-homework-only] [data-homework-preview]{display:none!important}
 `;
 document.head.append(style);
 function sync(){
  document.documentElement.toggleAttribute('data-student-homework-only',restricted());
  const app=window.ML_APP;
  if(!app||!restricted())return;
  if(app.assignmentKind()!=='homework'||app.homeworkWeek()!==week||
    document.body.dataset.view==='library'||app.current()&&!allowsQuestion(app.current()))
   app.homework(null,null,'homework',week);
 }
 sync();
 document.addEventListener('DOMContentLoaded',()=>{
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-teacher-admin','data-view']});
  sync();
 },{once:true});
})();
