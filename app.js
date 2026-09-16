
// Public RUN demo: frozen historical Hillstrom point estimate, not a live ADIE engine.
const overlay = document.getElementById('runOverlay');
const state = document.getElementById('runState');
const coreStatus = document.getElementById('coreStatus');
let demoBusy = false;
function runSequence(){
  if(demoBusy || !overlay) return;
  demoBusy = true;
  overlay.hidden = false;
  document.body.classList.add('adie-demo-open');
  document.getElementById('demoResults').hidden = true;
  document.getElementById('demoInputs').hidden = false;
  state.textContent = 'PUBLIC HISTORICAL DEMO / READY';
  if(coreStatus) coreStatus.textContent = 'DEMO READY';
  document.getElementById('demoCustomers').focus();
}
function closeDemo(){
  overlay.hidden = true;
  demoBusy = false;
  document.body.classList.remove('adie-demo-open');
  document.querySelector('.visual-stage')?.classList.remove('running');
  if(coreStatus) coreStatus.textContent = 'SYSTEM READY';
}
function calculateDemo(){
  const customers = Number(document.getElementById('demoCustomers').value);
  const cost = Number(document.getElementById('demoCost').value);
  const status = document.getElementById('demoError');
  status.textContent = '';
  if(!Number.isSafeInteger(customers) || customers < 1 || customers > 1000000 ||
     !Number.isFinite(cost) || cost < 0 || cost > 10){
    status.textContent = 'Enter 1–1,000,000 customers and a delivery cost from $0 to $10.';
    state.textContent = 'INPUT REJECTED';
    if(coreStatus) coreStatus.textContent = 'INPUT REJECTED';
    return;
  }
  const estimate = 0.9694, lower = 0.3543, upper = 1.5845;
  const gross = customers * estimate;
  const delivery = customers * cost;
  const afterAssumedCost = gross - delivery;
  const valid = [gross,delivery,afterAssumedCost,customers*lower,customers*upper].every(Number.isFinite)
    && Math.abs((gross-delivery)-afterAssumedCost) < 0.000001;
  if(!valid){
    status.textContent = 'Calculation could not be verified; no result is shown.';
    state.textContent = 'CHECK FAILED';
    if(coreStatus) coreStatus.textContent = 'CHECK FAILED';
    return;
  }
  const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
  const result = document.getElementById('demoResults');
  result.querySelector('[data-result="gross"]').textContent = money(gross);
  result.querySelector('[data-result="range"]').textContent = money(customers*lower)+' – '+money(customers*upper);
  result.querySelector('[data-result="cost"]').textContent = money(delivery);
  result.querySelector('[data-result="net"]').textContent = money(afterAssumedCost);
  result.querySelector('[data-result="check"]').textContent = 'PASS — arithmetic and input bounds only';
  document.getElementById('demoInputs').hidden = true;
  result.hidden = false;
  state.textContent = 'ILLUSTRATIVE RESULT / CHECK COMPLETE';
  if(coreStatus) coreStatus.textContent = 'DEMO CHECK COMPLETE';
}
if(overlay){
  document.getElementById('demoClose').addEventListener('click',closeDemo);
  document.getElementById('demoCalculate').addEventListener('click',calculateDemo);
  document.getElementById('demoAgain').addEventListener('click',()=>{
    document.getElementById('demoResults').hidden=true;
    document.getElementById('demoInputs').hidden=false;
    state.textContent='PUBLIC HISTORICAL DEMO / READY';
    if(coreStatus) coreStatus.textContent='DEMO READY';
    document.getElementById('demoCustomers').focus();
  });
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeDemo();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && !overlay.hidden)closeDemo();});
}

// V7.1 — subtle pointer-reactive cinematic layer.
// The movement is deliberately restrained so the master composition never breaks.
const stage = document.querySelector('.visual-stage');
const scene = document.querySelector('.master-scene');
if(stage && scene){
  const glow=document.createElement('div');
  glow.className='cursor-glow';
  stage.appendChild(glow);

  let tx=0,ty=0,cx=0,cy=0,raf=0;
  function animate(){
    cx+=(tx-cx)*.075; cy+=(ty-cy)*.075;
    scene.style.transform=`scale(1.022) translate3d(${cx}px,${cy}px,0)`;
    raf=requestAnimationFrame(animate);
  }
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(finePointer){
    stage.addEventListener('pointerenter',()=>stage.classList.add('stage-active'));
    stage.addEventListener('pointerleave',()=>{
      stage.classList.remove('stage-active'); tx=0;ty=0;
    });
    stage.addEventListener('pointermove',e=>{
      const r=stage.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-.5;
      const ny=(e.clientY-r.top)/r.height-.5;
      tx=nx*-8; ty=ny*-5;
      glow.style.left=(e.clientX-r.left)+'px';
      glow.style.top=(e.clientY-r.top)+'px';
    });
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) animate();
  }
}

// Keyboard accessibility for invisible cinematic hotspots.
document.querySelectorAll('.validation-hot,.security-hot,.core-run,.action').forEach(el=>{
  el.addEventListener('focus',()=>stage?.classList.add('stage-active'));
  el.addEventListener('blur',()=>stage?.classList.remove('stage-active'));
});


// V7.5 — visual pointer layer; RUN orchestration is centralized above.
const liveStage = document.querySelector('.visual-stage');
const liveCore = document.querySelector('.core-live-layer');
const hudCursor = document.querySelector('.hud-cursor');

