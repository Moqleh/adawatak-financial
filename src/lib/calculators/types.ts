export type AmortizationRow={month:number;openingBalance:number;payment:number;principal:number;interest:number;closingBalance:number};
export type LoanInput={principal:number;annualRate:number;months:number};
export type LoanResult={monthlyPayment:number;totalPayment:number;totalInterest:number;schedule:AmortizationRow[]};
export type VatMode='add'|'remove'|'extract';
export type VatInput={amount:number;rate:number;mode:VatMode};
export type VatResult={net:number;tax:number;gross:number};
export type CompoundInput={initial:number;monthlyContribution:number;annualRate:number;years:number};
export type CompoundResult={finalValue:number;totalContributions:number;growth:number};
