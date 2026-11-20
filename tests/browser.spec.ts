import { test, expect } from "@playwright/test";

const themes=["food","door","mcp","workout"];
const modes=["light","dark"];
const categories=["metrics","inputs","workflows","reactions","foundation","layout","components","action-list","cards","feedback","planning"];
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

for(const mode of modes) test("cooking workspace "+mode,async({page})=>{
 await page.goto("/");
 await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-mode").selectOption(mode);
 await page.locator("#showcase-size").selectOption("390px");
 await page.locator("#showcase-section").selectOption("workspace");
 const frame=page.frameLocator("#showcase-frame");
 await frame.locator("#workspace-open").click();
 await expect(frame.locator("#ingredients")).toBeVisible();
 await expect(frame.locator("#steps")).toBeHidden();
 const list=frame.locator("#ingredients .fu-action-list");
 await list.locator("input").nth(2).check();
 await expect(list.locator("label").first()).toContainText("Tagliatelle");
 await expect(frame.locator("#ingredients progress")).toHaveAttribute("value","1");
 await expect(frame.locator("#workspace-settings")).toBeDisabled();
 await list.locator("input").first().uncheck();
 await expect(list.locator("label").first()).toContainText("Zwiebeln");
 await expect(frame.locator("#workspace-settings")).toBeEnabled();
 await frame.locator('[data-pane="steps"]').click();
 await expect(frame.locator("#steps")).toBeVisible();
 await expect(frame.locator("#ingredients")).toBeHidden();
 await expect(frame.locator(".fu-workspace__footer")).toBeHidden();
 await frame.locator('[data-timer="9"]').click();
 await expect(frame.locator(".fu-timer")).toHaveCount(1);
 await expect(frame.locator("#steps input:checked")).toHaveCount(0);
 await frame.locator('[data-timer="0"]').click();
 await frame.locator("#demo-min").fill("0");
 await frame.locator("#demo-sec").fill("10");
 await frame.getByRole("button",{name:"Starten",exact:true}).click();
 await expect(frame.locator(".fu-timer")).toHaveCount(2);
 await frame.locator(".fu-timer").first().getByRole("button",{name:"Pause",exact:true}).click();
 await expect(frame.locator(".fu-timer").first().getByRole("button",{name:"Weiter",exact:true})).toBeVisible();
 await frame.locator("#workspace-close").click();
 await frame.locator("#workspace-open").click();
 await expect(frame.locator(".fu-timer")).toHaveCount(2);
 for(let i=0;i<2;i++)await frame.locator(".fu-timer").first().getByRole("button",{name:"×",exact:true}).click();
 await expect(frame.locator(".fu-workspace__footer")).toBeHidden();
 await page.locator("#showcase-size").selectOption("1280px");
 await frame.locator("#workspace-open").click();
 await expect(frame.locator("#ingredients")).toBeVisible();
 await expect(frame.locator("#steps")).toBeVisible();
 const a=await frame.locator("#ingredients").boundingBox(),b=await frame.locator("#steps").boundingBox();
 expect(a).not.toBeNull();expect(b).not.toBeNull();
 expect(b!.width/a!.width).toBeCloseTo(2,1);
});

 test("votes toggle exclusively and comments restore keyboard focus",async({page})=>{
 await page.goto("/");
 await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-section").selectOption("reactions");
 const frame=page.frameLocator("#showcase-frame");
 const group=frame.locator('[data-reactions="interactive"]');
 const yes=group.getByRole("button",{name:"Zustimmen",exact:true});
 const no=group.getByRole("button",{name:"Ablehnen",exact:true});
 await yes.focus(); await yes.press("Space");
 await expect(yes).toHaveAttribute("aria-pressed","true");
 await expect(frame.locator("#vote-count")).toHaveText("2 von 3 abgestimmt");
 await no.click(); await expect(yes).toHaveAttribute("aria-pressed","false");
 await expect(no).toHaveAttribute("aria-pressed","true");
 await no.click(); await expect(no).toHaveAttribute("aria-pressed","false");
 await expect(frame.locator("#vote-count")).toHaveText("1 von 3 abgestimmt");
 const comments=group.getByRole("button",{name:"3 Kommentare öffnen"});
 await comments.click(); await expect(frame.getByRole("dialog")).toBeVisible();
 await frame.getByRole("button",{name:"Schließen",exact:true}).click();
 await expect(comments).toBeFocused();
 await expect(frame.locator('[data-reactions="busy"] [data-vote]').first()).toBeDisabled();
 await expect(frame.locator('[data-reactions="disabled"] [data-comments]')).toBeDisabled();
 });