if(liveStage && liveCore){
  liveStage.addEventListener('pointermove',e=>{
    const r=liveStage.getBoundingClientRect();
    const px=e.clientX-r.left, py=e.clientY-r.top;

    if(hudCursor){
      hudCursor.style.left=px+'px';
      hudCursor.style.top=py+'px';
    }

    if(matchMedia('(hover:hover) and (pointer:fine)').matches &&
       !matchMedia('(prefers-reduced-motion: reduce)').matches){
      const nx=px/r.width-.5, ny=py/r.height-.5;
      liveCore.style.transform=`rotateX(${ny*-3.2}deg) rotateY(${nx*4.4}deg) translate3d(${nx*3}px,${ny*2}px,0)`;
    }

    const cr=liveCore.getBoundingClientRect();
    const overCore=e.clientX>=cr.left && e.clientX<=cr.right &&
                   e.clientY>=cr.top && e.clientY<=cr.bottom;
    liveStage.classList.toggle('core-hover',overCore);
    if(hudCursor) hudCursor.style.transform=`translate(-50%,-50%) scale(${overCore?1.22:.82})`;
  });

  liveStage.addEventListener('pointerleave',()=>{
    liveStage.classList.remove('core-hover');
    liveCore.style.transform='';
  });
}

// Give all primary page navigation real in-page behavior now.
const navTargets = {
  'HOME': '.visual-stage',
  'TECHNOLOGY': '#technology',
  'VALIDATION': '#validation',
  'SECURITY': '#security',
  'CYBERSECURITY': '#security',
  'USE CASES': '#uses',
  'ABOUT': 'footer',
  'CONTACT': 'footer'
};
document.querySelectorAll('.nav-hot a').forEach(a=>{
  const key=a.textContent.trim().toUpperCase();
  const target=navTargets[key];
  if(target){
    a.href=target.startsWith('#')?target:'#';
    a.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelector(target)?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
});


// V8.0 — route TECHNOLOGY / HOW IT WORKS to the real Technology section.
document.querySelectorAll('.nav-hot a').forEach(a=>{
  if(a.textContent.trim().toUpperCase()==='TECHNOLOGY'){
    a.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelector('#how-adie-works')?.scrollIntoView({behavior:'smooth',block:'start'});
    },true);
  }
});
document.querySelectorAll('.panel-btn').forEach(a=>{
  if(a.textContent.toUpperCase().includes('HOW IT WORKS')){
    a.setAttribute('href','#how-adie-works');
    a.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelector('#how-adie-works')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
});


// =========================================================
// V8.1 — Interactive Technology Architecture
// =========================================================
(() => {
  const nodes = [...document.querySelectorAll('.pipeline-node[data-tech]')];
  const visual = document.getElementById('visualStageMini');
  const modeBox = document.getElementById('consoleVisual');
  const step = document.getElementById('consoleStep');
  const title = document.getElementById('consoleTitle');
  const body = document.getElementById('consoleBody');
  const facts = document.getElementById('consoleFacts');
  const note = document.getElementById('consoleNote');
  if(!nodes.length || !visual) return;

  const data = {
    evidence:{
      step:'01 / EVIDENCE',
      title:'Evidence enters before a recommendation does.',
      body:'Real-world inputs are structured and validated before they enter the decision path. The purpose is to make the evidence boundary explicit and inspectable.',
      facts:[['ROLE','Validated input'],['BOUNDARY','Evidence first'],['OUTPUT','Structured context']],
      note:'ADIE separates the evidence entering a decision from the recommendation produced from it.',
      visual:`
        <div class="mini-chip" style="left:10%;top:20%">DATA</div>
        <div class="mini-chip" style="left:10%;top:46%">EVENTS</div>
        <div class="mini-chip" style="left:10%;top:72%">CONTEXT</div>
        <div class="mini-chip green" style="right:12%;top:45%">VALIDATED<br>INPUT</div>
        <div class="mini-line" style="left:31%;top:26%;width:48%;transform:rotate(20deg)"></div>
        <div class="mini-line" style="left:31%;top:51%;width:46%"></div>
        <div class="mini-line" style="left:31%;top:76%;width:48%;transform:rotate(-20deg)"></div>
        <div class="mini-dot" style="left:50%;top:38%"></div><div class="mini-dot green" style="left:67%;top:49%"></div>`
    },
    causal:{
      step:'02 / CAUSAL EFFECT',
      title:'Estimate what changes because of an intervention.',
      body:'The causal layer is designed to distinguish intervention effects from correlation alone, so candidate actions can be evaluated against estimated outcomes.',
      facts:[['QUESTION','What changes?'],['METHOD','Causal estimation'],['OUTPUT','Effect evidence']],
      note:'Hillstrom validation provides real-world causal business evidence for this part of the decision pipeline.',
      visual:`
        <div class="mini-chip" style="left:10%;top:42%">TREATMENT</div>
        <div class="mini-chip green" style="right:10%;top:20%">OUTCOME A</div>
        <div class="mini-chip" style="right:10%;top:65%">OUTCOME B</div>
        <div class="mini-dot" style="left:47%;top:48%"></div>
        <div class="mini-line" style="left:31%;top:49%;width:40%;transform:rotate(-24deg)"></div>
        <div class="mini-line" style="left:31%;top:51%;width:40%;transform:rotate(24deg)"></div>
        <div class="mini-dot green" style="left:61%;top:32%"></div><div class="mini-dot" style="left:61%;top:66%"></div>`
    },
    uncertainty:{
      step:'03 / UNCERTAINTY',
      title:'Uncertainty stays visible.',
      body:'Confidence and uncertainty remain explicit inputs to the decision process rather than being hidden behind a single point estimate.',
      facts:[['SIGNAL','Point estimate'],['RANGE','Lower ↔ Upper'],['USE','Bound decisions']],
      note:'A bounded estimate can support a different operational choice than an apparently precise number without context.',
      visual:`<div class="confidence-band"></div><div class="confidence-mean"></div>
        <div class="mini-chip" style="left:13%;top:65%">LOWER</div>
        <div class="mini-chip green" style="left:42%;top:22%">ESTIMATE</div>
        <div class="mini-chip" style="right:13%;top:65%">UPPER</div>`
    },
    decision:{
      step:'04 / DECISION',
      title:'Candidate actions are evaluated — not merely generated.',
      body:'Decision logic evaluates possible actions against evidence, constraints, uncertainty and expected impact before an action is promoted.',
      facts:[['INPUT','Candidate actions'],['EVALUATE','Constraints + impact'],['OUTPUT','Bounded choice']],
      note:'The decision layer is where evidence becomes an actionable recommendation candidate.',
      visual:`
        <div class="mini-chip" style="left:8%;top:43%">DECISION</div>
        <div class="decision-path safe" style="left:30%;top:30%;transform:rotate(-13deg)"></div>
        <div class="decision-path alt" style="left:30%;top:51%"></div>
        <div class="decision-path" style="left:30%;top:72%;transform:rotate(13deg)"></div>
        <div class="mini-chip green" style="right:8%;top:17%">PRIMARY</div>
        <div class="mini-chip violet" style="right:8%;top:43%">ALTERNATIVE</div>
        <div class="mini-chip" style="right:8%;top:69%">FALLBACK</div>`
    },
    safety:{
      step:'05 / SAFETY / FALLBACK',
      title:'Unsupported confidence should not become action.',
      body:'Explicit boundaries and fallback behavior are used when the available evidence does not justify a stronger operational recommendation.',
      facts:[['CONTROL','Safety boundary'],['BEHAVIOR','Fail / fallback'],['PURPOSE','Bounded action']],
      note:'Safety is part of the decision path, not a decorative layer added after the recommendation.',
      visual:`
        <div class="mini-chip" style="left:9%;top:27%">CANDIDATE A</div>
        <div class="mini-chip" style="left:9%;top:62%">CANDIDATE B</div>
        <div class="safety-wall"></div>
        <div class="mini-chip green" style="right:9%;top:27%">ALLOWED</div>
        <div class="mini-chip" style="right:9%;top:62%;opacity:.35">BLOCKED</div>`
    },
    holdout:{
      step:'06 / HOLDOUT VERIFICATION',
      title:'Previously unseen evidence tests whether the result survives.',
      body:'A reserved holdout can be used to check performance on evidence that was not used to produce the promoted result.',
      facts:[['HILLSTROM','12,788 records'],['STATUS','Previously unseen'],['RESULT','Consistent performance']],
      note:'The current Hillstrom evidence pack records 12,788 reserved holdout rows.',
      visual:`
        <div class="holdout-box" style="left:8%">MODEL<br><strong>BUILD</strong></div>
        <div class="holdout-box" style="left:37.5%">VERIFY<br><strong>CHECK</strong></div>
        <div class="holdout-box" style="right:8%;border-color:#00ff66;color:#8fffb7">HOLDOUT<br><strong>12,788</strong></div>
        <div class="mini-line" style="left:33%;top:51%;width:10%"></div>
        <div class="mini-line" style="left:62%;top:51%;width:10%"></div>`
    },
    value:{
      step:'07 / BUSINESS VALUE',
      title:'Decision effects are translated into measurable value.',
      body:'The business-value layer expresses decision effects in operational or economic terms while keeping assumptions and claim boundaries explicit.',
      facts:[['HILLSTROM','+$0.969 / customer'],['TYPE','Gross incremental revenue'],['CLAIM','Not net profit']],
      note:'The +$0.969 figure is the Hillstrom validation point estimate for incremental gross revenue per customer.',
      visual:`
        <div class="value-bar" style="left:17%;height:28%"></div>
        <div class="value-bar" style="left:34%;height:42%"></div>
        <div class="value-bar" style="left:51%;height:59%"></div>
        <div class="value-bar" style="left:68%;height:76%"></div>
        <div class="mini-chip green" style="right:8%;top:14%">MEASURABLE<br>IMPACT</div>`
    },
    audit:{
      step:'08 / AUDIT TRAIL',
      title:'A decision should leave evidence behind.',
      body:'Inputs, decision context and outcomes remain traceable so the path to a recommendation can be reviewed after the fact.',
      facts:[['TRACE','Inputs + context'],['REVIEW','Decision history'],['PURPOSE','Inspectability']],
      note:'Auditability supports review and evidence handling; it is not a substitute for independent external assurance.',
      visual:`
        <div class="audit-row" style="top:22%">INPUT / CONTEXT <b>RECORDED</b></div>
        <div class="audit-row" style="top:36%">DECISION STATE <b>TRACEABLE</b></div>
        <div class="audit-row" style="top:50%">OUTCOME <b>RECORDED</b></div>
        <div class="audit-row" style="top:64%">EVIDENCE PATH <b>INSPECTABLE</b></div>`
    },
    security:{
      step:'09 / SECURITY',
      title:'Security protects the decision path.',
      body:'Authentication, authorization, tenant isolation, integrity controls, observability and fail-closed behavior protect the system around the decision process.',
      facts:[['STATE','Internally validated'],['SECURITY SUITE','1,475 / 1,475'],['REGRESSIONS','0 detected']],
      note:'ADIE is a security-hardened enterprise prototype. External penetration testing and independent production assurance remain separate steps.',
      visual:`
        <div class="security-shield-mini"></div>
        <div class="mini-chip green" style="left:7%;top:18%">AUTH</div>
        <div class="mini-chip" style="left:7%;bottom:18%">RBAC</div>
        <div class="mini-chip" style="right:7%;top:18%">INTEGRITY</div>
        <div class="mini-chip green" style="right:7%;bottom:18%">FAIL-CLOSED</div>`
    }
  };

  function setFacts(items){
    facts.innerHTML = items.map(([k,v]) =>
      `<div><small>${k}</small><strong>${v}</strong></div>`
    ).join('');
  }

  function activate(node, scroll=false){
    const key=node.dataset.tech;
    const d=data[key];
    if(!d) return;
    nodes.forEach(n=>{
      const active=n===node;
      n.classList.toggle('is-active',active);
      n.setAttribute('aria-pressed',String(active));
    });
    step.textContent=d.step;
    title.textContent=d.title;
    body.textContent=d.body;
    setFacts(d.facts);
    note.textContent=d.note;
    visual.innerHTML=d.visual;
    modeBox.dataset.mode=key;
    if(scroll && innerWidth < 900){
      document.getElementById('techConsole')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }

  nodes.forEach(node=>{
    node.addEventListener('click',()=>activate(node,true));
    node.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault(); activate(node,true);
      }
    });
  });

  activate(nodes[0]);
})();


