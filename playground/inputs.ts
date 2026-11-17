import {numberInput,quantityInput,durationInput,disclosureButton,disclosureSection,bindInputs,bindDisclosures,durationValue,adaptiveRepeat} from "../src/inputs";
import {actionMenu,accountMenu,bindMenus} from "../src/dialogs";
import {familyIcon,familyIconNames} from "../src/icons";
export function inputsExample():string {
 return '<section id="input-example" class="fu-section fu-stack"><h2>Eingaben &amp; aufklappbare Inhalte</h2>'+
 numberInput({id:"demo-number",label:"Anzahl",value:2,min:1,max:20,integer:true})+
 quantityInput({id:"demo-quantity",label:"Menge",value:350,unit:"g",units:["g","kg","ml","l","Stk."],step:5,presets:[50,100,250,500]})+
 quantityInput({id:"adaptive-quantity",label:"Adaptive Menge",value:350,unit:"g",units:["g","kg","ml"],step:1,unitPolicies:{g:[{from:0,step:.5},{from:10,step:1},{from:50,step:5},{from:100,step:10},{from:1000,step:50}],kg:[{from:0,step:.05}],ml:[{from:0,step:5},{from:100,step:10}]},repeatPolicy:adaptiveRepeat})+
 durationInput({id:"demo-prep",label:"Vorbereitung",seconds:1200,mode:"minutes"})+
 durationInput({id:"demo-hm",label:"Gesamtdauer",seconds:5100,mode:"hm"})+
 durationInput({id:"demo-ms",label:"Küchentimer",seconds:1530,mode:"ms"})+
 durationInput({id:"demo-timer",label:"Timer",seconds:1530,mode:"hms",presets:[60,300,900,1800,3600]})+
 '<output id="demo-duration-result" aria-live="polite">1530 s</output>'+
 durationInput({id:"adaptive-timer",label:"Timer mit Übertrag",seconds:59,mode:"hms",carry:true,pasteTime:true,minSeconds:0,maxSeconds:86400,repeatPolicy:adaptiveRepeat,adjustments:[{seconds:-60,label:"−1 min"},{seconds:60,label:"+1 min"},{seconds:300,label:"+5 min"}]})+'<output id="adaptive-time-result">59 s</output>'+
 '<div class="fu-row">Zutaten '+disclosureButton({id:"demo-ingredients",label:"Zutaten ein- oder ausblenden"})+'</div><div id="demo-ingredients" hidden>350 g Nudeln</div>'+
 '<div class="fu-stack" data-fu-accordion>'+disclosureSection({id:"demo-section-a",label:"Zubereitung",expanded:true},"Gemüse schneiden")+disclosureSection({id:"demo-section-b",label:"Nährwerte"},"520 kcal")+'</div>'+
 actionMenu("demo-input-menu","Weitere Aktionen",[{id:"edit",label:"Bearbeiten"},{id:"copy",label:"Kopieren"}])+'<output id="demo-menu-result"></output>'+
 '<h3>Disclosure und Konto</h3>'+disclosureSection({id:"recipe-detail",label:"Mediterrane Ofengemüse-Bowl mit Kichererbsen und Zitronendressing",media:familyIcon("utensils"),metadata:"45 Minuten · 3 Portionen",status:"Geplant",actions:'<button class="fu-button" data-demo-action="Kochmodus">Kochmodus starten</button>'+actionMenu("recipe-menu","Rezeptaktionen",[{id:"edit",label:"Bearbeiten",icon:"pencil"}])},"Zutaten und Zubereitung")+
 disclosureButton({id:"participants-demo",label:"Teilnehmer ändern",text:"Teilnehmer ändern"})+'<div id="participants-demo" hidden>Teilnehmer auswählen</div>'+
 accountMenu({id:"account-desktop",label:"Benutzerkonto",name:"Alex",secondary:"Familienmitglied",initials:"A",items:[{id:"profile",label:"Profil",icon:"user-round"},{id:"keys",label:"Passkeys",icon:"key-round"},{id:"admin",label:"Verwaltung",disabled:true},{id:"logout",label:"Abmelden",icon:"log-out",group:"session"}]})+
 accountMenu({id:"account-mobile",label:"Kompaktes Konto",name:"Alex",compact:true,items:[{id:"profile",label:"Profil"}]})+
 '<div style="position:relative;height:100px;overflow:hidden">'+actionMenu("clipped-menu","Menü im Scrollcontainer",[{id:"edit",label:"Bearbeiten"},{id:"copy",label:"Kopieren"}])+'</div>'+
 '<div style="display:flex;flex-wrap:wrap;gap:12px">'+familyIconNames.map(n=>'<span>'+familyIcon(n)+' '+n+'</span>').join("")+'</div></section>';
}
export function bindInputExample(doc:Document):void {
 const root=doc.getElementById("input-example");if(!root)return;
 bindInputs(root);bindDisclosures(root);
 const timer=root.querySelectorAll("[data-fu-duration]")[3],output=doc.getElementById("demo-duration-result")!;
 const update=()=>{const n=durationValue(timer);output.textContent=n===null?"Ungültige Dauer":n+" s";const a=durationValue(root.querySelector("#adaptive-timer-hours")!.closest("[data-fu-duration]")!);doc.getElementById("adaptive-time-result")!.textContent=a===null?"Ungültige Dauer":a+" s";};
 root.addEventListener("input",update);root.addEventListener("change",update);
 bindMenus(root);
 root.addEventListener("click",e=>{const b=(e.target as Element).closest<HTMLElement>("[data-fu-action],[data-demo-action]");if(b)doc.getElementById("demo-menu-result")!.textContent=b.textContent;});
}
