import type {Money,MoneyDTO} from '@/lib/money';
import type {AmortizationRow} from '../core/loan';

export interface AutoFinanceResult {
  financedAmount: Money;
  monthlyPayment: Money;
  balloonAmount: Money;
  totalProfit: Money;
  totalInsurance: Money;
  totalFees: Money;
  totalOutOfPocket: Money;
  schedule: AmortizationRow[];
}

export interface AutoFinanceResultDTO {
  financedAmount: MoneyDTO;
  monthlyPayment: MoneyDTO;
  balloonAmount: MoneyDTO;
  totalProfit: MoneyDTO;
  totalInsurance: MoneyDTO;
  totalFees: MoneyDTO;
  totalOutOfPocket: MoneyDTO;
  schedule: Array<{
    month:number;
    openingBalance:MoneyDTO;
    payment:MoneyDTO;
    principal:MoneyDTO;
    interest:MoneyDTO;
    closingBalance:MoneyDTO;
  }>;
}
