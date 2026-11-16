import { workflowExample, bindWorkflow } from "./workflow";
import { reactionsExample, bindReactions } from "./reactions";
import "./showcase.css";
import { workspaceExample, bindWorkspace } from "./workspace";
import { phaseTwoExamples, bindPhaseTwo } from "./phase-two";

type Options = {getTheme:()=>string; getMode:()=>string};
export function installShowcase(app: HTMLElement, options: Options) {
  const host = document.createElement("section");
  host.className = "fu-showcase";
  host.innerHTML = `<div class="fu-showcase__switch"><button type="button" class="fu-button fu-button--secondary" id="showcase-toggle" aria-expanded="false" aria-controls="showcase-panel">Komponentenkatalog öffnen</button></div>
  <div id="showcase-panel" hidden>
    <div class="fu-showcase__controls">
      <label>Theme <select id="showcase-theme" class="fu-field__control"><option value="food">Food</option><option value="door">Door</option><option value="mcp">MCP</option><option value="workout">Workout</option></select></label>
      <label>Modus <select id="showcase-mode" class="fu-field__control"><option value="light">Light</option><option value="dark">Dark</option></select></label>
      <label>Vorschau <select id="showcase-size" class="fu-field__control"><option value="100%">Verfügbare Breite</option><option value="320px">Schmal (320 px)</option><option value="390px">Smartphone (390 px)</option><option value="768px">Tablet (768 px)</option><option value="1280px">Desktop (1280 px)</option></select></label>
      <label>Bereich <select id="showcase-section" class="fu-field__control"><option value="workflows">Prozesse &amp; Workflows</option><option value="reactions">Abstimmung &amp; Kommentare</option><option value="foundation" selected>Foundation</option><option value="layout">Layout</option><option value="components">Bestehende Komponenten</option><option value="action-list">ActionList</option><option value="cards">Cards &amp; Hero</option><option value="feedback">Status &amp; EmptyState</option><option value="workspace">Kochansicht</option><option value="planning">Tabellen &amp; Zeitraum</option></select></label>
    </div>
    <iframe title="Family UI responsive Komponenten-Vorschau" class="fu-showcase__preview" id="showcase-frame"></iframe>
  </div>`;
  document.body.insertBefore(host, app);
  const get = <T extends HTMLElement>(id:string) => host.querySelector<T>("#"+id)!;
  const toggle=get<HTMLButtonElement>("showcase-toggle"), panel=get("showcase-panel");
  const theme=get<HTMLSelectElement>("showcase-theme"), mode=get<HTMLSelectElement>("showcase-mode"), size=get<HTMLSelectElement>("showcase-size"), section=get<HTMLSelectElement>("showcase-section"), frame=get<HTMLIFrameElement>("showcase-frame");
  const css = Array.from(document.querySelectorAll<HTMLStyleElement>("style")).map(s=>s.outerHTML).join("");
  const links=Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map(l=>'<link rel="stylesheet" href="'+l.href+'">').join("");
  function render() {
    frame.style.width=size.value;
    const tokens=["page","surface","surface-soft","surface-interactive","surface-hover","surface-selected","border","border-interactive","focus","accent","text","text-muted","success","warning","danger","info"];
    const foundation=`<section class="fu-section"><h2 class="fu-section__title">Farben und Oberflächen</h2><div class="samples">${tokens.map(t=>'<div class="sample"><div class="swatch" style="background:var(--fu-'+t+')"></div><code>--fu-'+t+'</code></div>').join("")}</div></section><section class="fu-section"><h2 class="fu-section__title">Typografie</h2>${["xl","lg","md","base","sm","xs"].map(t=>'<p style="font-size:var(--fu-font-'+t+')">Family UI · '+t+'</p>').join("")}</section><section class="fu-section"><h2 class="fu-section__title">Abstände</h2>${[1,2,3,4,6,8].map(t=>'<div class="fu-row"><span>'+t+'</span><div style="width:var(--fu-space-'+t+');height:20px;background:var(--fu-accent)"></div></div>').join("")}</section>`;
    const toolbar=`<div class="fu-toolbar fu-toolbar--content"><div class="fu-toolbar__field fu-toolbar__field--grow"><label for="query">Suche</label><input id="query" class="fu-field__control" placeholder="Einträge suchen"></div><div class="fu-toolbar__field"><label for="sort">Sortierung</label><select id="sort" class="fu-field__control"><option>Name</option><option>Datum</option></select></div><button class="fu-button fu-button--secondary">Filter</button></div>`;
    const header=`<header class="fu-page-layout__header"><div class="fu-page-layout__heading"><p class="fu-page-layout__eyebrow">Family UI · Showcase</p><h1 class="fu-page-layout__title">Übersicht mit längerem Seitentitel</h1><p class="fu-page-layout__intro">Beschreibung und responsive Aktionen</p></div><div class="fu-page-layout__actions"><button class="fu-button">Neu</button><button class="fu-button fu-button--secondary">Optionen</button></div></header>`;
    const layout=["narrow","default","wide"].map(w=>`<main class="fu-page-layout fu-page-layout--revised fu-page-layout--${w}"><div class="fu-page-layout__inner">${header}<section class="fu-section"><div class="fu-section__header"><div><h2 class="fu-section__title">Abschnitt · ${w}</h2><p class="fu-section__description">Abschnitt ohne Kartenrahmen</p></div><button class="fu-button fu-button--secondary fu-section__action">Alle anzeigen</button></div>${toolbar}<p>Beispielinhalt mit einem längeren Text, der auch auf schmalen Bildschirmen korrekt umbrechen muss.</p></section></div></main>`).join("<hr>");
    const components=`<section class="fu-section"><h2 class="fu-section__title">Bestehende Komponenten</h2><div class="fu-stack"><div class="fu-row" style="flex-wrap:wrap"><button class="fu-button">Primär</button><button class="fu-button fu-button--secondary">Sekundär</button><button class="fu-button" disabled>Disabled</button></div><div class="fu-action-list"><button class="fu-action-list-item"><span class="fu-action-list-item__body"><span class="fu-action-list-item__title">Navigation mit langem Titel</span><span class="fu-action-list-item__meta">Metadaten</span></span><span class="fu-action-list-item__chevron">›</span></button><label class="fu-action-list-item fu-action-list-item--selection"><input class="fu-action-list-item__checkbox" type="checkbox" checked><span class="fu-action-list-item__body">Ausgewählt</span></label><button class="fu-action-list-item" disabled>Deaktiviert</button></div><div class="fu-panel">Informative Oberfläche</div><span class="fu-status fu-status--success">Erfolg</span></div></section>`;
    const body=section.value==="layout"?layout:'<main class="fu-page-layout fu-page-layout--revised"><div class="fu-page-layout__inner">'+(section.value==="workflows"?workflowExample():section.value==="reactions"?reactionsExample():section.value==="foundation"?foundation:section.value==="components"?components:section.value==="workspace"?workspaceExample():phaseTwoExamples(section.value))+'</div></main>';
    frame.srcdoc='<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+links+css+'<style>.samples{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,145px),1fr));gap:12px}.sample{min-width:0}.swatch{height:40px;border:1px solid var(--fu-border);border-radius:8px}.sample code{overflow-wrap:anywhere}hr{border:0;border-top:1px solid var(--fu-divider)}.fu-page-layout--revised{min-height:0}</style></head><body><div class="fu-app" data-fu-theme="'+theme.value+'" data-fu-mode="'+mode.value+'">'+body+'</div></body></html>';
  }
  frame.addEventListener("load",()=>{if(frame.contentDocument) { bindWorkflow(frame.contentDocument); bindReactions(frame.contentDocument); bindPhaseTwo(frame.contentDocument); bindWorkspace(frame.contentDocument); }});
  toggle.onclick=()=>{
    const open=panel.hidden;
    panel.hidden=!open; app.hidden=open; toggle.setAttribute("aria-expanded",String(open));
    toggle.textContent=open?"Zurück zu Beispielseiten":"Komponentenkatalog öffnen";
    if(open){theme.value=options.getTheme();mode.value=options.getMode();render();}
  };
  [theme,mode,size,section].forEach(el=>el.addEventListener("change",render));
}
