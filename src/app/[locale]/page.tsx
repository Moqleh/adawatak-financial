import {getTranslations,setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
const icons=['⌂','⌂','▣','▤','▥','◎','↗','◇','%','◆','⇄','▦'];
export default async function Home({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations('home');
 const tools=t.raw('toolItems') as {title:string;desc:string}[];
 const why=t.raw('whyItems') as {title:string;desc:string;icon:string}[];
 const articles=t.raw('articles') as {tag:string;title:string;date:string;kind:string}[];
 return <main>
  <section className="hero"><div className="hero-glow"/><div className="hero-city"/><div className="container hero-content">
   <div className="market-cards" id="markets">{['S&P 500','TASI','USD/SAR','Gold'].map((x,i)=><div className={'market-card m'+i} key={x}><b>{x}</b><strong>—</strong><small>UNAVAILABLE</small><span className="sparkline">⌁⌃⌁⌄⌃</span></div>)}</div>
   <div className="hero-copy"><h1>{t('titleLine1')}<br/><em>{t('titleLine2')}</em></h1><p>{t('description')}</p>
    <form className="search" action="/ar/tools"><input name="q" placeholder={t('search')}/><button aria-label={t('searchButton')}>⌕</button></form>
    <div className="popular"><b>{t('popular')}</b><Link href="/tools">{t('popularLoan')}</Link><Link href="/tools">{t('popularGold')}</Link><Link href="/tools">{t('popularFx')}</Link><Link href="/tools">{t('popularZakat')}</Link></div>
   </div>
  </div></section>
  <section className="tools-section" id="tools"><div className="container"><div className="section-heading"><a href="#tools">{t('showAll')} ←</a><h2>{t('toolsTitle')}</h2><p>{t('toolsSubtitle')}</p></div><div className="tool-grid">{tools.map((x,i)=><Link href="/tools" className={'tool-card tone-'+(i%4)} key={x.title}><span className="tool-icon">{icons[i]}</span><h3>{x.title}</h3><p>{x.desc}</p><b className="arrow">→</b></Link>)}</div></div></section>
  <section className="why" id="about"><div className="container"><h2>{t('whyTitle')}</h2><div className="why-grid">{why.map(x=><div className="why-item" key={x.title}><span>{x.icon}</span><div><b>{x.title}</b><small>{x.desc}</small></div></div>)}</div></div></section>
  <section className="resources" id="resources"><div className="container resource-grid"><div><div className="resource-title"><a href="#resources">{t('allArticles')} ←</a><h2>{t('resourcesTitle')}</h2></div><div className="article-grid">{articles.map((a,i)=><article className="article" key={a.title}><div className={'article-image art-'+i}><span>{a.kind}</span></div><div className="article-body"><small>{a.tag}</small><h3>{a.title}</h3><time>{a.date}</time></div></article>)}</div></div><aside className="newsletter"><div className="mail-icon">✉</div><h2>{t('newsletterTitle')}</h2><p>{t('newsletterDesc')}</p><input type="email" placeholder={t('email')}/><button>{t('subscribe')}</button></aside></div></section>
 </main>
}