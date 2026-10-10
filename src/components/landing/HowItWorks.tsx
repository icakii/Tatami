import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal, SectionHeading } from '../showcase/Section'

const STEPS = [
  { key: 'order', num: '一' },
  { key: 'build', num: '二' },
  { key: 'members', num: '三' },
  { key: 'care', num: '四' },
] as const

// Scroll-driven timeline: a straw line fills down the rail and each step's
// numeral lights up as the line reaches it.
export function HowItWorks() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  const [reached, setReached] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setReached(Math.floor(v * STEPS.length + 0.35)))

  return (
    <section id="how" className="scroll-mt-16 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kanji="道" title={t('how.title')} tone="kin" inverted />

        <div ref={ref} className="relative mt-16">
          <div className="absolute bottom-6 left-7 top-6 w-px bg-shiro/10 sm:left-1/2" />
          <motion.div
            className="absolute bottom-6 left-7 top-6 w-px origin-top bg-linear-to-b from-straw via-straw to-aka sm:left-1/2"
            style={{ scaleY: fill }}
          />

          <ol className="space-y-12">
            {STEPS.map((step, i) => {
              const lit = reached > i
              const right = i % 2 === 1
              return (
                <li key={step.key} className="relative grid items-center gap-6 pl-20 sm:grid-cols-2 sm:pl-0">
                  <span
                    className={`absolute left-0 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border font-brush text-2xl transition-all duration-500 sm:left-1/2 sm:-translate-x-1/2 ${
                      lit
                        ? 'scale-110 border-straw bg-straw text-night shadow-[0_0_30px_-4px_rgba(217,182,107,0.7)]'
                        : 'border-shiro/15 bg-night-2 text-shiro/40'
                    }`}
                  >
                    {step.num}
                  </span>
                  <Reveal
                    y={20}
                    className={`${right ? 'sm:col-start-2 sm:pl-14' : 'sm:pr-14 sm:text-right'}`}
                  >
                    <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-shiro">
                      {t(`how.steps.${step.key}.title`)}
                    </h3>
                    <p className="mt-2 leading-relaxed text-shiro/60">{t(`how.steps.${step.key}.desc`)}</p>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
