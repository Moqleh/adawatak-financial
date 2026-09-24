import type{InputHTMLAttributes}from'react';
type Props=InputHTMLAttributes<HTMLInputElement>&{label:string;hint?:string};
export function CalculatorInput({label,hint,id,...props}:Props){const inputId=id??props.name;return <label className="calculator-field" htmlFor={inputId}><span>{label}</span><input id={inputId}{...props}/>{hint&&<small>{hint}</small>}</label>}
