import {M,toDTO,type Money} from '@/lib/money';
import {MortgageInputSchema,type MortgageInput} from './schemas';
import {CalculatorError} from './errors';
import {calcLoanCore,type AmortizationRow} from './core/loan';
export interface MortgageResult{loanAmount:Money;/** Loan-to-Value as a percentage, e.g. 80 for 80%. */ltvPercent:Money;monthlyPayment:Money;totalPayment:Money;totalInterest:Money;schedule:AmortizationRow[]}
export interface MortgageDTO{loanAmount:string;ltvPercent:string;monthlyPayment:string;totalPayment:string;totalInterest:string;schedule:Array<{month:number;openingBalance:string;payment:string;interest:string;principal:string;closingBalance:string}>}
export function calcMortgage(input:MortgageInput):MortgageResult{
 const v=MortgageInputSchema.parse(input);
 if(v.downPayment>=v.propertyPrice)throw new CalculatorError('DOWN_PAYMENT_EXCEEDS_PRICE',{propertyPrice:v.propertyPrice,downPayment:v.downPayment});
 const loanAmount=M(v.propertyPrice).minus(v.downPayment);
 const ltvPercent=loanAmount.div(v.propertyPrice).times(100);
 const loan=calcLoanCore({principal:loanAmount,monthlyRate:M(v.annualRatePercent).div(100).div(12),months:v.termMonths});
 return{loanAmount,ltvPercent,...loan};
}
/** @deprecated Use calcMortgage. */
export function calculateMortgage(input:{propertyPrice:number;downPayment:number;annualRate:number;months:number}):MortgageResult{
 return calcMortgage({propertyPrice:input.propertyPrice,downPayment:input.downPayment,annualRatePercent:input.annualRate,termMonths:input.months});
}
export function toMortgageDTO(r:MortgageResult):MortgageDTO{return{loanAmount:toDTO(r.loanAmount),ltvPercent:toDTO(r.ltvPercent),monthlyPayment:toDTO(r.monthlyPayment),totalPayment:toDTO(r.totalPayment),totalInterest:toDTO(r.totalInterest),schedule:r.schedule.map(row=>({month:row.month,openingBalance:toDTO(row.openingBalance),payment:toDTO(row.payment),interest:toDTO(row.interest),principal:toDTO(row.principal),closingBalance:toDTO(row.closingBalance)}))}}
