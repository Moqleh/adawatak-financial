export type MarketErrorCode='INVALID_REQUEST'|'INVALID_SYMBOL'|'SYMBOL_NOT_FOUND'|'RATE_LIMITED'|'PROVIDER_UNAVAILABLE'|'PROVIDER_TIMEOUT'|'QUOTA_EXCEEDED'|'DATA_UNAVAILABLE'|'INTERNAL_ERROR';
export class MarketDataError extends Error{constructor(public readonly code:MarketErrorCode,message:string,public readonly cause?:unknown){super(message);this.name='MarketDataError'}}