// =========================================================
// V9.0 — Hillstrom Validation Center
// =========================================================
(() => {
  const gates=[...document.querySelectorAll('.vc-gate[data-gate]')];
  if(!gates.length) return;

  const el=id=>document.getElementById(id);
  const data={
    h1:{
      title:'Dataset integrity and experimental setup established.',
      claim:'The source supports a randomized marketing experiment suitable for the defined validation.',
      method:'Validate source identity, experimental structure and the evidence boundary before downstream analysis.',
      evidence:'64,000 customer records from the Hillstrom randomized retail e-mail experiment.',
      result:'Dataset integrity and experimental setup: PASS.',
      limit:'This establishes the Hillstrom validation setup; it does not establish performance in another company, domain or time period.'
    },
    h2:{
      title:'Randomized allocation, balance and positivity established.',
      claim:'The experiment provides a valid randomized basis for the defined aggregate treatment comparisons.',
      method:'Check randomized allocation, covariate balance and positivity before causal-effect recovery.',
      evidence:'The H2 gate records randomized allocation, covariate balance and positivity.',
      result:'Experimental validity gate: PASS.',
      limit:'Randomization supports identification inside this historical experiment; it does not imply universal causal validity.'
    },
    h3:{
      title:'Six randomized treatment effects were recovered.',
      claim:'ADIE can recover the defined aggregate randomized treatment effects in this benchmark.',
      method:'Randomized difference in means with Welch standard errors; compare against a separately calculated reference (not an external audit).',
      evidence:"Men's and Women's E-Mail effects were recovered for visit, conversion and spend.",
      result:'Six effects recovered; separate reference-calculation maximum error = 0.0.',
      limit:'This is evidence for the defined randomized aggregate effects, not proof of accuracy for arbitrary causal interventions.'
    },
    h4:{
      title:"Men's E-Mail exceeded Women's E-Mail on all three tested outcomes.",
      claim:'The benchmark can discriminate between the two randomized active treatments.',
      method:"Direct Men's minus Women's contrasts with Holm multiplicity correction.",
      evidence:'Visit +0.0314, conversion +0.0037 and spend +0.3454; all family-wise significant at alpha 0.05.',
      result:"Men's E-Mail preferred for visit, conversion and spend: PASS.",
      limit:'This treatment ranking is specific to the Hillstrom experiment and these measured outcomes.'
    },
    h5:{
      title:'Unsupported personalization was rejected.',
      claim:'A personalization candidate should not be promoted when incremental value is unsupported.',
      method:'Evaluate the individualized candidate and retain a safe fallback when support is insufficient.',
      evidence:"The individualized candidate did not demonstrate incremental value; the global Men's E-Mail fallback was retained.",
      result:'Safe fallback behavior: PASS.',
      limit:'This demonstrates rejection of one unsupported candidate; it does not validate individualized decisioning generally.'
    },
    h6:{
      title:'The frozen fallback remained positive on unseen evidence.',
      claim:'The promoted global fallback should generalize to the reserved Hillstrom partition.',
      method:'Freeze the global fallback and evaluate it on the untouched H6 holdout.',
      evidence:"12,788 reserved records; Men's E-Mail vs No E-Mail: +8.2444 percentage points visit, +1.0214 percentage points conversion, +$0.9694 gross revenue/customer.",
      result:'Reserved holdout generalization: PASS.',
      limit:'This supports generalization to the reserved Hillstrom partition, not to a future company or future time period.'
    },
    h7:{
      title:'Validated effects were translated into bounded business scenarios.',
      claim:'A validated causal effect can be expressed as an explicit gross-revenue sensitivity and break-even scenario.',
      method:'Use the holdout gross-revenue effect and clearly stated cost assumptions.',
      evidence:'Gross-revenue effect $0.9694/customer; 95% interval $0.3543 to $1.5845. A $0.25/customer marginal delivery cost is an explicit scenario assumption.',
      result:'Bounded business-value translation: PASS.',
      limit:'This is not audited net profit or realized ROI; COGS, fixed costs, tax, returns and capacity effects were unavailable.'
    },
    h8:{
      title:'The evidence state is deterministic and hash-verifiable.',
      claim:'The validation result should be reproducible and its evidence artifacts integrity-checkable.',
      method:'Record deterministic recomputation, source-data identity, artifact hashes and a frozen validation state.',
      evidence:'Freeze record reports 8/8 gates, 88/88 validation tests, 2719/2719 regression tests, 2 warnings; dataset and computation SHA-256 recorded.',
      result:'Reproducibility, integrity and claim controls: PASS.',
      limit:'Checksums verify consistency with the recorded manifest, not correctness. Full pytest log, independent audit and production-readiness evidence are not published.'
    }
  };

  function activate(btn){
    const key=btn.dataset.gate,d=data[key]; if(!d) return;
    gates.forEach(g=>g.classList.toggle('is-active',g===btn));
    el('vcGateId').textContent=key.toUpperCase()+' / PASS';
    el('vcTitle').textContent=d.title;
    el('vcClaim').textContent=d.claim;
    el('vcMethod').textContent=d.method;
    el('vcEvidence').textContent=d.evidence;
    el('vcResult').textContent=d.result;
    el('vcLimit').textContent=d.limit;
    const artifactFiles={h3:'h3_causal_effects.json',h4:'h4_treatment_discrimination.json',h5:'h5_individualized_policy.json',h6:'h6_reserved_generalization.json',h7:'h7_business_value_roi.json',h8:'h8_reproducibility_manifest.json'};
    const artifact=artifactFiles[key];
    const row=el('vcArtifactRow'),link=el('vcArtifactLink'),note=el('vcArtifactNote');
    row.hidden=!artifact;
    if(artifact){
      link.href='evidence/'+artifact;
      link.textContent=key==='h8'?'OPEN H8 MANIFEST [LINK]':'OPEN '+key.toUpperCase()+' JSON EVIDENCE [LINK]';
      note.textContent=key==='h8'?'Freeze record and disclosure below.':'Original artifact, checksum recorded in H8 manifest.';
    }
  }
  gates.forEach(g=>g.addEventListener('click',()=>activate(g)));
  activate(gates[0]);

  // Existing top navigation: make Validation a real destination.
  document.querySelectorAll('.nav-hot a').forEach(a=>{
    if(a.textContent.trim().toUpperCase()==='VALIDATION'){
      a.addEventListener('click',e=>{
        e.preventDefault();
        document.querySelector('#validation-center')?.scrollIntoView({behavior:'smooth',block:'start'});
      },true);
    }
  });
  document.querySelectorAll('.panel-btn').forEach(a=>{
    if(a.textContent.toUpperCase().includes('VALIDATION DETAILS')){
      a.setAttribute('href','#validation-center');
      a.addEventListener('click',e=>{
        e.preventDefault();
        document.querySelector('#validation-center')?.scrollIntoView({behavior:'smooth',block:'start'});
      });
    }
  });
})();

