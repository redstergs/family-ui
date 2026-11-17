import {numberInput,quantityInput,durationInput,disclosureButton,disclosureSection,bindInputs,bindDisclosures,durationValue} from "../src/inputs";
import {actionMenu} from "../src/dialogs";
export function inputsExample():string {
 return '<section id="input-example" class="fu-section fu-stack"><h2>Eingaben &amp; aufklappbare Inhalte</h2>'+
 numberInput({id:"demo-number",label:"Anzahl",value:2,min:1,max:20,integer:true})+
 quantityInput({id:"demo-quantity",label:"Menge",value:350,unit:"g",units:["g","kg","ml","l","Stk."],step:5,presets:[50,100,250,500]})+
 durationInput({id:"demo-prep",label:"Vorbereitung",seconds:1200,mode:"minutes"})+
 durationInput({id:"demo-hm",label:"Gesamtdauer",seconds:5100,mode:"hm"})+
 durationInput({id:"demo-ms",label:"Küchentimer",seconds:1530,mode:"ms"})+
 durationInput({id:"demo-timer",label:"Timer",seconds:1530,mode:"hms",presets:[60,300,900,1800,3600]})+
 '<output id="demo-duration-result" aria-live="polite">1530 s</output>'+
 '<div class="fu-row">Zutaten '+disclosureButton({id:"demo-ingredients",label:"Zutaten ein- oder ausblenden"})+'</div><div id="demo-ingredients" hidden>350 g Nudeln</div>'+
 '<div class="fu-stack" data-fu-accordion>'+disclosureSection({id:"demo-section-a",label:"Zubereitung",expanded:true},"Gemüse schneiden")+disclosureSection({id:"demo-section-b",label:"Nährwerte"},"520 kcal")+'</div>'+
 actionMenu("demo-input-menu","Weitere Aktionen",[{id:"edit",label:"Bearbeiten"},{id:"copy",label:"Kopieren"}])+'<output id="demo-menu-result"></output></section>';
}
export function bindInputExample(doc:Document):void {
 const root=doc.getElementById("input-example");if(!root)return;
 bindInputs(root);bindDisclosures(root);
 const timer=root.querySelectorAll("[data-fu-duration]")[3],output=doc.getElementById("demo-duration-result")!;
 const update=()=>{const n=durationValue(timer);output.textContent=n===null?"Ungültige Dauer":n+" s";};
 root.addEventListener("input",update);root.addEventListener("change",update);
 const toggle=root.querySelector<HTMLButtonElement>("[data-fu-menu-toggle]")!,menu=doc.getElementById("demo-input-menu")!;
 const close=()=>{menu.hidden=true;toggle.setAttribute("aria-expanded","false");};
 toggle.onclick=()=>{menu.hidden=!menu.hidden;toggle.setAttribute("aria-expanded",String(!menu.hidden));};
 root.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden){close();toggle.focus();}});
 doc.addEventListener("click",e=>{if(!e.composedPath().includes(menu)&&!e.composedPath().includes(toggle))close();});
 for(const b of Array.from(menu.querySelectorAll<HTMLButtonElement>("button")))b.onclick=()=>{doc.getElementById("demo-menu-result")!.textContent=b.textContent;close();toggle.focus();};
}
