import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p=>readFileSync(new URL(p,import.meta.url),"utf8");
const css=read("../src/components/content.css");
const exported=read("../src/components/index.css");
const playground=read("../playground/main.ts");
test("content primitives are part of public CSS entrypoint",()=>{
 assert.match(exported,/@import "\.\/content\.css"/);
 for(const name of ["fu-page-layout","fu-section","fu-action-list-item","fu-detail-view"]) assert.ok(css.includes("."+name),name);
});
test("action list supports optional leading icon, image, and status",()=>{
 for(const name of ["fu-action-list-item__media","fu-action-list-item__body","fu-action-list-item__status"])assert.ok(css.includes("."+name));
 assert.ok(css.includes(".fu-action-list-item__media img"));
 assert.ok(css.includes("object-fit: cover"));
 assert.ok(playground.includes("familyIcon(\"book-open\")"));
 assert.ok(playground.includes("fu-action-list-item__media--wide"));
});
test("page composition respects responsive insets and frameless sections",()=>{
 assert.ok(css.includes("@media (min-width: 600px)"));
 assert.ok(css.includes("padding: var(--fu-space-6) var(--fu-space-4) 106px"));
 assert.ok(css.includes(".fu-section__body"));
 assert.ok(css.includes(".fu-detail-view__body"));
});
test("playground detail view has an actual back interaction",()=>{
 assert.ok(playground.includes('get<HTMLButtonElement>("detail-back").onclick'));
 assert.ok(playground.includes("detailTrigger?.focus()"));
});
