export function metricsExample(): string {
  const item=(label:string,value:string,unit="",primary=false,state="",status="")=>`<div class="fu-metric-item${primary?" fu-metric-item--primary":""}"${state?' data-state="'+state+'"':""}><dt class="fu-metric-item__label">${label}</dt><dd class="fu-metric-item__value">${value}${unit?' <span class="fu-metric-item__unit">'+unit+'</span>':""}${status?'<span class="fu-metric-item__status">'+status+'</span>':""}</dd></div>`;
  const group=(title:string,items:string)=>`<section class="fu-panel fu-stack"><h2>${title}</h2><dl class="fu-metric-group">${items}</dl></section>`;
  return group("Nährwerte pro Portion",item("Energie","584","kcal",true)+item("Protein","24","g")+item("Kohlenhydrate","68","g")+item("Fett","23","g"))+
    group("Synchronisation",item("Synchronisationsgrad","98,4","%",true)+item("Synchronisiert","3.482","",false, "success","Erfolgreich")+item("Offen","54")+item("Fehler","2","",false,"error","Prüfen"))+
    group("Training",item("Distanz","86,4","km",true)+item("Dauer","3:12","h")+item("Höhenmeter","0","m")+item("Ø Leistung","—","",false,"unknown","Nicht verfügbar"));
}
