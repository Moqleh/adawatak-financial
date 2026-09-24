import type{MarketQuote}from'./types';
export type QuoteRequest={symbol:string;exchange?:string;currency?:string};
export interface MarketDataProvider{readonly id:string;getQuote(request:QuoteRequest):Promise<MarketQuote>}
export function unavailableQuote(input:{symbol:string;name?:string;currency?:string|null;source:string}):MarketQuote{return{symbol:input.symbol,name:input.name??input.symbol,price:null,currency:input.currency??null,change:null,changePercent:null,previousClose:null,bid:null,ask:null,exchange:null,exchangeTimezone:null,providerTimezone:null,marketState:'UNKNOWN',dataStatus:'UNAVAILABLE',providerTimestamp:null,fetchedAt:new Date().toISOString(),providerSource:input.source,isDelayed:null,delayMinutes:null}}
