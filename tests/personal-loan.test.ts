import {describe,it,expect} from 'vitest';import {calcPersonalLoan} from '../src/lib/calculators/personal-loan';import {M,ZERO,formatCurrency,nearlyEqual,isZero,TOLERANCE} from '../src/lib/money';
describe('calcPersonalLoan',()=>{const base={principal:100000,annualRatePercent:5,termMonths:60};
it('principal invariant',()=>{const r=calcPersonalLoan(base);const sum=r.schedule.reduce((s,row)=>s.plus(row.principal),ZERO);expect(nearlyEqual(sum,M(base.principal))).toBe(true)});
it('final balance',()=>{const r=calcPersonalLoan(base);expect(isZero(r.schedule.at(-1)!.closingBalance,TOLERANCE)).toBe(true)});
it('payment identity',()=>{const r=calcPersonalLoan(base);expect(nearlyEqual(r.totalPayment,M(base.principal).plus(r.totalInterest))).toBe(true)});
it('zero rate',()=>{const r=calcPersonalLoan({principal:12000,annualRatePercent:0,termMonths:12});expect(formatCurrency(r.monthlyPayment)).toBe('1000.00');expect(formatCurrency(r.totalInterest)).toBe('0.00')});
it.each([{principal:-1,annualRatePercent:5,termMonths:12},{principal:NaN,annualRatePercent:5,termMonths:12},{principal:Infinity,annualRatePercent:5,termMonths:12},{principal:1000,annualRatePercent:5,termMonths:12.5},{principal:1000,annualRatePercent:150,termMonths:12}])('rejects invalid input %#',input=>expect(()=>calcPersonalLoan(input)).toThrow());
});
