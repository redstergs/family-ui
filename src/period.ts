import {familyIcon} from "./icons";
export type PeriodKind="day"|"week"|"month";
const labels={day:["Vorheriger Tag","Nächster Tag","Datum wählen","Heute"],week:["Vorherige Woche","Nächste Woche","Woche wählen","Aktuelle Woche"],month:["Vorheriger Monat","Nächster Monat","Monat wählen (Datum im Monat)","Aktueller Monat"]} as const;
export function periodLabel(kind:PeriodKind,first:string,last=first,locale="de-AT"):string{
 const d=(s:string,o:Intl.DateTimeFormatOptions)=>new Date(s+"T12:00:00Z").toLocaleDateString(locale,{...o,timeZone:"UTC"});
 if(kind==="day")return d(first,{weekday:"short",day:"numeric",month:"long",year:"numeric"});
 if(kind==="month")return d(first,{month:"long",year:"numeric"});
 return d(first,{day:"numeric",month:"short",...(first.slice(0,4)!==last.slice(0,4)?{year:"numeric" as const}:{})})+" – "+d(last,{day:"numeric",month:"short",year:"numeric"});
}
/** Native calendar fallback is always accessible after opening; the consumer owns all calendar arithmetic and bounds. */
export function createPeriodNavigator(kind:PeriodKind){
 const [prevLabel,nextLabel,dateLabel,currentLabel]=labels[kind];
 const root=document.createElement("div");root.className="fu-period-navigator fu-period-navigator--compact";root.setAttribute("role","group");root.setAttribute("aria-label","Zeitraum wählen");
 const button=(name:string,icon?:string)=>{const b=document.createElement("button");b.type="button";b.className="fu-button fu-button--secondary fu-period-navigator__step";b.setAttribute("aria-label",name);b.title=name;if(icon)b.innerHTML=icon;else b.textContent=name;return b;};
 const previous=button(prevLabel,familyIcon("chevron-left")),next=button(nextLabel,familyIcon("chevron-right")),calendar=button(dateLabel,familyIcon("calendar-days")),current=button(currentLabel);
 current.textContent=kind==="day"?"Heute":"Aktuell";
 const label=document.createElement("strong");label.className="fu-period-navigator__label";label.setAttribute("aria-live","polite");
 const extras=document.createElement("div");extras.className="fu-period-navigator__extras";
 const date=document.createElement("input");date.type="date";date.className="fu-field__control fu-date-input";date.setAttribute("aria-label",dateLabel);date.hidden=true;calendar.setAttribute("aria-expanded","false");
 calendar.onclick=()=>{if(!date.hidden){date.hidden=true;calendar.setAttribute("aria-expanded","false");return;}date.hidden=false;calendar.setAttribute("aria-expanded","true");date.focus();try{date.showPicker?.();}catch{/* Native text/date field remains available. */}};
 date.addEventListener("keydown",e=>{if(e.key==="Escape"){date.hidden=true;calendar.setAttribute("aria-expanded","false");calendar.focus();}});
 date.addEventListener("change",()=>{if(date.value){date.hidden=true;calendar.setAttribute("aria-expanded","false");calendar.focus();}});
 extras.append(calendar,current,date);root.append(previous,label,next,extras);
 return {root,previous,next,label,date,current,extras,calendar};
}
