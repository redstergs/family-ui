
import {test,expect} from "@playwright/test";
test("meal editing changes local data and allows cancellation",async({page})=>{
 await page.goto("/");await page.locator("#showcase-toggle").click();await page.locator("#showcase-size").selectOption("320px");await page.locator("#showcase-section").selectOption("meal-edit");
 const f=page.frameLocator("#showcase-frame");
 const action=async(label:string)=>{await f.getByRole("button",{name:"Aktionen für Gemüselasagne"}).click();await f.getByRole("button",{name:label,exact:true}).click();};
 await action("Teilnehmer ändern");await f.getByRole("checkbox",{name:"Alex"}).uncheck();await f.getByRole("checkbox",{name:"Sam"}).uncheck();await f.getByRole("button",{name:"Teilnehmer speichern"}).click();await expect(f.getByText("Keine Teilnehmer")).toBeVisible();
 await action("Mahlzeit verschieben");await expect(f.locator(".fu-week-day")).toHaveCount(7);await f.getByRole("button",{name:"Vorherige Woche"}).click();await f.getByRole("button",{name:"Nächste Woche"}).click();await f.getByRole("button",{name:"Mahlzeit verschieben",exact:true}).click();await expect(f.getByRole("dialog")).toContainText("bereits belegt");await f.getByRole("button",{name:/Mahlzeiten tauschen/}).click();await expect(f.locator("#meal-status")).toHaveText("Mahlzeiten getauscht");
 await action("Mahlzeit ausfallen lassen");await f.getByRole("button",{name:"Abbrechen",exact:true}).click();await expect(f.getByRole("button",{name:"Aktionen für Gemüselasagne"})).toBeFocused();
 await action("Mahlzeit ausfallen lassen");await f.getByRole("button",{name:"Mahlzeit ausfallen lassen",exact:true}).click();await expect(f.getByRole("button",{name:"Aktionen für Gemüselasagne"})).toHaveCount(0);
});

test("free move, unchanged target, replacement and Escape across themes",async({page})=>{
 await page.goto("/");await page.locator("#showcase-toggle").click();await page.locator("#showcase-section").selectOption("meal-edit");
 const f=page.frameLocator("#showcase-frame");
 const open=async()=>{await f.getByRole("button",{name:"Aktionen für Gemüselasagne"}).click();await f.getByRole("button",{name:"Mahlzeit verschieben",exact:true}).click();};
 for(const theme of ["food","door","mcp","workout"])for(const mode of ["light","dark"]){
  await page.locator("#showcase-theme").selectOption(theme);await page.locator("#showcase-mode").selectOption(mode);
  await open();await f.locator('[data-fu-day="2026-11-17"]').click();await expect(f.getByRole("button",{name:"Mahlzeit verschieben",exact:true})).toBeDisabled();
  await f.locator('[data-fu-day="2026-11-16"]').click();await f.locator('[data-fu-slot="dinner"]').click();await f.getByRole("button",{name:"Mahlzeit verschieben",exact:true}).click();await expect(f.locator("#meal-status")).toHaveText("Mahlzeit verschoben");
  await f.locator("#meal-reset").click();await open();await f.getByRole("button",{name:"Mahlzeit verschieben",exact:true}).click();await f.getByRole("button",{name:/Mahlzeit ersetzen/}).click();await expect(f.locator("#meal-status")).toHaveText("Mahlzeit ersetzt");await expect(f.getByRole("button",{name:"Aktionen für Linsencurry"})).toHaveCount(0);
  await f.locator("#meal-reset").click();await open();await f.getByRole("button",{name:"Abbrechen",exact:true}).press("Escape");await expect(f.getByRole("button",{name:"Aktionen für Gemüselasagne"})).toBeFocused();
 }
});