// =========================================================
// V10.0 — Cybersecurity & Trust Center
// =========================================================
(() => {
 const controls=[...document.querySelectorAll('.sc-control[data-sec]')];
 if(!controls.length) return;
 const el=id=>document.getElementById(id);
 const data={
  auth:{id:'CONTROL 01 / AUTHENTICATION',title:'Authenticated sessions are required at protected API boundaries.',boundary:'Protected API access requires an authenticated session identifier.',control:'Session validation is applied before protected operations proceed.',verify:'Invalid-session rejection has been exercised in internal security validation.',fail:'Missing or invalid authentication does not silently become authorized access.',scope:'This is internal prototype validation, not an external penetration-test certification.'},
  rbac:{id:'CONTROL 02 / AUTHORIZATION',title:'Authenticated identity is constrained by explicit role boundaries.',boundary:'ADIE distinguishes admin, developer and viewer authorization roles.',control:'Role checks separate authentication from permission to perform protected operations.',verify:'Role-based authorization behavior has been included in internal enterprise verification.',fail:'A valid session does not automatically receive unrestricted authority.',scope:'The recorded role model validates the implemented prototype boundary; production IAM integration remains deployment-specific.'},
  tenant:{id:'CONTROL 03 / TENANT ISOLATION',title:'Tenant context separates organizational request scope.',boundary:'Authenticated operations carry tenant context rather than sharing an undifferentiated global scope.',control:'Tenant isolation is enforced around protected application behavior.',verify:'Tenant-isolation behavior has been exercised in internal verification.',fail:'Cross-tenant context is not treated as implicitly interchangeable.',scope:'SaaS production hardening and independent isolation assessment remain separate assurance work.'},
  api:{id:'CONTROL 04 / API HARDENING',title:'The API boundary validates request context and limits exposure.',boundary:'Protected requests are surrounded by request-ID validation, origin policy and security-header controls.',control:'Configured CORS, security headers, request identity and production HSTS capability reduce accidental boundary weakening.',verify:'Security-header and request-boundary behavior is part of the internally tested prototype.',fail:'Malformed or unauthorized request context is rejected rather than silently normalized into trust.',scope:'TLS termination, reverse-proxy policy and infrastructure configuration must still be hardened in the production environment.'},
  audit:{id:'CONTROL 05 / AUDIT & OBSERVABILITY',title:'Security-relevant request activity is designed to leave traceable evidence.',boundary:'Request start, completion and error events are observable alongside audit records.',control:'Structured observability and JSONL audit evidence support reconstruction of protected operations.',verify:'Authenticated persistence and observability behavior have been internally verified.',fail:'Security is not treated solely as an invisible perimeter with no record of relevant activity.',scope:'Production SIEM integration, retention policy and operational alerting remain deployment responsibilities.'},
  integrity:{id:'CONTROL 06 / INTEGRITY',title:'Integrity controls defend the trustworthiness of security-relevant state and evidence.',boundary:'Security decisions depend on trusted state, policy and evidence remaining consistent.',control:'Defensive tamper and integrity checks are exercised through hardened regression gates.',verify:'The recorded security checkpoint completed with zero detected security regressions.',fail:'Integrity ambiguity is handled defensively rather than assumed safe.',scope:'Independent adversarial assessment and production key-management infrastructure remain separate.'},
  abuse:{id:'CONTROL 07 / RATE & ABUSE PROTECTION',title:'Request pressure is bounded before it becomes unrestricted resource access.',boundary:'General and authentication-sensitive request paths use bounded rate policies.',control:'Rate limiting distinguishes general traffic from more sensitive authentication pressure.',verify:'Rate-limiting behavior has been included in enterprise verification.',fail:'Excess request pressure does not receive unlimited processing by default.',scope:'Production thresholds require tuning against real traffic, capacity and availability objectives.'},
  closed:{id:'CONTROL 08 / FAIL-CLOSED',title:'Security ambiguity does not become implicit permission.',boundary:'Protected operations depend on explicit security prerequisites being satisfied.',control:'Authentication, authorization, integrity and policy boundaries are designed to reject unsafe states.',verify:'Fail-closed defensive behavior is covered by the hardened security test program.',fail:'When required trust conditions are not satisfied, the safe outcome is rejection rather than privilege escalation.',scope:'Internal automated validation reduces known regression risk but cannot prove the absence of all vulnerabilities.'}
 };
 function activate(btn){
   const d=data[btn.dataset.sec]; if(!d) return;
   controls.forEach(x=>x.classList.toggle('is-active',x===btn));
   el('scId').textContent=d.id; el('scTitle').textContent=d.title;
   el('scBoundary').textContent=d.boundary; el('scControl').textContent=d.control;
   el('scVerify').textContent=d.verify; el('scFail').textContent=d.fail; el('scScope').textContent=d.scope;
 }
 controls.forEach(x=>x.addEventListener('click',()=>activate(x)));
 activate(controls[0]);

 document.querySelectorAll('.nav-hot a').forEach(a=>{
   if(a.textContent.trim().toUpperCase()==='SECURITY'){
     a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#security-center')?.scrollIntoView({behavior:'smooth',block:'start'});},true);
   }
 });
 document.querySelectorAll('.panel-btn').forEach(a=>{
   if(a.textContent.toUpperCase().includes('LEARN MORE')){
     const panel=a.closest('.panel');
     if(panel && panel.textContent.toUpperCase().includes('CYBERSECURITY')){
       a.setAttribute('href','#security-center');
       a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#security-center')?.scrollIntoView({behavior:'smooth',block:'start'});});
     }
   }
 });
})();

