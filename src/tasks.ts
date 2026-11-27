/** Lightweight, framework-independent task disclosures and keyed DOM reconciliation.
 * The application owns ids, data, sorting, validation, persistence and actions.
 */
export type TaskInteraction = "navigation" | "inline" | "dialog" | "action" | "information";
export type TaskState = "default" | "urgent" | "blocked" | "loading" | "error";
export interface TaskDefinition {
  id: string;
  title: string;
  meta?: string;
  status?: string;
  icon?: string; // trusted SVG or HTML supplied by consumer
  interaction: TaskInteraction;
  state?: TaskState;
  disabled?: boolean;
  person?: string;
  count?: number;
  content?: HTMLElement; // consumer-owned live element; never recreated on refresh
}
export interface TaskHandlers {
  onNavigate?: (id: string) => void;
  onDialog?: (id: string) => void;
  onAction?: (id: string) => void;
}
function span(className: string, text: string): HTMLSpanElement {
  const el=document.createElement("span");el.className=className;el.textContent=text;return el;
}
function indicator(interaction: TaskInteraction): string {
  if(interaction==="navigation") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  if(interaction==="inline") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  if(interaction==="dialog") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 5h14v14H5zM9 9h6m-6 4h6"/></svg>';
  if(interaction==="action") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7"/></svg>';
  return "";
}
/** Creates a stable keyed li once. All row interactions delegate to supplied callbacks. */
export function createTaskItem(task: TaskDefinition, handlers: TaskHandlers = {}): HTMLLIElement {
  if(!task.id) throw new Error("Task id is required");
  const li=document.createElement("li");li.className="fu-task-item";li.dataset.taskId=task.id;
  const control=document.createElement(task.interaction==="information"?"div":"button");
  control.className=task.interaction==="information"?"fu-task-item__information":"fu-task-item__trigger";
  if(control instanceof HTMLButtonElement)control.type="button";
  const media=span("fu-task-item__media","");media.setAttribute("aria-hidden","true");control.append(media);
  const content=span("fu-task-item__content","");content.append(span("fu-task-item__title",""),span("fu-task-item__meta",""));control.append(content);
  control.append(span("fu-task-item__status",""));
  const right=span("fu-task-item__indicator","");right.setAttribute("aria-hidden","true");control.append(right);
  li.append(control);
  if(task.interaction==="inline"){
    const body=document.createElement("div");body.className="fu-task-item__body";
    body.id="fu-task-body-"+task.id.replace(/[^a-zA-Z0-9_-]/g,"-");
    body.hidden=true;li.append(body);
    const button=control as HTMLButtonElement;
    button.setAttribute("aria-controls",body.id);button.setAttribute("aria-expanded","false");
    button.addEventListener("click",()=>{const expanded=button.getAttribute("aria-expanded")==="true";button.setAttribute("aria-expanded",String(!expanded));body.hidden=expanded;});
  }else if(control instanceof HTMLButtonElement){
    control.addEventListener("click",()=> {
      if(task.interaction==="navigation")handlers.onNavigate?.(li.dataset.taskId!);
      else if(task.interaction==="dialog")handlers.onDialog?.(li.dataset.taskId!);
      else if(task.interaction==="action")handlers.onAction?.(li.dataset.taskId!);
    });
  }
  updateTaskItem(li,task);return li;
}
/** Update labels in-place; never overwrite the consumer form, focus or expansion state. */
export function updateTaskItem(li: HTMLLIElement, task: TaskDefinition): void {
  if(li.dataset.taskId!==task.id)throw new Error("Task id cannot change");
  const control=li.firstElementChild as HTMLElement;
  const expected=task.interaction==="information"?"fu-task-item__information":"fu-task-item__trigger";
  if(!control.classList.contains(expected) || (task.interaction==="inline")!==!!li.querySelector(".fu-task-item__body")) throw new Error("Task interaction changed; recreate item");
  li.dataset.state=task.state??"default";li.dataset.interaction=task.interaction;
  const title=control.querySelector(".fu-task-item__title")!,meta=control.querySelector(".fu-task-item__meta")!,status=control.querySelector(".fu-task-item__status")!,media=control.querySelector(".fu-task-item__media")!,right=control.querySelector(".fu-task-item__indicator")!;
  title.textContent=task.title;
  const details=[task.meta,task.person,task.count==null?undefined:String(task.count)+" Einträge"].filter(Boolean);
  meta.textContent=details.join(" · ");(meta as HTMLElement).hidden=!details.length;
  status.textContent=task.status??"";(status as HTMLElement).hidden=!task.status;
  if(media.getAttribute("data-icon")!==task.icon){media.innerHTML=task.icon??"";media.setAttribute("data-icon",task.icon??"");}
  (media as HTMLElement).hidden=!task.icon;
  if(right.getAttribute("data-indicator")!==task.interaction){right.innerHTML=indicator(task.interaction);right.setAttribute("data-indicator",task.interaction);}
  if(control instanceof HTMLButtonElement){control.disabled=!!task.disabled||task.state==="loading";control.setAttribute("aria-busy",String(task.state==="loading"));}
  const body=li.querySelector<HTMLElement>(".fu-task-item__body");
  if(body && task.content && body.firstElementChild!==task.content)body.replaceChildren(task.content);
}
/** Reconcile only direct children, reusing unchanged keyed rows and their form DOM.
 * The caller supplies already-filtered, sorted tasks; no cross-group moves.
 */
export function reconcileTaskItems(list: HTMLElement, tasks: readonly TaskDefinition[], handlers: TaskHandlers = {}): void {
  const existing=new Map<string,HTMLLIElement>();
  list.querySelectorAll<HTMLLIElement>(":scope > li[data-task-id]").forEach(li=>existing.set(li.dataset.taskId!,li));
  const seen=new Set<string>();
  tasks.forEach((task,index)=>{
    if(seen.has(task.id))throw new Error("Duplicate task id "+task.id);
    seen.add(task.id);
    let item=existing.get(task.id);
    if(item && item.dataset.interaction!==task.interaction){item.remove();item=undefined;}
    if(item) updateTaskItem(item,task);
    else item=createTaskItem(task,handlers);
    if(list.children[index]!==item)list.insertBefore(item,list.children[index]??null);
  });
  for(const [id,item] of existing)if(!seen.has(id))item.remove();
}
export function bindTaskDisclosures(root: ParentNode): () => void {
  const controller=new AbortController();
  root.querySelectorAll<HTMLButtonElement>('.fu-task-list__toggle[aria-controls],.fu-task-group__toggle[aria-controls]').forEach(button=>{
    const target=root.querySelector<HTMLElement>("#"+CSS.escape(button.getAttribute("aria-controls")!));
    if(!target)return;
    button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")==="true";button.setAttribute("aria-expanded",String(!open));target.hidden=open;},{signal:controller.signal});
  });
  return ()=>controller.abort();
}
