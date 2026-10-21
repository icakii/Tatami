import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { PhoneFrame } from './PhoneFrame'
import { Reveal, SectionHeading } from './Section'

// How the club app gets onto a phone today: from the club's site, one tap,
// and the club's own icon lands on the home screen. The phone loops through
// those steps; next to it, the store badges for the native apps we're
// building.

const STEP_MS = [2200, 1900, 2300, 2200]

function ClubIcon({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-[22%] bg-[#f3ecdd] shadow-md ring-1 ring-ink/10 ${className}`}>
      <svg viewBox="0 0 200 200" className="h-[82%] w-[82%]" aria-hidden="true">
        <circle cx="100" cy="100" r="78" fill="none" stroke="#1f1b16" strokeWidth="15" strokeLinecap="round" strokeDasharray="410 490" transform="rotate(-62 100 100)" />
        <text x="100" y="103" textAnchor="middle" dominantBaseline="central" fontSize="92" fill="#1f1b16" fontFamily="'Yuji Syuku', serif">
          極
        </text>
        <rect x="146" y="146" width="30" height="30" rx="5" fill="#c2361f" />
      </svg>
    </span>
  )
}

function Finger({ x, y }: { x: string; y: string }) {
  return (
    <motion.span
      className="pointer-events-none absolute z-20 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-shiro bg-ink/35 shadow-lg"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 1.4 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [1.4, 1, 0.8, 1] }}
      transition={{ duration: 1.1, times: [0, 0.35, 0.6, 1], delay: 0.6 }}
    />
  )
}

function SiteScreen() {
  const { t } = useTranslation()
  return (
    <div className="relative flex h-full flex-col">
      <div className="mx-3 mt-8 rounded-full bg-ink/5 px-3 py-1.5 text-center text-[9px] text-muted">kime.tatamistudio.net</div>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <ClubIcon className="h-7 w-7" />
          <span className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-ink">Kime</span>
        </div>
        <div className="mt-4 h-16 rounded-xl bg-linear-to-br from-ai to-ai-soft" />
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-4/5 rounded bg-ink/10" />
          <div className="h-2 w-3/5 rounded bg-ink/10" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mt-5 flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-shiro"
        >
          <ClubIcon className="h-6 w-6" />
          <span className="font-display text-[10px] uppercase tracking-wide">{t('install.mock.button')}</span>
          <span className="ml-auto text-xs">↓</span>
        </motion.div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="aspect-square rounded-lg bg-kin/40" />
          <div className="aspect-square rounded-lg bg-aka/30" />
          <div className="aspect-square rounded-lg bg-jade/30" />
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-2/3 rounded bg-ink/10" />
          <div className="h-2 w-1/2 rounded bg-ink/10" />
        </div>
      </div>
      <Finger x="50%" y="46%" />
    </div>
  )
}

function SheetScreen() {
  const { t } = useTranslation()
  return (
    <div className="relative h-full bg-ink/40">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-shiro p-4"
      >
        <div className="flex items-center gap-3">
          <ClubIcon className="h-11 w-11" />
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink">Kime</p>
            <p className="text-[9px] text-muted">kime.tatamistudio.net</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-aka py-2.5 text-center font-display text-[10px] uppercase tracking-wide text-shiro">
          {t('install.mock.confirm')}
        </div>
      </motion.div>
      <Finger x="50%" y="93%" />
    </div>
  )
}

const OTHER_APPS = ['bg-ai-soft', 'bg-jade', 'bg-kin', 'bg-sakura', 'bg-ai', 'bg-aka/70', 'bg-ink/70', 'bg-jade/60', 'bg-kin/60', 'bg-ai-soft/70', 'bg-sakura/80']

function HomeScreen() {
  return (
    <div className="relative h-full bg-linear-to-b from-ai via-ai-soft to-jade/80 px-4 pt-12">
      <div className="grid grid-cols-4 gap-x-3 gap-y-4">
        {OTHER_APPS.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`aspect-square w-full rounded-[22%] ${c}`} />
            <span className="h-1 w-3/4 rounded bg-shiro/40" />
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.25 }}
            className="block aspect-square w-full"
          >
            <ClubIcon className="h-full w-full" />
          </motion.span>
          <span className="text-[8px] font-semibold text-shiro">Kime</span>
        </div>
      </div>
      <Finger x="84%" y="39%" />
    </div>
  )
}

