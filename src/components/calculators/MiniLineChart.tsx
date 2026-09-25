'use client';
type Point={label:string;value:number;secondary?:number};
export default function MiniLineChart({points,locale,primaryLabel,secondaryLabel}:{points:Point[];locale:string;primaryLabel:string;secondaryLabel?:string}){
 if(points.length<2)return null;
 const width=640,height=220,pad=22,max=Math.max(...points.flatMap(p=>[p.value,p.secondary??0]),1);
 const xy=(v:number,i:number)=>({x:pad+i*(width-pad*2)/(points.length-1),y:height-pad-(v/max)*(height-pad*2)});
 const line=(key:'value'|'secondary')=>points.map((p,i)=>{const v=key==='value'?p.value:(p.secondary??0),q=xy(v,i);return `${q.x},${q.y}`}).join(' ');
 return <figure className="finance-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={primaryLabel}><line x1={pad} y1={height-pad} x2={width-pad} y2={height-pad} className="chart-axis"/><polyline points={line('value')} className="chart-line"/>{secondaryLabel&&<polyline points={line('secondary')} className="chart-line chart-secondary"/>}</svg><figcaption><span><i className="legend-primary"/>{primaryLabel}</span>{secondaryLabel&&<span><i className="legend-secondary"/>{secondaryLabel}</span>}<small>{points.at(-1)?.label} · {new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(points.at(-1)?.value??0)}</small></figcaption></figure>;
}
