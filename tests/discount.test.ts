import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { calcDiscount, toDiscountDTO } from '../src/lib/calculators/discount';
import { DiscountInputSchema } from '../src/lib/calculators/schemas';

describe('Discount Calculator Engine - Structural Invariants Suite', () => {

  describe('1. Standard Discount Dynamics & Financial Invariants', () => {
    it('should accurately calculate discountAmount and finalPrice', () => {
      const input = DiscountInputSchema.parse({
        originalPrice: 200,
        discountPercent: 15,
      });

      const result = calcDiscount(input);

      expect(result.discountAmount.equals(new Decimal(30))).toBe(true);
      expect(result.finalPrice.equals(new Decimal(170))).toBe(true);
      expect(result.originalPrice.equals(new Decimal(200))).toBe(true);
      expect(result.discountPercent.equals(new Decimal(15))).toBe(true);
    });

    it('should correctly handle fractional prices and non-integer percentages', () => {
      const input = DiscountInputSchema.parse({
        originalPrice: 99.99,
        discountPercent: 12.5,
      });

      const result = calcDiscount(input);
      const expectedDiscount = new Decimal('99.99').times(new Decimal('12.5').div(100));
      const expectedFinal = new Decimal('99.99').minus(expectedDiscount);

      expect(result.discountAmount.equals(expectedDiscount)).toBe(true);
      expect(result.finalPrice.equals(expectedFinal)).toBe(true);
    });

    it('should serialize results correctly using toDiscountDTO', () => {
      const input = DiscountInputSchema.parse({
        originalPrice: 100,
        discountPercent: 20,
      });

      const result = calcDiscount(input);
      const dto = toDiscountDTO(result);

      expect(dto.originalPrice).toBe('100.00');
      expect(dto.discountPercent).toBe('20');
      expect(dto.discountAmount).toBe('20');
      expect(dto.finalPrice).toBe('80.00');
    });
  });

  describe('2. Boundary Conditions', () => {
    it('should handle 0% discount without changing final price', () => {
      const input = DiscountInputSchema.parse({
        originalPrice: 500,
        discountPercent: 0,
      });

      const result = calcDiscount(input);

      expect(result.discountAmount.equals(new Decimal(0))).toBe(true);
      expect(result.finalPrice.equals(new Decimal(500))).toBe(true);
    });

    it('should handle 100% discount resulting in 0 final price', () => {
      const input = DiscountInputSchema.parse({
        originalPrice: 350,
        discountPercent: 100,
      });

      const result = calcDiscount(input);

      expect(result.discountAmount.equals(new Decimal(350))).toBe(true);
      expect(result.finalPrice.equals(new Decimal(0))).toBe(true);
    });

    it('should handle zero original price correctly', () => {
      const input = DiscountInputSchema.parse({
        originalPrice: 0,
        discountPercent: 50,
      });

      const result = calcDiscount(input);

      expect(result.discountAmount.equals(new Decimal(0))).toBe(true);
      expect(result.finalPrice.equals(new Decimal(0))).toBe(true);
    });
  });

  describe('3. Schema Strictness & Validation Guards', () => {
    it('should reject unknown extra parameters due to .strict()', () => {
      expect(() =>
        DiscountInputSchema.parse({
          originalPrice: 100,
          discountPercent: 10,
          extraField: 'unauthorized',
        })
      ).toThrow();
    });

    it('should reject negative original prices', () => {
      expect(() =>
        DiscountInputSchema.parse({
          originalPrice: -50,
          discountPercent: 10,
        })
      ).toThrow();
    });

    it('should reject discount percentages greater than 100% or negative', () => {
      expect(() =>
        DiscountInputSchema.parse({
          originalPrice: 100,
          discountPercent: 105,
        })
      ).toThrow();

      expect(() =>
        DiscountInputSchema.parse({
          originalPrice: 100,
          discountPercent: -5,
        })
      ).toThrow();
    });
  });
});
