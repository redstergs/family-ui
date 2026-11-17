export interface StepBand { from:number; step:number }
export type StepPolicy=readonly StepBand[];
export interface RepeatBand { afterMs:number; intervalMs:number }
export type RepeatPolicy=false|readonly RepeatBand[];
export const adaptiveRepeat:readonly RepeatBand[]=[{afterMs:400,intervalMs:200},{afterMs:1500,intervalMs:100},{afterMs:3000,intervalMs:50}];
export const legacyRepeat:readonly RepeatBand[]=[{afterMs:400,intervalMs:85}];
export function stepValue(value:number,direction:number,fallback:number,policy?:StepPolicy,min=-Infinity,max=Infinity):number {
 const bands=(policy??[]).filter(b=>Number.isFinite(b.from)&&Number.isFinite(b.step)&&b.step>0).slice().sort((a,b)=>a.from-b.from);
 const dir=direction<0?-1:1;
 let index=-1;for(let i=0;i<bands.length;i++)if(dir>0?value>=bands[i].from:value>bands[i].from)index=i;
 const step=index>=0?bands[index].step:Number.isFinite(fallback)&&fallback>0?fallback:1;
 let next=Number((value+dir*step).toPrecision(12));
 // Stop at a crossed band boundary so adjacent bands cannot skip it.
 if(dir>0){const boundary=bands.find(b=>b.from>value&&b.from<next);if(boundary)next=boundary.from;}
 else if(index>=0&&next<bands[index].from)next=bands[index].from;
 return Math.min(max,Math.max(min,next));
}
export function repeatBands(policy:RepeatPolicy|undefined):RepeatBand[] {
 return (policy===false?[]:policy??legacyRepeat).filter(b=>Number.isFinite(b.afterMs)&&b.afterMs>=0&&Number.isFinite(b.intervalMs)&&b.intervalMs>=40).slice().sort((a,b)=>a.afterMs-b.afterMs);
}
