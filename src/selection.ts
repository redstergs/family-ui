const esc=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
export interface SelectionProps {targetId:string;allLabel:string;clearLabel?:string;invertLabel?:string}
export function selectionControls(p:SelectionProps):string {
 return '<div class="fu-selection-controls" data-fu-selection-controls="'+esc(p.targetId)+'"><label class="fu-check"><input type="checkbox" data-fu-select-all aria-controls="'+esc(p.targetId)+'">'+esc(p.allLabel)+'</label>'+(p.clearLabel?'<button type="button" class="fu-button fu-button--secondary" data-fu-select-clear>'+esc(p.clearLabel)+'</button>':"")+(p.invertLabel?'<button type="button" class="fu-button fu-button--secondary" data-fu-select-invert>'+esc(p.invertLabel)+'</button>':"")+'</div>';
}
const bindings=new WeakMap<ParentNode,()=>void>();
/** Only enabled checkboxes in the explicitly identified group are affected. */
export function bindSelectionControls(root:ParentNode):()=>void {
 bindings.get(root)?.();const first=root.querySelector("[data-fu-selection-controls]");
 const controller=new (first?.ownerDocument.defaultView?.AbortController??AbortController)(),signal=controller.signal;
 for(const bar of Array.from(root.querySelectorAll<HTMLElement>("[data-fu-selection-controls]"))){
 const target=bar.ownerDocument.getElementById(bar.dataset.fuSelectionControls??"");if(!target||target.contains(bar))continue;
 const all=bar.querySelector<HTMLInputElement>("[data-fu-select-all]")!;
 const inputs=()=>Array.from(target.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not(:disabled)'));
 const sync=()=>{const list=inputs(),n=list.filter(i=>i.checked).length;all.checked=list.length>0&&n===list.length;all.indeterminate=n>0&&n<list.length;all.disabled=!list.length;};
 const apply=(fn:(i:HTMLInputElement)=>boolean)=>{const changed=inputs().filter(i=>{const checked=fn(i);if(checked===i.checked)return false;i.checked=checked;return true;});for(const i of changed){const E=i.ownerDocument.defaultView?.Event??Event;i.dispatchEvent(new E("input",{bubbles:true}));i.dispatchEvent(new E("change",{bubbles:true}));}sync();};
 all.addEventListener("change",()=>{const checked=all.checked;apply(()=>checked);},{signal});
 bar.querySelector("[data-fu-select-clear]")?.addEventListener("click",()=>apply(()=>false),{signal});
 bar.querySelector("[data-fu-select-invert]")?.addEventListener("click",()=>apply(i=>!i.checked),{signal});
 target.addEventListener("change",sync,{signal});sync();
 }
 const cleanup=()=>{controller.abort();if(bindings.get(root)===cleanup)bindings.delete(root);};bindings.set(root,cleanup);return cleanup;
}
