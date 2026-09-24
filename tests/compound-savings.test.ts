import {describe,it,expect} from 'vitest';
import {calcCompoundSavings} from '../src/lib/calculators/compound-savings';
import {CompoundSavingsInputSchema} from '../src/lib/calculators/schemas';
import {M,ZERO} from '../src/lib/money';

function assertStructuralInvariants(result:ReturnType<typeof calcCompoundSavings>,initialAmount:string){
 expect(result.schedule.length).toBeGreaterThan(0);
 expect(result.schedule[0].openingBalance.equals(M(initialAmount))).toBe(true);

 for(const [index,row] of result.schedule.entries()){
  expect(row.period).toBe(index+1);
  expect(row.closingBalance.equals(row.openingBalance.plus(row.deposit).plus(row.interestEarned))).toBe(true);
  if(index>0){
   expect(row.openingBalance===result.schedule[index-1].closingBalance).toBe(true);
  }
 }

 const last=result.schedule[result.schedule.length-1];
 expect(result.endBalance===last.closingBalance).toBe(true);
 expect(result.totalInterest.equals(result.schedule.reduce((sum,row)=>sum.plus(row.interestEarned),ZERO))).toBe(true);
 expect(result.totalDeposits.equals(M(initialAmount).plus(result.schedule.reduce((sum,row)=>sum.plus(row.deposit),ZERO)))).toBe(true);
}

describe('calcCompoundSavings structural invariants',()=>{
 it('preserves row identities, continuity, and direct schedule totals',()=>{
  const r=calcCompoundSavings({initialAmount:50000,monthlyContribution:1000,annualReturnPercent:7,years:2});
  assertStructuralInvariants(r,'50000');
 });

 it('zero return produces zero interest and deposits-only ending balance',()=>{
  const r=calcCompoundSavings({initialAmount:10000,monthlyContribution:500,annualReturnPercent:0,years:10});
  expect(r.totalInterest.equals(ZERO)).toBe(true);
  expect(r.endBalance.equals(M(10000).plus(M(500).times(120)))).toBe(true);
  assertStructuralInvariants(r,'10000');
 });

 it('supports principal-only compound growth with no monthly contribution',()=>{
  const r=calcCompoundSavings({
   initialAmount:10000,
   monthlyContribution:0,
   annualReturnPercent:12,
   years:1,
   compoundingFrequency:'MONTHLY',
  });
  expect(r.schedule.every(row=>row.deposit.equals(ZERO))).toBe(true);
  expect(r.endBalance.greaterThan(M(10000))).toBe(true);
  assertStructuralInvariants(r,'10000');
 });

 it('BEGINNING earns more than END for the same positive-return inputs',()=>{
  const common={
   initialAmount:10000,
   monthlyContribution:500,
   annualReturnPercent:8,
   years:2,
   compoundingFrequency:'MONTHLY' as const,
  };
  const beginning=calcCompoundSavings({...common,depositTiming:'BEGINNING'});
  const end=calcCompoundSavings({...common,depositTiming:'END'});
  expect(beginning.totalInterest.greaterThan(end.totalInterest)).toBe(true);
  expect(beginning.endBalance.greaterThan(end.endBalance)).toBe(true);
 });

 it('credits quarterly interest only on quarter boundaries',()=>{
  const r=calcCompoundSavings({
   initialAmount:10000,
   monthlyContribution:500,
   annualReturnPercent:8,
   years:1,
   compoundingFrequency:'QUARTERLY',
   depositTiming:'END',
  });
  for(const row of r.schedule){
   if(row.period%3===0) expect(row.interestEarned.equals(ZERO)).toBe(false);
   else expect(row.interestEarned.equals(ZERO)).toBe(true);
  }
  assertStructuralInvariants(r,'10000');
 });

 it('credits semi-annual interest only on six-month boundaries',()=>{
  const r=calcCompoundSavings({
   initialAmount:10000,
   monthlyContribution:500,
   annualReturnPercent:8,
   years:1,
   compoundingFrequency:'SEMI_ANNUALLY',
   depositTiming:'END',
  });
  for(const row of r.schedule){
   if(row.period%6===0) expect(row.interestEarned.equals(ZERO)).toBe(false);
   else expect(row.interestEarned.equals(ZERO)).toBe(true);
  }
 });

 it('credits annual interest only in month 12',()=>{
  const r=calcCompoundSavings({
   initialAmount:10000,
   monthlyContribution:500,
   annualReturnPercent:8,
   years:1,
   compoundingFrequency:'ANNUALLY',
   depositTiming:'END',
  });
  expect(r.schedule.slice(0,11).every(row=>row.interestEarned.equals(ZERO))).toBe(true);
  expect(r.schedule[11].interestEarned.equals(ZERO)).toBe(false);
  assertStructuralInvariants(r,'10000');
 });

 it('MONTHLY credits interest every month for a positive balance and rate',()=>{
  const r=calcCompoundSavings({
   initialAmount:10000,
   monthlyContribution:0,
   annualReturnPercent:8,
   years:1,
   compoundingFrequency:'MONTHLY',
  });
  expect(r.schedule.every(row=>row.interestEarned.greaterThan(ZERO))).toBe(true);
 });

 it('BEGINNING boundary deposit participates in interest while END deposit does not',()=>{
  const common={
   initialAmount:10000,
   monthlyContribution:1000,
   annualReturnPercent:12,
   years:1,
   compoundingFrequency:'QUARTERLY' as const,
  };
  const beginning=calcCompoundSavings({...common,depositTiming:'BEGINNING'});
  const end=calcCompoundSavings({...common,depositTiming:'END'});
  const beginningMonth3=beginning.schedule[2];
  const endMonth3=end.schedule[2];
  expect(beginningMonth3.interestEarned.greaterThan(endMonth3.interestEarned)).toBe(true);
 });

 it('schema is strict and rejects unknown fields',()=>{
  const parsed=CompoundSavingsInputSchema.safeParse({
   initialAmount:10000,
   monthlyContribution:500,
   annualReturnPercent:7,
   years:10,
   unexpectedField:true,
  });
  expect(parsed.success).toBe(false);
 });
});
