import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { CONTACT_EMAILS } from '../lib/paddle'

// The 畳 seal: a hanko square, same mark the Hub uses.
export function Seal({ className = 'h-9 w-9 text-lg' }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md bg-aka font-brush leading-none text-shiro shadow-[0_6px_18px_-6px_rgba(194,54,31,0.9)] ${className}`}
      aria-hidden="true"
    >
      畳
    </span>
  )
}

export function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <Seal />
      <span className="font-display text-lg font-semibold uppercase tracking-[0.35em] text-shiro">Tatami</span>
    </Link>
  )
}

export function LangSwitch() {
  const { i18n } = useTranslation()
  return (
    <div className="flex items-center gap-1 font-display text-xs uppercase tracking-wide">
      {(['bg', 'en'] as const).map((lang, i) => (
        <span key={lang} className="flex items-center gap-1">
          {i > 0 && <span className="text-shiro/20">|</span>}
          <button
            type="button"
            onClick={() => i18n.changeLanguage(lang)}
            className={`px-1 py-1 transition-colors ${
              i18n.resolvedLanguage === lang ? 'text-straw' : 'text-shiro/50 hover:text-shiro'
            }`}
          >
            {lang}
          </button>
        </span>
      ))}
    </div>
  )
}

export function Nav() {
  const { t } = useTranslation()
  const { session } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-shiro/10 bg-night/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Wordmark />
        <nav className="hidden items-center gap-6 font-display text-xs uppercase tracking-[0.18em] text-shiro/60 md:flex">
          <a href="/#how" className="transition-colors hover:text-straw">{t('nav.how')}</a>
          <a href="/#app" className="transition-colors hover:text-straw">{t('nav.app')}</a>
          <a href="/#examples" className="transition-colors hover:text-straw">{t('nav.examples')}</a>
          <a href="/#pricing" className="transition-colors hover:text-straw">{t('nav.pricing')}</a>
          <a href="/#contact" className="transition-colors hover:text-straw">{t('nav.contact')}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link
            to={session ? '/account' : '/login'}
            className="rounded-full border border-straw/40 px-4 py-2 font-display text-xs uppercase tracking-wide text-straw transition-colors hover:bg-straw hover:text-night"
          >
            {session ? t('nav.account') : t('nav.login')}
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-shiro/10 px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-shiro/50 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Seal className="h-7 w-7 text-sm" />
          <span>
            © {new Date().getFullYear()} Tatami. {t('footer.rights')}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link to="/privacy" className="hover:text-straw">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-straw">{t('footer.terms')}</Link>
          {CONTACT_EMAILS.map((email) => (
            <a key={email} href={`mailto:${email}`} className="hover:text-straw">
              {email}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
