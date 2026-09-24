import {describe,it,expect} from 'vitest';
import {calcInflation} from '../src/lib/calculators/inflation';
import {InflationInputSchema} from '../src/lib/calculators/schemas';
import {M,ZERO} from '../src/lib/money';

describe('calcInflation structural invariants',()=>{
 it('calculates future cost, purchasing power, and inflation impact with Decimal identities',()=>{
  const amount=M(1000);
  const rate=M(5).div(100);
  const years=10;
  const factor=M(1).plus(rate).pow(years);
  const r=calcInflation({amount:1000,inflationRatePercent:5,years});

  expect(r.futureCost.equals(amount.times(factor))).toBe(true);
  expect(r.purchasingPower.equals(amount.div(factor))).toBe(true);
  expect(r.inflationImpact.equals(r.futureCost.minus(amount))).toBe(true);
 });

 it('preserves yearly schedule structure and final-result references',()=>{
  const years=12;
  const r=calcInflation({amount:2500,inflationRatePercent:3,years});

  expect(r.schedule.length).toBe(years);
  for(const [index,row] of r.schedule.entries()){
   expect(row.year).toBe(index+1);
   expect(row.inflationImpact.equals(row.futureCost.minus(M(2500)))).toBe(true);
  }

  const last=r.schedule[r.schedule.length-1];
  expect(last.year).toBe(years);
  expect(r.futureCost===last.futureCost).toBe(true);
  expect(r.purchasingPower===last.purchasingPower).toBe(true);
  expect(r.inflationImpact===last.inflationImpact).toBe(true);
 });

 it('matches the exact annual formula in every schedule row',()=>{
  const amount=M(750);
  const annualFactor=M(1).plus(M(4.25).div(100));
  const r=calcInflation({amount:750,inflationRatePercent:4.25,years:8});

  for(const row of r.schedule){
   const factor=annualFactor.pow(row.year);
   expect(row.futureCost.equals(amount.times(factor))).toBe(true);
   expect(row.purchasingPower.equals(amount.div(factor))).toBe(true);
  }
 });

 it('zero inflation keeps nominal cost and purchasing power unchanged',()=>{
  const amount=M(12345.67);
  const r=calcInflation({amount:12345.67,inflationRatePercent:0,years:20});

  expect(r.futureCost.equals(amount)).toBe(true);
  expect(r.purchasingPower.equals(amount)).toBe(true);
  expect(r.inflationImpact.equals(ZERO)).toBe(true);
  expect(r.schedule.every(row=>
   row.futureCost.equals(amount)&&
   row.purchasingPower.equals(amount)&&
   row.inflationImpact.equals(ZERO)
  )).toBe(true);
 });

 it('accepts a zero amount without manufacturing value',()=>{
  const r=calcInflation({amount:0,inflationRatePercent:8,years:10});

  expect(r.futureCost.equals(ZERO)).toBe(true);
  expect(r.purchasingPower.equals(ZERO)).toBe(true);
  expect(r.inflationImpact.equals(ZERO)).toBe(true);
 });

 it('schema rejects unknown fields',()=>{
  const parsed=InflationInputSchema.safeParse({
   amount:1000,
   inflationRatePercent:5,
   years:10,
   unexpectedField:true,
  });
  expect(parsed.success).toBe(false);
 });

 it('schema rejects negative amount and inflation rate',()=>{
  for(const input of [
   {amount:-1,inflationRatePercent:5,years:10},
   {amount:1000,inflationRatePercent:-1,years:10},
  ]){
   expect(InflationInputSchema.safeParse(input).success).toBe(false);
  }
 });

 it('schema rejects non-integer, zero, negative, and over-limit years',()=>{
  for(const years of [1.5,0,-1,101]){
   expect(InflationInputSchema.safeParse({
    amount:1000,
    inflationRatePercent:5,
    years,
   }).success).toBe(false);
  }
 });
});
