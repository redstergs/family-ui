import {test,expect} from "@playwright/test";
test("adaptive inputs preserve fixed controls and cross boundaries",async({page})=>{
 await page.goto("/");await page.locator("#showcase-toggle").click();await page.locator("#showcase-section").selectOption("inputs");
 const f=page.frameLocator("#showcase-frame"),q=f.locator("#adaptive-quantity");
 await q.fill("95");await f.getByRole("button",{name:"Adaptive Menge +",exact:true}).click();await expect(q).toHaveValue("100");
 await f.getByRole("button",{name:"Adaptive Menge −",exact:true}).click();await expect(q).toHaveValue("95");
 await q.fill("350");await q.press("ArrowUp");await expect(q).toHaveValue("360");
 await f.getByRole("combobox",{name:"Adaptive Menge – Einheit"}).selectOption("kg");await q.fill("0,5");await q.press("ArrowUp");await expect(q).toHaveValue("0.55");
 await f.locator("#demo-quantity").fill("2,5");await f.getByRole("button",{name:"Menge +",exact:true}).click();await expect(f.locator("#demo-quantity")).toHaveValue("7.5");
 await f.locator("#adaptive-timer-seconds").press("ArrowUp");await expect(f.locator("#adaptive-time-result")).toHaveText("60 s");
 await f.locator("#adaptive-timer-seconds").press("ArrowDown");await expect(f.locator("#adaptive-time-result")).toHaveText("59 s");
 await f.getByRole("button",{name:"+5 min",exact:true}).click();await expect(f.locator("#adaptive-time-result")).toHaveText("359 s");
 const all=f.getByRole("checkbox",{name:"Alle auswählen",exact:true});await expect(all).toHaveJSProperty("indeterminate",true);await all.check();await expect(f.locator("#adaptive-selection input").nth(1)).toBeChecked();await expect(f.locator("#adaptive-selection input").nth(2)).not.toBeChecked();
 await f.getByRole("button",{name:"Auswahl löschen"}).click();await expect(all).not.toBeChecked();
 const label=f.locator("#adaptive-week .fu-week-selector__label");await expect(label).toHaveText("16.11.2026");await f.locator("#adaptive-week").getByRole("button",{name:"Vier Wochen vor"}).click();await expect(label).toHaveText("14.12.2026");
});
