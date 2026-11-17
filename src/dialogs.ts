
import { familyIcon, type FamilyIconName } from "./icons";
export interface ContextItem { title:string; meta?:string; image?:string; icon?:FamilyIconName }
export interface ActionItem { id:string; label:string; description?:string; icon?:FamilyIconName; disabled?:boolean; group?:string }
export interface PersonItem { id:string; label:string; image?:string; selected:boolean; disabled?:boolean }
export interface DayItem { id:string; weekday:string; number:string; label:string; selected:boolean; today?:boolean; original?:boolean; disabled?:boolean }
export interface WeekSelectorProps { label:string; relative?:string; days:readonly DayItem[]; previousLabel:string; nextLabel:string; previousDisabled?:boolean; nextDisabled?:boolean }
export interface SlotItem extends ActionItem { selected:boolean; occupied:boolean; image?:string }
const e=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const disabled=(v?:boolean)=>v?" disabled":"";
const icon=(n?:FamilyIconName)=>n?familyIcon(n):"";
const image=(url:string)=>'<img alt="" src="'+e(url)+'">';
export function contextItem(p:ContextItem):string {return '<div class="fu-context">'+(p.image||p.icon?'<span class="fu-context__media">'+(p.image?image(p.image):icon(p.icon))+'</span>':'')+'<span class="fu-context__text"><strong>'+e(p.title)+'</strong>'+(p.meta?'<span class="fu-context__meta">'+e(p.meta)+'</span>':'')+'</span></div>'}
function menuMarkup(id:string,label:string,items:readonly ActionItem[],trigger:string,account=false):string {
 let group:string|undefined;
 const content=items.map((item,i)=>{const separator=i>0&&group!==item.group?'<hr role="separator">':'';group=item.group;return separator+'<button type="button" role="menuitem" tabindex="-1" class="fu-action-menu__item" data-fu-action="'+e(item.id)+'"'+disabled(item.disabled)+'>'+icon(item.icon)+e(item.label)+'</button>';}).join("");
 return '<div class="fu-action-menu'+(account?' fu-account-menu':'')+'"><button type="button" class="fu-icon-button'+(account?' fu-account-menu__trigger':'')+'" aria-label="'+e(label)+'" aria-haspopup="menu" aria-expanded="false" aria-controls="'+e(id)+'" data-fu-menu-toggle>'+trigger+'</button><div role="menu" aria-label="'+e(label)+'" class="fu-action-menu__items" id="'+e(id)+'" hidden>'+content+'</div></div>';
}
export function actionMenu(id:string,label:string,items:readonly ActionItem[]):string{return menuMarkup(id,label,items,icon("ellipsis-vertical"));}
export interface AccountMenuProps {id:string;label:string;name:string;secondary?:string;avatar?:string;initials?:string;compact?:boolean;items:readonly ActionItem[]}
export function accountMenu(p:AccountMenuProps):string{return menuMarkup(p.id,p.label,p.items,'<span class="fu-account-menu__avatar">'+(p.avatar?image(p.avatar):p.initials?e(p.initials):icon("circle-user-round"))+'</span>'+(p.compact?'':'<span class="fu-account-menu__name">'+e(p.name)+(p.secondary?'<small>'+e(p.secondary)+'</small>':'')+'</span>')+icon("chevron-down"),true);}
const menuBindings=new WeakMap<ParentNode,()=>void>();
export function bindMenus(root:ParentNode):()=>void {
 menuBindings.get(root)?.();
 const controller=new AbortController(),signal=controller.signal;
 const cleanups:(()=>void)[]=[];
 for(const trigger of Array.from(root.querySelectorAll<HTMLButtonElement>("[data-fu-menu-toggle]"))){
 const doc=trigger.ownerDocument,win=doc.defaultView!,panel=doc.getElementById(trigger.getAttribute("aria-controls")??"");
 if(!panel)continue;
 const native=typeof panel.showPopover==="function";
 const items=()=>Array.from(panel.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'));
 let opened=false;
 const position=()=>{if(!opened)return;const r=trigger.getBoundingClientRect(),v=win.visualViewport,left=v?.offsetLeft??0,top=v?.offsetTop??0,w=v?.width??win.innerWidth,h=v?.height??win.innerHeight,gap=8;
 panel.style.maxWidth=Math.max(0,w-2*gap)+"px";panel.style.maxHeight=Math.max(0,h-2*gap)+"px";
 const pw=panel.offsetWidth,ph=panel.offsetHeight,below=top+h-r.bottom-gap,above=r.top-top-gap;
 const down=below>=ph||below>=above;panel.style.maxHeight=Math.max(44,Math.min(h-2*gap,down?below:above))+"px";
 const height=panel.offsetHeight;
 panel.style.left=Math.max(left+gap,Math.min(r.right-pw,left+w-pw-gap))+"px";
 panel.style.top=Math.max(top+gap,Math.min(down?r.bottom+4:r.top-height-4,top+h-height-gap))+"px";
 };
 const close=(focus=false)=>{if(!opened)return;opened=false;if(native&&panel.matches(":popover-open"))panel.hidePopover();panel.hidden=true;trigger.setAttribute("aria-expanded","false");if(focus&&trigger.isConnected)trigger.focus();};
 const open=(last=false)=>{if(opened)return;opened=true;panel.hidden=false;trigger.setAttribute("aria-expanded","true");if(native){panel.setAttribute("popover","manual");panel.showPopover();}else{panel.style.zIndex="10000";}position();const list=items();(last?list[list.length-1]:list[0])?.focus();};
 trigger.addEventListener("click",()=>opened?close(true):open(),{signal});
 trigger.addEventListener("keydown",ev=>{if(ev.key==="ArrowDown"||ev.key==="ArrowUp"){ev.preventDefault();open(ev.key==="ArrowUp");}},{signal});
 panel.addEventListener("keydown",ev=>{const list=items(),i=list.indexOf(doc.activeElement as HTMLButtonElement);if(ev.key==="Escape"){ev.preventDefault();close(true);}else if(ev.key==="Tab"){close(true);}else if(["ArrowDown","ArrowUp","Home","End"].includes(ev.key)){ev.preventDefault();const n=ev.key==="Home"?0:ev.key==="End"?list.length-1:(i+(ev.key==="ArrowDown"?1:-1)+list.length)%list.length;list[n]?.focus();}},{signal});
 panel.addEventListener("click",ev=>{if((ev.target as Element).closest('[data-fu-action]:not(:disabled)'))close(true);},{signal});
 doc.addEventListener("pointerdown",ev=>{if(opened&&!trigger.contains(ev.target as Node)&&!panel.contains(ev.target as Node))close();},{signal,capture:true});
 doc.addEventListener("keydown",ev=>{if(opened&&ev.key==="Escape")close(true);},{signal});
 win.addEventListener("resize",position,{signal});win.addEventListener("scroll",position,{signal,capture:true});win.visualViewport?.addEventListener("resize",position,{signal});win.visualViewport?.addEventListener("scroll",position,{signal});
 cleanups.push(()=>{close();panel.removeAttribute("popover");});
 }
 const cleanup=()=>{controller.abort();cleanups.forEach(fn=>fn());if(menuBindings.get(root)===cleanup)menuBindings.delete(root);};menuBindings.set(root,cleanup);return cleanup;
}
export function personSelector(label:string,people:readonly PersonItem[]):string{return '<div class="fu-person-selector" role="group" aria-label="'+e(label)+'">'+people.map(p=>'<label class="fu-action-list-item fu-action-list-item--selection"><input type="checkbox" class="fu-action-list-item__checkbox" data-fu-person value="'+e(p.id)+'"'+(p.selected?' checked':'')+disabled(p.disabled)+'><span class="fu-action-list-item__media" aria-hidden="true">'+(p.image?image(p.image):e(p.label.slice(0,1)))+'</span><span class="fu-action-list-item__body">'+e(p.label)+'</span></label>').join("")+'</div>'}
export function weekDaySelector(p:WeekSelectorProps):string{return '<div class="fu-week-selector"><div class="fu-week-selector__header"><button type="button" class="fu-icon-button" data-fu-week="-1" aria-label="'+e(p.previousLabel)+'"'+disabled(p.previousDisabled)+'>'+icon("chevron-left")+'</button><div class="fu-week-selector__label" aria-live="polite"><strong>'+e(p.label)+'</strong>'+(p.relative?'<span class="fu-context__meta">'+e(p.relative)+'</span>':'')+'</div><button type="button" class="fu-icon-button" data-fu-week="1" aria-label="'+e(p.nextLabel)+'"'+disabled(p.nextDisabled)+'>'+icon("chevron-right")+'</button></div><div class="fu-week-selector__days" role="group" aria-label="'+e(p.label)+'">'+p.days.map(d=>'<button type="button" class="fu-week-day" data-fu-day="'+e(d.id)+'" aria-label="'+e(d.label)+'" aria-pressed="'+d.selected+'" data-original="'+Boolean(d.original)+'"'+(d.today?' aria-current="date"':'')+disabled(d.disabled)+'><span class="fu-week-day__weekday">'+e(d.weekday)+'</span><span class="fu-week-day__number">'+e(d.number)+'</span><span class="fu-week-day__mark" aria-hidden="true"></span></button>').join("")+'</div></div>'}
export function slotSelector(label:string,slots:readonly SlotItem[],freeLabel:string):string{return '<div class="fu-slot-selector" role="group" aria-label="'+e(label)+'">'+slots.map(s=>'<button type="button" class="fu-slot" data-fu-slot="'+e(s.id)+'" data-occupied="'+s.occupied+'" aria-pressed="'+s.selected+'"'+disabled(s.disabled)+'>'+icon(s.icon)+(s.image?'<span class="fu-context__media">'+image(s.image)+'</span>':'')+'<span class="fu-slot__body"><strong>'+e(s.label)+'</strong><span class="fu-context__meta">'+e(s.description??(s.occupied?"":freeLabel))+'</span></span><span class="fu-slot__mark">'+icon(s.selected?"circle-dot":"circle")+'</span></button>').join("")+'</div>'}
export function conflictActions(items:readonly ActionItem[]):string{return '<div class="fu-conflict-actions">'+items.map(a=>'<button type="button" class="fu-action-list-item" data-fu-action="'+e(a.id)+'"'+disabled(a.disabled)+'>'+icon(a.icon)+'<span class="fu-action-list-item__body"><strong>'+e(a.label)+'</strong>'+(a.description?'<span class="fu-action-list-item__meta">'+e(a.description)+'</span>':'')+'</span>'+icon("chevron-right")+'</button>').join("")+'</div>'}
export interface DialogProps { id:string; title:string; body:string; cancelLabel:string; confirmLabel?:string; confirmDisabled?:boolean; danger?:boolean }
/** body is trusted markup, not user text. Other fields are escaped. */
export function structuredDialog(p:DialogProps):string{return '<dialog class="fu-dialog fu-dialog--structured" id="'+e(p.id)+'" aria-labelledby="'+e(p.id)+'-title"><header class="fu-dialog__header"><h2 id="'+e(p.id)+'-title">'+e(p.title)+'</h2></header><div class="fu-dialog__body">'+p.body+'</div><form method="dialog" class="fu-dialog__footer">'+(p.confirmLabel?'<button class="fu-button'+(p.danger?' fu-button--danger':'')+'" value="confirm"'+disabled(p.confirmDisabled)+'>'+e(p.confirmLabel)+'</button>':'')+'<button class="fu-button fu-button--secondary" value="cancel">'+e(p.cancelLabel)+'</button></form></dialog>'}
