import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('metric styles are opt-in and exported',()=>{
 assert.ok(read('src/components/index.css').includes('./metrics.css'));
 const css=read('src/components/metrics.css');
 for(const part of ['.fu-metric-group','.fu-metric-item--primary','tabular-nums','auto-fit','data-state="unknown"','var(--fu-danger)']) assert.ok(css.includes(part),part);
});
test('metric catalog includes native semantics, unknown and zero',()=>{
 const demo=read('playground/metrics.ts');
 for(const part of ['<dl','<dt','<dd','Nicht verfügbar','"0"','"—"']) assert.ok(demo.includes(part),part);
 assert.ok(read('playground/showcase.ts').includes('metricsExample()'));
});