function OpenScreen() {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ scale: 0.2, opacity: 0, borderRadius: '40%' }}
      animate={{ scale: 1, opacity: 1, borderRadius: '0%' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col items-center justify-center bg-[#f3ecdd]"
    >
      <ClubIcon className="h-20 w-20 shadow-none ring-0" />
      <p className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.3em] text-ink">Kime</p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted"
      >
        {t('install.mock.opened')}
      </motion.p>
    </motion.div>
  )
}

const SCREENS = [SiteScreen, SheetScreen, HomeScreen, OpenScreen]

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path d="M4 2.8v18.4c0 .5.5.8 1 .6l15.9-9.2c.5-.3.5-.9 0-1.2L5 2.2c-.5-.2-1 .1-1 .6z" fill="currentColor" />
    </svg>
  )
}

function StoreGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M9.5 6.5 15.5 17M14.5 6.5 8.5 17M6.5 14h11" />
    </svg>
  )
}

function StoreBadge({ glyph, small, big, soon }: { glyph: React.ReactNode; small: string; big: string; soon: string }) {
  return (
    <div className="relative flex min-w-44 items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-shiro shadow-[0_14px_30px_-16px_rgba(31,27,22,0.9)]">
      {glyph}
      <div className="leading-tight">
        <p className="text-[10px] text-shiro/70">{small}</p>
        <p className="font-display text-lg font-semibold tracking-wide">{big}</p>
      </div>
      <span className="absolute -right-2 -top-2 rotate-6 rounded-full bg-aka px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-shiro shadow">
        {soon}
      </span>
    </div>
  )
}

export function InstallShowcase() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? 2 : 0)
  const phoneRef = useRef<HTMLDivElement>(null)
  // Only play while the phone is on screen, so it starts from step 1.
  const inView = useInView(phoneRef, { amount: 0.4 })

  useEffect(() => {
    if (reduced || !inView) return
    const id = window.setTimeout(() => setStep((s) => (s + 1) % SCREENS.length), STEP_MS[step])
    return () => window.clearTimeout(id)
  }, [step, reduced, inView])

  const Screen = SCREENS[step]
  const steps = t('install.steps', { returnObjects: true }) as string[]

  return (
    <section id="install" className="scroll-mt-16 px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="lg:order-2">
          <SectionHeading kanji="入" title={t('install.title')} align="left" tone="aka" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t('install.body')}</p>
          </Reveal>
          <ol className="mt-8 space-y-3">
            {steps.map((label, i) => {
              // Steps 1-3 light up with the matching phone screens.
              const active = Math.min(step, 2) === i
              return (
                <Reveal key={i} delay={0.2 + i * 0.08} y={16}>
                  <li
                    className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors duration-500 ${
                      active ? 'border-aka/40 bg-shiro' : 'border-ink/10 bg-shiro/60'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm transition-colors duration-500 ${
                        active ? 'bg-aka text-shiro' : 'bg-ink/10 text-muted'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink/80">{label}</span>
                  </li>
                </Reveal>
              )
            })}
          </ol>

          <Reveal delay={0.45}>
            <div className="mt-10 rounded-2xl border border-dashed border-ink/20 p-5">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-aka-text">{t('install.storesEyebrow')}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <StoreBadge glyph={<PlayGlyph />} small={t('install.playSmall')} big="Google Play" soon={t('install.soon')} />
                <StoreBadge glyph={<StoreGlyph />} small={t('install.appleSmall')} big="App Store" soon={t('install.soon')} />
              </div>
              <p className="mt-4 text-sm text-muted">{t('install.storesNote')}</p>
            </div>
          </Reveal>
        </div>

        <PhoneFrame glow="aka" tilt={-1}>
          <div ref={phoneRef} className="relative h-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </div>
        </PhoneFrame>
      </div>
    </section>
  )
}
