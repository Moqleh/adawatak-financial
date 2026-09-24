import {z} from 'zod';
const finite=z.number().finite();
const nonNeg=finite.min(0);
const ratePct=finite.min(0).max(100);
const signedRatePct=finite.min(-100).max(100);
export const PersonalLoanInputSchema=z.object({principal:finite.positive(),annualRatePercent:ratePct,termMonths:z.number().int().positive().max(600)});
export type PersonalLoanInput=z.infer<typeof PersonalLoanInputSchema>;
export const MortgageInputSchema=z.object({propertyPrice:finite.positive(),downPayment:nonNeg,annualRatePercent:ratePct,termMonths:z.number().int().positive().max(600)}).refine((data)=>data.downPayment<data.propertyPrice,{message:'DOWN_PAYMENT_MUST_BE_LESS_THAN_PRICE',path:['downPayment']});
export type MortgageInput=z.infer<typeof MortgageInputSchema>;
export const CompoundSavingsInputSchema=z.object({
 initialAmount:nonNeg,
 monthlyContribution:nonNeg,
 annualReturnPercent:signedRatePct,
 years:z.number().int().positive().max(100),
 depositTiming:z.enum(['BEGINNING','END']).default('END'),
 compoundingFrequency:z.enum(['MONTHLY','QUARTERLY','SEMI_ANNUALLY','ANNUALLY']).default('MONTHLY'),
}).strict();
export type CompoundSavingsInput=z.input<typeof CompoundSavingsInputSchema>;
export type CompoundSavingsParsedInput=z.output<typeof CompoundSavingsInputSchema>;
export const RetirementInputSchema=z.object({
 currentSavings:nonNeg,
 monthlyContribution:nonNeg,
 expectedAnnualReturnPercent:signedRatePct,
 inflationRatePercent:signedRatePct.default(2.5),
 currentAge:z.number().int().min(18).max(100),
 retirementAge:z.number().int().min(19).max(100),
 targetMonthlySpending:nonNeg,
 withdrawalRatePercent:finite.min(0.1).max(100).default(4),
}).strict().refine((data)=>data.retirementAge>data.currentAge,{
 message:'Retirement age must be strictly greater than current age',
 path:['retirementAge'],
});
export type RetirementInput=z.input<typeof RetirementInputSchema>;
export type RetirementParsedInput=z.output<typeof RetirementInputSchema>;
export const VatInputSchema=z.discriminatedUnion('mode',[
 z.object({mode:z.literal('add'),netAmount:nonNeg,ratePercent:ratePct}),
 z.object({mode:z.literal('remove'),grossAmount:nonNeg,ratePercent:ratePct})
]);
export type VatInput=z.infer<typeof VatInputSchema>;
