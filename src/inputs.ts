import {stepValue,repeatBands,type StepPolicy,type RepeatPolicy} from "./step-policy";
export {stepValue,adaptiveRepeat,legacyRepeat,type StepPolicy,type RepeatPolicy} from "./step-policy";
import { familyIcon } from "./icons";
const esc=(v:string)=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
export interface NumberInputProps { id:string; label:string; value:number; min?:number; max?:number; step?:number; disabled?:boolean; presets?:readonly number[]; unit?:string; units?:readonly string[]; integer?:boolean; stepPolicy?:StepPolicy; unitPolicies?:Readonly<Record<string,StepPolicy>>; repeatPolicy?:RepeatPolicy }
export function parseNumber(raw:string):number|null {
 const s=raw.trim(); if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s))return null;
 const n=Number(s.replace(",","."));return Number.isFinite(n)?n:null;
}
export function numberInput(p:NumberInputProps):string {
 const id=esc(p.id), label=esc(p.label), off=p.disabled?" disabled":"";
 return '<div class="fu-field fu-number" data-fu-number data-policy="'+esc(JSON.stringify(p.stepPolicy??[]))+'" data-unit-policies="'+esc(JSON.stringify(p.unitPolicies??{}))+'" data-unit="'+esc(p.unit??"")+'" data-repeat="'+esc(JSON.stringify(p.repeatPolicy??null))+'" data-min="'+(p.min??"-Infinity")+'" data-max="'+(p.max??"Infinity")+'" data-step="'+(p.step??1)+'" data-integer="'+Boolean(p.integer)+'"><label class="fu-field__label" for="'+id+'">'+label+'</label><div class="fu-number__row">'+[-1,0,1].map(n=>n===0?'<input class="fu-field__control" id="'+id+'" type="text" inputmode="'+(p.integer?"numeric":"decimal")+'" value="'+p.value+'"'+off+'>':'<button type="button" class="fu-icon-button fu-number__step" data-step="'+n+'" aria-label="'+label+(n<0?" −":" +")+'"'+off+'>'+familyIcon(n<0?"minus":"plus")+'</button>').join("")+(p.units?.length?'<select class="fu-field__control fu-number__unit" aria-label="'+label+' – Einheit"'+off+'>'+p.units.map(u=>'<option'+(u===p.unit?' selected':'')+'>'+esc(u)+'</option>').join("")+'</select>':p.unit?'<span>'+esc(p.unit)+'</span>':'')+'</div>'+(p.presets?.length?'<div class="fu-number__presets">'+p.presets.map(n=>'<button type="button" class="fu-button fu-button--secondary" data-preset="'+n+'"'+off+'>'+n+'</button>').join("")+'</div>':'')+'</div>';
}
export function quantityInput(p:NumberInputProps):string {return numberInput({...p,min:p.min??0});}
export type DurationMode="minutes"|"hm"|"ms"|"hms";
export interface DurationProps {id:string;label:string;seconds:number;mode:DurationMode;disabled?:boolean;labels?:{hours:string;minutes:string;seconds:string};presets?:readonly number[]; carry?:boolean; minSeconds?:number; maxSeconds?:number; partSteps?:Partial<Record<"hours"|"minutes"|"seconds",number>>; repeatPolicy?:RepeatPolicy; adjustments?:readonly {seconds:number;label:string}[]; pasteTime?:boolean}
export function durationInput(p:DurationProps):string {
 const s=Math.max(0,Math.floor(p.seconds)), labels=p.labels??{hours:"Stunden",minutes:"Minuten",seconds:"Sekunden"};
 const parts=p.mode==="minutes"?["minutes"]:p.mode==="hm"?["hours","minutes"]:p.mode==="ms"?["minutes","seconds"]:["hours","minutes","seconds"];
 return '<fieldset class="fu-duration" data-fu-duration data-carry="'+Boolean(p.carry)+'" data-min-seconds="'+(p.minSeconds??0)+'" data-max-seconds="'+(p.maxSeconds??Number.MAX_SAFE_INTEGER)+'" data-paste-time="'+Boolean(p.pasteTime)+'"'+(p.disabled?' disabled':'')+'><legend class="fu-field__label">'+esc(p.label)+'</legend><div class="fu-duration__parts">'+parts.map(k=>{
 const key=k as keyof typeof labels, scale=k==="hours"?3600:k==="minutes"?60:1, bounded=k==="seconds"||(k==="minutes"&&parts.includes("hours"));
 return '<div data-scale="'+scale+'">'+numberInput({id:p.id+"-"+k,label:labels[key],value:bounded?Math.floor(s/scale)%60:Math.floor(s/scale),min:0,max:bounded?59:undefined,integer:true,disabled:p.disabled,step:p.partSteps?.[key],repeatPolicy:p.repeatPolicy})+'</div>';
 }).join("")+'</div>'+(p.presets?.length?'<div class="fu-number__presets">'+p.presets.map(n=>'<button type="button" class="fu-button fu-button--secondary" data-duration-preset="'+n+'">'+n/60+' min</button>').join("")+'</div>':'')+(p.adjustments?.length?'<div class="fu-number__presets">'+p.adjustments.map(a=>'<button type="button" class="fu-button fu-button--secondary" data-duration-adjust="'+a.seconds+'"'+(p.disabled?' disabled':'')+'>'+esc(a.label)+'</button>').join('')+'</div>':'')+'</fieldset>';
}
export function numberValue(root:Element):number|null {
 const input=root.querySelector<HTMLInputElement>("input");if(!input)return null;const v=parseNumber(input.value);
 const el=root as HTMLElement;
 return v!==null&&v>=Number(el.dataset.min)&&v<=Number(el.dataset.max)&&(! (el.dataset.integer==="true")||Number.isInteger(v))?v:null;
}
export function durationValue(root:Element):number|null {
 let total=0;for(const part of Array.from(root.querySelectorAll<HTMLElement>("[data-scale]"))){const n=numberValue(part.querySelector("[data-fu-number]")!);if(n===null)return null;total+=n*Number(part.dataset.scale);}const el=root as HTMLElement;return Number.isSafeInteger(total)&&total>=Number(el.dataset.minSeconds??0)&&total<=Number(el.dataset.maxSeconds??Number.MAX_SAFE_INTEGER)?total:null;
}
/** Bind local presentation only; native input/change events are the consumer contract. */
const inputBindings=new WeakMap<ParentNode,()=>void>();
function partsOf(el:Element){return Array.from(el.querySelectorAll<HTMLElement>("[data-scale]"));}
function notify(el:HTMLElement,type:string){el.dispatchEvent(new (el.ownerDocument.defaultView?.Event??Event)(type,{bubbles:true}));}
function readDuration(el:Element):number|null {
 let total=0;for(const p of partsOf(el)){const n=numberValue(p.querySelector("[data-fu-number]")!);if(n===null)return null;total+=n*Number(p.dataset.scale);}
 return Number.isSafeInteger(total)?total:null;
}
function writeDuration(el:HTMLElement,seconds:number):boolean {
 const parts=partsOf(el),quantum=Number(parts[parts.length-1]?.dataset.scale??1);
 const min=Math.ceil(Number(el.dataset.minSeconds??0)/quantum)*quantum,max=Math.floor(Number(el.dataset.maxSeconds??Number.MAX_SAFE_INTEGER)/quantum)*quantum;
 if(!Number.isFinite(seconds)||min>max||!parts.length||el.matches(":disabled"))return false;
 const total=Math.max(min,Math.min(max,Math.floor(seconds/quantum)*quantum)),changed:HTMLInputElement[]=[];
 for(const p of parts){const field=p.querySelector<HTMLElement>("[data-fu-number]")!,input=field.querySelector<HTMLInputElement>("input")!;const n=Math.floor(total/Number(p.dataset.scale));const value=String(field.dataset.max==="59"?n%60:n);if(input.value!==value){input.value=value;changed.push(input);}}
 for(const input of changed)notify(input,"input");if(changed.length)notify(el,"change");return changed.length>0;
}
export function bindInputs(root:ParentNode):()=>void {
 inputBindings.get(root)?.();
 const first=root.querySelector("[data-fu-number]"),win=first?.ownerDocument.defaultView;
 const controller=new (win?.AbortController??AbortController)(),signal=controller.signal;
 const cleanups:(()=>void)[]=[];
 for(const el of Array.from(root.querySelectorAll<HTMLElement>("[data-fu-number]"))){
 const input=el.querySelector<HTMLInputElement>("input")!;
 const decode=<T>(raw:string|undefined,fallback:T):T=>{try{return raw===undefined?fallback:JSON.parse(raw) as T;}catch{return fallback;}};
 const base=decode<StepPolicy>(el.dataset.policy,[]), units=decode<Record<string,StepPolicy>>(el.dataset.unitPolicies,{}),repeat=repeatBands(decode<RepeatPolicy|null>(el.dataset.repeat,null)??undefined);
 const validate=()=>input.setAttribute("aria-invalid",String(numberValue(el)===null));
 const write=(n:number)=>{if(input.matches(":disabled"))return false;const value=String(Math.min(Number(el.dataset.max),Math.max(Number(el.dataset.min),n)));if(value===input.value)return false;input.value=value;notify(input,"input");notify(input,"change");return true;};
 input.addEventListener("focus",()=>input.select(),{signal});input.addEventListener("input",validate,{signal});input.addEventListener("blur",validate,{signal});
 const step=(dir:number)=>{
 if(input.matches(":disabled")||!input.isConnected)return false;
 const duration=el.closest<HTMLElement>("[data-fu-duration]"),part=el.closest<HTMLElement>("[data-scale]");
 if(duration?.dataset.carry==="true"&&part){const total=readDuration(duration);if(total===null)return false;return writeDuration(duration,total+dir*Number(part.dataset.scale)*Number(el.dataset.step));}
 const unit=el.querySelector<HTMLSelectElement>("select")?.value??el.dataset.unit??"";
 const policy=Object.prototype.hasOwnProperty.call(units,unit)?units[unit]:base;
 return write(stepValue(parseNumber(input.value)??0,dir,Number(el.dataset.step),policy,Number(el.dataset.min),Number(el.dataset.max)));
 };
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-step]"))){
 let timer:ReturnType<typeof setTimeout>|undefined,held=false,active=false,start=0;
 const stop=()=>{active=false;clearTimeout(timer);};
 const tick=()=>{if(!active||!b.isConnected||b.matches(":disabled")){stop();return;}held=true;if(!step(Number(b.dataset.step))){stop();return;}const elapsed=Date.now()-start;let band=repeat[0];for(const r of repeat)if(elapsed>=r.afterMs)band=r;timer=setTimeout(tick,band.intervalMs);};
 b.addEventListener("pointerdown",e=>{if(e.button!==0||!repeat.length||b.matches(":disabled"))return;stop();held=false;active=true;start=Date.now();b.setPointerCapture(e.pointerId);timer=setTimeout(tick,repeat[0].afterMs);},{signal});
 for(const event of ["pointerup","pointercancel","lostpointercapture","blur"])b.addEventListener(event,stop,{signal});
 b.addEventListener("click",e=>{if(!held||e.detail===0)step(Number(b.dataset.step));held=false;},{signal});
 win?.addEventListener("blur",stop,{signal});b.ownerDocument.addEventListener("visibilitychange",stop,{signal});cleanups.push(stop);
 }
 input.addEventListener("keydown",e=>{if(e.key==="ArrowUp"||e.key==="ArrowDown"){e.preventDefault();step(e.key==="ArrowUp"?1:-1);}},{signal});
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-preset]")))b.addEventListener("click",()=>write(Number(b.dataset.preset)),{signal});
 validate();
 }
 for(const el of Array.from(root.querySelectorAll<HTMLElement>("[data-fu-duration]"))){
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-duration-preset]")))b.addEventListener("click",()=>writeDuration(el,Number(b.dataset.durationPreset)),{signal});
 for(const b of Array.from(el.querySelectorAll<HTMLButtonElement>("[data-duration-adjust]")))b.addEventListener("click",()=>{const v=readDuration(el);if(v!==null)writeDuration(el,v+Number(b.dataset.durationAdjust));},{signal});
 if(el.dataset.pasteTime==="true")el.addEventListener("paste",e=>{const text=e.clipboardData?.getData("text").trim()??"";if(!/^\d+(?::\d{1,2}){1,2}$/.test(text))return;const values=text.split(":").map(Number),parts=partsOf(el);if(values.length!==parts.length||values.slice(1).some(n=>n>59))return;e.preventDefault();writeDuration(el,values.reduce((sum,n,i)=>sum+n*Number(parts[i].dataset.scale),0));},{signal});
 }
 const cleanup=()=>{controller.abort();cleanups.forEach(fn=>fn());if(inputBindings.get(root)===cleanup)inputBindings.delete(root);};inputBindings.set(root,cleanup);return cleanup;
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
 const controller=new (root.querySelector("button")?.ownerDocument.defaultView?.AbortController??AbortController)();disclosureBindings.set(root,controller);
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
