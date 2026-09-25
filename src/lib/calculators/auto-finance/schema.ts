import {z} from 'zod';

const finite=z.number().finite();
const nonNeg=finite.min(0);
const ratePct=finite.min(0).max(100);

export const AutoFinanceInputSchema=z.object({
  vehiclePrice:finite.positive(),
  downPayment:nonNeg,
  profitRatePercent:ratePct,
  termMonths:z.number().int().positive().max(600),
  balloonAmount:nonNeg.default(0),
  upfrontFees:nonNeg.default(0),
  annualInsuranceRatePercent:ratePct.default(0),
  capitalizeFees:z.boolean().default(false),
  capitalizeInsurance:z.boolean().default(false),
}).refine((data)=>data.downPayment<data.vehiclePrice,{
  message:'DOWN_PAYMENT_MUST_BE_LESS_THAN_VEHICLE_PRICE',
  path:['downPayment'],
}).refine((data)=>data.balloonAmount<(data.vehiclePrice-data.downPayment),{
  message:'BALLOON_PAYMENT_MUST_BE_LESS_THAN_FINANCED_AMOUNT',
  path:['balloonAmount'],
});

export type AutoFinanceInput=z.infer<typeof AutoFinanceInputSchema>;
