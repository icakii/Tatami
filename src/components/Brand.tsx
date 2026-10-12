import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
      <span className="flex items-baseline gap-2">
        <span className="font-display text-lg font-semibold uppercase tracking-[0.35em] text-shiro">Tatami</span>
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-straw">Studio</span>
      </span>
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
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Collapse the menu first, then scroll: scrolling while the panel's height
  // animates away lands in the wrong place (or nowhere).
  function goTo(e: React.MouseEvent, href: string) {
    e.preventDefault()
    setOpen(false)
    const id = href.split('#')[1]
    if (location.pathname !== '/') {
      navigate(href)
      return
    }
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', href)
    }, 320)
  }
  const links = [
    ['/#how', t('nav.how')],
    ['/#app', t('nav.app')],
    ['/#examples', t('nav.examples')],
    ['/#services', t('nav.services')],
    ['/#pricing', t('nav.pricing')],
    ['/#contact', t('nav.contact')],
  ] as const

  // Close the menu whenever the route or anchor changes.
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <header className="sticky top-0 z-30 border-b border-shiro/10 bg-night/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Wordmark />
        <nav className="hidden items-center gap-6 font-display text-xs uppercase tracking-[0.18em] text-shiro/60 md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-straw">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link
            to={session ? '/account' : '/login'}
            className="rounded-full border border-straw/40 px-4 py-2 font-display text-xs uppercase tracking-wide text-straw transition-colors hover:bg-straw hover:text-night"
          >
            {session ? t('nav.account') : t('nav.login')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-shiro/15 md:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              className="absolute h-0.5 w-4 rounded bg-shiro"
            />
            <motion.span
              animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              className="absolute h-0.5 w-4 rounded bg-shiro"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-shiro/10 md:hidden"
          >
            <div className="flex flex-col px-5 py-3">
              {links.map(([href, label], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={(e) => goTo(e, href)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className="border-b border-shiro/5 py-3.5 font-display text-sm uppercase tracking-[0.18em] text-shiro/80 last:border-0 hover:text-straw"
                >
                  {label}
                </motion.a>
              ))}
              <Link
                to="/order"
                className="mb-2 mt-3 rounded-full bg-aka py-3 text-center font-display text-sm uppercase tracking-wider text-shiro"
              >
                {t('nav.order')}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
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
            © {new Date().getFullYear()} Tatami Studio. {t('footer.rights')}
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
