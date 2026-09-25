import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { calcMargin, toMarginDTO } from '../src/lib/calculators/margin';
import { MarginInputSchema } from '../src/lib/calculators/schemas';

describe('Margin Calculator Engine - Structural Invariants Suite', () => {

  describe('1. Standard Margin Dynamics & Financial Invariants', () => {
    it('should accurately calculate profit and marginPercent for positive profit', () => {
      const input = MarginInputSchema.parse({
        cost: 60,
        sellingPrice: 100,
      });

      const result = calcMargin(input);

      expect(result.profit.equals(new Decimal(40))).toBe(true);
      expect(result.marginPercent.equals(new Decimal(40))).toBe(true);
      expect(result.cost.equals(new Decimal(60))).toBe(true);
      expect(result.sellingPrice.equals(new Decimal(100))).toBe(true);
    });

    it('should handle decimal values with exact precision', () => {
      const input = MarginInputSchema.parse({
        cost: 15.5,
        sellingPrice: 20,
      });

      const result = calcMargin(input);

      expect(result.profit.equals(new Decimal('4.5'))).toBe(true);
      expect(result.marginPercent.equals(new Decimal('22.5'))).toBe(true);
    });

    it('should correctly serialize results using toMarginDTO', () => {
      const input = MarginInputSchema.parse({
        cost: 80,
        sellingPrice: 100,
      });

      const result = calcMargin(input);
      const dto = toMarginDTO(result);

      expect(dto.cost).toBe('80.00');
      expect(dto.sellingPrice).toBe('100.00');
      expect(dto.profit).toBe('20.00');
      expect(dto.marginPercent).toBe('20.00');
    });
  });

  describe('2. Boundary & Negative Profit Conditions', () => {
    it('should yield 100% margin when cost is zero', () => {
      const input = MarginInputSchema.parse({
        cost: 0,
        sellingPrice: 150,
      });

      const result = calcMargin(input);

      expect(result.profit.equals(new Decimal(150))).toBe(true);
      expect(result.marginPercent.equals(new Decimal(100))).toBe(true);
    });

    it('should yield 0% margin and 0 profit when selling at cost', () => {
      const input = MarginInputSchema.parse({
        cost: 250,
        sellingPrice: 250,
      });

      const result = calcMargin(input);

      expect(result.profit.equals(new Decimal(0))).toBe(true);
      expect(result.marginPercent.equals(new Decimal(0))).toBe(true);
    });

    it('should calculate negative profit and negative margin on loss', () => {
      const input = MarginInputSchema.parse({
        cost: 120,
        sellingPrice: 100,
      });

      const result = calcMargin(input);

      expect(result.profit.equals(new Decimal(-20))).toBe(true);
      expect(result.marginPercent.equals(new Decimal(-20))).toBe(true);
    });
  });

  describe('3. Schema Strictness & Validation Guards', () => {
    it('should reject non-positive selling prices (sellingPrice <= 0)', () => {
      expect(() =>
        MarginInputSchema.parse({
          cost: 50,
          sellingPrice: 0,
        })
      ).toThrow();

      expect(() =>
        MarginInputSchema.parse({
          cost: 50,
          sellingPrice: -10,
        })
      ).toThrow();
    });

    it('should reject negative cost values', () => {
      expect(() =>
        MarginInputSchema.parse({
          cost: -20,
          sellingPrice: 100,
        })
      ).toThrow();
    });

    it('should reject extra unknown parameters due to .strict()', () => {
      expect(() =>
        MarginInputSchema.parse({
          cost: 50,
          sellingPrice: 100,
          unexpectedKey: 'unauthorized',
        })
      ).toThrow();
    });
  });
});
