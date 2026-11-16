import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const css=readFileSync(new URL("../src/components/workflow.css",import.meta.url),"utf8");
test("workflow selectors are additive and token-based",()=>{for(const name of ["process-stepper","workflow-header","task-list","progress-checklist","workflow-summary","workflow-handoff"])assert.ok(css.includes(".fu-"+name));assert.ok(css.includes("var(--fu-target-min)"));assert.ok(css.includes(":focus-visible"));assert.ok(css.includes('aria-current="step"'));assert.ok(!/#(?:[0-9a-f]{3,8})\b/i.test(css));});
