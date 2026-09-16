"use strict";
(() => {
 const form=document.getElementById('adieInquiry');if(!form)return;
 const config=window.ADIE_INQUIRY_CONFIG||{};
 const button=document.getElementById('inquirySubmit');
 const status=document.getElementById('inquiryStatus');
 const connection=document.getElementById('inquiryConnection');
 const validId=typeof config.formId==='string' && /^[a-zA-Z0-9]{6,24}$/.test(config.formId);
 const validPrivacy=typeof config.privacyNoticeUrl==='string' && /^https:\/\//i.test(config.privacyNoticeUrl);
 const ready=config.enabled===true && validId && validPrivacy;
 function report(message,kind='info'){status.textContent=message;status.dataset.kind=kind;}
 if(!ready){form.addEventListener('submit',event=>event.preventDefault());button.disabled=true;connection.textContent='SETUP REQUIRED';return;}
 connection.textContent='FORM CONFIGURED';connection.style.color='#79ffae';button.disabled=false;
 const notice=document.createElement('a');notice.href=config.privacyNoticeUrl;notice.target='_blank';notice.rel='noopener noreferrer';notice.textContent='Read the privacy notice ↗';notice.style.color='#70eaff';
 document.querySelector('.inquiry-privacy')?.append(' ',notice);
 report('Ready to submit. Do not include sensitive or confidential information.');
 let busy=false;
 form.addEventListener('submit',async event=>{
   event.preventDefault();if(busy||!ready)return;
   if(!form.reportValidity())return;
   const fields=new FormData(form);
   if(String(fields.get('_gotcha')||'').trim()){report('Unable to process this submission.','error');return;}
   const payload=new FormData();
   for(const key of ['company','name','email','interest','problem','evidence','outcome','consent']){
      const value=String(fields.get(key)||'').trim();if(value)payload.set(key,value);
   }
   payload.set('_subject','ADIE Enterprise Inquiry');
   busy=true;button.disabled=true;button.textContent='SENDING…';report('Sending your inquiry…');
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
   try{
     const response=await fetch('https://formspree.io/f/'+config.formId,{method:'POST',body:payload,headers:{Accept:'application/json'},signal:controller.signal});
     if(!response.ok)throw new Error('Submission rejected');
     report('Submission accepted by the form service. An e-mail notification depends on your provider settings.','success');
     form.reset();
   }catch(err){report('Submission could not be confirmed. Please try again later; do not assume it was delivered.','error');}
   finally{clearTimeout(timeout);busy=false;button.disabled=false;button.textContent='SUBMIT ENTERPRISE INQUIRY ↗';}
 });
})();
