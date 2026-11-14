import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = p=>readFileSync(new URL(p,import.meta.url),"utf8");
const themes=read("../src/tokens/themes.css"), foundation=read("../src/tokens/foundation.css");
function luminance(hex){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test("all four product themes available in both modes",()=>{for(const name of ["food","door","mcp","workout"]){assert.ok(themes.includes('data-fu-theme="'+name+'"'));assert.ok(themes.includes('data-fu-mode="dark"][data-fu-theme="'+name+'"'));}});
test("accent colors pass normal text AA",()=>{for(const c of ["#244f42","#965025","#64509d","#245f9b"])assert.ok(contrast(c,"#ffffff")>=4.5,c);for(const c of ["#a9dec2","#f1b78a","#cbb9ff","#a7d1ff"])assert.ok(contrast(c,"#131a1c")>=4.5,c);});
test("semantic colors pass normal text AA",()=>{for(const c of ["#176b4d","#935000","#b3261e","#245f9b"])assert.ok(contrast(c,"#ffffff")>=4.5,c);for(const c of ["#87dcb5","#ffd08a","#ffb4ab","#a7d1ff"])assert.ok(contrast(c,"#202a2d")>=4.5,c);});
test("large action sizing",()=>{assert.ok(foundation.includes("--fu-primary-action-size: 148px"));assert.ok(foundation.includes("--fu-primary-action-size: 138px"));});

test("bottom navigation uses bounded, equal-width columns",()=>{
  const css=read("../src/components/layout.css");
  const playground=read("../playground/main.ts");
  assert.ok(css.includes("grid-template-columns: repeat(var(--fu-nav-count, 4), minmax(0, 1fr))"));
  assert.ok(css.includes("max-width: 100%; min-width: 0; display: grid"));
  assert.ok(playground.includes("current.nav.length"));
});
test("short landscape screens retain bottom navigation",()=>{
  const css=read("../src/components/layout.css");
  assert.ok(css.includes("(orientation: landscape) and (max-height: 500px) and (max-width: 899px)"));
  assert.ok(css.includes("position: fixed; inset: auto 0 0"));
});
