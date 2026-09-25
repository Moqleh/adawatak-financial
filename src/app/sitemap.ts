export const dynamic='force-static';
import type{MetadataRoute}from'next';
import{tools,toolHref}from'@/lib/tools/registry';
const base=process.env.NEXT_PUBLIC_SITE_URL??'https://moqleh.github.io/adawatak-financial';
export default function sitemap():MetadataRoute.Sitemap{
 const fixed=['','/tools','/favorites','/gold','/currencies','/currency-converter','/markets','/about','/privacy','/disclaimer','/guides'];
 const toolPaths=tools.map(t=>toolHref(t.id)).filter(path=>!fixed.includes(path));
 const paths=[...fixed,...toolPaths];
 return['ar','en'].flatMap(locale=>paths.map(path=>({url:`${base}/${locale}${path}/`,changeFrequency:path===''?'weekly' as const:'monthly' as const,priority:path===''?1:path==='/tools'?.8:.6})));
}
