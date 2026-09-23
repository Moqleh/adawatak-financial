import type{VatInput,VatResult}from'./types';import{nonNegative}from'./validation';
export function calculateVat({amount,rate,mode}:VatInput):VatResult{nonNegative('amount',amount);nonNegative('rate',rate);const r=rate/100;if(mode==='add'){const tax=amount*r;return{net:amount,tax,gross:amount+tax}}const net=r===0?amount:amount/(1+r);const tax=amount-net;return{net,tax,gross:amount}}
