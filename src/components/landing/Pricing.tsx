import { animate, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MONTHLY_EUR } from '../../lib/paddle'
import { Reveal, SectionHeading } from '../showcase/Section'

const DOMAINS = ['subdomain', 'own', 'new'] as const

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{value}</span>
}

export function Pricing() {
  const { t } = useTranslation()
  const features = t('pricing.features', { returnObjects: true }) as string[]

  return (
    <section id="pricing" className="scroll-mt-16 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading kanji="価" title={t('pricing.title')} tone="kin" inverted />

        <Reveal delay={0.1}>
          <div className="relative mt-14 overflow-hidden rounded-3xl border border-straw/25 bg-night-2 p-8 shadow-[0_50px_100px_-50px_rgba(217,182,107,0.35)] sm:p-12">
            <span
              className="pointer-events-none absolute -right-6 -top-10 font-brush text-[14rem] leading-none text-straw/5"
              aria-hidden="true"
            >
              畳
            </span>
            <div className="relative grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
              <div>
                <p className="font-display text-7xl font-bold leading-none text-shiro sm:text-8xl">
                  <CountUp to={MONTHLY_EUR} />
                  <span className="ml-1 text-4xl text-straw">€</span>
                </p>
                <p className="mt-2 font-display text-sm uppercase tracking-[0.25em] text-shiro/50">{t('pricing.per')}</p>
                <Link
                  to="/order"
                  className="mt-8 inline-flex rounded-full bg-aka px-8 py-3.5 font-display text-sm uppercase tracking-wider text-shiro shadow-[0_14px_30px_-12px_rgba(194,54,31,0.9)] transition-transform hover:-translate-y-0.5"
                >
                  {t('pricing.cta')}
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-3 text-sm text-shiro/80"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jade text-[11px] text-shiro">
                      ✓
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <h3 className="mt-14 text-center font-display text-sm uppercase tracking-[0.3em] text-straw">
          {t('pricing.domainTitle')}
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {DOMAINS.map((d, i) => (
            <Reveal key={d} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-shiro/10 bg-night-2/70 p-6 transition-colors hover:border-straw/40">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-straw">{t(`pricing.domains.${d}.price`)}</p>
                <p className="mt-2 font-display text-lg font-semibold uppercase tracking-wide text-shiro">
                  {t(`pricing.domains.${d}.title`)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-shiro/55">{t(`pricing.domains.${d}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-shiro/50">{t('pricing.terms')}</p>
      </div>
    </section>
  )
}