// =========================================================
// V11.0 — Use Cases
// =========================================================
(() => {
 const items=[...document.querySelectorAll('.uc-item[data-uc]')];
 if(!items.length) return;
 const el=id=>document.getElementById(id);
 const data={
  supply:{id:'USE CASE 01 / SUPPLY CHAIN',title:'Respond to operational disruption with explicit trade-offs.',scenario:'A shipment is delayed while fuel cost, congestion and customer impact are changing at the same time.',signal:'Delay, fuel, route and service signals enter the decision context.',question:'Should the operation hold, reroute, hedge, or combine interventions?',role:'Compare candidate actions causally, preserve uncertainty, enforce safety boundaries and expose the reasoning path.',value:'Reduce avoidable loss while keeping the chosen intervention explainable and reviewable.',evidence:'Designed application area — not yet validated as a logistics performance claim.'},
  operations:{id:'USE CASE 02 / ENTERPRISE OPERATIONS',title:'Choose among competing operational actions under constraints.',scenario:'An operating condition changes and several responses are plausible, but each has different cost, timing, reversibility and downstream effects.',signal:'Operational state, constraints, exposures and candidate-action evidence.',question:'Which action is supportable now, and when is HOLD or fallback safer?',role:'Structure the decision, compare candidates, preserve uncertainty and prevent unsupported action from being promoted.',value:'Improve decision consistency while retaining an auditable explanation of why an action was or was not selected.',evidence:'Designed application area — domain-specific operational validation is still required.'},
  risk:{id:'USE CASE 03 / RISK & RESILIENCE',title:'Balance intervention against uncertainty, irreversibility and recovery.',scenario:'A system is drifting from an acceptable state, but aggressive intervention may create new risk or reduce future options.',signal:'Risk indicators, uncertainty, intervention size, irreversibility and recovery evidence.',question:'Intervene, reduce exposure, hold, or use a safer fallback?',role:'Evaluate candidate actions inside explicit safety boundaries and keep unresolved uncertainty visible.',value:'Reduce avoidable risk without treating maximum intervention as automatically optimal.',evidence:'Designed application area — not a validated risk-management performance claim.'},
  commercial:{id:'USE CASE 04 / COMMERCIAL DECISIONS',title:'Connect treatment choice to causal evidence and bounded value.',scenario:'Several customer or commercial actions are available, but correlation alone cannot establish which action creates incremental value.',signal:'Treatment assignment, outcomes, uncertainty and business-cost assumptions.',question:'Which intervention has supported incremental effect, and is personalization justified?',role:'Estimate causal effects, discriminate between treatments, reject unsupported personalization and translate validated effects into bounded value scenarios.',value:'Focus optimization on incremental impact rather than raw prediction or response correlation.',evidence:'This pattern has real-world causal evidence in the Hillstrom validation; it does not establish performance for every commercial setting.'},
  resource:{id:'USE CASE 05 / RESOURCE ALLOCATION',title:'Allocate limited resources where consequences and constraints compete.',scenario:'Capacity, budget or attention is limited and several interventions compete for the same resources.',signal:'Expected effects, costs, constraints, confidence and opportunity-cost context.',question:'Where should limited resources be committed, deferred or protected?',role:'Make trade-offs explicit, preserve uncertainty and retain the evidence behind the selected allocation.',value:'Support more disciplined allocation decisions with measurable assumptions and reviewable reasoning.',evidence:'Designed application area — resource-allocation value requires a scoped domain benchmark or pilot.'},
  complex:{id:'USE CASE 06 / COMPLEX DECISION SYSTEMS',title:'Create a traceable path through multi-signal decision environments.',scenario:'Many signals arrive together, dependencies matter, and no single metric is sufficient to justify action.',signal:'Multiple evidence streams, state, constraints, temporal context and candidate actions.',question:'What changed, what matters causally, what action is supportable, and what must be verified afterward?',role:'Connect evidence, causal reasoning, uncertainty, safety, action choice, outcome verification and auditability in one decision path.',value:'Reduce fragmentation between analysis, decision justification and post-action verification.',evidence:'Architectural application pattern — not a universal performance or autonomy claim.'}
 };
 function activate(btn){
   const d=data[btn.dataset.uc]; if(!d) return;
   items.forEach(x=>x.classList.toggle('is-active',x===btn));
   el('ucId').textContent=d.id; el('ucTitle').textContent=d.title; el('ucScenario').textContent=d.scenario;
   el('ucSignal').textContent=d.signal; el('ucQuestion').textContent=d.question; el('ucRole').textContent=d.role;
   el('ucValue').textContent=d.value; el('ucEvidence').textContent=d.evidence;
 }
 items.forEach(x=>x.addEventListener('click',()=>activate(x)));
 activate(items[0]);
 document.querySelectorAll('.nav-hot a').forEach(a=>{
   if(a.textContent.trim().toUpperCase()==='USE CASES'){
     a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#usecases-center')?.scrollIntoView({behavior:'smooth',block:'start'});},true);
   }
 });
})();

