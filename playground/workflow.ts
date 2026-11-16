import { familyIcon, type FamilyIconName } from "../src/icons";
// All domain data and transitions live in this local demo, not in the CSS library.
const phases=["Vorbereitung","Menüplanung","Familienabstimmung","Finale Freigabe","Rezeptheft"];
const roles=["Planungsverantwortliche Person","Familienmitglied A","Familienmitglied B"];
const criteria=["Rezepte vorhanden","Portionsmengen vollständig","Zubereitungsschritte vollständig","Timerprüfung (wo erforderlich)","Einkaufsartikel zugeordnet"];
type State="action-required"|"waiting"|"blocked"|"in-progress"|"completed"|"open"|"fulfilled"|"warning"|"optional";
const states:Record<State,[string,FamilyIconName]>={"action-required":["Eigene Aktion erforderlich","circle-alert"],waiting:["Warten auf andere","clock"],blocked:["Blockiert","lock"],"in-progress":["In Bearbeitung","circle-dot"],completed:["Erledigt","check"],open:["Offen","circle"],fulfilled:["Erfüllt","check"],warning:["Hinweis","circle-alert"],optional:["Optional","circle"]};
const status=(s:State)=>'<span class="fu-workflow-status" data-state="'+s+'">'+familyIcon(states[s][1])+states[s][0]+'</span>';
const button=(label:string,action:string,primary=false,disabled=false)=>'<button type="button" class="fu-button'+(primary?'':' fu-button--secondary')+'" data-workflow-action="'+action+'"'+(disabled?' disabled':'')+'>'+label+'</button>';
const progress=(value:number,max:number,label:string)=>'<progress class="fu-progress" value="'+value+'" max="'+max+'" aria-label="'+label+'"></progress>';
const task=(title:string,s:State,meta:string,action="")=>'<li class="fu-action-list-item fu-action-list-item--informational"><div class="fu-action-list-item__body"><strong class="fu-action-list-item__title">'+title+'</strong>'+status(s)+'<span class="fu-action-list-item__meta">'+meta+'</span></div>'+action+'</li>';
const group=(title:string,items:string)=>'<section class="fu-action-list__group"><h3 class="fu-action-list__group-title">'+title+'</h3><ul class="fu-action-list">'+items+'</ul></section>';
const check=(title:string,s:State,n?:number,max=28,action="")=>'<li class="fu-progress-checklist__item"><div class="fu-progress-checklist__line"><strong>'+title+'</strong>'+status(s)+(n===undefined?'':'<span>'+n+'/'+max+'</span>')+'</div>'+(n===undefined?'':progress(n,max,title))+action+'</li>';
export function workflowExample(){return '<div id="workflow-demo" class="fu-stack"></div>'}
export function bindWorkflow(doc:Document){
 const host=doc.getElementById("workflow-demo");if(!host)return;
 let phase=0,view=0,role=0,menu=25,finished=false,preparation=[false,false,false,false,false],votes=[0,0,0],changes=[true,true],revote=[false,false],counts=[26,25,26,24,23],comment="",catalog=false;
 const prep=["Mahlzeiten und Teilnehmer","Abwesenheiten","Termine","Vorhandene Lebensmittel","Besondere Wünsche"];
 const prompts=["Prüfe die Rahmenbedingungen für die Wochenplanung.","Ergänze die fehlenden Gerichte im Menüentwurf.","Überarbeite die beanstandeten Mahlzeiten ohne andere Vorschläge zu ändern.","Prüfe den finalen Menüplan.","Ergänze fehlende Portionsmengen, Arbeitsschritte, erforderliche Timer und Einkaufsartikel."];
 const advance=()=>{phase++;view=phase;};
 const ready=()=>votes.every(v=>v!==0)&&changes.every(v=>!v)&&revote.every(v=>!v);
 const esc=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 function render(){
  const historical=view!==phase||finished;
  let title=phases[view],next="",primary="",tasks="",checks="",s:State="action-required",summary="";
  if(view===0){next="Rahmenbedingungen prüfen";summary=preparation.filter(Boolean).length+" von 5 geprüft";tasks=group("Vorbereitung",prep.map((p,i)=>task(p,preparation[i]?"completed":"open",roles[0],!historical&&!preparation[i]&&role===0?button("Prüfen","prep-"+i):"")).join(""));primary=button("Menüplanung starten","start",true,!preparation.every(Boolean));}
  if(view===1){next=menu<28?"Fehlende Gerichte ergänzen":"Menüentwurf veröffentlichen";summary=menu+" von 28 Gerichten";checks=check("Gerichte vorgeschlagen",menu===28?"fulfilled":"blocked",menu);primary=menu<28?button("Menüentwurf ergänzen","menu",true):button("Zur Abstimmung veröffentlichen","publish",true);}
  if(view===2){const own=role===0?changes.some(Boolean):votes[role-1]===0||revote[role-1];s=own?"action-required":ready()?"in-progress":"waiting";next=own?"Bewertungen oder Änderungswünsche bearbeiten":ready()?"Abstimmung vollständig":"Auf weitere Rückmeldungen warten";summary=(38+votes.filter(v=>v===1).length)+" Zustimmungen · "+changes.filter(Boolean).length+" Änderungswünsche · "+(votes.filter(v=>v===0).length+revote.filter(Boolean).length)+" ausstehende Stimmen";
   tasks=group("Änderungswünsche",changes.map((v,i)=>task(i===0?"Gemüsegericht anpassen":"Alternative zum Auflauf",v?"open":"completed",i===0?"Kommentar: Bitte weniger scharf.":"Kommentar: Andere Beilage gewünscht.",v&&role===0&&!historical?button("Änderungswunsch bearbeiten","change-"+i):"")).join(""))+group("Ausstehende Stimmen",votes.map((v,i)=>task("Stimme "+(i+1),v===0||revote[i]?"waiting":"completed",v===1?"Zustimmung":v===2?"Änderungswunsch":v===3?"Ablehnung":"Noch ausstehend",!historical&&(role===i+1||(i===2&&role===0))&&(v===0||revote[i])?'<div class="fu-workflow-actions">'+button("Zustimmen","vote-"+i+"-1")+button("Änderung wünschen","vote-"+i+"-2")+button("Ablehnen","vote-"+i+"-3")+'</div>':"")).join(""));
   if(comment)tasks+='<p class="fu-banner">'+esc(comment)+'</p>';
   if(!ready())tasks+='<p class="fu-banner">Finale Freigabe blockiert: Rückmeldungen oder Änderungen fehlen.</p>';
   if(ready())primary=button("Zur finalen Freigabe","review",true);
  }
  if(view===3){next="Abschließend geprüften Wochenplan freigeben";summary="28 Gerichte · Abstimmung vollständig";checks=check("Menüentwurf vollständig","fulfilled")+check("Änderungswünsche bearbeitet","fulfilled")+check("Abstimmung abgeschlossen","fulfilled");primary=button("Wochenplan freigeben","release",true);}
  if(view===4){next="Fehlende Rezeptdetails ergänzen";summary=counts.filter(n=>n===28).length+" von 5 Kriterien";checks=criteria.map((c,i)=>check(c,counts[i]===28?"fulfilled":"blocked",counts[i],28,!historical&&role===0&&counts[i]<28?button("Ergänzen","recipe-"+i):"")).join("")+check("Nährwertinformationen","optional")+check("Timer nur bei fachlichem Bedarf","warning");primary=button("Fehlende Rezeptdetails ergänzen","recipes",true);}
  if(role!==0&&view!==2&&!historical){s="waiting";primary="";next="Auf die planungsverantwortliche Person warten";}
  if(historical){s="completed";primary="";next=finished&&view===4?"Planung abgeschlossen":"Abgeschlossene Phase ansehen";}
  const steps=phases.map((p,i)=>{const st=finished||i<phase?"completed":i===phase?"current":i===phase+1&&!ready()&&phase===2?"blocked":"upcoming";const icon:FamilyIconName=st==="completed"?"check":st==="current"?"circle-dot":st==="blocked"?"lock":"circle";return '<li><button type="button" class="fu-process-stepper__step" data-state="'+st+'" data-viewed="'+(view===i)+'" data-workflow-action="view-'+i+'" '+(!finished&&i===phase?'aria-current="step" ':'')+'aria-pressed="'+(view===i)+'"'+(i>phase?' disabled':'')+'>'+familyIcon(icon)+'<span class="fu-process-stepper__label">'+(i+1)+'. '+p+'<span class="fu-process-stepper__state">'+({completed:"Abgeschlossen",current:"Aktuell",blocked:"Blockiert",upcoming:"Ausstehend"}[st])+'</span></span></button></li>'}).join("");
  const summaryMarkup='<article class="fu-panel fu-workflow-summary"><h2>Wochenplanung</h2><p>16.–22. November · '+(finished?"Planung abgeschlossen":phases[phase])+'</p>'+progress(finished?5:phase,5,"Abgeschlossene Phasen")+'<p>'+ (finished?"5":phase) +' von 5 Phasen abgeschlossen</p>'+button("Prozess fortsetzen","resume")+'</article>';
  host!.innerHTML='<div class="fu-toolbar fu-toolbar--content"><label>Rolle <select class="fu-field__control" id="workflow-role">'+roles.map((r,i)=>'<option value="'+i+'"'+(i===role?' selected':'')+'>'+r+'</option>').join("")+'</select></label>'+button("Zurücksetzen","reset")+button(catalog?"Workflow anzeigen":"Einzelkomponenten anzeigen","catalog")+'</div>'+summaryMarkup+'<nav class="fu-process-stepper" aria-label="Planungsphasen"><strong>'+(finished?"Planung abgeschlossen":"Schritt "+(phase+1)+" von 5 · "+phases[phase])+'</strong><ol>'+steps+'</ol></nav><header class="fu-workflow-header"><h1 class="fu-page-layout__title">'+title+'</h1>'+status(s)+'<h2>'+next+'</h2><p>'+summary+'</p><div class="fu-workflow-meta"><span>'+roles[0]+'</span><span>Frist: Dienstag, 18:00</span></div><div class="fu-workflow-actions">'+primary+(historical&&!finished?button("Zur aktuellen Phase","resume"):"")+'</div></header>'+(checks?'<section class="fu-progress-checklist"><h2>Vollständigkeit</h2>'+(view===4?progress(counts.filter(n=>n===28).length,5,"Erfüllte Kriterien"):"")+'<ul>'+checks+'</ul></section>':"")+(tasks?'<section class="fu-task-list"><h2>Aufgaben</h2>'+tasks+'<details><summary>Bereits erledigt</summary><p>Planungswoche angelegt</p></details></section>':"")+(view===0&&!historical?'<p class="fu-banner">Beispiel: Eine Prüfung ist überfällig.</p>':"")+'<section class="fu-workflow-handoff"><h2>'+familyIcon("chatgpt")+' Mit ChatGPT weiterarbeiten</h2><p>'+prompts[view]+'</p><details><summary>Vollständigen Arbeitsauftrag anzeigen</summary><pre>'+prompts[view]+' Verwende ausschließlich simulierte Planungsdaten.</pre></details>'+button("Planungsauftrag kopieren","copy")+'<p id="workflow-copy-status" role="status"></p></section>'+(catalog?'<section class="fu-task-list"><h2>Isolierte Statusvarianten</h2><ul class="fu-action-list">'+(Object.keys(states) as State[]).map(k=>task(states[k][0],k,"Beispiel ohne Aktion")).join("")+'</ul></section>':"")+'<dialog class="fu-dialog" id="workflow-confirm" aria-labelledby="workflow-confirm-title"><h2 id="workflow-confirm-title">Wochenplan freigeben?</h2><p>Die Freigabe wird ausdrücklich bestätigt.</p><form method="dialog" class="fu-dialog__actions"><button class="fu-button fu-button--secondary" value="cancel">Abbrechen</button><button class="fu-button" value="confirm">Freigeben</button></form></dialog>';
  host!.querySelector<HTMLSelectElement>("#workflow-role")!.onchange=e=>{role=Number((e.target as HTMLSelectElement).value);render();host!.querySelector<HTMLSelectElement>("#workflow-role")!.focus()};
  const dialog=host!.querySelector<HTMLDialogElement>("#workflow-confirm")!;dialog.onclose=()=>{if(dialog.returnValue==="confirm"){advance();render();focusHeading()}else host!.querySelector<HTMLButtonElement>('[data-workflow-action="release"]')?.focus()};
 }
 function focusHeading(){const h=host!.querySelector<HTMLElement>("h1")!;h.tabIndex=-1;h.focus()}
 host.addEventListener("click",async e=>{const b=(e.target as Element).closest<HTMLButtonElement>("[data-workflow-action]");if(!b||b.disabled)return;const a=b.dataset.workflowAction!;const parts=a.split("-");
 if(a==="copy"){try{await doc.defaultView!.navigator.clipboard.writeText(prompts[view]+" Verwende ausschließlich simulierte Planungsdaten.");host!.querySelector("#workflow-copy-status")!.textContent="Kopiert";}catch{host!.querySelector("#workflow-copy-status")!.textContent="Kopieren nicht verfügbar. Bitte den Arbeitsauftrag manuell auswählen.";}return}
 if(a==="release"){host!.querySelector<HTMLDialogElement>("#workflow-confirm")!.showModal();return}
 if(a==="reset"){phase=view=role=0;menu=25;finished=false;preparation=prep.map(()=>false);votes=[0,0,0];changes=[true,true];revote=[false,false];counts=[26,25,26,24,23];comment=""}
 else if(a==="catalog")catalog=!catalog;
 else if(a==="resume")view=phase;
 else if(parts[0]==="view")view=Number(parts[1]);
 else if(parts[0]==="prep")preparation[Number(parts[1])]=true;
 else if(a==="start"&&preparation.every(Boolean))advance();
 else if(a==="menu")menu=28;
 else if(a==="publish"&&menu===28)advance();
 else if(parts[0]==="change"){const i=Number(parts[1]);changes[i]=false;revote[i]=true;votes[i]=0;}
 else if(parts[0]==="vote"){const i=Number(parts[1]),v=Number(parts[2]);votes[i]=v;if(i<2){revote[i]=false;if(v!==1){changes[i]=true;comment="Änderungswunsch oder Ablehnung: Alternative erforderlich.";}}else if(v!==1){votes[i]=0;comment="Weitere Abstimmung erforderlich.";}}
 else if(a==="review"&&ready())advance();
 else if(parts[0]==="recipe")counts[Number(parts[1])]=28;
 else if(a==="recipes")counts=counts.map(()=>28);
 if(phase===4&&counts.every(n=>n===28))finished=true;
 render();const replacement=Array.from(host!.querySelectorAll<HTMLButtonElement>("[data-workflow-action]")).find(x=>x.dataset.workflowAction===a&&!x.disabled);if(replacement)replacement.focus();else focusHeading();
 });render();
}
