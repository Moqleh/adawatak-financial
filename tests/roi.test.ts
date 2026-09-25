import {describe,it,expect} from 'vitest';
import Decimal from 'decimal.js';
import {calcRoi,toRoiDTO} from '../src/lib/calculators/roi';
import {RoiInputSchema} from '../src/lib/calculators/schemas';

describe('ROI Calculator Engine - Structural Invariants Suite',()=>{
 describe('1. Standard ROI Dynamics & Financial Invariants',()=>{
  it('should accurately calculate netProfit and roiPercent for positive return',()=>{
   const input=RoiInputSchema.parse({cost:1000,finalValue:1500});
   const result=calcRoi(input);
   expect(result.netProfit.equals(new Decimal(500))).toBe(true);
   expect(result.roiPercent.equals(new Decimal(50))).toBe(true);
   expect(result.cost.equals(new Decimal(1000))).toBe(true);
   expect(result.finalValue.equals(new Decimal(1500))).toBe(true);
  });

  it('should handle decimal values with exact precision',()=>{
   const input=RoiInputSchema.parse({cost:12.5,finalValue:18.75});
   const result=calcRoi(input);
   expect(result.netProfit.equals(new Decimal('6.25'))).toBe(true);
   expect(result.roiPercent.equals(new Decimal(50))).toBe(true);
  });

  it('should correctly serialize results using toRoiDTO',()=>{
   const input=RoiInputSchema.parse({cost:200,finalValue:300});
   const dto=toRoiDTO(calcRoi(input));
   expect(dto.cost).toBe('200.00');
   expect(dto.finalValue).toBe('300.00');
   expect(dto.netProfit).toBe('100.00');
   expect(dto.roiPercent).toBe('50.00');
  });
 });

 describe('2. Boundary & Loss Conditions',()=>{
  it('should yield 0% ROI and 0 net profit when breaking even (finalValue = cost)',()=>{
   const result=calcRoi(RoiInputSchema.parse({cost:500,finalValue:500}));
   expect(result.netProfit.equals(new Decimal(0))).toBe(true);
   expect(result.roiPercent.equals(new Decimal(0))).toBe(true);
  });

  it('should calculate -100% ROI on complete capital loss (finalValue = 0)',()=>{
   const result=calcRoi(RoiInputSchema.parse({cost:1000,finalValue:0}));
   expect(result.netProfit.equals(new Decimal(-1000))).toBe(true);
   expect(result.roiPercent.equals(new Decimal(-100))).toBe(true);
  });

  it('should calculate negative ROI accurately on partial loss',()=>{
   const result=calcRoi(RoiInputSchema.parse({cost:1000,finalValue:600}));
   expect(result.netProfit.equals(new Decimal(-400))).toBe(true);
   expect(result.roiPercent.equals(new Decimal(-40))).toBe(true);
  });
 });

 describe('3. Schema Strictness & Validation Guards',()=>{
  it('should reject non-positive cost values (cost <= 0)',()=>{
   expect(()=>RoiInputSchema.parse({cost:0,finalValue:100})).toThrow();
   expect(()=>RoiInputSchema.parse({cost:-100,finalValue:100})).toThrow();
  });

  it('should reject negative finalValue',()=>{
   expect(()=>RoiInputSchema.parse({cost:100,finalValue:-50})).toThrow();
  });

  it('should reject extra unknown parameters due to .strict()',()=>{
   expect(()=>RoiInputSchema.parse({cost:100,finalValue:150,invalidProperty:'unauthorized'})).toThrow();
  });
 });
});
