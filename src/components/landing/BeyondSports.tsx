import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Reveal, SectionHeading } from '../showcase/Section'

// The "it's not only for karate" section: what else we build, each card with
// its own kanji stamp.
const CARDS = [
  { key: 'bookings', kanji: '約', tone: 'bg-ai' },
  { key: 'gyms', kanji: '力', tone: 'bg-aka' },
  { key: 'schools', kanji: '学', tone: 'bg-jade' },
  { key: 'restaurants', kanji: '食', tone: 'bg-kin' },
  { key: 'events', kanji: '祭', tone: 'bg-aka' },
  { key: 'internal', kanji: '社', tone: 'bg-ai' },
  { key: 'stores', kanji: '店', tone: 'bg-jade' },
  { key: 'content', kanji: '写', tone: 'bg-kin' },
] as const

export function BeyondSports() {
  const { t } = useTranslation()

  return (
    <section id="services" className="relative scroll-mt-16 overflow-hidden px-5 py-20 sm:py-28">
      <span
        className="pointer-events-none absolute -right-10 top-10 font-brush text-[22rem] leading-none text-straw/[0.04]"
        aria-hidden="true"
      >
        外
      </span>
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading kanji="外" title={t('beyond.title')} tone="ai" inverted />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-shiro/65">{t('beyond.body')}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.key} delay={(i % 4) * 0.07}>
              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="group relative h-full overflow-hidden rounded-2xl border border-shiro/10 bg-night-2/70 p-6 transition-colors hover:border-straw/40"
              >
                <motion.span
                  variants={{ rest: { rotate: -6, scale: 1 }, hover: { rotate: 4, scale: 1.12 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                  className={`inline-block rounded-md px-2 py-1.5 font-brush text-xl leading-none text-shiro shadow-md ${c.tone}`}
                >
                  {c.kanji}
                </motion.span>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase tracking-wide text-shiro">
                  {t(`beyond.cards.${c.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-shiro/60">{t(`beyond.cards.${c.key}.desc`)}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 text-center">
            <Link
              to="/order?plan=custom"
              className="inline-flex rounded-full border border-straw/50 px-8 py-3.5 font-display text-sm uppercase tracking-wider text-straw transition-colors hover:bg-straw hover:text-night"
            >
              {t('beyond.cta')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
