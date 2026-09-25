import {M,ONE,toDTO,type Money} from '@/lib/money';
import {RetirementInputSchema,type RetirementInput} from './schemas';

export interface RetirementRow{
 period:number;
 age:Money;
 openingBalance:Money;
 deposit:Money;
 interestEarned:Money;
 closingBalance:Money;
 inflationAdjustedBalance:Money;
}

export interface RetirementResult{
 yearsToRetirement:number;
 annualSpending:Money;
 targetPortfolio:Money;
 projectedPortfolio:Money;
 inflationAdjustedPortfolio:Money;
 fundingGap:Money;
 schedule:RetirementRow[];
}

export interface RetirementDTO{
 yearsToRetirement:number;
 annualSpending:string;
 targetPortfolio:string;
 projectedPortfolio:string;
 inflationAdjustedPortfolio:string;
 fundingGap:string;
 schedule:Array<{
  period:number;
  age:string;
  openingBalance:string;
  deposit:string;
  interestEarned:string;
  closingBalance:string;
  inflationAdjustedBalance:string;
 }>;
}

const MONTHS_PER_YEAR=12;
const PERCENT=M(100);

export function calcRetirement(input:RetirementInput):RetirementResult{
 const v=RetirementInputSchema.parse(input);
 const yearsToRetirement=v.retirementAge-v.currentAge;
 const months=yearsToRetirement*MONTHS_PER_YEAR;
 const currentSavings=M(v.currentSavings);
 const monthlyContribution=M(v.monthlyContribution);
 const monthlyNominalRate=M(v.expectedAnnualReturnPercent).div(PERCENT).div(MONTHS_PER_YEAR);
 const annualInflationFactor=ONE.plus(M(v.inflationRatePercent).div(PERCENT));
 const monthlyInflationFactor=annualInflationFactor.pow(ONE.div(MONTHS_PER_YEAR));
 const schedule:RetirementRow[]=[];
 let balance=currentSavings;
 let cumulativeInflationFactor=ONE;

 for(let period=1;period<=months;period++){
  const openingBalance=balance;
  const deposit=monthlyContribution;
  const interestEarned=openingBalance.times(monthlyNominalRate);
  const closingBalance=openingBalance.plus(interestEarned).plus(deposit);
  cumulativeInflationFactor=cumulativeInflationFactor.times(monthlyInflationFactor);
  const inflationAdjustedBalance=closingBalance.div(cumulativeInflationFactor);
  const age=M(v.currentAge).plus(M(period).div(MONTHS_PER_YEAR));

  schedule.push({
   period,
   age,
   openingBalance,
   deposit,
   interestEarned,
   closingBalance,
   inflationAdjustedBalance,
  });
  balance=closingBalance;
 }

 const annualSpending=M(v.targetMonthlySpending).times(MONTHS_PER_YEAR);
 const withdrawalRate=M(v.withdrawalRatePercent).div(PERCENT);
 const targetPortfolio=annualSpending.div(withdrawalRate);
 const projectedPortfolio=schedule.at(-1)?.closingBalance??currentSavings;
 const inflationAdjustedPortfolio=schedule.at(-1)?.inflationAdjustedBalance??currentSavings;
 const fundingGap=targetPortfolio.minus(inflationAdjustedPortfolio);

 return{
  yearsToRetirement,
  annualSpending,
  targetPortfolio,
  projectedPortfolio,
  inflationAdjustedPortfolio,
  fundingGap,
  schedule,
 };
}

export function toRetirementDTO(r:RetirementResult):RetirementDTO{
 return{
  yearsToRetirement:r.yearsToRetirement,
  annualSpending:toDTO(r.annualSpending),
  targetPortfolio:toDTO(r.targetPortfolio),
  projectedPortfolio:toDTO(r.projectedPortfolio),
  inflationAdjustedPortfolio:toDTO(r.inflationAdjustedPortfolio),
  fundingGap:toDTO(r.fundingGap),
  schedule:r.schedule.map(row=>({
   period:row.period,
   age:toDTO(row.age),
   openingBalance:toDTO(row.openingBalance),
   deposit:toDTO(row.deposit),
   interestEarned:toDTO(row.interestEarned),
   closingBalance:toDTO(row.closingBalance),
   inflationAdjustedBalance:toDTO(row.inflationAdjustedBalance),
  })),
 };
}
