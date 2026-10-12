import { useTranslation } from 'react-i18next'

// Two endless strips under the hero, running opposite ways: sports on top,
// every other kind of business underneath. Tatami started on the mat but
// isn't only for it. Pure CSS marquees (each list doubled so the loop has
// no seam).
function Row({ items, reverse, dim }: { items: string[]; reverse?: boolean; dim?: boolean }) {
  const row = [...items, ...items]
  return (
    <div className={`flex w-max items-center gap-10 ${reverse ? 'sports-marquee-reverse' : 'sports-marquee'}`} aria-hidden="true">
      {row.map((item, i) => (
        <span
          key={i}
          className={`flex items-center gap-10 font-display uppercase tracking-[0.3em] ${
            dim ? 'text-base text-straw/60' : 'text-lg text-shiro/70'
          }`}
        >
          {item}
          <span className={`h-1.5 w-1.5 rotate-45 ${dim ? 'bg-straw/50' : 'bg-aka'}`} />
        </span>
      ))}
    </div>
  )
}

export function SportsBand() {
  const { t } = useTranslation()
  const sports = t('sportsBand', { returnObjects: true }) as string[]
  const businesses = t('businessBand', { returnObjects: true }) as string[]

  return (
    <div
      className="relative space-y-3 overflow-hidden border-y border-straw/15 bg-night-2/80 py-5"
      aria-label={[...sports, ...businesses].join(', ')}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-night to-transparent" />
      <Row items={sports} />
      <Row items={businesses} reverse dim />
    </div>
  )
}
