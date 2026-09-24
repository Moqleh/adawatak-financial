import Decimal from 'decimal.js';
import {MarginInputSchema,type MarginParsedInput} from './schemas';
import {M,type Money,toDTO} from '@/lib/money';

export interface MarginResult {
 cost:Money;
 sellingPrice:Money;
 profit:Money;
 marginPercent:Decimal;
}

export interface MarginResultDTO {
 cost:string;
 sellingPrice:string;
 profit:string;
 marginPercent:string;
}

export function calcMargin(input:unknown):MarginResult {
 const parsed:MarginParsedInput=MarginInputSchema.parse(input);

 const cost=M(parsed.cost);
 const sellingPrice=M(parsed.sellingPrice);
 const profit=sellingPrice.minus(cost);
 const marginPercent=profit.div(sellingPrice).times(100);

 return {
  cost,
  sellingPrice,
  profit,
  marginPercent,
 };
}

export function toMarginDTO(result:MarginResult):MarginResultDTO {
 return {
  cost:toDTO(result.cost),
  sellingPrice:toDTO(result.sellingPrice),
  profit:toDTO(result.profit),
  marginPercent:toDTO(result.marginPercent),
 };
}
