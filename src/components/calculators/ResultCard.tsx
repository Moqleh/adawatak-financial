import type{ReactNode}from'react';
export function ResultCard({label,value,note}:{label:string;value:ReactNode;note?:string}){return <div className="result-card"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
