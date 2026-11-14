import "../src/index.css";
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
 "<main class=\"fu-content fu-stack\"><div><p class=\"fu-field__hint\">Family UI 0.1.0 · ausschließlich Demo</p><h1>"+current.nav[page].label+"</h1><p>Vier Identitäten, ein Designsystem.</p></div>"+
 "<section class=\"fu-panel fu-stack\"><h2>Große Hauptaktion</h2><div style=\"display:flex;justify-content:center\"><button class=\"fu-primary-action\" id=\"action\"><span class=\"fu-primary-action__icon\" aria-hidden=\"true\">"+familyIcon(current.actionIcon)+"</span><span class=\"fu-primary-action__label\">"+current.action+"</span></button></div><p class=\"fu-field__hint\">Keine reale Türsteuerung, API-Verbindung oder Trainingsaktion.</p></section>"+
 "<section class=\"fu-panel fu-stack\"><h2>Eingaben und Dialoge</h2><div class=\"fu-field\"><label class=\"fu-field__label\" for=\"entry\">Bezeichnung *</label><input class=\"fu-field__control\" id=\"entry\" placeholder=\"Mein Eintrag\" aria-describedby=\"hint error\"><span class=\"fu-field__hint\" id=\"hint\">Beschriftungen bleiben immer sichtbar.</span><span class=\"fu-field__error\" id=\"error\" hidden>Bitte eine Bezeichnung eingeben.</span></div><label class=\"fu-check\"><input type=\"checkbox\" checked>In Übersicht anzeigen</label><div class=\"fu-row\" style=\"flex-wrap:wrap\"><button class=\"fu-button\" id=\"validate\">Prüfen</button><button class=\"fu-button fu-button--secondary\" id=\"edit\">Dialog</button><button class=\"fu-button fu-button--danger\" id=\"delete\">Löschen …</button></div></section>"+
 "<section class=\"fu-panel fu-stack\"><h2>Status und Listen</h2><div class=\"fu-list\"><div class=\"fu-list__item fu-row fu-row--between\">Verbindung <span class=\"fu-status fu-status--success\">✓ Aktiv</span></div><div class=\"fu-list__item fu-row fu-row--between\">Überprüfung <span class=\"fu-status fu-status--warning\">⚠ Erforderlich</span></div><div class=\"fu-list__item fu-row fu-row--between\">Fehler <span class=\"fu-status fu-status--danger\">✕ Fehlgeschlagen</span></div></div><p id=\"feedback\" role=\"status\" aria-live=\"polite\"></p></section></main></div></div>"+
 "<dialog class=\"fu-dialog\" id=\"dialog\" aria-labelledby=\"dialog-title\"><h2 id=\"dialog-title\">Eintrag bearbeiten</h2><p>Diese Aktion ist nur simuliert.</p><form method=\"dialog\" class=\"fu-dialog__actions\"><button value=\"cancel\" class=\"fu-button fu-button--secondary\">Abbrechen</button><button value=\"confirm\" class=\"fu-button\">Übernehmen</button></form></dialog>"+
 "<dialog class=\"fu-dialog\" id=\"danger-dialog\" aria-labelledby=\"danger-title\"><h2 id=\"danger-title\">Eintrag löschen?</h2><p>Es werden keine Daten gelöscht.</p><form method=\"dialog\" class=\"fu-dialog__actions\"><button value=\"cancel\" class=\"fu-button fu-button--secondary\">Abbrechen</button><button value=\"confirm\" class=\"fu-button fu-button--danger\">Löschen</button></form></dialog>";
 const get=<T extends HTMLElement>(id:string)=>root.querySelector<T>("#"+id)!;
 const message=(s:string)=>{get<HTMLElement>("feedback").textContent=s;};
 get<HTMLSelectElement>("theme").onchange=e=>{theme=(e.currentTarget as HTMLSelectElement).value as Theme; page=0; show();};
 get<HTMLSelectElement>("mode").onchange=e=>{mode=(e.currentTarget as HTMLSelectElement).value as Mode; show();};
 root.querySelectorAll<HTMLButtonElement>("[data-section]").forEach(b=>b.onclick=()=>{page=Number(b.dataset.section);show();});
 get("action").onclick=()=>message("Demo-Aktion ausgewählt. Nichts ausgeführt.");
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
