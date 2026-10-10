import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LangSwitch, Wordmark } from './Brand'

export const inputClass =
  'mt-1.5 min-h-12 w-full rounded-xl border border-shiro/15 bg-night px-4 text-shiro outline-none transition-colors placeholder:text-shiro/30 focus:border-straw'
export const labelClass = 'block text-xs font-semibold uppercase tracking-[0.15em] text-shiro/55'
export const primaryButton =
  'min-h-12 w-full rounded-full bg-aka px-6 font-display text-sm uppercase tracking-wider text-shiro shadow-[0_14px_30px_-12px_rgba(194,54,31,0.9)] transition-transform active:scale-[0.98] disabled:opacity-60'

// Centered card on the woven background, used by every account page.
export function AuthShell({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="tatami-weave flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Wordmark />
        <LangSwitch />
      </header>
      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-6 sm:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} overflow-hidden rounded-3xl border border-shiro/10 bg-night-2 p-7 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.9)] sm:p-9`}
        >
          <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-aka via-straw to-ai" />
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            className="font-display text-xs uppercase tracking-wide text-shiro/45 transition-colors hover:text-straw"
          >
            ← {t('auth.back')}
          </button>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-shiro">{title}</h1>
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="rounded-xl border border-aka/40 bg-aka/10 px-4 py-3 text-sm text-sakura">{message}</p>
}
