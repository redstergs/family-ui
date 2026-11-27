import {createTaskItem,reconcileTaskItems,bindTaskDisclosures,type TaskDefinition} from "../src/tasks";
import {familyIcon} from "../src/icons";
const base:TaskDefinition[]=[
 {id:"weekly",title:"Wochenplanung fortsetzen",meta:"KW 49 · Menüplanung",interaction:"navigation",icon:familyIcon("calendar-days")},
 {id:"reviews",title:"Mahlzeiten bewerten",meta:"3 offene Bewertungen",interaction:"inline",icon:familyIcon("thumbs-up")},
 {id:"leftovers",title:"Resteverwertung",meta:"Pizza · 27.11.",interaction:"navigation",icon:familyIcon("utensils")},
 {id:"closing",title:"Tagesabschluss",meta:"Donnerstag, 26.11.2026",interaction:"inline",icon:familyIcon("calendar-days")},
 {id:"weight",title:"Gewicht erfassen",meta:"Keine aktuelle Messung",interaction:"inline",icon:familyIcon("circle-dot")},
 {id:"waist",title:"Bauchumfang erfassen",meta:"Wöchentliche Messung",interaction:"inline",icon:familyIcon("circle-dot")}
];
export function tasksExample():string {
 return `<section class="fu-section fu-stack"><h2>Einheitliche Aufgaben</h2><p>Aufgabenliste, Gruppierung, Inline-Formular und Verwaltungsaufgaben. Alle Aktionen sind lokal simuliert.</p>
 <section class="fu-task-list fu-task-list--unified" id="tasks-demo" aria-labelledby="tasks-title">
 <div class="fu-task-list__heading"><h2 id="tasks-title">Offene Aufgaben</h2><span class="fu-task-list__count" id="task-count">6</span></div>
 <div class="fu-toolbar fu-toolbar--content"><label>Person <select id="task-person" class="fu-field__control"><option value="all">Alle Personen</option><option>Barbara</option><option>Philipp</option></select></label><label>Art <select id="task-kind" class="fu-field__control"><option value="all">Alle Aufgaben</option><option>Assistent</option><option>Benutzer</option></select></label></div>
 <ul class="fu-task-list__items" id="task-items"></ul><p id="task-live" role="status" aria-live="polite"></p>
 <button type="button" class="fu-button fu-button--secondary" id="task-refresh">Liste aktualisieren (Eingaben erhalten)</button></section>
 <section class="fu-task-list fu-task-list--unified" aria-label="Gruppierte Aufgaben"><div class="fu-task-list__heading"><h2>Gruppiert nach Personen</h2><span class="fu-task-list__count">6</span></div>
 <div class="fu-task-group"><div class="fu-task-group__heading"><h3>Barbara</h3><span class="fu-task-group__count">3 offen</span></div><div class="fu-task-group__body"><div class="fu-task-group"><h4>Assistentenaufgaben</h4><ul class="fu-task-group__items" id="group-barbara-assistant"></ul></div><div class="fu-task-group"><h4>Benutzeraufgaben</h4><ul class="fu-task-group__items" id="group-barbara-user"></ul></div></div></div>
 <div class="fu-task-group"><div class="fu-task-group__heading"><h3>Philipp</h3><span class="fu-task-group__count">3 offen</span></div><div class="fu-task-group__body"><div class="fu-task-group"><h4>Assistentenaufgaben</h4><ul class="fu-task-group__items" id="group-philipp-assistant"></ul></div><div class="fu-task-group"><h4>Benutzeraufgaben</h4><ul class="fu-task-group__items" id="group-philipp-user"></ul></div></div></div></section>
 <section class="fu-task-list fu-task-list--unified"><div class="fu-task-list__heading"><h2>Administrative Aufgaben</h2><span class="fu-task-list__count">4</span></div><ul class="fu-task-list__items" id="admin-items"></ul></section>
 <section class="fu-task-list fu-task-list--unified"><h2>Weitere Zustände</h2><ul class="fu-task-list__items" id="state-items"></ul><p class="fu-task-list__state">Keine offenen Aufgaben</p><p class="fu-task-list__state" role="status">Aufgaben werden geladen …</p><p class="fu-task-list__state" role="alert">Aufgaben konnten nicht vollständig geladen werden. <button class="fu-button fu-button--secondary" type="button">Erneut versuchen</button></p></section>
 <dialog class="fu-dialog" id="task-dialog" aria-labelledby="task-dialog-title"><h2 id="task-dialog-title">Aufgabe öffnen</h2><p>Beispieldialog ohne Speicherung.</p><form method="dialog"><button class="fu-button">Schließen</button></form></dialog>
 </section>`;
}
export function bindTasksExample(doc: Document):void {
 const list=doc.getElementById("task-items");if(!list)return;
 const live=doc.getElementById("task-live")!;
 let tasks=base.map(t=>({...t}));
 const handlers={onNavigate:(id:string)=>{live.textContent="Navigation zu "+id+" simuliert";},onDialog:()=>{(doc.getElementById("task-dialog") as HTMLDialogElement).showModal();},onAction:(id:string)=>{live.textContent="Aktion "+id+" ausgelöst";}};
 const form=doc.createElement("form");form.className="fu-stack";
 form.innerHTML='<div class="fu-field"><label class="fu-field__label" for="task-date">Messdatum</label><input id="task-date" class="fu-field__control" type="date" value="2026-11-27"></div><div class="fu-field"><label class="fu-field__label" for="task-value">Bauchumfang (cm)</label><input id="task-value" class="fu-field__control" type="number" min="1" step="0.1" required></div><p class="fu-field__error" id="task-validation" role="alert" hidden>Bitte gültigen Messwert eingeben.</p><div class="fu-row"><button class="fu-button" type="submit">Messwert speichern</button><button class="fu-button fu-button--secondary" type="button" id="task-cancel">Abbrechen</button></div>';
 form.addEventListener("submit",e=>{e.preventDefault();const input=form.querySelector<HTMLInputElement>("#task-value")!,error=form.querySelector<HTMLElement>("#task-validation")!;error.hidden=!(Number(input.value)>0);if(!error.hidden)return;const button=form.querySelector<HTMLButtonElement>('[type="submit"]')!;button.disabled=true;button.textContent="Speichert …";live.textContent="Speicherung simuliert – Aufgabe wird entfernt";tasks=tasks.filter(t=>t.id!=="waist");update();});
 form.querySelector<HTMLButtonElement>("#task-cancel")!.addEventListener("click",()=>{const row=list.querySelector<HTMLButtonElement>('[data-task-id="waist"] .fu-task-item__trigger');row?.click();row?.focus();});
 tasks.find(t=>t.id==="waist")!.content=form;
 const review=doc.createElement("div");review.innerHTML='<p>3 Bewertungen offen</p><button class="fu-button" type="button">Bewertung öffnen</button>';tasks.find(t=>t.id==="reviews")!.content=review;
 const closing=doc.createElement("div");closing.innerHTML='<p>Tagesabschluss prüfen</p><button class="fu-button" type="button">Abschluss starten</button>';tasks.find(t=>t.id==="closing")!.content=closing;
 const weight=doc.createElement("div");weight.innerHTML='<p>Messung eingeben</p><input class="fu-field__control" aria-label="Gewicht" type="number" step="0.1">';tasks.find(t=>t.id==="weight")!.content=weight;
 const update=()=>{reconcileTaskItems(list,tasks,handlers);doc.getElementById("task-count")!.textContent=String(tasks.length);};
 update();
 doc.getElementById("task-refresh")!.addEventListener("click",()=>{tasks=tasks.map(t=>({...t}));update();live.textContent="Aktualisiert, Formulare unverändert";});
 const grouped:[string,string,string,string][]=[
 ["group-barbara-assistant","Datenqualität prüfen","Unvollständige Tagesbilanzen","action"],
 ["group-barbara-user","Tagesabschluss","Mahlzeiten bewerten","inline"],
 ["group-philipp-assistant","Ernährungstagebuch auswerten","","action"],
 ["group-philipp-user","Tagesabschluss","Bauchumfang erfassen","inline"]
 ];
 grouped.forEach(([id,a,b,mode],i)=>{const el=doc.getElementById(id)!;el.append(createTaskItem({id:id+"-1",title:a,meta:i===0?b:undefined,interaction:mode as "action"|"inline"} ,handlers));if(i===1||i===3)el.append(createTaskItem({id:id+"-2",title:b,interaction:"navigation"},handlers));});
 ["Nährwertzuordnungen","Artikelzuordnungen","Einkaufszuordnungen","Einkaufsorte"].forEach((name,i)=>doc.getElementById("admin-items")!.append(createTaskItem({id:"admin-"+i,title:"Fehlende "+name,meta:[3,2,1,4][i]+" offene Einträge",interaction:"navigation"},handlers)));
 ["blocked","urgent","loading","error"].forEach((state,i)=>doc.getElementById("state-items")!.append(createTaskItem({id:"state-"+i,title:["Blockierte Aufgabe","Dringende Aufgabe","Laufende Bearbeitung","Fehlgeschlagene Bearbeitung"][i],status:state,interaction:"action",state:state as "blocked"|"urgent"|"loading"|"error",disabled:state==="blocked"},handlers)));
 bindTaskDisclosures(doc);
}