// =========================================================
// V12.0 — About ADIE navigation
// =========================================================
(() => {
  document.querySelectorAll('.nav-hot a').forEach(a=>{
    const label=a.textContent.trim().toUpperCase();
    if(label==='ABOUT' || label==='ABOUT ADIE'){
      a.addEventListener('click',e=>{
        e.preventDefault();
        document.querySelector('#about-center')?.scrollIntoView({behavior:'smooth',block:'start'});
      },true);
    }
  });
})();

// =========================================================
// V12.1 — Global navigation and CTA routing
// =========================================================
(() => {
  const q = s => document.querySelector(s);
  const routes = {
    HOME: '#top',
    TECHNOLOGY: '.technology-section',
    VALIDATION: '#validation-center',
    CYBERSECURITY: '#security-center',
    'USE CASES': '#usecases-center',
    DOCUMENTATION: '#documentation-center',
    ABOUT: '#about-center',
    CONTACT: '#contact-center'
  };

  const go = selector => {
    const target = selector === '#top' ? document.documentElement : q(selector);
    if (!target) return false;
    if (selector === '#top') window.scrollTo({top:0, behavior:'smooth'});
    else target.scrollIntoView({behavior:'smooth', block:'start'});
    return true;
  };

  document.querySelectorAll('.nav-hot a').forEach(a => {
    const label = a.textContent.trim().toUpperCase();
    if (!routes[label]) return;
    a.href = routes[label] === '.technology-section' ? '#technology' : routes[label];
    a.addEventListener('click', e => {
      e.preventDefault();
      go(routes[label]);
    }, true);
  });

  // Contact may be styled separately from the main nav.
  document.querySelectorAll('a,button').forEach(el => {
    const label = el.textContent.trim().toUpperCase().replace(/\s+/g,' ');
    if (label === 'CONTACT' && !el.closest('#contact-center')) {
      el.addEventListener('click', e => { e.preventDefault(); go('#contact-center'); }, true);
    }
    if (label.includes('EXPLORE ADIE')) {
      el.addEventListener('click', e => { e.preventDefault(); go('.technology-section'); }, true);
    }
  });

  // Documentation cards.
  document.querySelectorAll('[data-route]').forEach(a => {
    const map = {technology:'.technology-section',validation:'#validation-center',security:'#security-center',usecases:'#usecases-center'};
    a.addEventListener('click', e => { e.preventDefault(); go(map[a.dataset.route]); });
  });

  // Active menu state follows the visible section.
  const observed = [
    ['HOME', document.body],
    ['TECHNOLOGY', q('.technology-section')],
    ['VALIDATION', q('#validation-center')],
    ['CYBERSECURITY', q('#security-center')],
    ['USE CASES', q('#usecases-center')],
    ['DOCUMENTATION', q('#documentation-center')],
    ['ABOUT', q('#about-center')]
  ].filter(x => x[1]);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      const pair = observed.find(x=>x[1]===visible.target);
      if (!pair) return;
      document.querySelectorAll('.nav-hot a').forEach(a =>
        a.classList.toggle('is-route-active', a.textContent.trim().toUpperCase()===pair[0])
      );
    }, {rootMargin:'-18% 0px -62% 0px', threshold:[0,.05,.15,.3]});
    observed.slice(1).forEach(x=>io.observe(x[1]));
  }
})();

