import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AppShowcase } from '../showcase/AppShowcase'
import { CompetitionsShowcase } from '../showcase/CompetitionsShowcase'
import { InstallShowcase } from '../showcase/InstallShowcase'
import { PaymentShowcase } from '../showcase/PaymentShowcase'

// The night page opens onto a sheet of washi: the student-facing app is
// shown on paper, the way the club site itself looks.
export function ShowcaseBand() {
  const { t } = useTranslation()

  return (
    <section id="app" className="relative scroll-mt-16 bg-kuro text-ink">
      {/* Torn-paper top edge. */}
      <svg
        className="absolute -top-px left-0 h-6 w-full -translate-y-full text-kuro"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 24 L0 14 L40 9 L90 16 L150 7 L220 13 L300 5 L360 12 L430 8 L520 15 L600 6 L680 12 L760 4 L840 13 L910 8 L990 15 L1060 7 L1130 12 L1200 9 L1200 24 Z"
        />
      </svg>
      <div className="px-5 pt-20 text-center sm:pt-24">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-xs uppercase text-aka-text"
        >
          {t('band.eyebrow')}
        </motion.p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-wide sm:text-5xl">
          {t('band.title')}
        </h2>
      </div>
      <AppShowcase />
      <InstallShowcase />
      <CompetitionsShowcase />
      <PaymentShowcase />
      <svg
        className="absolute -bottom-px left-0 h-6 w-full translate-y-full rotate-180 text-kuro"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 24 L0 12 L70 7 L140 15 L210 6 L290 13 L370 8 L450 16 L530 5 L610 12 L700 7 L780 14 L860 6 L940 12 L1020 8 L1100 15 L1200 10 L1200 24 Z"
        />
      </svg>
    </section>
  )
}
