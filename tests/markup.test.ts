import {describe,it,expect} from 'vitest';
import Decimal from 'decimal.js';
import {calcMarkup,toMarkupDTO} from '../src/lib/calculators/markup';
import {MarkupInputSchema} from '../src/lib/calculators/schemas';

describe('Markup Calculator Engine - Structural Invariants Suite',()=>{
 describe('1. Standard Markup Dynamics & Financial Invariants',()=>{
  it('should accurately calculate profit and markupPercent for positive markup',()=>{
   const input=MarkupInputSchema.parse({cost:80,sellingPrice:100});
   const result=calcMarkup(input);
   expect(result.profit.equals(new Decimal(20))).toBe(true);
   expect(result.markupPercent.equals(new Decimal(25))).toBe(true);
   expect(result.cost.equals(new Decimal(80))).toBe(true);
   expect(result.sellingPrice.equals(new Decimal(100))).toBe(true);
  });

  it('should handle decimal values with exact precision',()=>{
   const input=MarkupInputSchema.parse({cost:12.5,sellingPrice:15});
   const result=calcMarkup(input);
   expect(result.profit.equals(new Decimal('2.5'))).toBe(true);
   expect(result.markupPercent.equals(new Decimal(20))).toBe(true);
  });

  it('should correctly serialize results using toMarkupDTO',()=>{
   const input=MarkupInputSchema.parse({cost:50,sellingPrice:75});
   const dto=toMarkupDTO(calcMarkup(input));
   expect(dto.cost).toBe('50.00');
   expect(dto.sellingPrice).toBe('75.00');
   expect(dto.profit).toBe('25.00');
   expect(dto.markupPercent).toBe('50.00');
  });
 });

 describe('2. Boundary & Loss Conditions',()=>{
  it('should yield 0% markup and 0 profit when selling at cost',()=>{
   const result=calcMarkup(MarkupInputSchema.parse({cost:100,sellingPrice:100}));
   expect(result.profit.equals(new Decimal(0))).toBe(true);
   expect(result.markupPercent.equals(new Decimal(0))).toBe(true);
  });

  it('should calculate -100% markup on complete loss (sellingPrice = 0)',()=>{
   const result=calcMarkup(MarkupInputSchema.parse({cost:200,sellingPrice:0}));
   expect(result.profit.equals(new Decimal(-200))).toBe(true);
   expect(result.markupPercent.equals(new Decimal(-100))).toBe(true);
  });

  it('should calculate negative markup accurately on partial loss',()=>{
   const result=calcMarkup(MarkupInputSchema.parse({cost:100,sellingPrice:60}));
   expect(result.profit.equals(new Decimal(-40))).toBe(true);
   expect(result.markupPercent.equals(new Decimal(-40))).toBe(true);
  });
 });

 describe('3. Schema Strictness & Validation Guards',()=>{
  it('should reject non-positive cost values (cost <= 0)',()=>{
   expect(()=>MarkupInputSchema.parse({cost:0,sellingPrice:100})).toThrow();
   expect(()=>MarkupInputSchema.parse({cost:-50,sellingPrice:100})).toThrow();
  });

  it('should reject negative selling prices',()=>{
   expect(()=>MarkupInputSchema.parse({cost:50,sellingPrice:-10})).toThrow();
  });

  it('should reject extra unknown parameters due to .strict()',()=>{
   expect(()=>MarkupInputSchema.parse({cost:50,sellingPrice:100,invalidProperty:'unauthorized'})).toThrow();
  });
 });
});