// =========================================================
// V12.2 — Real click controller for baked hero controls
// =========================================================
(() => {
 const targetMap={
   home:()=>window.scrollTo({top:0,behavior:'smooth'}),
   technology:()=>document.querySelector('.technology-section')?.scrollIntoView({behavior:'smooth',block:'start'}),
   validation:()=>document.querySelector('#validation-center')?.scrollIntoView({behavior:'smooth',block:'start'}),
   security:()=>document.querySelector('#security-center')?.scrollIntoView({behavior:'smooth',block:'start'}),
   usecases:()=>document.querySelector('#usecases-center')?.scrollIntoView({behavior:'smooth',block:'start'}),
   documentation:()=>document.querySelector('#documentation-center')?.scrollIntoView({behavior:'smooth',block:'start'}),
   about:()=>document.querySelector('#about-center')?.scrollIntoView({behavior:'smooth',block:'start'}),
   contact:()=>document.querySelector('#contact-center')?.scrollIntoView({behavior:'smooth',block:'start'})
 };
 document.querySelectorAll('[data-real-route]').forEach(a=>{
   a.addEventListener('click',e=>{
     e.preventDefault();
     targetMap[a.dataset.realRoute]?.();
   });
 });

 document.querySelectorAll('.hero-zone[data-hero-action]').forEach(btn=>{
   btn.addEventListener('click',()=>{
     const action=btn.dataset.heroAction;
     if(action==='run') return; // Existing #runDemo / #coreRun listeners execute the public demo.
     else targetMap[action]?.();
   });
 });
})();

// V12.4 — Register hit areas to actual pixels of the object-fit:cover master image.
// Original artwork dimensions: 1536 x 1024. Image uses object-position:center top.
(() => {
 const stage=document.querySelector('.visual-stage');
 const img=stage?.querySelector('.master-scene');
 const zones=stage?.querySelector('.hero-real-controls');
 if(!stage||!img||!zones)return;
 const art={
   'zone-data':[510,134,110,100],
   'zone-causal':[490,245,105,105],
   'zone-decision':[527,364,106,105],
   'zone-safety':[1021,133,110,100],
   'zone-action':[1045,246,105,105],
   'zone-learn':[1008,364,110,105],
   'zone-run':[703,448,225,46],
   'zone-run-demo':[45,393,202,54],
   'zone-explore':[255,393,207,54]
 };
 const nav=document.querySelector('.real-top-nav');
 function align(){
   const W=stage.clientWidth,H=stage.clientHeight;
   if(!W||!H)return;
   const scale=Math.max(W/1536,H/1024);
   const x=(W-1536*scale)/2;
   const y=0; // CSS object-position:center top
   for(const [cls,rect] of Object.entries(art)){
     const el=zones.querySelector('.'+cls);
     if(!el)continue;
     el.style.setProperty('left',(x+rect[0]*scale)+'px','important');
     el.style.setProperty('top',(y+rect[1]*scale)+'px','important');
     el.style.setProperty('width',(rect[2]*scale)+'px','important');
     el.style.setProperty('height',(rect[3]*scale)+'px','important');
   }
   // Navigation hitboxes are registered to the same art, not viewport percentages.
   if(nav && W>620){
     nav.style.left=(stage.getBoundingClientRect().left+window.scrollX+x+470*scale)+'px';
     nav.style.right='auto';
     nav.style.top='0px';
     nav.style.width=(796*scale)+'px';
     nav.style.height=(64*scale)+'px';
   }
 }
 align();
 window.addEventListener('resize',align,{passive:true});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(align).observe(stage);
 img.addEventListener('load',align,{once:true});
 // Capture before older V12.1/V12.2 click handlers; run the real local demo exactly once.
 zones.querySelectorAll('[data-hero-action="run"]').forEach(btn=>{
   btn.addEventListener('click',e=>{
     e.preventDefault();e.stopImmediatePropagation();
     if(typeof runSequence==='function')runSequence();
     if(typeof liveCoreSequence==='function')liveCoreSequence();
   },true);
 });
})();

