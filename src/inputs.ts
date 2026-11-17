import { familyIcon } from "./icons";
const esc=(v:string)=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
export interface NumberInputProps { id:string; label:string; value:number; min?:number; max?:number; step?:number; disabled?:boolean; presets?:readonly number[]; unit?:string; units?:readonly string[]; integer?:boolean }
export function parseNumber(raw:string):number|null {
 const s=raw.trim(); if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s))return null;
 const n=Number(s.replace(",","."));return Number.isFinite(n)?n:null;
}
export function numberInput(p:NumberInputProps):string {
 const id=esc(p.id), label=esc(p.label), off=p.disabled?" disabled":"";
 return '<div class="fu-field fu-number" data-fu-number data-min="'+(p.min??"-Infinity")+'" data-max="'+(p.max??"Infinity")+'" data-step="'+(p.step??1)+'" data-integer="'+Boolean(p.integer)+'"><label class="fu-field__label" for="'+id+'">'+label+'</label><div class="fu-number__row">'+[-1,0,1].map(n=>n===0?'<input class="fu-field__control" id="'+id+'" type="text" inputmode="'+(p.integer?"numeric":"decimal")+'" value="'+p.value+'"'+off+'>':'<button type="button" class="fu-icon-button fu-number__step" data-step="'+n+'" aria-label="'+label+(n<0?" −":" +")+'"'+off+'>'+familyIcon(n<0?"minus":"plus")+'</button>').join("")+(p.units?.length?'<select class="fu-field__control fu-number__unit" aria-label="'+label+' – Einheit"'+off+'>'+p.units.map(u=>'<option'+(u===p.unit?' selected':'')+'>'+esc(u)+'</option>').join("")+'</select>':p.unit?'<span>'+esc(p.unit)+'</span>':'')+'</div>'+(p.presets?.length?'<div class="fu-number__presets">'+p.presets.map(n=>'<button type="button" class="fu-button fu-button--secondary" data-preset="'+n+'"'+off+'>'+n+'</button>').join("")+'</div>':'')+'</div>';
}
export function quantityInput(p:NumberInputProps):string {return numberInput({...p,min:p.min??0});}
export type DurationMode="minutes"|"hm"|"ms"|"hms";
export interface DurationProps {id:string;label:string;seconds:number;mode:DurationMode;disabled?:boolean;labels?:{hours:string;minutes:string;seconds:string};presets?:readonly number[]}
export function durationInput(p:DurationProps):string {
 const s=Math.max(0,Math.floor(p.seconds)), labels=p.labels??{hours:"Stunden",minutes:"Minuten",seconds:"Sekunden"};
 const parts=p.mode==="minutes"?["minutes"]:p.mode==="hm"?["hours","minutes"]:p.mode==="ms"?["minutes","seconds"]:["hours","minutes","seconds"];
 return '<fieldset class="fu-duration" data-fu-duration'+(p.disabled?' disabled':'')+'><legend class="fu-field__label">'+esc(p.label)+'</legend><div class="fu-duration__parts">'+parts.map(k=>{
 const key=k as keyof typeof labels, scale=k==="hours"?3600:k==="minutes"?60:1, bounded=k==="seconds"||(k==="minutes"&&parts.includes("hours"));
 return '<div data-scale="'+scale+'">'+numberInput({id:p.id+"-"+k,label:labels[key],value:bounded?Math.floor(s/scale)%60:Math.floor(s/scale),min:0,max:bounded?59:undefined,integer:true,disabled:p.disabled})+'</div>';
 }).join("")+'</div>'+(p.presets?.length?'<div class="fu-number__presets">'+p.presets.map(n=>'<button type="button" class="fu-button fu-button--secondary" data-duration-preset="'+n+'">'+n/60+' min</button>').join("")+'</div>':'')+'</fieldset>';
}
export function numberValue(root:Element):number|null {
 const input=root.querySelector<HTMLInputElement>("input");if(!input)return null;const v=parseNumber(input.value);
 const el=root as HTMLElement;
 return v!==null&&v>=Number(el.dataset.min)&&v<=Number(el.dataset.max)&&(! (el.dataset.integer==="true")||Number.isInteger(v))?v:null;
}
export function durationValue(root:Element):number|null {
 let total=0;for(const part of Array.from(root.querySelectorAll<HTMLElement>("[data-scale]"))){const n=numberValue(part.querySelector("[data-fu-number]")!);if(n===null)return null;total+=n*Number(part.dataset.scale);}return Number.isSafeInteger(total)?total:null;
}
/** Bind local presentation only; native input/change events are the consumer contract. */
export function bindInputs(root:ParentNode):void {
 for(const el of Array.from(root.querySelectorAll<HTMLElement>("[data-fu-number]"))){
 const input=el.querySelector<HTMLInputElement>("input")!;
 const validate=()=>input.setAttribute("aria-invalid",String(numberValue(el)===null));
 const write=(n:number)=>{input.value=String(Math.min(Number(el.dataset.max),Math.max(Number(el.dataset.min),n)));input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));};
 input.addEventListener("focus",()=>input.select());input.addEventListener("input",validate);input.addEventListener("blur",validate);
 const step=(dir:number)=>write(Number(((parseNumber(input.value)??0)+dir*Number(el.dataset.step)).toPrecision(12)));
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-step]"))){
 let delay:ReturnType<typeof setTimeout>|undefined, repeat:ReturnType<typeof setInterval>|undefined, held=false;
 const stop=()=>{clearTimeout(delay);clearInterval(repeat);};
 b.addEventListener("pointerdown",e=>{if(e.button!==0)return;held=false;b.setPointerCapture(e.pointerId);delay=setTimeout(()=>{held=true;step(Number(b.dataset.step));repeat=setInterval(()=>step(Number(b.dataset.step)),85);},400);});
 for(const event of ["pointerup","pointercancel","lostpointercapture","blur"])b.addEventListener(event,stop);
 b.addEventListener("click",e=>{if(!held||e.detail===0)step(Number(b.dataset.step));held=false;});
 }
 input.addEventListener("keydown",e=>{if(e.key==="ArrowUp"||e.key==="ArrowDown"){e.preventDefault();step(e.key==="ArrowUp"?1:-1);}});
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-preset]")))b.onclick=()=>write(Number(b.dataset.preset));
 validate();
 }
 for(const el of Array.from(root.querySelectorAll<HTMLElement>("[data-fu-duration]"))){
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-duration-preset]")))b.onclick=()=>{
 const s=Number(b.dataset.durationPreset);for(const p of Array.from(el.querySelectorAll<HTMLElement>("[data-scale]"))){const field=p.querySelector<HTMLElement>("[data-fu-number]")!, input=field.querySelector<HTMLInputElement>("input")!;const n=Math.floor(s/Number(p.dataset.scale));input.value=String(field.dataset.max==="59"?n%60:n);input.dispatchEvent(new Event("input",{bubbles:true}));}
 el.dispatchEvent(new Event("change",{bubbles:true}));
 };
 }
}
export interface DisclosureProps {id:string;label:string;expanded?:boolean;disabled?:boolean;text?:string;expandedText?:string;collapsedText?:string}
export interface DisclosureSectionProps extends DisclosureProps {media?:string;metadata?:string;status?:string;actions?:string}
/** Media, status, actions and body are trusted consumer markup. Text labels are escaped. */
function disclosureAttributes(p:DisclosureProps):string {
 return ' aria-label="'+esc(p.label)+'" aria-controls="'+esc(p.id)+'" aria-expanded="'+Boolean(p.expanded)+'" data-fu-disclosure'+(p.disabled?' disabled':'');
}
export function disclosureButton(p:DisclosureProps):string {
 const closed=p.collapsedText??p.text??p.expandedText, opened=p.expandedText??p.text??closed;
 return '<button type="button" class="fu-icon-button fu-disclosure-button"'+disclosureAttributes(p)+'>'+(closed!==undefined?'<span data-fu-disclosure-text data-closed="'+esc(closed)+'" data-open="'+esc(opened??closed)+'">'+esc((p.expanded?opened:closed)??closed)+'</span>':'')+familyIcon("chevron-down")+'</button>';
}
export function disclosureSection(p:DisclosureSectionProps,body:string):string {
 return '<section class="fu-disclosure-section"><div class="fu-disclosure-section__heading"><h3><button type="button" class="fu-disclosure-section__header"'+disclosureAttributes(p)+'>'+(p.media?'<span class="fu-disclosure-section__media">'+p.media+'</span>':'')+'<span class="fu-disclosure-section__title"><span>'+esc(p.label)+'</span>'+(p.metadata?'<small>'+esc(p.metadata)+'</small>':'')+(p.status?'<span>'+p.status+'</span>':'')+'</span>'+familyIcon("chevron-down")+'</button></h3>'+(p.actions?'<div class="fu-disclosure-section__actions">'+p.actions+'</div>':'')+'</div><div class="fu-disclosure-section__body" id="'+esc(p.id)+'"'+(p.expanded?'':' hidden')+'>'+body+'</div></section>';
}
const disclosureBindings=new WeakMap<ParentNode,AbortController>();
export function bindDisclosures(root:ParentNode):()=>void {
 disclosureBindings.get(root)?.abort();
 const controller=new AbortController();disclosureBindings.set(root,controller);
 const set=(b:HTMLButtonElement,open:boolean)=>{
 const id=b.getAttribute("aria-controls");const panel=id?b.ownerDocument.getElementById(id):null;if(!panel)return;
 b.setAttribute("aria-expanded",String(open));panel.hidden=!open;
 const label=b.querySelector<HTMLElement>("[data-fu-disclosure-text]");
 if(label){label.textContent=(open?label.dataset.open:label.dataset.closed)??"";b.setAttribute("aria-label",label.textContent);}
 };
 for(const b of Array.from(root.querySelectorAll<HTMLButtonElement>("[data-fu-disclosure]")))b.addEventListener("click",()=>{
 const open=b.getAttribute("aria-expanded")!=="true",group=b.closest("[data-fu-accordion]");
 if(open&&group)for(const other of Array.from(group.querySelectorAll<HTMLButtonElement>("[data-fu-disclosure]")))if(other!==b&&other.closest("[data-fu-accordion]")===group)set(other,false);
 set(b,open);
 },{signal:controller.signal});
 return ()=>{controller.abort();if(disclosureBindings.get(root)===controller)disclosureBindings.delete(root);};
}
