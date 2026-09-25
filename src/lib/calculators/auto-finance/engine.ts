import {M,ONE,ZERO,type Money} from '@/lib/money';
import type {AmortizationRow} from '../core/loan';
import {CalculatorError} from '../errors';
import {AutoFinanceInputSchema,type AutoFinanceInput} from './schema';
import type {AutoFinanceResult} from './types';

const MONTHS_PER_YEAR=M(12);
const PERCENT=M(100);

export function calcAutoFinance(input:AutoFinanceInput):AutoFinanceResult{
  const v=AutoFinanceInputSchema.parse(input);
  const vehiclePrice=M(v.vehiclePrice);
  const downPayment=M(v.downPayment);
  const upfrontFees=M(v.upfrontFees);
  const balloonAmount=M(v.balloonAmount);
  const monthlyRate=M(v.profitRatePercent).div(MONTHS_PER_YEAR).div(PERCENT);
  const firstYearInsurance=vehiclePrice.times(M(v.annualInsuranceRatePercent)).div(PERCENT);
  const totalInsurance=firstYearInsurance.times(M(v.termMonths).div(MONTHS_PER_YEAR));

  const baseFinancedAmount=vehiclePrice.minus(downPayment);
  const financedAmount=baseFinancedAmount
    .plus(v.capitalizeFees?upfrontFees:ZERO)
    .plus(v.capitalizeInsurance?firstYearInsurance:ZERO);

  const balloonPresentValue=monthlyRate.isZero()
    ? balloonAmount
    : balloonAmount.div(ONE.plus(monthlyRate).pow(v.termMonths));
  const amortizedPresentValue=financedAmount.minus(balloonPresentValue);

  if(!amortizedPresentValue.greaterThan(0)){
    throw new CalculatorError('INVALID_INPUT',{field:'balloonAmount'});
  }

  const monthlyPayment=monthlyRate.isZero()
    ? amortizedPresentValue.div(v.termMonths)
    : amortizedPresentValue.times(monthlyRate).div(
        ONE.minus(ONE.plus(monthlyRate).pow(-v.termMonths)),
      );

  const schedule=buildBalloonSchedule(
    financedAmount,
    monthlyRate,
    v.termMonths,
    monthlyPayment,
  );
  const totalScheduledPayments=schedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);
  const totalProfit=totalScheduledPayments.minus(financedAmount);

  const uncapitalizedFees=v.capitalizeFees?ZERO:upfrontFees;
  const uncapitalizedInsurance=v.capitalizeInsurance
    ? totalInsurance.minus(firstYearInsurance)
    : totalInsurance;
  const totalOutOfPocket=downPayment
    .plus(totalScheduledPayments)
    .plus(uncapitalizedFees)
    .plus(uncapitalizedInsurance);

  return{
    financedAmount,
    monthlyPayment,
    balloonAmount,
    totalProfit,
    totalInsurance,
    totalFees:upfrontFees,
    totalOutOfPocket,
    schedule,
  };
}

function buildBalloonSchedule(
  principal:Money,
  monthlyRate:Money,
  months:number,
  payment:Money,
):AmortizationRow[]{
  const rows:AmortizationRow[]=[];
  let balance=principal;

  for(let month=1;month<months;month++){
    const openingBalance=balance;
    const interest=openingBalance.times(monthlyRate);
    const principalPart=payment.minus(interest);
    if(principalPart.isNegative()){
      throw new CalculatorError('NEGATIVE_AMORTIZATION',{
        period:month,
        payment:payment.toString(),
        interest:interest.toString(),
      });
    }
    const closingBalance=openingBalance.minus(principalPart);
    rows.push({month,openingBalance,payment,principal:principalPart,interest,closingBalance});
    balance=closingBalance;
  }

  const openingBalance=balance;
  const interest=openingBalance.times(monthlyRate);
  const principalPart=openingBalance;
  const finalPayment=principalPart.plus(interest);
  rows.push({
    month:months,
    openingBalance,
    payment:finalPayment,
    principal:principalPart,
    interest,
    closingBalance:ZERO,
  });

  return rows;
}
