import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name+'.json'),'utf8'));
export function validate(input){
 const names=['documents','processes','process-groups','references','diagrams','tags','relationships','onboarding','stops','gaps','departments','settings','source-links','source-review'];
 const c=input||Object.fromEntries(names.map(n=>[n,read(n)])),errors=[],warnings=[],ids=new Set(),tags=new Set(c.tags.map(t=>t.id));
 const fail=s=>errors.push(s),required=['id','title','department','warehouseApplicability','documentType','processCategory','tags','documentationStatus','reviewStatus','publicationStatus','trainingRequired','source'];
 const safeFile=(p,base=root)=>{const full=path.resolve(base,p);return full.startsWith(base+path.sep)&&fs.existsSync(full)&&fs.statSync(full).isFile();};
 for(const [group,prefix]of [['documents','page'],['processes','process'],['process-groups','group'],['references','reference'],['diagrams','diagram']])for(const r of c[group]){
  const key=prefix+':'+r.id;if(ids.has(key))fail('Duplicate ID '+key);ids.add(key);
  for(const f of required)if(r[f]===undefined)fail(key+' missing '+f);
  if(!/^[a-z0-9][a-z0-9-]*$/i.test(r.id))fail('Unstable/unsafe ID '+key);
  if(!['MT','ID','Both','Unknown'].includes(r.warehouseApplicability))fail('Warehouse '+key);
  if(!['draft','reference','published'].includes(r.publicationStatus))fail('Publication state '+key);
  if(!['unknown','proposed','needs-review','verified','approved'].includes(r.reviewStatus))fail('Review state '+key);
  if(!['documented','review-needed','documentation-needed','flow-only'].includes(r.documentationStatus))fail('Documentation state '+key);
  if(!Array.isArray(r.tags)||r.tags.some(t=>!tags.has(t)))fail('Unknown tag '+key);
  if(r.tags.length>5)fail('Too many tags '+key);
  if(r.lastReviewedDate!==null&&!/^\d{4}-\d{2}-\d{2}$/.test(r.lastReviewedDate))fail('Review date '+key);
  if(['approved','verified'].includes(r.reviewStatus)&&(!r.lastReviewedDate||!r.processOwner))fail('Verified metadata requires reviewer/owner and date '+key);
  if(r.publicationStatus==='published'&&r.reviewStatus!=='approved')fail('Published instruction is not approved '+key);
  if(!['unknown','not-established','source-documented','suggested'].includes(r.trainingRequired))fail('Training requirement '+key);
  if(r.contentFile&&!safeFile(r.contentFile))fail('Missing page source '+r.contentFile);
  if(r.sourceFile&&!safeFile(r.sourceFile))fail('Missing diagram source '+r.sourceFile);
  if(r.file&&!safeFile(r.file,path.join(root,'public')))fail('Missing reference file '+r.file);
 }
 for(const [group,prefix]of [['stops','stop'],['gaps','gap']])for(const r of c[group]){if(ids.has(prefix+':'+r.id))fail('Duplicate '+r.id);ids.add(prefix+':'+r.id);}
 for(const r of c.relationships){if(!ids.has(r.from)||!ids.has(r.to))fail('Dangling relationship '+r.from+' → '+r.to);if(!r.evidence)fail('Relationship missing evidence');}
 const published=new Set([...c.documents.map(x=>['page',x]),...c.processes.map(x=>['process',x]),...c['process-groups'].map(x=>['group',x]),...c.references.map(x=>['reference',x]),...c.diagrams.map(x=>['diagram',x])].filter(([,x])=>x.publicationStatus!=='draft').map(([p,x])=>p+':'+x.id));
 for(const g of c['process-groups'])for(const ref of g.references)if(!ids.has(ref)||!published.has(ref))fail('Process group missing/hidden reference '+g.id+' '+ref);
 for(const m of c.processes){const ns=new Set();for(const n of m.nodes){if(ns.has(n.id))fail('Duplicate node '+m.id+'/'+n.id);ns.add(n.id);if(!['nav','doc','gap','flow','stop'].includes(n.status))fail('Node status '+m.id+'/'+n.id);const t=n.link||'';let ref;if(t.includes('/sources/'))ref='page:'+c['source-links'][t.split('/').pop()];else if(t.includes('/stops/'))ref='stop:'+t.split('/').pop().replace('.html','');else if(t.includes('/gaps/'))ref='gap:'+t.split('/').pop().replace('.html','');else if(t)ref='process:'+t.split('/').pop().replace('.html','');if(ref&&!ids.has(ref))fail('Node link '+m.id+'/'+n.id+' '+ref);if(ref&&m.publicationStatus!=='draft'&&/^(page|process):/.test(ref)&&!published.has(ref))fail('Public node points to draft '+ref);}
  for(const e of m.edges)if(!ns.has(e.source)||!ns.has(e.target))fail('Invalid graph endpoint '+m.id);
  for(const n of m.nodes.filter(n=>n.status==='stop'))if(!c.stops.some(s=>s.map===m.id&&s.node===n.id))fail('Missing STOP record '+m.id+'/'+n.id);
 }
 for(const s of c.stops){if(!c.processes.some(m=>m.id===s.map&&m.nodes.some(n=>n.id===s.node)))fail('Orphan STOP '+s.id);for(const f of ['why','authority','resume'])if(!s[f])fail('STOP missing '+f+' '+s.id);if(!s.action)warnings.push('STOP action relies on source connections: '+s.id);}
 for(const p of c.onboarding){if(!['proposed','approved'].includes(p.reviewStatus))fail('Onboarding review status '+p.id);for(const [i,it]of p.items.entries()){if(!ids.has(it.reference))fail('Onboarding missing reference '+it.reference);if(!published.has(it.reference))fail('Onboarding references draft '+it.reference);if(it.sequence!==i+1)fail('Onboarding sequence '+p.id);if(p.reviewStatus==='proposed'&&it.requirement!=='proposed-reference')fail('Unreviewed training made mandatory '+p.id);}}
 if(errors.length)throw Error(errors.join('\n'));
 return {content:c,summary:{documents:c.documents.length,processes:c.processes.length,coreProcessGroups:c['process-groups'].length,fileReferences:c.references.length,sourceDiagrams:c.diagrams.length,relationships:c.relationships.length,onboardingCollections:c.onboarding.length,draftRecords:[...c.documents,...c.processes].filter(x=>x.publicationStatus==='draft').length,errors:[],warnings}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{console.log(JSON.stringify(validate().summary,null,2));}catch(e){console.error(e.message);process.exit(1);}}