test("meal rating keeps not-eaten neutral and comments optional in every theme", async ({page}) => {
 await page.goto("/");
 await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-section").selectOption("reactions");
 const frame = page.frameLocator("#showcase-frame");
 for (const theme of themes) for (const mode of modes) {
  await page.locator("#showcase-theme").selectOption(theme);
  await page.locator("#showcase-mode").selectOption(mode);
  const row = frame.locator('[data-reactions="meal-rating"]');
  const group = row.getByRole("group", {name: "Mahlzeitenbewertung"});
  await expect(group.getByRole("button")).toHaveCount(3);
  const liked = group.getByRole("button", {name: "Hat geschmeckt", exact: true});
  const disliked = group.getByRole("button", {name: "Nicht mein Fall", exact: true});
  const skipped = group.getByRole("button", {name: "Hab ich nicht gegessen", exact: true});
  await liked.click(); await disliked.click();
  await expect(liked).toHaveAttribute("aria-pressed", "false");
  await skipped.focus(); await skipped.press("Space");
  await expect(disliked).toHaveAttribute("aria-pressed", "false");
  await expect(skipped).toHaveAttribute("aria-pressed", "true");
  await expect(frame.locator("#meal-rating-status")).toHaveText("Deine Auswahl: Hab ich nicht gegessen");
  const appearance = await skipped.evaluate(el => {
   const s = getComputedStyle(el);
   const probe = el.ownerDocument.createElement('span'); el.append(probe);
   probe.style.color = 'var(--fu-text)'; probe.style.backgroundColor = 'var(--fu-surface-soft)';
   const expected = getComputedStyle(probe);
   const result = {neutral: s.color === expected.color && s.backgroundColor === expected.backgroundColor,
    focus: s.outlineStyle, width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height,
    mark: getComputedStyle(el.querySelector('.fu-reaction__selected')!).visibility};
   probe.remove(); return result;
  });
  expect(appearance.neutral).toBe(true); expect(appearance.mark).toBe("visible");
  expect(appearance.focus).toBe("solid");
  expect(appearance.width).toBeGreaterThanOrEqual(44); expect(appearance.height).toBeGreaterThanOrEqual(44);
  await expect(skipped.locator('svg')).toHaveAttribute('stroke', 'currentColor');
  await expect(skipped.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  await expect(skipped.locator('svg path').last()).toHaveAttribute('d', 'm2 2 20 20');
  const comments = row.getByRole("button", {name: "Kommentare öffnen", exact: true});
  await expect(group.locator('[data-comments]')).toHaveCount(0);
  await expect(comments).not.toHaveAttribute('aria-pressed');
  await expect(frame.getByRole('dialog')).not.toBeVisible();
  await comments.click(); await expect(frame.getByRole('dialog')).toBeVisible();
  await frame.getByRole('button', {name:'Schließen', exact:true}).press('Escape');
  await expect(comments).toBeFocused();
  await expect(skipped).toHaveAttribute('aria-pressed', 'true');
  await skipped.click(); await expect(skipped).toHaveAttribute('aria-pressed', 'false');
  await expect(frame.locator('#meal-rating-status')).toHaveText('Deine Auswahl: Noch keine Bewertung');
 }
});

test("guided workflow from preparation to automatic completion",async({page})=>{
 await page.goto("/"); await page.locator("#showcase-toggle").click(); await page.locator("#showcase-section").selectOption("workflows");
 const f=page.frameLocator("#showcase-frame"); const click=(a:string)=>f.locator('[data-workflow-action="'+a+'"]').click();
 await expect(f.locator('[data-workflow-action="start"]')).toBeDisabled();
 for(let i=0;i<5;i++)await click("prep-"+i);
 await click("start"); await click("view-0"); await expect(f.locator('[aria-current="step"]')).toContainText("Menüplanung"); await click("return-current"); await click("menu"); await click("publish");
 await click("change-0"); await click("change-1"); await f.locator("#workflow-role").selectOption("1"); await click("vote-0-2"); await f.locator("#workflow-role").selectOption("0"); await click("change-0"); await f.locator("#workflow-role").selectOption("1"); await click("vote-0-1"); await f.locator("#workflow-role").selectOption("2"); await click("vote-1-1"); await f.locator("#workflow-role").selectOption("0"); await click("vote-2-1"); await click("review"); await click("release"); await f.getByRole("button",{name:"Abbrechen",exact:true}).click(); await expect(f.locator('[aria-current="step"]')).toContainText("Finale Freigabe"); await click("release"); await f.getByRole("button",{name:"Freigeben",exact:true}).click(); await click("recipes"); await expect(f.locator(".fu-process-stepper")).toContainText("Planung abgeschlossen"); await expect(f.locator(".fu-process-stepper li")).toHaveCount(5);
 await click("reset"); await expect(f.locator('[aria-current="step"]')).toContainText("Vorbereitung");
});

test("compact workflow navigation and isolated examples",async({page})=>{
 await page.goto("/"); await page.locator("#showcase-toggle").click(); await page.locator("#showcase-size").selectOption("320px"); await page.locator("#showcase-section").selectOption("workflows");
 const f=page.frameLocator("#showcase-frame"); const toggle=f.locator('[aria-controls="workflow-steps"]');
 await expect(toggle).toBeVisible(); await expect(f.locator("#workflow-steps li:visible")).toHaveCount(1);
 await toggle.focus(); await toggle.press("Enter"); await expect(f.locator("#workflow-steps li:visible")).toHaveCount(5); await expect(toggle).toHaveAttribute("aria-expanded","true");
 await f.locator('[data-workflow-action="catalog"]').click(); await expect(f.getByRole("region",{name:"Einzelkomponenten"})).toBeVisible();
});

test("shared account menu and independent disclosure actions",async({page})=>{
 await page.goto("/");await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-size").selectOption("390px");
 await page.locator("#showcase-section").selectOption("inputs");
 const f=page.frameLocator("#showcase-frame");
 const account=f.getByRole("button",{name:"Benutzerkonto",exact:true});
 await account.press("Enter");await expect(f.locator("#account-desktop")).toBeVisible();
 await expect(f.getByRole("menuitem",{name:"Profil",exact:true}).first()).toBeFocused();
 await account.press("Escape");await expect(account).toBeFocused();
 await expect(f.locator("#account-desktop")).toBeHidden();
 await f.getByRole("button",{name:"Kochmodus starten"}).click();
 await expect(f.locator("#recipe-detail")).toBeHidden();
 await f.locator('[aria-controls="recipe-detail"]').click();
 await expect(f.locator("#recipe-detail")).toBeVisible();
 const clipped=f.getByRole("button",{name:"Menü im Scrollcontainer"});
 await clipped.click();await expect(f.locator("#clipped-menu")).toBeVisible();
 await expect(f.locator("#clipped-menu")).toHaveJSProperty("hidden",false);
 await f.locator("#clipped-menu").getByRole("menuitem",{name:"Kopieren"}).click();
 await expect(clipped).toBeFocused();
});

test("responsive navigation keeps hidden destinations reachable",async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto("/");
 const nav=page.locator(".fu-nav").first();const more=nav.getByRole("button",{name:"Mehr",exact:true});
 await expect(more).toBeVisible();await more.click();
 await expect(more).toHaveAttribute("aria-expanded","true");
 await page.keyboard.press("Escape");await expect(more).toHaveAttribute("aria-expanded","false");
 await more.click();await nav.getByRole("button",{name:"Einkauf",exact:true}).click();
 await expect(more).toHaveClass(/active/);
 await page.setViewportSize({width:1280,height:800});await expect(more).toBeHidden();
 await expect(nav.getByRole("button",{name:"Einkauf",exact:true})).toHaveAttribute("aria-current","page");
});

