export type ReferenceAvailability='EXTERNAL_LINK'|'STATIC_REFERENCE';
export const referenceLabel=(s:ReferenceAvailability,locale='en')=>{const ar=locale==='ar';return s==='EXTERNAL_LINK'?(ar?'مصدر خارجي موثوق':'Trusted external source'):(ar?'مرجع ثابت':'Static reference')};
export const marketReferences={
 gold:{label:'TradingView · XAU/USD',url:'https://www.tradingview.com/symbols/XAUUSD/'},
 tasi:{label:'Saudi Exchange · TASI',url:'https://www.saudiexchange.sa/wps/portal/saudiexchange/ourmarkets/main-market-watch/indices-performance?locale=en'},
 sp500:{label:'S&P Dow Jones Indices · S&P 500',url:'https://www.spglobal.com/spdji/en/indices/equity/sp-500/'},
 aapl:{label:'Yahoo Finance · AAPL',url:'https://finance.yahoo.com/quote/AAPL/'},
 saudiMarket:{label:'Saudi Exchange · Main Market',url:'https://www.saudiexchange.sa/wps/portal/saudiexchange/ourmarkets/main-market-watch'}
} as const;
