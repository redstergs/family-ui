import { test, expect } from "@playwright/test";

const themes=["food","door","mcp","workout"];
const modes=["light","dark"];
const categories=["foundation","layout","components","action-list","cards","feedback","planning"];
for(const theme of themes) for(const mode of modes) {
 test(theme+" / "+mode+" responsive catalog",async({page})=>{
  await page.goto("/");
  await page.locator("#showcase-toggle").click();
  await page.locator("#showcase-theme").selectOption(theme);
  await page.locator("#showcase-mode").selectOption(mode);
  const frame=page.frameLocator("#showcase-frame");
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width:width+40,height:900});
   await page.locator("#showcase-size").selectOption(width+"px");
   for(const category of categories){
    await page.locator("#showcase-section").selectOption(category);
    const root=frame.locator(".fu-app");
    await expect(root).toHaveAttribute("data-fu-theme",theme);
    await expect(root).toHaveAttribute("data-fu-mode",mode);
    await expect.poll(async()=>root.evaluate(el=>{
     const doc=el.ownerDocument;
     const viewport=doc.documentElement.clientWidth;
     return [...el.querySelectorAll<HTMLElement>("*")].filter(n=>{
      if(n.closest(".fu-table-scroll")||n instanceof SVGElement)return false;
      const r=n.getBoundingClientRect();
      return r.width>0&&(r.right>viewport+2||r.left < -2);
     }).map(n=>n.className||n.tagName);
    })).toEqual([]);
   }
  }
 });
}
test("native selection, navigation, secondary action and period controls",async({page})=>{
 await page.goto("/");
 await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-section").selectOption("action-list");
 const frame=page.frameLocator("#showcase-frame");
 const checks=frame.locator('input[type="checkbox"]');
 await expect(checks.nth(0)).toBeChecked();
 await checks.nth(1).focus();
 await checks.nth(1).press("Space");
 await expect(checks.nth(1)).toBeChecked();
 await expect(checks.nth(2)).toBeDisabled();
 await frame.getByRole("button",{name:"Weitere Aktionen"}).click();
 await expect(frame.locator("#phase-two-feedback")).toHaveText("Weitere Aktionen geöffnet");
 await frame.locator("button.fu-action-list-item").first().focus();
 await frame.locator("button.fu-action-list-item").first().press("Enter");
 await expect(frame.locator("#phase-two-feedback")).toHaveText("Detail geöffnet");
 await page.locator("#showcase-section").selectOption("planning");
 const date=frame.locator("#demo-date");
 await expect(date).not.toHaveValue("");
 const original=await date.inputValue();
 await frame.getByRole("button",{name:"Nächste Woche"}).click();
 await expect(date).not.toHaveValue(original);
 await frame.getByRole("button",{name:"Vorherige Woche"}).click();
 await expect(date).toHaveValue(original);
 await date.fill("2026-11-18");
 await expect(date).toHaveValue("2026-11-16");
 await frame.getByRole("button",{name:"Heute",exact:true}).click();
 await expect(date).toHaveValue(original);
});
test("visible focus and theme contrast",async({page})=>{
 await page.goto("/");
 await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-section").selectOption("action-list");
 const frame=page.frameLocator("#showcase-frame");
 for(const theme of themes)for(const mode of modes){
  await page.locator("#showcase-theme").selectOption(theme);
  await page.locator("#showcase-mode").selectOption(mode);
  const row=frame.locator("button.fu-action-list-item").first();
  await row.focus();
  await expect(row).toBeFocused();
  const ratios=await row.evaluate(node=>{
   const style=getComputedStyle(node);
   const root=getComputedStyle(node.closest(".fu-app")!);
   const rgb=(s:string)=>{if(s.startsWith("#"))return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16));return (s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);};
   const lum=(s:string)=>rgb(s.trim()).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
   const ratio=(a:string,b:string)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   return {text:ratio(style.color,style.backgroundColor),meta:ratio(root.getPropertyValue("--fu-text-muted"),style.backgroundColor),border:ratio(style.borderTopColor,style.backgroundColor),focus:ratio(root.getPropertyValue("--fu-focus"),root.getPropertyValue("--fu-page")),outline:style.outlineStyle};
  });
  expect(ratios.text).toBeGreaterThanOrEqual(4.5);
  expect(ratios.meta).toBeGreaterThanOrEqual(4.5);
  expect(ratios.border).toBeGreaterThanOrEqual(3);
  expect(ratios.focus).toBeGreaterThanOrEqual(3);
  expect(ratios.outline).toBe("solid");
 }
});
