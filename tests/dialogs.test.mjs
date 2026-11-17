import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const css=readFileSync(new URL("../src/components/dialogs.css",import.meta.url),"utf8");
const source=readFileSync(new URL("../src/dialogs.ts",import.meta.url),"utf8");
test("structured dialog preserves native semantics and responsive layout",()=>{assert.match(source,/method="dialog"/);assert.match(css,/repeat\(7,minmax\(0,1fr\)\)/);assert.match(css,/safe-area-inset-bottom/);assert.match(css,/overflow:auto/);});
test("selectors expose independent selection and disabled states",()=>{for(const name of ["personSelector","weekDaySelector","slotSelector","conflictActions","actionMenu","structuredDialog"])assert.ok(source.includes("export function "+name));assert.match(source,/data-occupied/);assert.match(source,/aria-pressed/);assert.match(source,/aria-current="date"/);});
