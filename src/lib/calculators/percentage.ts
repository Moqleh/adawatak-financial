import {M,toDTO,type Money} from '@/lib/money';
import {PercentageInputSchema,type PercentageInput} from './schemas';

export type PercentageMode='PERCENT_OF'|'WHAT_PERCENT'|'PERCENT_CHANGE';

export interface PercentageResult {
 mode:PercentageMode;
 result:Money;
 difference?:Money;
 isIncrease?:boolean;
}

export interface PercentageResultDTO {
 mode:PercentageMode;
 result:string;
 difference?:string;
 isIncrease?:boolean;
}

export function calcPercentage(input:PercentageInput):PercentageResult {
 const v=PercentageInputSchema.parse(input);

 switch(v.mode){
  case 'PERCENT_OF':{
   return {
    mode:v.mode,
    result:M(v.value).times(M(v.percentage).div(100)),
   };
  }
  case 'WHAT_PERCENT':{
   return {
    mode:v.mode,
    result:M(v.part).div(M(v.total)).times(100),
   };
  }
  case 'PERCENT_CHANGE':{
   const difference=M(v.toValue).minus(M(v.fromValue));
   return {
    mode:v.mode,
    result:difference.div(M(v.fromValue)).times(100),
    difference,
    isIncrease:difference.greaterThanOrEqualTo(0),
   };
  }
 }
}

export function toPercentageDTO(result:PercentageResult):PercentageResultDTO {
 return {
  mode:result.mode,
  result:toDTO(result.result),
  ...(result.difference!==undefined?{difference:toDTO(result.difference)}:{}),
  ...(result.isIncrease!==undefined?{isIncrease:result.isIncrease}:{}),
 };
}
