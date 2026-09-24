export type SummaryRow={label:string;value:string};
export function ResultSummaryTable({rows,caption}:{rows:SummaryRow[];caption?:string}){return <table className="result-summary">{caption&&<caption>{caption}</caption>}<tbody>{rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table>}
