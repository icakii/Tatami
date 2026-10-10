import { useTranslation } from 'react-i18next'

// Endless strip of sports under the hero: Tatami isn't only for karate.
// Pure CSS marquee (the list is doubled so the loop has no seam).
export function SportsBand() {
  const { t } = useTranslation()
  const sports = t('sportsBand', { returnObjects: true }) as string[]
  const row = [...sports, ...sports]

  return (
    <div className="relative overflow-hidden border-y border-straw/15 bg-night-2/80 py-5" aria-label={sports.join(', ')}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-night to-transparent" />
      <div className="sports-marquee flex w-max items-center gap-10" aria-hidden="true">
        {row.map((sport, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-lg uppercase tracking-[0.3em] text-shiro/70">
            {sport}
            <span className="h-1.5 w-1.5 rotate-45 bg-aka" />
          </span>
        ))}
      </div>
    </div>
  )
}
