import {readFileSync} from "node:fs";
import {test} from "node:test";
import assert from "node:assert/strict";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("tasks remain opt-in and preserve existing workflow styles",()=>{
 const c=read("src/components/index.css");
 assert.match(c,/workflow.css/);assert.match(c,/tasks.css/);
 assert.match(read("src/components/tasks.css"),/fu-task-list--unified/);
});
test("keyed reconciliation does not destroy task forms or expansion",()=>{
 const s=read("src/tasks.ts");
 assert.match(s,/reconcileTaskItems/);
 assert.match(s,/updateTaskItem\(item,task\)/);
 assert.match(s,/body\.replaceChildren\(task\.content\)/);
 assert.doesNotMatch(s,/list\.innerHTML\s*=/);
});
test("showcase includes tasks and docs",()=>{
 assert.match(read("playground/showcase.ts"),/tasksExample\(\)/);
 assert.match(read("docs/tasks.md"),/Family Food integration example/);
});
