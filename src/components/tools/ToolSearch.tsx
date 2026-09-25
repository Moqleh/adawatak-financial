'use client';

import {FormEvent,useMemo,useState} from 'react';
import {Search} from 'lucide-react';
import {useRouter} from '@/i18n/navigation';

type SearchItem={title:string;description:string;href:string;keywords?:string};

const normalize=(value:string)=>value.trim().toLocaleLowerCase().replace(/[\u064B-\u065F\u0670]/g,'');

export default function ToolSearch({items,placeholder}:{items:SearchItem[];placeholder:string}){
  const router=useRouter();
  const[input,setInput]=useState('');
  const matches=useMemo(()=>{
    const q=normalize(input);
    if(!q)return [];
    return items.filter(item=>normalize([item.title,item.description,item.keywords??''].join(' ')).includes(q)).slice(0,6);
  },[input,items]);
  const go=(href:string)=>{setInput('');router.push(href);};
  const submit=(event:FormEvent)=>{event.preventDefault();if(matches[0])go(matches[0].href);};
  return <div className="tool-search-wrap">
    <form className="hero-search functional-search" role="search" onSubmit={submit}>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder={placeholder} aria-label={placeholder} autoComplete="off"/>
      <button type="submit" aria-label={placeholder}><Search size={21} strokeWidth={2}/></button>
    </form>
    {input&&<div className="search-results" role="listbox">{matches.length?matches.map(item=><button type="button" key={item.href} onClick={()=>go(item.href)}><strong>{item.title}</strong><small>{item.description}</small></button>):<div className="search-empty">—</div>}</div>}
  </div>;
}
