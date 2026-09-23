export type CalculatorErrorCode='INVALID_INPUT'|'DOWN_PAYMENT_EXCEEDS_PRICE'|'PAYMENT_BELOW_INTEREST'|'DURATION_IMPOSSIBLE'|'NEGATIVE_AMORTIZATION';
export class CalculatorError extends Error{
 readonly code:CalculatorErrorCode;
 readonly details?:unknown;
 constructor(code:CalculatorErrorCode,details?:unknown){super(code);this.name='CalculatorError';this.code=code;this.details=details}
}
