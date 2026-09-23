import {z} from 'zod';
const finite=z.number().finite();
const nonNeg=finite.min(0);
const ratePct=finite.min(0).max(100);
const signedRatePct=finite.min(-100).max(100);
export const PersonalLoanInputSchema=z.object({principal:finite.positive(),annualRatePercent:ratePct,termMonths:z.number().int().positive().max(600)});
export type PersonalLoanInput=z.infer<typeof PersonalLoanInputSchema>;
export const MortgageInputSchema=z.object({propertyPrice:finite.positive(),downPayment:nonNeg,annualRatePercent:ratePct,termMonths:z.number().int().positive().max(600)}).refine((data)=>data.downPayment<data.propertyPrice,{message:'DOWN_PAYMENT_MUST_BE_LESS_THAN_PRICE',path:['downPayment']});
export type MortgageInput=z.infer<typeof MortgageInputSchema>;
export const CompoundSavingsInputSchema=z.object({initialAmount:nonNeg,monthlyContribution:nonNeg,annualReturnPercent:signedRatePct,years:z.number().int().positive().max(100)});
export type CompoundSavingsInput=z.infer<typeof CompoundSavingsInputSchema>;
export const VatInputSchema=z.discriminatedUnion('mode',[
 z.object({mode:z.literal('add'),netAmount:nonNeg,ratePercent:ratePct}),
 z.object({mode:z.literal('remove'),grossAmount:nonNeg,ratePercent:ratePct})
]);
export type VatInput=z.infer<typeof VatInputSchema>;
