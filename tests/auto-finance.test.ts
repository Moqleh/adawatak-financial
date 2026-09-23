import {describe,it,expect} from 'vitest';
import {calcAutoFinance} from '../src/lib/calculators/auto-finance/engine';
import {AutoFinanceInputSchema} from '../src/lib/calculators/auto-finance/schema';
import {calcLoanCore} from '../src/lib/calculators/core/loan';
import {M,ZERO} from '../src/lib/money';

const base={
  vehiclePrice:120000,
  downPayment:20000,
  profitRatePercent:6,
  termMonths:60,
  balloonAmount:0,
  upfrontFees:0,
  annualInsuranceRatePercent:0,
  capitalizeFees:false,
  capitalizeInsurance:false,
};

const monthlyRate=(annualPercent:string)=>M(annualPercent).div(12).div(100);

describe('calcAutoFinance — schedule invariants',()=>{
  it('closes the schedule telescopically and repays financed principal exactly',()=>{
    const result=calcAutoFinance({...base,balloonAmount:25000});
    expect(result.schedule.at(-1)?.closingBalance.equals(ZERO)).toBe(true);
    expect(result.schedule[0].openingBalance.equals(result.financedAmount)).toBe(true);
    for(let i=1;i<result.schedule.length;i++){
      expect(result.schedule[i].openingBalance.equals(result.schedule[i-1].closingBalance)).toBe(true);
    }
    const principalSum=result.schedule.reduce((sum,row)=>sum.plus(row.principal),ZERO);
    expect(principalSum.equals(result.financedAmount)).toBe(true);
  });
});

describe('calcAutoFinance — balloon mechanics',()=>{
  it('matches LoanCore monthly payment when balloon is zero',()=>{
    const result=calcAutoFinance(base);
    const loan=calcLoanCore({
      principal:M(100000),
      monthlyRate:monthlyRate('6'),
      months:60,
    });
    expect(result.monthlyPayment.equals(loan.monthlyPayment)).toBe(true);
  });

  it('reduces regular monthly payment and settles the remaining balance in final payment',()=>{
    const withoutBalloon=calcAutoFinance(base);
    const withBalloon=calcAutoFinance({...base,balloonAmount:25000});
    expect(withBalloon.monthlyPayment.lessThan(withoutBalloon.monthlyPayment)).toBe(true);
    const last=withBalloon.schedule.at(-1);
    expect(last).toBeDefined();
    if(!last)return;
    expect(last.payment.greaterThan(withBalloon.monthlyPayment)).toBe(true);
    expect(last.closingBalance.equals(ZERO)).toBe(true);
  });
});

describe('calcAutoFinance — zero profit rate',()=>{
  it('has zero total profit and total scheduled payments equal financed amount',()=>{
    const result=calcAutoFinance({...base,profitRatePercent:0,balloonAmount:25000});
    expect(result.totalProfit.equals(ZERO)).toBe(true);
    const totalPayments=result.schedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);
    expect(totalPayments.equals(result.financedAmount)).toBe(true);
  });
});

describe('calcAutoFinance — fees and insurance isolation',()=>{
  it('does not double count fees when capitalized',()=>{
    const upfront=calcAutoFinance({...base,upfrontFees:3000,capitalizeFees:false});
    const capitalized=calcAutoFinance({...base,upfrontFees:3000,capitalizeFees:true});
    expect(upfront.financedAmount.equals(M(100000))).toBe(true);
    expect(capitalized.financedAmount.equals(M(103000))).toBe(true);

    const upfrontScheduled=upfront.schedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);
    const capitalizedScheduled=capitalized.schedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);
    expect(upfront.totalOutOfPocket.equals(M(base.downPayment).plus(upfrontScheduled).plus(3000))).toBe(true);
    expect(capitalized.totalOutOfPocket.equals(M(base.downPayment).plus(capitalizedScheduled))).toBe(true);
  });

  it('capitalizes first-year insurance only and leaves later insurance outside financing',()=>{
    const result=calcAutoFinance({
      ...base,
      termMonths:36,
      annualInsuranceRatePercent:2,
      capitalizeInsurance:true,
    });
    const firstYearInsurance=M(base.vehiclePrice).times(2).div(100);
    const expectedTotalInsurance=firstYearInsurance.times(3);
    expect(result.totalInsurance.equals(expectedTotalInsurance)).toBe(true);
    expect(result.financedAmount.equals(M(100000).plus(firstYearInsurance))).toBe(true);
    const scheduled=result.schedule.reduce((sum,row)=>sum.plus(row.payment),ZERO);
    const laterInsurance=expectedTotalInsurance.minus(firstYearInsurance);
    expect(result.totalOutOfPocket.equals(M(base.downPayment).plus(scheduled).plus(laterInsurance))).toBe(true);
  });
});

describe('AutoFinanceInputSchema — cross-field bounds',()=>{
  it('rejects downPayment equal to or greater than vehiclePrice',()=>{
    for(const downPayment of [120000,130000]){
      const result=AutoFinanceInputSchema.safeParse({...base,downPayment});
      expect(result.success).toBe(false);
      if(result.success)continue;
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({
          message:'DOWN_PAYMENT_MUST_BE_LESS_THAN_VEHICLE_PRICE',
          path:['downPayment'],
        }),
      ]));
    }
  });

  it('rejects balloonAmount equal to or greater than base financed amount',()=>{
    for(const balloonAmount of [100000,110000]){
      const result=AutoFinanceInputSchema.safeParse({...base,balloonAmount});
      expect(result.success).toBe(false);
      if(result.success)continue;
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({
          message:'BALLOON_PAYMENT_MUST_BE_LESS_THAN_FINANCED_AMOUNT',
          path:['balloonAmount'],
        }),
      ]));
    }
  });
});
