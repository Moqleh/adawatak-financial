import {M,ONE,toDTO,type Money} from '@/lib/money';
import {InflationInputSchema,type InflationInput} from './schemas';

export interface InflationRow {
 year: number;
 futureCost: Money;
 purchasingPower: Money;
 inflationImpact: Money;
}

export interface InflationResult {
 futureCost: Money;
 purchasingPower: Money;
 inflationImpact: Money;
 schedule: InflationRow[];
}

export interface InflationDTO {
 futureCost: string;
 purchasingPower: string;
 inflationImpact: string;
 schedule: Array<{
  year: number;
  futureCost: string;
  purchasingPower: string;
  inflationImpact: string;
 }>;
}

const PERCENT=M(100);

export function calcInflation(input:InflationInput):InflationResult {
 const v=InflationInputSchema.parse(input);
 const amount=M(v.amount);
 const annualFactor=ONE.plus(M(v.inflationRatePercent).div(PERCENT));
 const schedule:InflationRow[]=[];

 for(let year=1;year<=v.years;year++){
  const factor=annualFactor.pow(year);
  const futureCost=amount.times(factor);
  const purchasingPower=amount.div(factor);
  const inflationImpact=futureCost.minus(amount);

  schedule.push({
   year,
   futureCost,
   purchasingPower,
   inflationImpact,
  });
 }

 const last=schedule[schedule.length-1];

 return {
  futureCost:last.futureCost,
  purchasingPower:last.purchasingPower,
  inflationImpact:last.inflationImpact,
  schedule,
 };
}

export function toInflationDTO(result:InflationResult):InflationDTO {
 return {
  futureCost:toDTO(result.futureCost),
  purchasingPower:toDTO(result.purchasingPower),
  inflationImpact:toDTO(result.inflationImpact),
  schedule:result.schedule.map(row=>({
   year:row.year,
   futureCost:toDTO(row.futureCost),
   purchasingPower:toDTO(row.purchasingPower),
   inflationImpact:toDTO(row.inflationImpact),
  })),
 };
}
