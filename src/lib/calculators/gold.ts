import{z}from'zod';import{M,toDTO,type Money}from'@/lib/money';
const S=z.object({weightGrams:z.number().finite().positive(),karat:z.union([z.literal(24),z.literal(22),z.literal(21),z.literal(18)]),pricePerGram24k:z.number().finite().nonnegative(),makingCostPerGram:z.number().finite().nonnegative().default(0),vatRatePercent:z.number().finite().min(0).max(100).default(0)}).strict();
export type GoldInput=z.input<typeof S>;
export interface GoldResult{metalValue:Money;makingCost:Money;subtotal:Money;vat:Money;total:Money;purity:Money}
export function calcGold(input:GoldInput):GoldResult{const v=S.parse(input),purity=M(v.karat).div(24),metalValue=M(v.weightGrams).times(M(v.pricePerGram24k)).times(purity),makingCost=M(v.weightGrams).times(M(v.makingCostPerGram)),subtotal=metalValue.plus(makingCost),vat=subtotal.times(M(v.vatRatePercent).div(100));return{metalValue,makingCost,subtotal,vat,total:subtotal.plus(vat),purity}}
export function toGoldDTO(r:GoldResult){return{metalValue:toDTO(r.metalValue),makingCost:toDTO(r.makingCost),subtotal:toDTO(r.subtotal),vat:toDTO(r.vat),total:toDTO(r.total),purity:toDTO(r.purity)}}
