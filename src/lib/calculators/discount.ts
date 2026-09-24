import {M,toDTO,type Money} from '@/lib/money';
import {DiscountInputSchema,type DiscountInput} from './schemas';

export interface DiscountResult {
 originalPrice:Money;
 discountPercent:Money;
 discountAmount:Money;
 finalPrice:Money;
}

export interface DiscountResultDTO {
 originalPrice:string;
 discountPercent:string;
 discountAmount:string;
 finalPrice:string;
}

export function calcDiscount(input:DiscountInput):DiscountResult {
 const v=DiscountInputSchema.parse(input);
 const originalPrice=M(v.originalPrice);
 const discountPercent=M(v.discountPercent);
 const discountAmount=originalPrice.times(discountPercent.div(100));
 const finalPrice=originalPrice.minus(discountAmount);

 return {
  originalPrice,
  discountPercent,
  discountAmount,
  finalPrice,
 };
}

export function toDiscountDTO(result:DiscountResult):DiscountResultDTO {
 return {
  originalPrice:toDTO(result.originalPrice),
  discountPercent:toDTO(result.discountPercent),
  discountAmount:toDTO(result.discountAmount),
  finalPrice:toDTO(result.finalPrice),
 };
}
