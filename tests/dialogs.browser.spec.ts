
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
