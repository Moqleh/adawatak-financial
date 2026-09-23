import type {Money,MoneyDTO} from '@/lib/money';

export interface CreditCardRow {
  month:number;
  openingBalance:Money;
  payment:Money;
  interest:Money;
  principal:Money;
  closingBalance:Money;
}

export interface CreditCardPayoffResult {
  monthsToPayoff:number;
  monthlyPayment:Money;
  totalInterest:Money;
  totalPaid:Money;
  payoffSchedule:CreditCardRow[];
}

export interface CreditCardPayoffResultDTO {
  monthsToPayoff:number;
  monthlyPayment:MoneyDTO;
  totalInterest:MoneyDTO;
  totalPaid:MoneyDTO;
  payoffSchedule:Array<{
    month:number;
    openingBalance:MoneyDTO;
    payment:MoneyDTO;
    interest:MoneyDTO;
    principal:MoneyDTO;
    closingBalance:MoneyDTO;
  }>;
}
