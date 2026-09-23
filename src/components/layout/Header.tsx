import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default async function Header(){
  const t=await getTranslations();
  return <header className="header"><div className="container header-inner">
    <Link href="/" className="brand"><span className="brand-mark"><i/><i/><i/></span><span><b>{t('brand')}</b><small>Adawatak Financial</small></span></Link>
    <nav className="nav"><Link href="/">{t('nav.home')}</Link><Link href="/tools">{t('nav.tools')}</Link><a href="#markets">{t('nav.markets')}</a><a href="#resources">{t('nav.resources')}</a><a href="#about">{t('nav.about')}</a></nav>
    <div className="header-actions"><LanguageSwitcher/></div>
  </div></header>
}