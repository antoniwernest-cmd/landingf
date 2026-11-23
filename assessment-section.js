/* Current-homework patterning and algebra assessment. */
window.ML_ASSESSMENT_SECTION={open(){
 if(window.ML_STUDENT_HOMEWORK_ACCESS?.restricted())return window.ML_APP?.homework(null,null,'homework',window.ML_STUDENT_HOMEWORK_ACCESS.week);
 window.ML_APP?.save();document.getElementById('stopVoice')?.click();document.getElementById('grownUpMenu')?.hidePopover();
 const url=new URL('Patterning-Assessment-20/index.html',location.href),g=Number(document.getElementById('grade')?.value)||2;
 url.searchParams.set('grade',String(g));const student=document.getElementById('student')?.value;if(student&&student!=='default')url.searchParams.set('student',student);
 location.assign(url.href);
}};
document.getElementById('patternAssessmentOpen')?.addEventListener('click',()=>window.ML_ASSESSMENT_SECTION.open());
