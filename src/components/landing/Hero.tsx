import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

// A classic 4.5-mat room seen from above: four full mats in a pinwheel
// around a half mat. Units are thirds of the square; `dx/dy` is the
// direction each mat drifts as the hero scrolls away.
const MATS = [
  { x: 0, y: 0, w: 2, h: 1, dx: -1, dy: -1 },
  { x: 2, y: 0, w: 1, h: 2, dx: 1, dy: -1 },
  { x: 1, y: 2, w: 2, h: 1, dx: 1, dy: 1 },
  { x: 0, y: 1, w: 1, h: 2, dx: -1, dy: 1 },
] as const

function Mat({
  mat,
  index,
  spread,
  reduced,
}: {
  mat: (typeof MATS)[number]
  index: number
  spread: MotionValue<number>
  reduced: boolean
}) {
  const horizontal = mat.w > mat.h
  const x = useTransform(spread, (s) => s * mat.dx * 26)
  const y = useTransform(spread, (s) => s * mat.dy * 26)

  return (
    <motion.div
      className="absolute p-[3px]"
      style={{
        left: `${(mat.x / 3) * 100}%`,
        top: `${(mat.y / 3) * 100}%`,
        width: `${(mat.w / 3) * 100}%`,
        height: `${(mat.h / 3) * 100}%`,
        x,
        y,
      }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, rotateX: horizontal ? 75 : 0, rotateY: horizontal ? 0 : 75, scale: 0.85 }}
        animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.25 + index * 0.16 }}
        className="relative h-full w-full overflow-hidden rounded-[3px] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
        style={{
          background: 'linear-gradient(135deg, #cdb67a, #b59a5c 55%, #a88d52)',
          transformPerspective: 800,
        }}
      >
        {/* Igusa weave running along the mat's long side. */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `repeating-linear-gradient(${horizontal ? '90deg' : '0deg'}, rgba(80,60,20,0.18) 0 1px, transparent 1px 4px)`,
          }}
        />
        {/* Heri: the cloth binding on the two long edges. */}
        <div
          className={`absolute bg-ai ${horizontal ? 'inset-x-0 top-0 h-[9%]' : 'inset-y-0 left-0 w-[9%]'}`}
        />
        <div
          className={`absolute bg-ai ${horizontal ? 'inset-x-0 bottom-0 h-[9%]' : 'inset-y-0 right-0 w-[9%]'}`}
        />
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })
  const spread = useTransform(smooth, [0, 1], [0, reduced ? 0 : 3])
  const turn = useTransform(smooth, [0, 1], [0, reduced ? 0 : 12])
  const copyY = useTransform(smooth, [0, 1], [0, reduced ? 0 : 120])
  const copyOpacity = useTransform(smooth, [0, 0.7], [1, 0])

  return (
    <section ref={ref} id="top" className="relative overflow-hidden px-5 pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[70vmin] w-[70vmin] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(194,54,31,0.22), transparent)' }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[60vmin] w-[60vmin] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(217,182,107,0.16), transparent)' }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-straw"
          >
            <span className="h-px w-10 bg-straw/60" />
            {t('hero.eyebrow')}
          </motion.p>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] tracking-wide text-shiro sm:text-5xl lg:text-6xl">
            {t('hero.title')
              .split(' ')
              .map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={reduced ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.06 }}
                  >
                    {word}&nbsp;
                  </motion.span>
                </span>
              ))}
          </h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-shiro/70"
          >
            {t('hero.body')}
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/order"
              className="rounded-full bg-aka px-7 py-3.5 font-display text-sm uppercase tracking-wider text-shiro shadow-[0_14px_30px_-12px_rgba(194,54,31,0.9)] transition-transform hover:-translate-y-0.5"
            >
              {t('hero.ctaOrder')}
            </Link>
            <a
              href="#examples"
              className="rounded-full border border-shiro/20 px-7 py-3.5 font-display text-sm uppercase tracking-wider text-shiro/85 transition-colors hover:border-straw hover:text-straw"
            >
              {t('hero.ctaExample')}
            </a>
          </motion.div>
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-5 text-sm text-shiro/45"
          >
            {t('hero.note')}
          </motion.p>
        </motion.div>

        <motion.div style={{ rotate: turn }} className="relative mx-auto aspect-square w-full max-w-[26rem]">
          {MATS.map((mat, i) => (
            <Mat key={i} mat={mat} index={i} spread={spread} reduced={reduced} />
          ))}
          {/* Center half mat with the seal stamped onto it. */}
          <div className="absolute p-[3px]" style={{ left: '33.333%', top: '33.333%', width: '33.333%', height: '33.333%' }}>
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
              className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[3px]"
              style={{ background: 'linear-gradient(135deg, #c4ab6e, #a98f55)' }}
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(80,60,20,0.18) 0 1px, transparent 1px 4px)' }}
              />
              <motion.span
                initial={reduced ? false : { scale: 2.6, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 1.35 }}
                className="relative rounded-md bg-aka px-3 py-2 font-brush text-5xl leading-none text-shiro shadow-[0_10px_24px_-8px_rgba(120,20,10,0.9)] sm:text-6xl"
              >
                畳
              </motion.span>
            </motion.div>
          </div>
          {/* Light sweeping across the mats. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
            <div className="mat-sheen absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-shiro/15 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
