import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL(p,import.meta.url),"utf8");
const css=read("../src/components/revision.css");
const demo=read("../playground/phase-two.ts");
test("new CSS is exported and old components remain available",()=>{
 const index=read("../src/components/index.css");
 for(const file of ["controls","layout","content","feedback","revision"])assert.ok(index.includes('./'+file+'.css'));
});
test("action list variants reuse native navigation and selection markup",()=>{
 for(const k of ["fu-action-list--revised","fu-action-list--compact","fu-action-list--aligned","fu-action-list__item--with-action"])assert.ok(css.includes("."+k));
 assert.ok(demo.includes('type="checkbox"'));
 assert.ok(demo.includes('aria-label="Weitere Aktionen"'));
 assert.ok(css.includes("input:disabled"));
});
test("cards, feedback and planned cells are exposed",()=>{
 for(const k of ["fu-panel--interactive","fu-card-grid","fu-hero-card","fu-period-navigator","fu-status--badge","fu-empty-state--compact","fu-table-scroll","fu-table__action"]) {
  assert.ok(css.includes("."+k),k);
  assert.ok(demo.includes(k),k);
 }
 assert.ok(css.includes("minmax(min(100%"));
 assert.ok(css.includes("overflow-x: auto"));
 assert.ok(demo.includes('scope="row"'));
});
test("period demo is local and supports keyboard-native controls",()=>{
 assert.ok(demo.includes("formatRange"));
 assert.ok(demo.includes('type="date"'));
 assert.ok(demo.includes("step*7"));
 assert.ok(demo.includes("monday(new Date())"));
});
