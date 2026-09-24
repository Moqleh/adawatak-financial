import {M,ZERO,toDTO,type Money} from '@/lib/money';
import {CompoundSavingsInputSchema,type CompoundSavingsInput} from './schemas';

export interface CompoundSavingsRow{
 period:number;
 openingBalance:Money;
 deposit:Money;
 interestEarned:Money;
 closingBalance:Money;
}
export interface CompoundSavingsResult{
 endBalance:Money;
 totalDeposits:Money;
 totalInterest:Money;
 schedule:CompoundSavingsRow[];
 /** @deprecated Use endBalance. */
 finalValue:Money;
 /** @deprecated Use totalDeposits. */
 initialAmount:Money;
 /** @deprecated Use totalDeposits minus initialAmount when needed. */
 contributions:Money;
 /** @deprecated Use totalInterest. */
 growth:Money;
}
export interface CompoundSavingsDTO{
 endBalance:string;
 totalDeposits:string;
 totalInterest:string;
 schedule:Array<{
  period:number;
  openingBalance:string;
  deposit:string;
  interestEarned:string;
  closingBalance:string;
 }>;
 finalValue:string;
 initialAmount:string;
 contributions:string;
 growth:string;
}

const MONTHS_PER_YEAR=12;
const PERCENT=M(100);
const FREQUENCY={
 MONTHLY:{periodsPerYear:12,monthsPerPeriod:1},
 QUARTERLY:{periodsPerYear:4,monthsPerPeriod:3},
 SEMI_ANNUALLY:{periodsPerYear:2,monthsPerPeriod:6},
 ANNUALLY:{periodsPerYear:1,monthsPerPeriod:12},
} as const;

export function calcCompoundSavings(input:CompoundSavingsInput):CompoundSavingsResult{
 const v=CompoundSavingsInputSchema.parse(input);
 const initialAmount=M(v.initialAmount);
 const monthlyContribution=M(v.monthlyContribution);
 const frequency=FREQUENCY[v.compoundingFrequency];
 const periodicRate=M(v.annualReturnPercent).div(PERCENT).div(frequency.periodsPerYear);
 const months=v.years*MONTHS_PER_YEAR;
 const schedule:CompoundSavingsRow[]=[];
 let balance=initialAmount;

 for(let period=1;period<=months;period++){
  const openingBalance=balance;
  const deposit=monthlyContribution;
  const isCompoundingMonth=period%frequency.monthsPerPeriod===0;
  const balanceBeforeInterest=v.depositTiming==='BEGINNING'
   ? openingBalance.plus(deposit)
   : openingBalance;
  const interestEarned=isCompoundingMonth
   ? balanceBeforeInterest.times(periodicRate)
   : ZERO;
  const closingBalance=v.depositTiming==='BEGINNING'
   ? balanceBeforeInterest.plus(interestEarned)
   : openingBalance.plus(interestEarned).plus(deposit);

  schedule.push({period,openingBalance,deposit,interestEarned,closingBalance});
  balance=closingBalance;
 }

 const contributionTotal=monthlyContribution.times(months);
 const totalDeposits=initialAmount.plus(contributionTotal);
 const totalInterest=schedule.reduce((sum,row)=>sum.plus(row.interestEarned),ZERO);
 const endBalance=schedule.at(-1)?.closingBalance??initialAmount;

 return{
  endBalance,
  totalDeposits,
  totalInterest,
  schedule,
  finalValue:endBalance,
  initialAmount,
  contributions:contributionTotal,
  growth:totalInterest,
 };
}

/** @deprecated Use calcCompoundSavings. */
export function calculateCompoundSavings(input:{initial:number;monthlyContribution:number;annualRate:number;years:number}):CompoundSavingsResult{
 return calcCompoundSavings({
  initialAmount:input.initial,
  monthlyContribution:input.monthlyContribution,
  annualReturnPercent:input.annualRate,
  years:input.years,
 });
}

export function toCompoundSavingsDTO(r:CompoundSavingsResult):CompoundSavingsDTO{
 return{
  endBalance:toDTO(r.endBalance),
  totalDeposits:toDTO(r.totalDeposits),
  totalInterest:toDTO(r.totalInterest),
  schedule:r.schedule.map(row=>({
   period:row.period,
   openingBalance:toDTO(row.openingBalance),
   deposit:toDTO(row.deposit),
   interestEarned:toDTO(row.interestEarned),
   closingBalance:toDTO(row.closingBalance),
  })),
  finalValue:toDTO(r.finalValue),
  initialAmount:toDTO(r.initialAmount),
  contributions:toDTO(r.contributions),
  growth:toDTO(r.growth),
 };
}