// V12.5 — evidence walkthrough. No backend calls, no invented live results.
(() => {
 const data = {
 decision: [
 ['Problem','What specific action needs support?','Hillstrom example: choosing an e-mail treatment against a no-email baseline in a randomized marketing experiment.','This example does not establish performance for unrelated industries or future campaigns.','Hillstrom experiment / 64,000 records','#validation-center'],
 ['Evidence','What observations support a causal comparison?','Randomized treatment assignment and experimental checks; H1 and H2 passed in the project validation.','Randomization in Hillstrom cannot establish causal identification in arbitrary observational datasets.','Hillstrom H1–H2','#validation-center'],
 ['Decision','What intervention is supported by the validation?','The personalized candidate was not promoted. A frozen Mens E-Mail fallback was selected for holdout evaluation.','This is not proof of generally reliable individualized treatment selection.','Hillstrom H5–H6','#validation-center'],
 ['Uncertainty','How wide is the plausible outcome range?','Reserved holdout gross incremental revenue estimate: $0.9694/customer; 95% interval $0.3543–$1.5845.','The interval is not a guarantee of future results or net profit.','Hillstrom H6–H7','#validation-center'],
 ['Verification','Was the frozen decision tested on reserved records?','12,788 previously unseen holdout records; 8/8 gates and 88/88 validation tests passed.','This is historical experimental validation, not a prospective customer pilot.','Hillstrom H6 and H8','#validation-center'],
 ['Business Impact','How is a causal effect translated into business terms?','100,000-customer illustration: approximately $96,943 estimated incremental gross revenue; assumed delivery cost $0.25/customer yields $71,943 after that assumed cost.','The example is sensitivity analysis, not audited net profit, realized ROI, or a client result.','Hillstrom H7','#validation-center']
 ],
 system: [
 ['Identity','Who is requesting an operation?','The prototype documents mandatory session identification and authentication controls.','Public website navigation does not authenticate a user or prove production identity assurance.','ADIE CYBER / authentication','#security-center'],
 ['Authorization','What is this identity allowed to do?','Documented admin, developer and viewer roles; role-based access control is part of internal security validation.','Actual permissions must be verified in the deployed environment and per endpoint.','ADIE CYBER / RBAC','#security-center'],
 ['Isolation','Can one tenant access another tenant’s data?','Tenant-scoped controls and isolation checks are included in the prototype security work.','A passing internal suite is not an independent multi-tenant SaaS assessment.','ADIE CYBER / tenant isolation','#security-center'],
 ['Integrity','Can the decision evidence be checked for modification?','Hillstrom evidence has recorded dataset/computation SHA-256 hashes and a frozen evidence snapshot; security work includes integrity checks.','A checksum alone does not establish provenance, signer identity or secure production key custody.','Hillstrom H8 + ADIE CYBER','#validation-center'],
 ['Audit','Can a decision or request be reviewed afterwards?','The prototype documents request observability and JSONL audit logging; the validation report includes reproducibility evidence.','Audit completeness, retention and operational monitoring still need deployment-specific assurance.','ADIE CYBER / audit','#security-center'],
 ['Security Verification','Which controls have been tested, and what remains?','Internal security suite: 1,475/1,475 passing; 0 detected regressions at the recorded checkpoint.','Independent penetration testing, production hardening and external certification are not claimed.','Internal security checkpoint','#security-center']
 ]
 };
 const root=document.querySelector('#decision-trust-journey');if(!root)return;
 const el=id=>root.querySelector('#'+id);let lane='decision',index=0;
 const steps=el('tjSteps');
 function render(){
   root.querySelectorAll('[data-journey]').forEach(b=>{const active=b.dataset.journey===lane;b.classList.toggle('tj-selected',active);b.setAttribute('aria-pressed',String(active));});
   steps.replaceChildren();data[lane].forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className=i===index?'tj-selected':'';b.setAttribute('aria-pressed',String(i===index));const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0')+' / 06';b.append(n,document.createTextNode(item[0]));b.addEventListener('click',()=>{index=i;render();});steps.append(b);});
   const item=data[lane][index];el('tjStepNumber').textContent=String(index+1).padStart(2,'0')+' / 06';el('tjEvidenceType').textContent=lane==='decision'?'DECISION EVIDENCE':'SYSTEM CONTROL';
   ['tjStepTitle','tjStepQuestion','tjStepProof','tjStepLimit','tjStepSource'].forEach((id,i)=>el(id).textContent=item[i]);el('tjEvidenceLink').href=item[5];el('tjEvidenceLink').textContent=item[5]==='#validation-center'?'OPEN VALIDATION EVIDENCE ↗':'OPEN SECURITY EVIDENCE ↗';
 }
 root.querySelectorAll('[data-journey]').forEach(b=>b.addEventListener('click',()=>{lane=b.dataset.journey;index=0;render();}));render();
})();
