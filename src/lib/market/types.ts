export type MarketState='OPEN'|'CLOSED'|'EXTENDED'|'UNKNOWN';
export type DataStatus='LIVE'|'DELAYED'|'EOD'|'STALE'|'UNAVAILABLE';
export interface MarketQuote{symbol:string;name:string;price:number|null;currency:string|null;change:number|null;changePercent:number|null;previousClose:number|null;bid:number|null;ask:number|null;exchange:string|null;exchangeTimezone:string|null;providerTimezone:string|null;marketState:MarketState;dataStatus:DataStatus;providerTimestamp:string|null;fetchedAt:string;providerSource:string;isDelayed:boolean|null;delayMinutes:number|null}
