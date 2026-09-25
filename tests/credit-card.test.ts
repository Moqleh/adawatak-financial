import {describe,it,expect} from 'vitest';
import {calcCreditCardPayoff} from '../src/lib/calculators/credit-card/engine';
import {CreditCardPayoffInputSchema} from '../src/lib/calculators/credit-card/schema';
import {M,ONE,ZERO} from '../src/lib/money';

const balance=12000;
const aprPercent=24;
const monthlyRate=M(aprPercent).div(12).div(100);

function expectScheduleInvariants(result:ReturnType<typeof calcCreditCardPayoff>){
  expect(result.payoffSchedule.at(-1)?.closingBalance.equals(ZERO)).toBe(true);
  expect(result.payoffSchedule[0].openingBalance.equals(M(balance))).toBe(true);
  for(let i=1;i<result.payoffSchedule.length;i++){
    expect(result.payoffSchedule[i].openingBalance.equals(result.payoffSchedule[i-1].closingBalance)).toBe(true);
  }
  for(const row of result.payoffSchedule){
    expect(row.payment.equals(row.principal.plus(row.interest))).toBe(true);
    expect(row.closingBalance.equals(row.openingBalance.minus(row.principal))).toBe(true);
  }
  const scheduleTotalPaid=result.payoffSchedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);
  const scheduleTotalInterest=result.payoffSchedule.reduce((sum,row)=>sum.plus(row.interest),ZERO);
  expect(result.totalPaid.equals(scheduleTotalPaid)).toBe(true);
  expect(result.totalInterest.equals(scheduleTotalInterest)).toBe(true);
}

describe('calcCreditCardPayoff — PAYMENT_BELOW_INTEREST',()=>{
  it('rejects a fixed payment equal to first-month interest',()=>{
    const firstInterest=M(balance).times(monthlyRate);
    expect(()=>calcCreditCardPayoff({
      mode:'FIXED_PAYMENT',
      balance,
      aprPercent,
      monthlyPayment:Number(firstInterest.toString()),
    })).toThrowError(expect.objectContaining({code:'PAYMENT_BELOW_INTEREST'}));
  });

  it('rejects a fixed payment below first-month interest',()=>{
    expect(()=>calcCreditCardPayoff({
      mode:'FIXED_PAYMENT',
      balance,
      aprPercent,
      monthlyPayment:239,
    })).toThrowError(expect.objectContaining({code:'PAYMENT_BELOW_INTEREST'}));
  });

  it('accepts a payment just above first-month interest and closes within the safety cap',()=>{
    const result=calcCreditCardPayoff({
      mode:'FIXED_PAYMENT',
      balance,
      aprPercent,
      monthlyPayment:241,
    });
    expect(result.monthsToPayoff).toBeLessThanOrEqual(1200);
    expectScheduleInvariants(result);
  });
});

describe('calcCreditCardPayoff — FIXED_PAYMENT',()=>{
  it('maintains exact schedule and aggregate invariants',()=>{
    const result=calcCreditCardPayoff({
      mode:'FIXED_PAYMENT',
      balance,
      aprPercent,
      monthlyPayment:500,
    });
    expectScheduleInvariants(result);
  });

  it('handles zero APR with exact payoff totals and expected month count',()=>{
    const result=calcCreditCardPayoff({
      mode:'FIXED_PAYMENT',
      balance:1000,
      aprPercent:0,
      monthlyPayment:300,
    });
    expect(result.totalInterest.equals(ZERO)).toBe(true);
    expect(result.totalPaid.equals(M(1000))).toBe(true);
    expect(result.monthsToPayoff).toBe(4);
    expect(result.payoffSchedule.at(-1)?.closingBalance.equals(ZERO)).toBe(true);
  });
});

describe('calcCreditCardPayoff — TARGET_TIMEFRAME',()=>{
  it('matches the annuity formula, uses exactly targetMonths, and closes at zero',()=>{
    const targetMonths=36;
    const result=calcCreditCardPayoff({
      mode:'TARGET_TIMEFRAME',
      balance,
      aprPercent,
      targetMonths,
    });
    const expected=M(balance).times(monthlyRate).div(
      ONE.minus(ONE.plus(monthlyRate).pow(-targetMonths)),
    );
    expect(result.monthlyPayment.equals(expected)).toBe(true);
    expect(result.monthsToPayoff).toBe(targetMonths);
    expect(result.payoffSchedule).toHaveLength(targetMonths);
    expectScheduleInvariants(result);
  });

  it('handles zero APR exactly',()=>{
    const result=calcCreditCardPayoff({
      mode:'TARGET_TIMEFRAME',
      balance:1200,
      aprPercent:0,
      targetMonths:12,
    });
    expect(result.monthlyPayment.equals(M(100))).toBe(true);
    expect(result.totalInterest.equals(ZERO)).toBe(true);
    expect(result.totalPaid.equals(M(1200))).toBe(true);
    expect(result.payoffSchedule).toHaveLength(12);
    expect(result.payoffSchedule.at(-1)?.closingBalance.equals(ZERO)).toBe(true);
  });
});

describe('CreditCardPayoffInputSchema — discriminated union bounds',()=>{
  it('rejects monthlyPayment in TARGET_TIMEFRAME mode',()=>{
    const result=CreditCardPayoffInputSchema.safeParse({
      mode:'TARGET_TIMEFRAME',
      balance,
      aprPercent,
      targetMonths:24,
      monthlyPayment:500,
    });
    expect(result.success).toBe(false);
  });

  it('rejects targetMonths in FIXED_PAYMENT mode',()=>{
    const result=CreditCardPayoffInputSchema.safeParse({
      mode:'FIXED_PAYMENT',
      balance,
      aprPercent,
      monthlyPayment:500,
      targetMonths:24,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-positive balance and negative APR',()=>{
    expect(CreditCardPayoffInputSchema.safeParse({
      mode:'FIXED_PAYMENT',
      balance:0,
      aprPercent,
      monthlyPayment:500,
    }).success).toBe(false);
    expect(CreditCardPayoffInputSchema.safeParse({
      mode:'TARGET_TIMEFRAME',
      balance,
      aprPercent:-1,
      targetMonths:24,
    }).success).toBe(false);
  });
});
