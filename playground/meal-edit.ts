
import { actionMenu, contextItem, personSelector, weekDaySelector, slotSelector, conflictActions, structuredDialog } from "../src/dialogs";
import type { FamilyIconName } from "../src/icons";
const slots: {id:string;label:string;icon:FamilyIconName}[]=[{id:"breakfast",label:"Frühstück",icon:"coffee"},{id:"snack",label:"Snack",icon:"apple"},{id:"lunch",label:"Mittagessen",icon:"utensils"},{id:"dinner",label:"Abendessen",icon:"moon"}];
const people=["Alex","Sam","Kim"];
const today="2026-11-17";
const date=(s:string)=>new Date(s+"T12:00:00Z");
const shift=(s:string,n:number)=>{const d=date(s);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const fmt=(s:string,options:Intl.DateTimeFormatOptions)=>date(s).toLocaleDateString("de-AT",{...options,timeZone:"UTC"});
const full=(s:string)=>fmt(s,{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const slotName=(s:string)=>slots.find(x=>x.id===s)?.label??s;
type Meal={id:string;title:string;day:string;slot:string;people:string[]};
const initial=():Meal[]=>[{id:"lasagna",title:"Gemüselasagne",day:today,slot:"lunch",people:["Alex","Sam"]},{id:"curry",title:"Linsencurry",day:"2026-11-18",slot:"lunch",people:["Kim"]}];
export const mealEditExample=()=>'<section class="fu-section fu-stack" id="meal-edit-demo"></section>';
export function bindMealEdit(doc:Document){
 const host=doc.getElementById("meal-edit-demo");if(!host)return;
 let meals=initial(),active="",day=today,slot="lunch",week="2026-11-16",message="";
 const context=(m:Meal)=>contextItem({title:m.title,meta:full(m.day)+" · "+slotName(m.slot),icon:"utensils"});
 const find=()=>meals.find(m=>m.id===active)!;
 const target=()=>meals.find(m=>m.id!==active&&m.day===day&&m.slot===slot);
 const valid=()=>day!==find().day||slot!==find().slot;
 let dialog:HTMLDialogElement|null=null;
 function render(focusId?:string){
  host!.innerHTML='<h2>Mahlzeiten bearbeiten</h2><p class="fu-context__meta">Fiktive Beispieldaten · Heute: 17. November 2026</p><button class="fu-button fu-button--secondary" id="meal-reset">Zurücksetzen</button>'+meals.map(m=>'<article class="fu-panel fu-row fu-row--between">'+context(m)+'<div>'+actionMenu("menu-"+m.id,"Aktionen für "+m.title,[{id:"people",label:"Teilnehmer ändern",icon:"users"},{id:"move",label:"Mahlzeit verschieben",icon:"calendar-arrow-right"},{id:"skip",label:"Mahlzeit ausfallen lassen",icon:"calendar-x"}])+'<p class="fu-context__meta">'+(m.people.join(", ")||"Keine Teilnehmer")+'</p></div></article>').join("")+'<p role="status" id="meal-status">'+message+'</p><div id="meal-dialog-host"></div>';
  host!.querySelectorAll<HTMLButtonElement>("[data-fu-menu-toggle]").forEach(b=>{
   const menu=doc.getElementById(b.getAttribute("aria-controls")!)!;
   b.onclick=()=>{const open=menu.hidden;closeMenus();menu.hidden=!open;b.setAttribute("aria-expanded",String(open));};
   menu.querySelectorAll<HTMLButtonElement>("[data-fu-action]").forEach(a=>a.onclick=()=>{active=menu.id.slice(5);closeMenus();open(a.dataset.fuAction!);});
  });
  doc.getElementById("meal-reset")!.onclick=()=>{meals=initial();message="Beispieldaten zurückgesetzt";render("meal-reset")};
  if(focusId)doc.getElementById(focusId)?.focus();
 }
 function closeMenus(){host!.querySelectorAll<HTMLButtonElement>("[data-fu-menu-toggle]").forEach(b=>{b.setAttribute("aria-expanded","false");doc.getElementById(b.getAttribute("aria-controls")!)!.hidden=true;})}
 doc.addEventListener("click",e=>{if(!(e.target as Element).closest(".fu-action-menu"))closeMenus()});
 doc.addEventListener("keydown",e=>{if(e.key==="Escape"&&!dialog){const b=host!.querySelector<HTMLButtonElement>('[data-fu-menu-toggle][aria-expanded="true"]');closeMenus();b?.focus()}});
 function restore(){host!.querySelector<HTMLButtonElement>('[aria-controls="menu-'+active+'"]')?.focus();}
 function mount(title:string,body:string,confirmLabel?:string,confirmDisabled=false,danger=false,onConfirm?:()=>void){
  const h=doc.getElementById("meal-dialog-host")!;
  if(dialog){dialog.onclose=null;dialog.close();}
  h.innerHTML=structuredDialog({id:"meal-dialog",title,body,cancelLabel:"Abbrechen",confirmLabel,confirmDisabled,danger});
  const d=h.querySelector<HTMLDialogElement>("dialog")!;dialog=d;
  d.onclose=()=>{if(dialog!==d)return;dialog=null;if(d.returnValue==="confirm"&&onConfirm)onConfirm();else{h.innerHTML="";restore();}};
  d.showModal();
 }
 function finish(text:string){if(dialog){dialog.onclose=null;dialog.close();dialog=null;}message=text;render();restore();if(!meals.some(m=>m.id===active))doc.getElementById("meal-reset")?.focus();}
 function open(action:string){
  const m=find();
  if(action==="people"){
   mount("Teilnehmer ändern",context(m)+personSelector("Teilnehmer",people.map(p=>({id:p,label:p,selected:m.people.includes(p)}))),"Teilnehmer speichern",false,false,()=>{m.people=Array.from(host!.querySelectorAll<HTMLInputElement>("[data-fu-person]:checked")).map(i=>i.value);finish("Teilnehmer gespeichert")});
  }else if(action==="skip"){mount("Mahlzeit ausfallen lassen?",context(m),"Mahlzeit ausfallen lassen",false,true,()=>{meals=meals.filter(x=>x.id!==active);finish("Mahlzeit fällt aus")});}
  else {day=shift(m.day,1);slot=m.slot;week=shift(day,-((date(day).getUTCDay()+6)%7));moveDialog();}
 }
 function selectors(){
  const m=find(),days=Array.from({length:7},(_,i)=>shift(week,i));
  return weekDaySelector({label:fmt(week,{day:"numeric",month:"short",year:"numeric"})+" – "+fmt(days[6],{day:"numeric",month:"short",year:"numeric"}),relative:week==="2026-11-16"?"Diese Woche":week==="2026-11-23"?"Nächste Woche":week==="2026-11-09"?"Letzte Woche":undefined,previousLabel:"Vorherige Woche",nextLabel:"Nächste Woche",days:days.map(d=>({id:d,weekday:fmt(d,{weekday:"short"}),number:String(date(d).getUTCDate()),label:full(d)+(d===m.day?" · Ausgangstag":""),selected:d===day,today:d===today,original:d===m.day}))})+slotSelector("Zielmahlzeit",slots.map(s=>{const existing=meals.find(x=>x.day===day&&x.slot===s.id);return {...s,selected:slot===s.id,occupied:!!existing,description:existing?.title,disabled:false}}),"Frei");
 }
 function updateSelectors(focus:string){
  const area=doc.getElementById("meal-selectors")!;area.innerHTML=selectors();
  dialog!.querySelector<HTMLButtonElement>('button[value="confirm"]')!.disabled=!valid();
  bindSelectors();area.querySelector<HTMLButtonElement>(focus)?.focus();
 }
 function bindSelectors(){
  dialog!.querySelectorAll<HTMLButtonElement>("[data-fu-week]").forEach(b=>b.onclick=()=>{const n=Number(b.dataset.fuWeek);week=shift(week,n*7);day=shift(day,n*7);updateSelectors('[data-fu-week="'+n+'"]')});
  dialog!.querySelectorAll<HTMLButtonElement>("[data-fu-day]").forEach(b=>b.onclick=()=>{day=b.dataset.fuDay!;updateSelectors('[data-fu-day="'+day+'"]')});
  dialog!.querySelectorAll<HTMLButtonElement>("[data-fu-slot]").forEach(b=>b.onclick=()=>{slot=b.dataset.fuSlot!;updateSelectors('[data-fu-slot="'+slot+'"]')});
 }
 function moveDialog(){
  mount("Mahlzeit verschieben",context(find())+'<div id="meal-selectors" class="fu-stack">'+selectors()+'</div>',"Mahlzeit verschieben",!valid(),false,()=>{if(!valid())return;if(target())conflict();else{Object.assign(find(),{day,slot});finish("Mahlzeit verschoben")}});
  bindSelectors();
 }
 function conflict(){
  const old=target()!,m=find();
  mount(slotName(slot)+" bereits belegt",'<p class="fu-context__meta">'+full(day)+'</p><div><span class="fu-context__meta">Bisher geplant</span>'+context(old)+'</div><div><span class="fu-context__meta">Neue Mahlzeit</span>'+context(m)+'</div>'+conflictActions([{id:"swap",label:"Mahlzeiten tauschen",description:"Beide Gerichte behalten und Termine tauschen.",icon:"arrow-left-right"},{id:"replace",label:"Mahlzeit ersetzen",description:"Das bisher geplante Gericht fällt aus.",icon:"replace"}]));
  dialog!.querySelectorAll<HTMLButtonElement>("[data-fu-action]").forEach(b=>b.onclick=()=>{if(b.dataset.fuAction==="swap"){Object.assign(old,{day:m.day,slot:m.slot});}else meals=meals.filter(x=>x.id!==old.id);Object.assign(m,{day,slot});finish(b.dataset.fuAction==="swap"?"Mahlzeiten getauscht":"Mahlzeit ersetzt")});
 }
 render();
}
