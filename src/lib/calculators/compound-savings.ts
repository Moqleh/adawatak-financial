import {M,toDTO,type Money} from '@/lib/money';
import {CompoundSavingsInputSchema,type CompoundSavingsInput} from './schemas';
export interface CompoundSavingsResult{finalValue:Money;initialAmount:Money;contributions:Money;growth:Money}
export interface CompoundSavingsDTO{finalValue:string;initialAmount:string;contributions:string;growth:string}
export function calcCompoundSavings(input:CompoundSavingsInput):CompoundSavingsResult{
 const v=CompoundSavingsInputSchema.parse(input);const P=M(v.initialAmount);const PMT=M(v.monthlyContribution);const i=M(v.annualReturnPercent).div(100).div(12);const n=v.years*12;
 const finalValue=i.isZero()?P.plus(PMT.times(n)):(()=>{const factor=i.plus(1).pow(n);return P.times(factor).plus(PMT.times(factor.minus(1)).div(i))})();
 const contributions=PMT.times(n);const growth=finalValue.minus(P).minus(contributions);
 return{finalValue,initialAmount:P,contributions,growth};
}
/** @deprecated Use calcCompoundSavings. */
export function calculateCompoundSavings(input:{initial:number;monthlyContribution:number;annualRate:number;years:number}):CompoundSavingsResult{
 return calcCompoundSavings({initialAmount:input.initial,monthlyContribution:input.monthlyContribution,annualReturnPercent:input.annualRate,years:input.years});
}
export function toCompoundSavingsDTO(r:CompoundSavingsResult):CompoundSavingsDTO{return{finalValue:toDTO(r.finalValue),initialAmount:toDTO(r.initialAmount),contributions:toDTO(r.contributions),growth:toDTO(r.growth)}}
