import {describe,it,expect} from 'vitest';
import Decimal from 'decimal.js';
import {calcPercentage} from '../src/lib/calculators/percentage';
import {PercentageInputSchema} from '../src/lib/calculators/schemas';

describe('Percentage Calculator Engine - Structural Invariants Suite',()=>{
 describe('1. Mode: PERCENT_OF Dynamics',()=>{
  it('should correctly calculate percentage of a given value using Decimal precision',()=>{
   const input=PercentageInputSchema.parse({
    mode:'PERCENT_OF',
    percentage:15,
    value:200,
   });
   const result=calcPercentage(input);
   expect(result.result.equals(new Decimal(30))).toBe(true);
  });

  it('should handle negative values and fractional percentages correctly',()=>{
   const input=PercentageInputSchema.parse({
    mode:'PERCENT_OF',
    percentage:2.5,
    value:-500,
   });
   const result=calcPercentage(input);
   expect(result.result.equals(new Decimal('-12.5'))).toBe(true);
  });
 });

 describe('2. Mode: WHAT_PERCENT Dynamics',()=>{
  it('should calculate the exact percentage part represents of total',()=>{
   const input=PercentageInputSchema.parse({
    mode:'WHAT_PERCENT',
    part:25,
    total:100,
   });
   const result=calcPercentage(input);
   expect(result.result.equals(new Decimal(25))).toBe(true);
  });

  it('should reject zero total at schema level',()=>{
   expect(()=>PercentageInputSchema.parse({
    mode:'WHAT_PERCENT',
    part:50,
    total:0,
   })).toThrow();
  });
 });

 describe('3. Mode: PERCENT_CHANGE Dynamics',()=>{
  it('should calculate positive percentage increase and set flags correctly',()=>{
   const input=PercentageInputSchema.parse({
    mode:'PERCENT_CHANGE',
    fromValue:100,
    toValue:150,
   });
   const result=calcPercentage(input);
   expect(result.difference?.equals(new Decimal(50))).toBe(true);
   expect(result.result.equals(new Decimal(50))).toBe(true);
   expect(result.isIncrease).toBe(true);
  });

  it('should calculate negative percentage decrease',()=>{
   const input=PercentageInputSchema.parse({
    mode:'PERCENT_CHANGE',
    fromValue:200,
    toValue:150,
   });
   const result=calcPercentage(input);
   expect(result.difference?.equals(new Decimal(-50))).toBe(true);
   expect(result.result.equals(new Decimal(-25))).toBe(true);
   expect(result.isIncrease).toBe(false);
  });

  it('should reject zero fromValue at schema level',()=>{
   expect(()=>PercentageInputSchema.parse({
    mode:'PERCENT_CHANGE',
    fromValue:0,
    toValue:100,
   })).toThrow();
  });
 });

 describe('4. Schema Strictness & Discriminated Union Guarding',()=>{
  it('should reject unknown extra parameters due to .strict()',()=>{
   expect(()=>PercentageInputSchema.parse({
    mode:'PERCENT_OF',
    percentage:10,
    value:100,
    unknownParam:'forbidden',
   })).toThrow();
  });
 });
});
