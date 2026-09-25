import{NextResponse}from'next/server';import{unavailableQuote}from'@/lib/market';
const ALLOWED=new Set(['gold','fx','stock','index']);
export async function GET(request:Request){const u=new URL(request.url),kind=u.searchParams.get('kind')??'',symbol=(u.searchParams.get('symbol')??'').trim().toUpperCase();if(!ALLOWED.has(kind)||!symbol)return NextResponse.json({error:{code:'INVALID_REQUEST',message:'kind and symbol are required'}},{status:400});return NextResponse.json(unavailableQuote({symbol,source:'provider-not-configured'}),{headers:{'Cache-Control':'no-store'}})}
