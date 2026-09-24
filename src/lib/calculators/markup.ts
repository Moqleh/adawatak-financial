import Decimal from 'decimal.js';
import {MarkupInputSchema,type MarkupParsedInput} from './schemas';
import {M,type Money,toDTO} from '@/lib/money';

export interface MarkupResult {
 cost:Money;
 sellingPrice:Money;
 profit:Money;
 markupPercent:Decimal;
}

export interface MarkupResultDTO {
 cost:string;
 sellingPrice:string;
 profit:string;
 markupPercent:string;
}

export function calcMarkup(input:unknown):MarkupResult {
 const parsed:MarkupParsedInput=MarkupInputSchema.parse(input);

 const cost=M(parsed.cost);
 const sellingPrice=M(parsed.sellingPrice);
 const profit=sellingPrice.minus(cost);
 const markupPercent=profit.div(cost).times(100);

 return {
  cost,
  sellingPrice,
  profit,
  markupPercent,
 };
}

export function toMarkupDTO(result:MarkupResult):MarkupResultDTO {
 return {
  cost:toDTO(result.cost),
  sellingPrice:toDTO(result.sellingPrice),
  profit:toDTO(result.profit),
  markupPercent:toDTO(result.markupPercent),
 };
}
