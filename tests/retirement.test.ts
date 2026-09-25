import {describe,it,expect} from 'vitest';
import {calcRetirement} from '../src/lib/calculators/retirement';
import {RetirementInputSchema} from '../src/lib/calculators/schemas';
import {M,ZERO} from '../src/lib/money';

function assertStructuralInvariants(
 result:ReturnType<typeof calcRetirement>,
 currentSavings:string,
 currentAge:number,
 retirementAge:number,
){
 expect(result.schedule.length).toBe((retirementAge-currentAge)*12);
 expect(result.schedule[0].openingBalance.equals(M(currentSavings))).toBe(true);

 for(const [index,row] of result.schedule.entries()){
  expect(row.period).toBe(index+1);
  expect(row.closingBalance.equals(row.openingBalance.plus(row.interestEarned).plus(row.deposit))).toBe(true);
  if(index>0){
   expect(row.openingBalance===result.schedule[index-1].closingBalance).toBe(true);
  }
 }

 const last=result.schedule[result.schedule.length-1];
 expect(result.projectedPortfolio===last.closingBalance).toBe(true);
 expect(result.inflationAdjustedPortfolio===last.inflationAdjustedBalance).toBe(true);
 expect(result.schedule[0].age.equals(M(currentAge).plus(M(1).div(12)))).toBe(true);
 expect(last.age.equals(M(retirementAge))).toBe(true);
}

describe('calcRetirement structural invariants',()=>{
 it('preserves row identities, continuity, final balances, and age progression',()=>{
  const r=calcRetirement({
   currentSavings:50000,
   monthlyContribution:1000,
   expectedAnnualReturnPercent:7,
   inflationRatePercent:2.5,
   currentAge:30,
   retirementAge:40,
   targetMonthlySpending:4000,
  });
  assertStructuralInvariants(r,'50000',30,40);
 });

 it('zero inflation makes nominal and inflation-adjusted portfolios identical',()=>{
  const r=calcRetirement({
   currentSavings:50000,
   monthlyContribution:1000,
   expectedAnnualReturnPercent:7,
   inflationRatePercent:0,
   currentAge:30,
   retirementAge:40,
   targetMonthlySpending:4000,
  });
  expect(r.inflationAdjustedPortfolio.equals(r.projectedPortfolio)).toBe(true);
 });

 it('positive inflation reduces present purchasing power',()=>{
  const r=calcRetirement({
   currentSavings:50000,
   monthlyContribution:1000,
   expectedAnnualReturnPercent:7,
   inflationRatePercent:3,
   currentAge:30,
   retirementAge:40,
   targetMonthlySpending:4000,
  });
  expect(r.inflationAdjustedPortfolio.lessThan(r.projectedPortfolio)).toBe(true);
 });

 it('calculates target portfolio from annual spending and withdrawal rate',()=>{
  const r=calcRetirement({
   currentSavings:0,
   monthlyContribution:0,
   expectedAnnualReturnPercent:0,
   inflationRatePercent:0,
   currentAge:30,
   retirementAge:31,
   targetMonthlySpending:4000,
   withdrawalRatePercent:4,
  });
  expect(r.annualSpending.equals(M(48000))).toBe(true);
  expect(r.targetPortfolio.equals(M(1200000))).toBe(true);
 });

 it('reports a positive funding gap when the real portfolio is below target',()=>{
  const r=calcRetirement({
   currentSavings:10000,
   monthlyContribution:0,
   expectedAnnualReturnPercent:0,
   inflationRatePercent:0,
   currentAge:30,
   retirementAge:31,
   targetMonthlySpending:4000,
  });
  expect(r.fundingGap.equals(r.targetPortfolio.minus(r.inflationAdjustedPortfolio))).toBe(true);
  expect(r.fundingGap.greaterThan(ZERO)).toBe(true);
 });

 it('reports a negative funding gap when the real portfolio exceeds target',()=>{
  const r=calcRetirement({
   currentSavings:2000000,
   monthlyContribution:0,
   expectedAnnualReturnPercent:0,
   inflationRatePercent:0,
   currentAge:30,
   retirementAge:31,
   targetMonthlySpending:4000,
  });
  expect(r.fundingGap.equals(r.targetPortfolio.minus(r.inflationAdjustedPortfolio))).toBe(true);
  expect(r.fundingGap.lessThan(ZERO)).toBe(true);
 });

 it('zero return grows only by monthly contributions',()=>{
  const r=calcRetirement({
   currentSavings:10000,
   monthlyContribution:500,
   expectedAnnualReturnPercent:0,
   inflationRatePercent:0,
   currentAge:30,
   retirementAge:40,
   targetMonthlySpending:0,
  });
  expect(r.schedule.every(row=>row.interestEarned.equals(ZERO))).toBe(true);
  expect(r.projectedPortfolio.equals(M(10000).plus(M(500).times(120)))).toBe(true);
  assertStructuralInvariants(r,'10000',30,40);
 });

 it('zero contribution grows only the initial portfolio',()=>{
  const r=calcRetirement({
   currentSavings:10000,
   monthlyContribution:0,
   expectedAnnualReturnPercent:12,
   inflationRatePercent:0,
   currentAge:30,
   retirementAge:31,
   targetMonthlySpending:0,
  });
  expect(r.schedule.every(row=>row.deposit.equals(ZERO))).toBe(true);
  expect(r.projectedPortfolio.greaterThan(M(10000))).toBe(true);
  assertStructuralInvariants(r,'10000',30,31);
 });

 it('schema rejects unknown fields',()=>{
  const parsed=RetirementInputSchema.safeParse({
   currentSavings:10000,
   monthlyContribution:500,
   expectedAnnualReturnPercent:7,
   currentAge:30,
   retirementAge:40,
   targetMonthlySpending:4000,
   unexpectedField:true,
  });
  expect(parsed.success).toBe(false);
 });

 it('schema rejects retirementAge less than or equal to currentAge',()=>{
  for(const retirementAge of [30,29]){
   const parsed=RetirementInputSchema.safeParse({
    currentSavings:10000,
    monthlyContribution:500,
    expectedAnnualReturnPercent:7,
    currentAge:30,
    retirementAge,
    targetMonthlySpending:4000,
   });
   expect(parsed.success).toBe(false);
  }
 });
});
