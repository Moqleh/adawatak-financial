import Decimal from 'decimal.js';

Decimal.set({precision:28,rounding:Decimal.ROUND_HALF_EVEN,toExpNeg:-30,toExpPos:30});
export {Decimal};
export type Money=Decimal;
export const M=(v:Decimal.Value):Money=>new Decimal(v);
export const ZERO=new Decimal(0);
export const ONE=new Decimal(1);
export type MoneyDTO=string;
export const toDTO=(v:Money):MoneyDTO=>v.toDecimalPlaces(2,Decimal.ROUND_HALF_EVEN).toFixed(2);
export const fromDTO=(v:MoneyDTO|number):Money=>new Decimal(v);
export const DISPLAY={currency:2,percent:2,rate:2} as const;
export const TOLERANCE=new Decimal('0.01');
export function formatCurrency(v:Money,decimals=DISPLAY.currency){return v.toDecimalPlaces(decimals,Decimal.ROUND_HALF_EVEN).toFixed(decimals)}
export function formatPercent(v:Money,decimals=DISPLAY.percent){return v.toDecimalPlaces(decimals,Decimal.ROUND_HALF_EVEN).toFixed(decimals)}
export function formatRate(v:Money,decimals=DISPLAY.rate){return v.toDecimalPlaces(decimals,Decimal.ROUND_HALF_EVEN).toFixed(decimals)}
export function isZero(v:Money,tol:Money=TOLERANCE){return v.abs().lessThanOrEqualTo(tol)}
export function nearlyEqual(a:Money,b:Money,tol:Money=TOLERANCE){return a.minus(b).abs().lessThanOrEqualTo(tol)}

export interface AmortizationLike{payment:Money;principal:Money;balance:Money}
export class ScheduleInvariantError extends Error{
 readonly code='SCHEDULE_INVARIANT_VIOLATION';
 constructor(public detail:Record<string,string>){super('SCHEDULE_INVARIANT_VIOLATION');this.name='ScheduleInvariantError'}
}
export function adjustFinalPayment<T extends AmortizationLike>(schedule:T[],originalPrincipal:Money):void{
 if(schedule.length===0)return;
 const last=schedule[schedule.length-1];
 const sumPrincipal=schedule.reduce((s,r)=>s.plus(r.principal),ZERO);
 const deficit=originalPrincipal.minus(sumPrincipal);
 if(!last.balance.equals(deficit))throw new ScheduleInvariantError({finalBalance:last.balance.toString(),principalDeficit:deficit.toString()});
 if(deficit.isZero()){last.balance=ZERO;return}
 last.principal=last.principal.plus(deficit);
 last.payment=last.payment.plus(deficit);
 last.balance=ZERO;
}
