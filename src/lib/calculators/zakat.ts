import{z}from'zod';import{M,ZERO,toDTO,type Money}from'@/lib/money';
const nonNeg=z.number().finite().nonnegative();
const S=z.object({cash:nonNeg,goldValue:nonNeg,silverValue:nonNeg,investments:nonNeg,receivables:nonNeg,inventory:nonNeg,otherZakatable:nonNeg,deductibleLiabilities:nonNeg,nisabValue:nonNeg,zakatRatePercent:z.number().finite().min(0).max(100).default(2.5)}).strict();
export type ZakatInput=z.input<typeof S>;
export interface ZakatResult{totalAssets:Money;netZakatable:Money;nisabValue:Money;isDue:boolean;zakatAmount:Money;rate:Money}
export function calcZakat(input:ZakatInput):ZakatResult{const v=S.parse(input);const totalAssets=[v.cash,v.goldValue,v.silverValue,v.investments,v.receivables,v.inventory,v.otherZakatable].reduce((s,x)=>s.plus(M(x)),ZERO);const net=M.max(ZERO,totalAssets.minus(M(v.deductibleLiabilities)));const nisab=M(v.nisabValue),rate=M(v.zakatRatePercent).div(100),isDue=net.greaterThanOrEqualTo(nisab)&&net.greaterThan(ZERO);return{totalAssets,netZakatable:net,nisabValue:nisab,isDue,zakatAmount:isDue?net.times(rate):ZERO,rate}}
export function toZakatDTO(r:ZakatResult){return{totalAssets:toDTO(r.totalAssets),netZakatable:toDTO(r.netZakatable),nisabValue:toDTO(r.nisabValue),isDue:r.isDue,zakatAmount:toDTO(r.zakatAmount),rate:toDTO(r.rate)}}
