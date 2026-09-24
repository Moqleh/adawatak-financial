import Decimal from 'decimal.js';
import {RoiInputSchema,type RoiParsedInput} from './schemas';
import {M,type Money,toDTO} from '@/lib/money';

export interface RoiResult {
 cost:Money;
 finalValue:Money;
 netProfit:Money;
 roiPercent:Decimal;
}

export interface RoiResultDTO {
 cost:string;
 finalValue:string;
 netProfit:string;
 roiPercent:string;
}

export function calcRoi(input:unknown):RoiResult {
 const parsed:RoiParsedInput=RoiInputSchema.parse(input);

 const cost=M(parsed.cost);
 const finalValue=M(parsed.finalValue);
 const netProfit=finalValue.minus(cost);
 const roiPercent=netProfit.div(cost).times(100);

 return {
  cost,
  finalValue,
  netProfit,
  roiPercent,
 };
}

export function toRoiDTO(result:RoiResult):RoiResultDTO {
 return {
  cost:toDTO(result.cost),
  finalValue:toDTO(result.finalValue),
  netProfit:toDTO(result.netProfit),
  roiPercent:toDTO(result.roiPercent),
 };
}
