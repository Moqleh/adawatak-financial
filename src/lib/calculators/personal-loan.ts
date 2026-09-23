import type{LoanInput,LoanResult}from'./types';import{nonNegative,positive,positiveInteger}from'./validation';
export function calculatePersonalLoan({principal,annualRate,months}:LoanInput):LoanResult{
 positive('principal',principal);nonNegative('annualRate',annualRate);positiveInteger('months',months);
 const r=annualRate/1200;const monthlyPayment=r===0?principal/months:principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);
 let balance=principal,totalInterest=0;const schedule=[];
 for(let month=1;month<=months;month++){const openingBalance=balance;const interest=openingBalance*r;let principalPart=monthlyPayment-interest;let payment=monthlyPayment;if(month===months){principalPart=openingBalance;payment=principalPart+interest}balance=Math.max(0,openingBalance-principalPart);totalInterest+=interest;schedule.push({month,openingBalance,payment,principal:principalPart,interest,closingBalance:balance});}
 const totalPayment=principal+totalInterest;return{monthlyPayment,totalPayment,totalInterest,schedule};
}
