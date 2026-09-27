'use client';
import type{ReactNode}from'react';

export function CalculatorShell({title,description,children,results}:{title:string;description?:string;children:ReactNode;results?:ReactNode}){
const printResult=()=>{window.print()};
return <div className="calculator-shell">
<header><div className="calculator-title-row"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div><button type="button" className="pdf-btn" onClick={printResult} aria-label="Print or save result as PDF"><span aria-hidden="true">⇩</span><span>PDF / طباعة</span></button></div></header>
<div className="calculator-grid"><div className="calculator-form">{children}</div>{results&&<aside className="calculator-results" aria-live="polite">{results}</aside>}</div>
<p className="data-note">النتائج تقديرية ولأغراض معلوماتية فقط وليست نصيحة مالية أو استثمارية. · Results are estimates for informational purposes only and are not financial or investment advice.</p>
</div>}