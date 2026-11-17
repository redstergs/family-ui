import {durationInput,bindInputs,durationValue} from "../src/inputs";
// Interactive demo only; no production state or services.
export function workspaceExample(): string {
  const row=(title:string,detail:string,timer?:number)=>`<div class="fu-action-list__item--with-action"><label class="fu-action-list-item fu-action-list-item--selection"><input type="checkbox" class="fu-action-list-item__checkbox"><span class="fu-action-list-item__body"><span class="fu-action-list-item__title">${title}</span><span class="fu-action-list-item__subtitle">${detail}</span></span></label>${timer===undefined?'':`<button class="fu-button fu-button--secondary" data-timer="${timer}" data-name="${title}">${timer?'▶ 0'+timer+':00':'Zeit einstellen'}</button>`}</div>`;
  return `<button class="fu-button" id="workspace-open">Kochansicht öffnen</button><section class="fu-workspace" id="workspace-demo" hidden aria-label="Kochansicht">
  <header class="fu-workspace__header"><div class="fu-row fu-row--between"><button class="fu-button fu-button--secondary" id="workspace-close">× Kochansicht schließen</button><button class="fu-button fu-button--secondary" id="workspace-awake" aria-pressed="true" aria-label="Bildschirmstatus simulieren">☀</button></div><h1 class="fu-detail-view__title">Champignon-Tagliatelle</h1><div class="fu-row fu-row--between"><span>3 Personen · 25 Min.</span><button class="fu-button fu-button--secondary" id="workspace-settings">Einstellungen</button></div><div class="fu-tabs fu-tabs--split" aria-label="Arbeitsbereich"><button class="fu-button fu-button--secondary" data-pane="ingredients" aria-pressed="true" aria-selected="true">Zutaten</button><button class="fu-button fu-button--secondary" data-pane="steps" aria-pressed="false" aria-selected="false">Arbeitsschritte</button></div></header>
  <div class="fu-workspace__body"><div class="fu-split-layout fu-split-layout--1-2"><section class="fu-split-layout__pane" id="ingredients" data-active="true"><h2>Zutaten</h2><progress class="fu-progress" aria-label="Zutatenfortschritt" max="6" value="0"></progress><div class="fu-action-list fu-action-list--revised fu-action-list--compact">${[['Zwiebeln','1 Stück'],['Champignons','400 g'],['Tagliatelle','300 g'],['Hafercuisine','250 ml'],['Parmesan','45 g'],['Olivenöl','15 ml']].map(x=>row(x[0],x[1])).join('')}</div></section><section class="fu-split-layout__pane" id="steps" data-active="false"><h2>Arbeitsschritte</h2><progress class="fu-progress" aria-label="Schrittfortschritt" max="5" value="0"></progress><div class="fu-action-list fu-action-list--revised">${row('1. Zwiebeln schneiden','Zwiebeln fein würfeln.')}${row('2. Champignons vorbereiten','Pilze in Scheiben schneiden.')}${row('3. Nudeln kochen','Nach Packungsanleitung kochen.',0)}${row('4. Pilze anbraten','Bei mittlerer Hitze anbraten.',9)}${row('5. Sauce fertigstellen','Hafercuisine und Parmesan hinzufügen.')}</div></section></div></div>
  <footer class="fu-workspace__footer" hidden><div class="fu-timer-bar" aria-label="Aktive Timer"></div></footer>
  <dialog class="fu-dialog" id="workspace-duration"><h2>Timer einstellen</h2><form method="dialog">${durationInput({id:"workspace-time",label:"Dauer",seconds:300,mode:"ms",carry:true,minSeconds:1,maxSeconds:59999,pasteTime:true}).replaceAll("workspace-time-minutes","demo-min").replaceAll("workspace-time-seconds","demo-sec")}<div class="fu-dialog__actions"><button class="fu-button fu-button--secondary" value="cancel" formnovalidate>Abbrechen</button><button class="fu-button" value="start">Starten</button></div></form></dialog>
  <dialog class="fu-dialog" id="workspace-options"><h2>Einstellungen (Demo)</h2><label class="fu-check"><input type="checkbox" checked>Zusätzliche Person</label><form method="dialog"><button class="fu-button">Schließen</button></form></dialog></section>`;
}
export function bindWorkspace(doc:Document) {
  const get=<T extends HTMLElement>(id:string)=>doc.getElementById(id) as T;
  const workspace=get('workspace-demo'); if(!workspace)return;
  const open=get('workspace-open'), close=get('workspace-close');
  open.onclick=()=>{workspace.hidden=false;close.focus();};
  close.onclick=()=>{workspace.hidden=true;open.focus();};
  const awake=get('workspace-awake');
  awake.onclick=()=>awake.setAttribute('aria-pressed',String(awake.getAttribute('aria-pressed')!=='true'));
  get('workspace-settings').onclick=()=>get<HTMLDialogElement>('workspace-options').showModal();
  const tabs=Array.from(workspace.querySelectorAll<HTMLButtonElement>('[data-pane]'));
  tabs.forEach(tab=>tab.onclick=()=>tabs.forEach(t=>{const active=t===tab; t.setAttribute('aria-selected',String(active));t.setAttribute('aria-pressed',String(active));get(t.dataset.pane!).dataset.active=String(active);}));
  const lists=Array.from(workspace.querySelectorAll('.fu-action-list'));
  lists.forEach(list=>{const original=Array.from(list.children);const done:Element[]=[];
    list.addEventListener('change',e=>{const input=e.target as HTMLInputElement;const item=input.closest('.fu-action-list__item--with-action');if(!item)return;
      if(input.checked)done.push(item);else{const i=done.indexOf(item);if(i>=0)done.splice(i,1);}
      [...done,...original.filter(x=>!done.includes(x))].forEach(x=>list.append(x));
      const progress=list.parentElement?.querySelector('progress');if(progress)progress.value=done.length;
      (get('workspace-settings') as HTMLButtonElement).disabled=!!workspace.querySelector('.fu-action-list input:checked');
    });
  });
  const footer=workspace.querySelector<HTMLElement>('.fu-workspace__footer')!, bar=footer.querySelector('.fu-timer-bar')!;
  const timers=new Map<string,{end:number;paused:number|null;node:HTMLElement}>();
  const tick=()=>{for(const t of timers.values()){const n=Math.max(0,Math.ceil((t.paused??(t.end-Date.now()))/1000));t.node.querySelector('.fu-timer__value')!.textContent=n?Math.floor(n/60)+':'+String(n%60).padStart(2,'0'):'Fertig!';t.node.dataset.state=n?'running':'expired';}footer.hidden=timers.size===0;};
  function start(name:string,seconds:number){if(seconds<=0||timers.has(name))return;
    const node=doc.createElement('div');node.className='fu-timer';node.innerHTML='<strong class="fu-timer__name"></strong><span class="fu-timer__value"></span><button class="fu-button fu-button--secondary">Pause</button><button class="fu-button fu-button--secondary">+ 1 Min.</button><button class="fu-button fu-button--secondary">×</button>';
    node.querySelector('strong')!.textContent=name;const t={end:Date.now()+seconds*1000,paused:null as number|null,node};timers.set(name,t);bar.append(node);
    const [pause,extend,stop]=Array.from(node.querySelectorAll('button'));pause.onclick=()=>{if(t.paused===null){t.paused=Math.max(0,t.end-Date.now());pause.textContent='Weiter';}else{t.end=Date.now()+t.paused;t.paused=null;pause.textContent='Pause';}tick();};extend.onclick=()=>{if(t.paused!==null)t.paused+=60000;else t.end=Math.max(Date.now(),t.end)+60000;tick();};stop.onclick=()=>{timers.delete(name);node.remove();tick();};tick();
  }
  const dialog=get<HTMLDialogElement>('workspace-duration');let pending='';bindInputs(dialog);const duration=dialog.querySelector('[data-fu-duration]')!;dialog.querySelector('form')!.addEventListener('submit',e=>{if((e.submitter as HTMLButtonElement)?.value==='start'&&durationValue(duration)===null)e.preventDefault();});
  workspace.querySelectorAll<HTMLButtonElement>('[data-timer]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.timer);if(n)start(b.dataset.name!,n*60);else{pending=b.dataset.name!;dialog.returnValue='';dialog.showModal();}});
  dialog.onclose=()=>{if(dialog.returnValue==='start')start(pending,durationValue(duration)??0);};
  doc.defaultView?.setInterval(tick,250);
}
