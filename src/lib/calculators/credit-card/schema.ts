import {z} from 'zod';

const finite=z.number().finite();
const ratePct=finite.min(0).max(100);

const common={
  balance:finite.positive(),
  aprPercent:ratePct,
};

export const CreditCardPayoffInputSchema=z.discriminatedUnion('mode',[
  z.object({
    ...common,
    mode:z.literal('FIXED_PAYMENT'),
    monthlyPayment:finite.positive(),
  }).strict(),
  z.object({
    ...common,
    mode:z.literal('TARGET_TIMEFRAME'),
    targetMonths:z.number().int().positive().max(600),
  }).strict(),
]);

export type CreditCardPayoffInput=z.infer<typeof CreditCardPayoffInputSchema>;
