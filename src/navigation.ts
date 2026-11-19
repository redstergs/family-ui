let nextOverflowId=0;
export function bindNavigationOverflow(nav:HTMLElement, options:{icon:string; label?:string; compactQuery?:string; itemWidth?:number}):()=>void {
  const items=Array.from(nav.querySelectorAll<HTMLButtonElement>("button[data-page]"));
  if(!items.length)return ()=>{};
  const originalColumns=nav.style.gridTemplateColumns;
  const trigger=document.createElement("button");trigger.type="button";trigger.className="fu-nav__link nav-overflow";trigger.setAttribute("aria-expanded","false");
  trigger.innerHTML='<span class="fu-nav__icon">'+options.icon+'</span><span class="fu-nav__label"></span>';trigger.querySelector(".fu-nav__label")!.textContent=options.label??"Mehr";
  const panel=document.createElement("div");panel.id="fu-nav-overflow-"+(++nextOverflowId);panel.className="nav-overflow-panel";panel.hidden=true;trigger.setAttribute("aria-controls",panel.id);
  nav.appendChild(trigger);nav.appendChild(panel);
  const narrow=matchMedia(options.compactQuery??"(max-width:740px)");
  const close=()=>{panel.hidden=true;trigger.setAttribute("aria-expanded","false");};
  const active=()=>{trigger.classList.toggle("active",!!panel.querySelector('[aria-current="page"]'));};
  let previous="";
  const layout=()=>{
    const capacity=narrow.matches?Math.max(2,Math.floor(nav.clientWidth/(options.itemWidth??100))):items.length;
    const count=items.length>capacity?capacity-1:items.length;
    const signature=String(narrow.matches)+":"+count;
    if(signature===previous)return;previous=signature;
    items.forEach((item,i)=>{if(i<count)nav.insertBefore(item,trigger);else panel.appendChild(item);});
    trigger.hidden=count===items.length;
    nav.style.gridTemplateColumns=narrow.matches?"repeat("+Math.min(items.length,capacity)+",minmax(0,1fr))":"";
    close();active();
  };
  trigger.onclick=()=>{if(!panel.hidden)close();else{panel.hidden=false;trigger.setAttribute("aria-expanded","true");}};
  const outside=(event:PointerEvent)=>{if(!nav.contains(event.target as Node))close();};
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape"&&!panel.hidden){close();trigger.focus();}};
  const changed=()=>{if(!panel.hidden&&panel.contains(document.activeElement))trigger.focus();close();active();};
  nav.addEventListener("nav-active-change",changed);
  document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);
  narrow.addEventListener("change",layout);
  const observer=new ResizeObserver(()=>layout());observer.observe(nav);layout();
  return ()=>{observer.disconnect();narrow.removeEventListener("change",layout);document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);nav.removeEventListener("nav-active-change",changed);items.forEach(item=>nav.insertBefore(item,trigger));trigger.remove();panel.remove();nav.style.gridTemplateColumns=originalColumns;};
}
