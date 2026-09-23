import {ZERO,ONE,type Money,adjustFinalPayment} from '@/lib/money';
import {CalculatorError} from '../errors';
export interface AmortizationRow{period:number;payment:Money;interest:Money;principal:Money;balance:Money}
export interface LoanCoreInput{principal:Money;monthlyRate:Money;months:number}
export interface LoanCoreResult{monthlyPayment:Money;totalPayment:Money;totalInterest:Money;schedule:AmortizationRow[]}
export function calcLoanCore({principal,monthlyRate,months}:LoanCoreInput):LoanCoreResult{
 if(!principal.isFinite()||!principal.greaterThan(0))throw new CalculatorError('INVALID_INPUT',{field:'principal'});
 if(!monthlyRate.isFinite()||monthlyRate.isNegative())throw new CalculatorError('INVALID_INPUT',{field:'monthlyRate'});
 if(!Number.isInteger(months)||months<=0)throw new CalculatorError('INVALID_INPUT',{field:'months'});
 const monthlyPayment=monthlyRate.isZero()?principal.div(months):principal.times(monthlyRate).div(ONE.minus(monthlyRate.plus(ONE).pow(-months)));
 const schedule=buildSchedule(principal,monthlyRate,months,monthlyPayment);
 adjustFinalPayment(schedule,principal);
 const totalPayment=schedule.reduce((s,row)=>s.plus(row.payment),ZERO);
 const totalInterest=schedule.reduce((s,row)=>s.plus(row.interest),ZERO);
 return{monthlyPayment,totalPayment,totalInterest,schedule};
}
function buildSchedule(principal:Money,monthlyRate:Money,months:number,payment:Money):AmortizationRow[]{
 const rows:AmortizationRow[]=[];let balance=principal;
 for(let i=1;i<=months;i++){
  const interest=balance.times(monthlyRate);
  const principalPart=payment.minus(interest);
  if(principalPart.isNegative()&&i<months)throw new CalculatorError('NEGATIVE_AMORTIZATION',{period:i,payment:payment.toString(),interest:interest.toString()});
  balance=balance.minus(principalPart);
  rows.push({period:i,payment,interest,principal:principalPart,balance});
 }
 return rows;
}
