import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT_EMAILS } from '../../lib/paddle'
import { Reveal, SectionHeading } from '../showcase/Section'

export function Faq() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true }) as { q: string; a: string }[]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kanji="問" title={t('faq.title')} tone="ai" inverted />
        <div className="mt-12 divide-y divide-shiro/10 rounded-2xl border border-shiro/10 bg-night-2/70">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base uppercase tracking-wide text-shiro">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-straw/40 text-straw"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 leading-relaxed text-shiro/60">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden px-5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(194,54,31,0.18), transparent)' }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <SectionHeading kanji="話" title={t('contact.title')} tone="aka" inverted />
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg text-shiro/65">{t('contact.body')}</p>
        </Reveal>
        <div className="mt-10 flex flex-col items-center gap-5">
          {CONTACT_EMAILS.map((email, i) => (
            <Reveal key={email} delay={0.2 + i * 0.1}>
              <a
                href={`mailto:${email}`}
                className="group inline-block font-display text-xl tracking-wide text-shiro sm:text-3xl"
              >
                {email}
                <span className="mt-2 block h-0.5 origin-left scale-x-0 bg-straw transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
