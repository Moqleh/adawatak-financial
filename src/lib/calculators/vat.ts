import {M,toDTO,type Money} from '@/lib/money';
import {VatInputSchema,type VatInput} from './schemas';
export interface VatResult{net:Money;vat:Money;gross:Money;rate:Money;mode:'add'|'remove'}
export interface VatDTO{net:string;vat:string;gross:string;rate:string;mode:'add'|'remove'}
export function calcVat(input:VatInput):VatResult{
 const v=VatInputSchema.parse(input);const rate=M(v.ratePercent).div(100);
 if(v.mode==='add'){const net=M(v.netAmount);const vat=net.times(rate);return{net,vat,gross:net.plus(vat),rate,mode:'add'}}
 const gross=M(v.grossAmount);const net=gross.div(rate.plus(1));const vat=gross.minus(net);return{net,vat,gross,rate,mode:'remove'};
}
/** @deprecated Use calcVat. Legacy extract maps to remove. */
export function calculateVat(input:{amount:number;rate:number;mode:'add'|'remove'|'extract'}):VatResult{
 return input.mode==='add'?calcVat({mode:'add',netAmount:input.amount,ratePercent:input.rate}):calcVat({mode:'remove',grossAmount:input.amount,ratePercent:input.rate});
}
export function toVatDTO(r:VatResult):VatDTO{return{net:toDTO(r.net),vat:toDTO(r.vat),gross:toDTO(r.gross),rate:toDTO(r.rate),mode:r.mode}}
