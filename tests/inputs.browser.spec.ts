import {test,expect} from "@playwright/test";
test("direct numeric input, duration and disclosure",async({page})=>{
 await page.goto("/");await page.locator("#showcase-toggle").click();await page.locator("#showcase-section").selectOption("inputs");
 const f=page.frameLocator("#showcase-frame");
 const q=f.locator("#demo-quantity");await q.fill("350");await expect(q).toHaveValue("350");await q.fill("2,5");await expect(q).toHaveAttribute("aria-invalid","false");
 await f.getByRole("button",{name:"Menge +",exact:true}).click();await expect(q).toHaveValue("7.5");
 await f.locator("#demo-timer-hours").fill("1");await expect(f.locator("#demo-duration-result")).toHaveText("5130 s");
 await f.locator("#demo-timer-seconds").fill("60");await expect(f.locator("#demo-duration-result")).toHaveText("Ungültige Dauer");
 await f.getByRole("button",{name:"Zutaten ein- oder ausblenden"}).click();await expect(f.locator("#demo-ingredients")).toBeVisible();
 await f.getByRole("button",{name:"Nährwerte"}).click();await expect(f.locator("#demo-section-a")).toBeHidden();await expect(f.locator("#demo-section-b")).toBeVisible();
 await f.getByRole("button",{name:"Weitere Aktionen"}).click();await f.getByRole("button",{name:"Kopieren"}).click();await expect(f.locator("#demo-menu-result")).toHaveText("Kopieren");
});
