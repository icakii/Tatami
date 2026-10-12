import { animate, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PLANS, type Plan } from '../../lib/paddle'
import { Reveal, SectionHeading } from '../showcase/Section'

const ADD_ONS = ['domain'] as const

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{value}</span>
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const { t } = useTranslation()
  const featured = plan.id === 'club'
  const features = t(`plans.${plan.id}.features`, { returnObjects: true }) as string[]

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-7 ${
          featured
            ? 'border border-straw/50 bg-night-2 shadow-[0_40px_90px_-40px_rgba(217,182,107,0.45)]'
            : 'border border-shiro/10 bg-night-2/70'
        }`}
      >
        {featured && (
          <>
            <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-aka via-straw to-aka" />
            <span className="absolute right-5 top-5 rounded-full bg-aka px-3 py-1 font-display text-[10px] uppercase tracking-wider text-shiro">
              {t('plans.popular')}
            </span>
          </>
        )}
        <p className="font-display text-xl font-semibold uppercase tracking-wide text-shiro">{t(`plans.${plan.id}.name`)}</p>
        <p className="mt-1 pr-16 text-sm text-shiro/55">{t(`plans.${plan.id}.tagline`)}</p>

        <div className="mt-6 flex items-end gap-1">
          {plan.quoted && <span className="mb-2 text-sm text-shiro/50">{t('plans.from')}</span>}
          <span className="font-display text-6xl font-bold leading-none text-shiro">
            <CountUp to={plan.monthly} />
          </span>
          <span className="mb-1.5 font-display text-2xl text-straw">€</span>
          <span className="mb-2 text-sm text-shiro/50">{t('plans.perMonth')}</span>
        </div>
        <p className="mt-2 text-sm text-shiro/60">
          + {plan.quoted ? `${t('plans.from')} ` : ''}
          {plan.setup} € {t('plans.setup')}
        </p>

        <ul className="mt-6 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-shiro/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jade text-[11px] text-shiro">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Link
            to={`/order?plan=${plan.id}`}
            className={`block rounded-full py-3 text-center font-display text-sm uppercase tracking-wider transition-transform hover:-translate-y-0.5 ${
              featured
                ? 'bg-aka text-shiro shadow-[0_14px_30px_-12px_rgba(194,54,31,0.9)]'
                : 'border border-shiro/20 text-shiro hover:border-straw hover:text-straw'
            }`}
          >
            {plan.quoted ? t('plans.ctaQuote') : t('plans.ctaPick')}
          </Link>
        </div>
      </motion.div>
    </Reveal>
  )
}

export function Pricing() {
  const { t } = useTranslation()
  const fixed = PLANS.filter((p) => !p.quoted)
  const quoted = PLANS.filter((p) => p.quoted)

  return (
    <section id="pricing" className="scroll-mt-16 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="価" title={t('pricing.title')} tone="kin" inverted />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg text-shiro/65">{t('pricing.body')}</p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3">
          {fixed.map((p, i) => (
            <PlanCard key={p.id} plan={p} index={i} />
          ))}
        </div>

        <h3 className="mt-16 text-center font-display text-sm uppercase tracking-[0.3em] text-straw">{t('pricing.quotedTitle')}</h3>
        <div className="mx-auto mt-6 grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
          {quoted.map((p, i) => (
            <PlanCard key={p.id} plan={p} index={i} />
          ))}
        </div>

        <Reveal>
          <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-shiro/10 bg-night-2/70">
            <p className="border-b border-shiro/10 px-6 py-4 font-display text-sm uppercase tracking-[0.25em] text-straw">
              {t('pricing.addOnsTitle')}
            </p>
            {ADD_ONS.map((a) => (
              <div key={a} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-shiro/5 px-6 py-4 last:border-0">
                <span className="text-sm text-shiro/80">{t(`pricing.addOns.${a}.name`)}</span>
                <span className="font-display text-sm tracking-wide text-shiro">{t(`pricing.addOns.${a}.price`)}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-shiro/50">
          {t('pricing.vatNote')} {t('pricing.terms')}
        </p>
      </div>
    </section>
  )
}
