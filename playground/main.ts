import "../src/index.css";
import { installShowcase } from "./showcase";
import { familyIcon, type FamilyIconName } from "../src/icons";
type Theme = "food" | "door" | "mcp" | "workout";
type Mode = "light" | "dark";
const themes: Record<Theme, {name:string; icon:FamilyIconName; actionIcon:FamilyIconName; action:string; nav:{label:string;icon:FamilyIconName}[]}> = {
 food:{name:"Family Food",icon:"utensils",actionIcon:"utensils",action:"Rezept kochen",nav:[{label:"Heute",icon:"house"},{label:"Plan",icon:"calendar-days"},{label:"Rezepte",icon:"book-open"},{label:"Einkauf",icon:"shopping-basket"}]},
 door:{name:"Family Door",icon:"door-open",actionIcon:"door-open",action:"Aufsperren",nav:[{label:"Türen",icon:"door-open"},{label:"Personen",icon:"users"},{label:"Verwaltung",icon:"settings"}]},
 mcp:{name:"Family MCP",icon:"network",actionIcon:"refresh-cw",action:"Synchronisieren",nav:[{label:"Übersicht",icon:"layout-dashboard"},{label:"Personen",icon:"users"},{label:"Verbindungen",icon:"network"},{label:"Verwaltung",icon:"settings"}]},
 workout:{name:"Family Workout",icon:"dumbbell",actionIcon:"play",action:"Workout beginnen",nav:[{label:"Training",icon:"house"},{label:"Workouts",icon:"dumbbell"},{label:"Übungen",icon:"list"}]}
};
const root=document.querySelector<HTMLDivElement>("#app");
if(!root) throw new Error("Playground root missing");
let theme:Theme="food", mode:Mode=matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light", page=0;
function show() {
 if(!root)return;
 const current=themes[theme]; root.className="fu-app"; root.dataset.fuTheme=theme; root.dataset.fuMode=mode;
 const option=(id:string,label:string,active:boolean)=>"<option value=\""+id+"\""+(active?" selected":"")+">"+label+"</option>";
 root.innerHTML=
 "<div class=\"fu-app-shell\"><header class=\"fu-header\"><div class=\"fu-brand\"><span class=\"fu-brand__mark\">"+familyIcon(current.icon)+"</span>"+current.name+"</div>"+
 "<div class=\"fu-toolbar\"><div class=\"fu-toolbar__field\"><label for=\"theme\">App</label><select class=\"fu-field__control\" id=\"theme\">"+
 (Object.keys(themes) as Theme[]).map(k=>option(k,themes[k].name.replace("Family ",""),theme===k)).join("")+"</select></div>"+
 "<div class=\"fu-toolbar__field\"><label for=\"mode\">Modus</label><select class=\"fu-field__control\" id=\"mode\">"+option("light","Hell",mode==="light")+option("dark","Dunkel",mode==="dark")+"</select></div></div></header>"+
 "<div class=\"fu-shell-body\"><nav class=\"fu-nav\" style=\"--fu-nav-count:"+current.nav.length+"\" aria-label=\"Hauptnavigation\">"+
 current.nav.map((item,i)=>"<button type=\"button\" class=\"fu-nav__link\" data-section=\""+i+"\" "+(page===i?"aria-current=\"page\"":"")+"><span class=\"fu-nav__icon\" aria-hidden=\"true\">"+familyIcon(item.icon)+"</span><span class=\"fu-nav__label\">"+item.label+"</span></button>").join("")+"</nav>"+
 "<main class=\"fu-page-layout\"><div class=\"fu-page-layout__inner fu-stack\"><header class=\"fu-page-layout__header\"><p class=\"fu-page-layout__eyebrow\">Family UI · Demo</p><h1 class=\"fu-page-layout__title\">"+current.nav[page].label+"</h1><p class=\"fu-page-layout__intro\">Vier Identitäten, ein Designsystem.</p></header>"+
 "<section class=\"fu-panel fu-stack\"><h2>Große Hauptaktion</h2><div style=\"display:flex;justify-content:center\"><button class=\"fu-primary-action\" id=\"action\"><span class=\"fu-primary-action__icon\" aria-hidden=\"true\">"+familyIcon(current.actionIcon)+"</span><span class=\"fu-primary-action__label\">"+current.action+"</span></button></div><p class=\"fu-field__hint\">Keine reale Türsteuerung, API-Verbindung oder Trainingsaktion.</p></section>"+
 "<section class=\"fu-panel fu-stack\"><h2>Eingaben und Dialoge</h2><div class=\"fu-field\"><label class=\"fu-field__label\" for=\"entry\">Bezeichnung *</label><input class=\"fu-field__control\" id=\"entry\" placeholder=\"Mein Eintrag\" aria-describedby=\"hint error\"><span class=\"fu-field__hint\" id=\"hint\">Beschriftungen bleiben immer sichtbar.</span><span class=\"fu-field__error\" id=\"error\" hidden>Bitte eine Bezeichnung eingeben.</span></div><label class=\"fu-check\"><input type=\"checkbox\" checked>In Übersicht anzeigen</label><div class=\"fu-row\" style=\"flex-wrap:wrap\"><button class=\"fu-button\" id=\"validate\">Prüfen</button><button class=\"fu-button fu-button--secondary\" id=\"edit\">Dialog</button><button class=\"fu-button fu-button--danger\" id=\"delete\">Löschen …</button></div></section>"+
 "<section class=\"fu-section\" aria-labelledby=\"section-heading\"><div class=\"fu-section__header\"><div><h2 class=\"fu-section__title\" id=\"section-heading\">Inhalte entdecken</h2><p class=\"fu-section__description\">Ein Abschnitt ohne Kartenrahmen</p></div><span class=\"fu-field__hint fu-section__action\">2 Einträge</span></div><div class=\"fu-section__body\"><div class=\"fu-action-list\" id=\"demo-items\"><div class=\"fu-action-list__item\"><button type=\"button\" class=\"fu-action-list-item\" data-open-detail=\"first\"><span class=\"fu-action-list-item__media\" aria-hidden=\"true\">"+familyIcon("book-open")+"</span><span class=\"fu-action-list-item__body\"><span class=\"fu-action-list-item__title\">Beispiel-Eintrag</span><span class=\"fu-action-list-item__meta\">Details und Metadaten</span></span><span class=\"fu-action-list-item__status\">Aktuell</span><span class=\"fu-action-list-item__chevron\" aria-hidden=\"true\">›</span></button></div><div class=\"fu-action-list__item\"><button type=\"button\" class=\"fu-action-list-item\" data-open-detail=\"second\"><span class=\"fu-action-list-item__media fu-action-list-item__media--wide\" aria-hidden=\"true\"><svg viewBox=\"0 0 64 48\" width=\"64\" height=\"48\"><rect width=\"64\" height=\"48\" fill=\"#D4E8D9\"/><circle cx=\"47\" cy=\"13\" r=\"8\" fill=\"#F4C966\"/><path d=\"M0 44 21 20 38 36 51 25 64 38V48H0Z\" fill=\"#438260\"/></svg></span><span class=\"fu-action-list-item__body\"><span class=\"fu-action-list-item__title\">Weiterer Eintrag</span><span class=\"fu-action-list-item__meta\">Ohne Status · vollständig anklickbar</span></span><span class=\"fu-action-list-item__chevron\" aria-hidden=\"true\">›</span></button></div></div><article class=\"fu-detail-view\" id=\"demo-detail\" hidden aria-labelledby=\"detail-title\"><button type=\"button\" class=\"fu-button fu-button--secondary fu-detail-view__back\" id=\"detail-back\">← Zurück</button><header class=\"fu-detail-view__header\"><h3 class=\"fu-detail-view__title\" id=\"detail-title\">Beispiel-Eintrag</h3><div class=\"fu-detail-view__meta\"><span>Beispieldaten</span><span>Zuletzt aktualisiert: heute</span></div><p class=\"fu-detail-view__summary\">Eine Detailansicht mit Titel, Metadaten und frei gestaltbarem Inhalt.</p><div class=\"fu-detail-view__actions\"><button type=\"button\" class=\"fu-button\" id=\"detail-action\">Aktion testen</button></div></header><div class=\"fu-detail-view__body\"><div class=\"fu-section\"><h4 class=\"fu-section__title\">Beschreibung</h4><p>Rezepte, Trainingsdetails und andere Inhalte können hier ohne obligatorischen Kartenrahmen dargestellt werden.</p></div></div></article></div></section>"+
 "<section class=\"fu-section\" aria-labelledby=\"selection-heading\"><div class=\"fu-section__header\"><div><h2 class=\"fu-section__title\" id=\"selection-heading\">Auswahlliste</h2><p class=\"fu-section__description\">Gleiches Zeilenlayout – ganze Zeile schaltet die Checkbox</p></div><span class=\"fu-field__hint fu-section__action\" id=\"selection-count\" role=\"status\" aria-live=\"polite\">0 ausgewählt</span></div><div class=\"fu-section__body\"><div class=\"fu-action-list\" role=\"group\" aria-labelledby=\"selection-heading\"><div class=\"fu-action-list__item\"><label class=\"fu-action-list-item fu-action-list-item--selection\"><input class=\"fu-action-list-item__checkbox\" type=\"checkbox\" name=\"demo-selection\" value=\"first\"><span class=\"fu-action-list-item__body\"><span class=\"fu-action-list-item__title\">Champignon-Tagliatelle</span><span class=\"fu-action-list-item__meta\">Für den Wochenplan auswählen</span></span><span class=\"fu-action-list-item__status\">30 Min.</span></label></div><div class=\"fu-action-list__item\"><label class=\"fu-action-list-item fu-action-list-item--selection\"><input class=\"fu-action-list-item__checkbox\" type=\"checkbox\" name=\"demo-selection\" value=\"second\"><span class=\"fu-action-list-item__body\"><span class=\"fu-action-list-item__title\">Kürbis-Gnocchi</span><span class=\"fu-action-list-item__meta\">Weitere Auswahloption</span></span></label></div></div></div></section>"+
 "<section class=\"fu-panel fu-stack\"><h2>Status und Listen</h2><div class=\"fu-list\"><div class=\"fu-list__item fu-row fu-row--between\">Verbindung <span class=\"fu-status fu-status--success\">✓ Aktiv</span></div><div class=\"fu-list__item fu-row fu-row--between\">Überprüfung <span class=\"fu-status fu-status--warning\">⚠ Erforderlich</span></div><div class=\"fu-list__item fu-row fu-row--between\">Fehler <span class=\"fu-status fu-status--danger\">✕ Fehlgeschlagen</span></div></div><p id=\"feedback\" role=\"status\" aria-live=\"polite\"></p></section></div></main></div></div>"+
 "<dialog class=\"fu-dialog\" id=\"dialog\" aria-labelledby=\"dialog-title\"><h2 id=\"dialog-title\">Eintrag bearbeiten</h2><p>Diese Aktion ist nur simuliert.</p><form method=\"dialog\" class=\"fu-dialog__actions\"><button value=\"cancel\" class=\"fu-button fu-button--secondary\">Abbrechen</button><button value=\"confirm\" class=\"fu-button\">Übernehmen</button></form></dialog>"+
 "<dialog class=\"fu-dialog\" id=\"danger-dialog\" aria-labelledby=\"danger-title\"><h2 id=\"danger-title\">Eintrag löschen?</h2><p>Es werden keine Daten gelöscht.</p><form method=\"dialog\" class=\"fu-dialog__actions\"><button value=\"cancel\" class=\"fu-button fu-button--secondary\">Abbrechen</button><button value=\"confirm\" class=\"fu-button fu-button--danger\">Löschen</button></form></dialog>";
 const get=<T extends HTMLElement>(id:string)=>root.querySelector<T>("#"+id)!;
 const message=(s:string)=>{get<HTMLElement>("feedback").textContent=s;};
 get<HTMLSelectElement>("theme").onchange=e=>{theme=(e.currentTarget as HTMLSelectElement).value as Theme; page=0; show();};
 get<HTMLSelectElement>("mode").onchange=e=>{mode=(e.currentTarget as HTMLSelectElement).value as Mode; show();};
 root.querySelectorAll<HTMLButtonElement>("[data-section]").forEach(b=>b.onclick=()=>{page=Number(b.dataset.section);show();});
 get("action").onclick=()=>message("Demo-Aktion ausgewählt. Nichts ausgeführt.");
 const items=get<HTMLElement>("demo-items"); const detail=get<HTMLElement>("demo-detail");
 let detailTrigger:HTMLButtonElement|null=null;
 root.querySelectorAll<HTMLButtonElement>("[data-open-detail]").forEach(button=>button.onclick=()=>{
   detailTrigger=button;
   get<HTMLElement>("detail-title").textContent=button.querySelector(".fu-action-list-item__title")?.textContent||"Eintrag";
   items.hidden=true;detail.hidden=false;get<HTMLButtonElement>("detail-back").focus();
 });
 get<HTMLButtonElement>("detail-back").onclick=()=>{detail.hidden=true;items.hidden=false;detailTrigger?.focus();};
 get<HTMLButtonElement>("detail-action").onclick=()=>message("Detailaktion simuliert – keine Daten geändert.");

 const selectedInputs=Array.from(root.querySelectorAll<HTMLInputElement>('input[name="demo-selection"]'));
 const updateSelected=()=>{get<HTMLElement>("selection-count").textContent=selectedInputs.filter(i=>i.checked).length+" ausgewählt";};
 selectedInputs.forEach(input=>input.addEventListener("change",updateSelected));
 const input=get<HTMLInputElement>("entry");
 const check=()=>{const invalid=!input.value.trim();input.setAttribute("aria-invalid",String(invalid));get<HTMLElement>("error").hidden=!invalid;return invalid;};
 get("validate").onclick=()=>{if(check()){input.focus();message("Bitte Eingabe korrigieren.");}else message("Eingabe geprüft (Demo).");};
 input.onblur=()=>{if(input.value.length)check();};
 for(const [trigger,id] of [["edit","dialog"],["delete","danger-dialog"]]){
  const d=get<HTMLDialogElement>(id); const b=get<HTMLButtonElement>(trigger);
  b.onclick=()=>d.showModal(); d.onclose=()=>{b.focus();if(d.returnValue==="confirm")message("Dialogaktion simuliert – keine Daten geändert.");};
 }
}
show();
installShowcase(root, { getTheme:()=>theme, getMode:()=>mode });
