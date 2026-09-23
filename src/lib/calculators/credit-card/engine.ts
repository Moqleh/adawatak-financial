import {M,ONE,ZERO,type Money} from '@/lib/money';
import {CalculatorError} from '../errors';
import {CreditCardPayoffInputSchema,type CreditCardPayoffInput} from './schema';
import type {CreditCardPayoffResult,CreditCardRow} from './types';

const MONTHS_PER_YEAR=M(12);
const PERCENT=M(100);
const MAX_PAYOFF_MONTHS=1200;

export function calcCreditCardPayoff(input:CreditCardPayoffInput):CreditCardPayoffResult{
  const v=CreditCardPayoffInputSchema.parse(input);
  const balance=M(v.balance);
  const monthlyRate=M(v.aprPercent).div(MONTHS_PER_YEAR).div(PERCENT);

  let monthlyPayment:Money;
  let payoffSchedule:CreditCardRow[];

  if(v.mode==='FIXED_PAYMENT'){
    monthlyPayment=M(v.monthlyPayment);
    const firstMonthInterest=balance.times(monthlyRate);
    if(monthlyPayment.lessThanOrEqualTo(firstMonthInterest)){
      throw new CalculatorError('PAYMENT_BELOW_INTEREST',{
        monthlyPayment:monthlyPayment.toString(),
        firstMonthInterest:firstMonthInterest.toString(),
      });
    }
    payoffSchedule=buildFixedPaymentSchedule(balance,monthlyRate,monthlyPayment);
  }else{
    monthlyPayment=monthlyRate.isZero()
      ? balance.div(v.targetMonths)
      : balance.times(monthlyRate).div(
          ONE.minus(ONE.plus(monthlyRate).pow(-v.targetMonths)),
        );
    payoffSchedule=buildTargetSchedule(
      balance,
      monthlyRate,
      v.targetMonths,
      monthlyPayment,
    );
  }

  const totalInterest=payoffSchedule.reduce((sum,row)=>sum.plus(row.interest),ZERO);
  const totalPaid=payoffSchedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);

  return{
    monthsToPayoff:payoffSchedule.length,
    monthlyPayment,
    totalInterest,
    totalPaid,
    payoffSchedule,
  };
}

function buildFixedPaymentSchedule(
  principal:Money,
  monthlyRate:Money,
  monthlyPayment:Money,
):CreditCardRow[]{
  const rows:CreditCardRow[]=[];
  let balance=principal;

  for(let month=1;month<=MAX_PAYOFF_MONTHS;month++){
    const openingBalance=balance;
    const interest=openingBalance.times(monthlyRate);
    const amountDue=openingBalance.plus(interest);
    const payment=monthlyPayment.greaterThanOrEqualTo(amountDue)?amountDue:monthlyPayment;
    const principalPart=payment.minus(interest);

    if(principalPart.lessThanOrEqualTo(ZERO)){
      throw new CalculatorError('PAYMENT_BELOW_INTEREST',{
        period:month,
        payment:payment.toString(),
        interest:interest.toString(),
      });
    }

    const closingBalance=amountDue.minus(payment);
    rows.push({
      month,
      openingBalance,
      payment,
      interest,
      principal:principalPart,
      closingBalance,
    });

    if(closingBalance.isZero())return rows;
    balance=closingBalance;
  }

  throw new CalculatorError('DURATION_IMPOSSIBLE',{maxMonths:MAX_PAYOFF_MONTHS});
}

function buildTargetSchedule(
  principal:Money,
  monthlyRate:Money,
  months:number,
  monthlyPayment:Money,
):CreditCardRow[]{
  const rows:CreditCardRow[]=[];
  let balance=principal;

  for(let month=1;month<months;month++){
    const openingBalance=balance;
    const interest=openingBalance.times(monthlyRate);
    const principalPart=monthlyPayment.minus(interest);
    if(principalPart.lessThanOrEqualTo(ZERO)){
      throw new CalculatorError('PAYMENT_BELOW_INTEREST',{
        period:month,
        payment:monthlyPayment.toString(),
        interest:interest.toString(),
      });
    }
    const closingBalance=openingBalance.minus(principalPart);
    rows.push({
      month,
      openingBalance,
      payment:monthlyPayment,
      interest,
      principal:principalPart,
      closingBalance,
    });
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
    interest,
    principal:principalPart,
    closingBalance:ZERO,
  });

  return rows;
}