test("MetricGroup preserves zero, unknown and primary hierarchy",async({page})=>{
 await page.goto("/");
 await page.locator("#showcase-toggle").click();
 await page.locator("#showcase-section").selectOption("metrics");
 const frame=page.frameLocator("#showcase-frame");
 await expect(frame.locator("dl.fu-metric-group")).toHaveCount(3);
 await expect(frame.locator(".fu-metric-item--primary")).toHaveCount(3);
 await expect(frame.locator('.fu-metric-item[data-state="unknown"] dd')).toContainText("Nicht verfügbar");
 await expect(frame.locator('.fu-metric-item[data-state="unknown"] dd')).toContainText("—");
 await expect(frame.locator(".fu-metric-group").last().locator("dd").nth(2)).toHaveText("0 m");
 const primary=frame.locator(".fu-metric-item--primary dd").first();
 const secondary=frame.locator(".fu-metric-item:not(.fu-metric-item--primary) dd").first();
 expect(await primary.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(await secondary.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)));
});

 test("retrospective OK is selectable and exclusive", async ({page}) => {
 await page.goto("/");
 await page.locator("#showcase-section").selectOption("reactions");
 const frame=page.frameLocator("iframe").first();
 const row=frame.locator('[data-reactions="meal-rating"]');
 const ok=row.getByRole("button",{name:"OK",exact:true});
 await ok.click(); await expect(ok).toHaveAttribute("aria-pressed","true");
 await expect(row.locator('[data-vote][aria-pressed="true"]')).toHaveCount(1);
 await ok.click(); await expect(ok).toHaveAttribute("aria-pressed","false");
 });
