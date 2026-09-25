import {M,toDTO,type Money} from '@/lib/money';
import {PersonalLoanInputSchema,type PersonalLoanInput} from './schemas';
import {calcLoanCore,type AmortizationRow} from './core/loan';
export type {AmortizationRow};
export interface PersonalLoanResult{monthlyPayment:Money;totalPayment:Money;totalInterest:Money;schedule:AmortizationRow[]}
export interface PersonalLoanDTO{monthlyPayment:string;totalPayment:string;totalInterest:string;schedule:Array<{month:number;openingBalance:string;payment:string;interest:string;principal:string;closingBalance:string}>}
export function calcPersonalLoan(input:PersonalLoanInput):PersonalLoanResult{
 const v=PersonalLoanInputSchema.parse(input);
 return calcLoanCore({principal:M(v.principal),monthlyRate:M(v.annualRatePercent).div(100).div(12),months:v.termMonths});
}
/** @deprecated Use calcPersonalLoan. */
export function calculatePersonalLoan(input:{principal:number;annualRate:number;months:number}):PersonalLoanResult{
 return calcPersonalLoan({principal:input.principal,annualRatePercent:input.annualRate,termMonths:input.months});
}
export function toPersonalLoanDTO(r:PersonalLoanResult):PersonalLoanDTO{return{monthlyPayment:toDTO(r.monthlyPayment),totalPayment:toDTO(r.totalPayment),totalInterest:toDTO(r.totalInterest),schedule:r.schedule.map(row=>({month:row.month,openingBalance:toDTO(row.openingBalance),payment:toDTO(row.payment),interest:toDTO(row.interest),principal:toDTO(row.principal),closingBalance:toDTO(row.closingBalance)}))}}
