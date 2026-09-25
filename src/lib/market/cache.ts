import type{MarketQuote}from'./types';
type Entry={quote:MarketQuote;expiresAt:number;staleUntil:number};const cache=new Map<string,Entry>();
export function setQuoteCache(key:string,quote:MarketQuote,ttlMs:number,maxStaleMs:number){const now=Date.now();cache.set(key,{quote,expiresAt:now+ttlMs,staleUntil:now+ttlMs+maxStaleMs})}
export function getQuoteCache(key:string):MarketQuote|null{const x=cache.get(key);if(!x)return null;const now=Date.now();if(now<=x.expiresAt)return x.quote;if(now<=x.staleUntil)return{...x.quote,dataStatus:'STALE'};cache.delete(key);return null}
