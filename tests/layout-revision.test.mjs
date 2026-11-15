import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL(p,import.meta.url),"utf8");
const tokens=read("../src/tokens/foundation.css"), css=read("../src/components/content.css"), showcase=read("../playground/showcase.ts");
test("semantic additions retain legacy tokens",()=>{
 for(const k of ["surface","border","max-content","surface-interactive","surface-hover","surface-selected","border-interactive","border-selected","divider","text-subtle","page-gutter","section-gap","content-narrow","content-wide","control-height-compact"]) assert.ok(tokens.includes("--fu-"+k+":"),k);
 assert.match(tokens,/\[data-fu-mode="dark"\] \{ --fu-focus: #a7d1ff;/);
});
test("revised layout is opt-in and has width and toolbar variants",()=>{
 for(const k of ["fu-page-layout--revised","fu-page-layout--narrow","fu-page-layout--wide","fu-page-layout__heading","fu-page-layout__actions","fu-toolbar--content","fu-toolbar--compact"]) assert.ok(css.includes("."+k),k);
 assert.match(css,/max-width: var\(--fu-layout-width, var\(--fu-max-content\)\)/);
});
test("showcase includes responsive iframe and independent theme controls",()=>{
 for(const k of ["showcase-theme","showcase-mode","showcase-size","showcase-section","frame.srcdoc","390px","768px","1280px"]) assert.ok(showcase.includes(k),k);
 assert.ok(read("../playground/main.ts").includes("installShowcase(root"));
});
