import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { MouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Reveal, SectionHeading } from '../showcase/Section'

const EXAMPLE_SITE = (import.meta.env.VITE_EXAMPLE_SITE_URL as string | undefined) ?? 'https://kimeclub.onrender.com'
const HUB = 'hub.tatamistudio.net'

// Card that tilts toward the pointer, like lifting a print off the table.
function TiltCard({ children, className }: { children: ReactNode; className: string }) {
  const reduced = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 })

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function BrowserBar({ url, dark }: { url: string; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 ${dark ? 'bg-night' : 'bg-surface'}`}>
      <span className="h-2 w-2 rounded-full bg-aka/70" />
      <span className="h-2 w-2 rounded-full bg-kin/70" />
      <span className="h-2 w-2 rounded-full bg-jade/70" />
      <span
        className={`ml-2 truncate rounded px-2 py-0.5 font-mono text-[10px] ${
          dark ? 'bg-shiro/5 text-shiro/50' : 'bg-shiro text-muted'
        }`}
      >
        {url.replace('https://', '')}
      </span>
    </div>
  )
}

export function Examples() {
  const { t } = useTranslation()

  return (
    <section id="examples" className="scroll-mt-16 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="見" title={t('examples.title')} tone="aka" inverted />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg text-shiro/65">{t('examples.body')}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <TiltCard className="h-full overflow-hidden rounded-2xl bg-kuro text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <BrowserBar url={EXAMPLE_SITE} />
              {/* Miniature of the Kime landing: emblem lockup over paper. */}
              <div className="relative h-44 overflow-hidden border-b border-line bg-kuro">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(closest-side, rgba(194,54,31,0.25), transparent), radial-gradient(circle at 80% 20%, rgba(31,51,82,0.2), transparent 50%)',
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink font-brush text-2xl">
                    極
                  </span>
                  <span className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.4em]">Kime</span>
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted">Karate Club</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold uppercase tracking-wide">{t('examples.kime.title')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t('examples.kime.desc')}</p>
                <div className="mt-4 rounded-xl border border-line bg-shiro px-4 py-3 text-xs">
                  <p className="font-display uppercase tracking-wide text-muted">{t('examples.kime.demo')}</p>
                  <p className="mt-1 font-mono text-ink">student1@kime.demo</p>
                  <p className="font-mono text-ink">KimeStudentDemo!2026</p>
                </div>
                <a
                  href={EXAMPLE_SITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 font-display text-xs uppercase tracking-wider text-shiro transition-transform hover:-translate-y-0.5"
                >
                  {t('examples.kime.cta')} ↗
                </a>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.12}>
            <TiltCard className="h-full overflow-hidden rounded-2xl border border-shiro/10 bg-night-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <BrowserBar url={HUB} dark />
              {/* Miniature of the Hub: stat tiles and club rows. */}
              <div className="h-44 space-y-2 border-b border-shiro/10 bg-night p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['bg-jade', '12'],
                    ['bg-aka', '2'],
                    ['bg-straw', '99 €'],
                  ].map(([accent, value], i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12 }}
                      className="relative overflow-hidden rounded-md border border-shiro/10 bg-night-2 px-3 py-2"
                    >
                      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
                      <p className="font-display text-lg text-shiro">{value}</p>
                    </motion.div>
                  ))}
                </div>
                {['Kime Karate Club', t('examples.hub.yourClub')].map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center justify-between rounded-md border border-shiro/10 bg-night-2 px-3 py-1.5 text-[11px]"
                  >
                    <span className="text-shiro/80">{name}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${i === 1 ? 'bg-kin' : 'bg-jade'}`} />
                  </motion.div>
                ))}
              </div>
              <div className="p-6">
                <h3 className="flex items-center gap-2 font-display text-xl font-semibold uppercase tracking-wide text-shiro">
                  <span className="rounded bg-aka px-1.5 py-0.5 font-brush text-sm text-shiro">畳</span>
                  {t('examples.hub.title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-shiro/60">{t('examples.hub.desc')}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-shiro/40">{t('examples.hub.note')}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-shiro/15 px-6 py-3 font-display text-xs uppercase tracking-wider text-shiro/50">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-straw" />
                  {t('examples.hub.cta')}
                </span>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
