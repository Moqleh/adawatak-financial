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
export const InflationInputSchema=z.object({
 amount:nonNeg,
 inflationRatePercent:ratePct,
 years:z.number().int().positive().max(100),
}).strict();
export type InflationInput=z.input<typeof InflationInputSchema>;
export type InflationParsedInput=z.output<typeof InflationInputSchema>;
export const PercentOfInputSchema=z.object({
 mode:z.literal('PERCENT_OF'),
 percentage:finite,
 value:finite,
}).strict();
export const WhatPercentInputSchema=z.object({
 mode:z.literal('WHAT_PERCENT'),
 part:finite,
 total:finite.refine((value)=>value!==0,{message:'Total cannot be zero in WHAT_PERCENT mode'}),
}).strict();
export const PercentChangeInputSchema=z.object({
 mode:z.literal('PERCENT_CHANGE'),
 fromValue:finite.refine((value)=>value!==0,{message:'From value cannot be zero in PERCENT_CHANGE mode'}),
 toValue:finite,
}).strict();
export const PercentageInputSchema=z.discriminatedUnion('mode',[
 PercentOfInputSchema,
 WhatPercentInputSchema,
 PercentChangeInputSchema,
]);
export type PercentageInput=z.input<typeof PercentageInputSchema>;
export type PercentageParsedInput=z.output<typeof PercentageInputSchema>;
export const DiscountInputSchema=z.object({
 originalPrice:nonNeg,
 discountPercent:ratePct,
}).strict();
export type DiscountInput=z.input<typeof DiscountInputSchema>;
export type DiscountParsedInput=z.output<typeof DiscountInputSchema>;
export const MarginInputSchema=z.object({
 cost:nonNeg,
 sellingPrice:finite.positive(),
}).strict();
export type MarginInput=z.input<typeof MarginInputSchema>;
export type MarginParsedInput=z.output<typeof MarginInputSchema>;
export const MarkupInputSchema=z.object({
 cost:finite.positive(),
 sellingPrice:nonNeg,
}).strict();
export type MarkupInput=z.input<typeof MarkupInputSchema>;
export type MarkupParsedInput=z.output<typeof MarkupInputSchema>;
export const RoiInputSchema=z.object({
 cost:finite.positive(),
 finalValue:nonNeg,
}).strict();
export type RoiInput=z.input<typeof RoiInputSchema>;
export type RoiParsedInput=z.output<typeof RoiInputSchema>;
export const VatInputSchema=z.discriminatedUnion('mode',[
 z.object({mode:z.literal('add'),netAmount:nonNeg,ratePercent:ratePct}),
 z.object({mode:z.literal('remove'),grossAmount:nonNeg,ratePercent:ratePct})
]);
export type VatInput=z.infer<typeof VatInputSchema>;
