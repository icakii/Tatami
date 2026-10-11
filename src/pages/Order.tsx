import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell, FormError, inputClass, labelClass, primaryButton } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { useCreateOrder, usePaddle, type DomainOption } from '../hooks/useOrders'
import { DOMAIN_EUR, MONTHLY_EUR } from '../lib/paddle'

const DOMAINS: DomainOption[] = ['subdomain', 'own', 'new']

export function Order() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const { ready, openCheckout } = usePaddle(() => navigate('/account?paid=1'))

  const [form, setForm] = useState({
    contact_name: (session?.user.user_metadata?.full_name as string | undefined) ?? '',
    phone: '',
    club_name: '',
    city: '',
    student_count: '',
    domain: '',
    notes: '',
  })
  const [domainOption, setDomainOption] = useState<DomainOption>('subdomain')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = MONTHLY_EUR + (domainOption === 'new' ? DOMAIN_EUR : 0)
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const [mode, setMode] = useState<'inquiry' | 'pay'>('inquiry')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const paying = mode === 'pay'
    if (form.notes.trim().length < 10) return setError(t('order.errors.notes'))
    if (paying && !accepted) return setError(t('order.errors.terms'))
    if (paying && !ready) return setError(t('order.errors.payments'))
    setError(null)
    const email = session?.user.email ?? ''
    try {
      const id = await createOrder.mutateAsync({
        contact_name: form.contact_name.trim(),
        email,
        phone: form.phone.trim() || null,
        club_name: form.club_name.trim(),
        city: form.city.trim() || null,
        student_count: form.student_count ? Number(form.student_count) : null,
        domain_option: domainOption,
        domain: domainOption === 'subdomain' ? null : form.domain.trim().toLowerCase() || null,
        notes: form.notes.trim() || null,
        status: paying ? 'pending_payment' : 'inquiry',
      })
      if (paying) openCheckout({ id, email, domain_option: domainOption })
      else navigate('/account?inquiry=1')
    } catch (err) {
      setError(err instanceof Error && err.message.includes('Too many') ? err.message : t('order.errors.generic'))
    }
  }

  return (
    <AuthShell title={t('order.title')} wide>
      <p className="mt-2 text-shiro/60">{t('order.subtitle')}</p>
      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>{t('order.contactName')}</span>
            <input required maxLength={120} value={form.contact_name} onChange={set('contact_name')} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>{t('order.phone')}</span>
            <input type="tel" maxLength={40} value={form.phone} onChange={set('phone')} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>{t('order.clubName')}</span>
            <input required maxLength={120} value={form.club_name} onChange={set('club_name')} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>{t('order.city')}</span>
            <input maxLength={80} value={form.city} onChange={set('city')} className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>{t('order.students')}</span>
            <input type="number" min={0} max={5000} value={form.student_count} onChange={set('student_count')} className={inputClass} />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>{t('order.notes')}</span>
          <textarea
            rows={5}
            required
            minLength={10}
            maxLength={2000}
            placeholder={t('order.notesPlaceholder')}
            value={form.notes}
            onChange={set('notes')}
            className={`${inputClass} py-3`}
          />
          <span className="mt-2 block rounded-xl border border-straw/20 bg-straw/5 px-4 py-3 text-xs leading-relaxed text-shiro/60">
            {t('order.extrasNote')}
          </span>
        </label>

        <fieldset>
          <legend className={labelClass}>{t('pricing.domainTitle')}</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {DOMAINS.map((d) => {
              const active = domainOption === d
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDomainOption(d)}
                  aria-pressed={active}
                  className={`relative rounded-2xl border p-4 pr-9 text-left transition-colors ${
                    active ? 'border-straw bg-straw/10' : 'border-shiro/10 hover:border-shiro/30'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="domain-check"
                      className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-straw text-[11px] text-night"
                    >
                      ✓
                    </motion.span>
                  )}
                  <span className="block font-display text-sm uppercase tracking-wide text-shiro">
                    {t(`pricing.domains.${d}.title`)}
                  </span>
                  <span className="mt-1 block text-xs text-straw">{t(`pricing.domains.${d}.price`)}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        {domainOption !== 'subdomain' && (
          <label className="block">
            <span className={labelClass}>{t('order.domain')}</span>
            <input
              maxLength={120}
              placeholder={t('order.domainPlaceholder')}
              value={form.domain}
              onChange={set('domain')}
              pattern="[A-Za-z0-9.\-]+"
              className={inputClass}
            />
          </label>
        )}

        <div className="flex items-center justify-between rounded-2xl border border-straw/25 bg-night px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-shiro/50">{t('order.summary')}</p>
            <p className="text-xs text-shiro/40">{t('order.firstMonth')}</p>
          </div>
          <motion.p key={total} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-display text-3xl text-shiro">
            {total} <span className="text-straw">€</span>
          </motion.p>
        </div>

        <label className="flex items-start gap-3 text-sm text-shiro/65">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-aka" />
          <span>
            {t('order.acceptTerms')}{' '}
            <Link to="/terms" target="_blank" className="text-straw hover:underline">
              {t('footer.terms')}
            </Link>
          </span>
        </label>

        <FormError message={error} />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="submit"
            onClick={() => setMode('inquiry')}
            disabled={createOrder.isPending}
            className={primaryButton}
          >
            {createOrder.isPending && mode === 'inquiry' ? '...' : t('order.sendInquiry')}
          </button>
          <button
            type="submit"
            onClick={() => setMode('pay')}
            disabled={createOrder.isPending}
            className="min-h-12 w-full rounded-full border border-straw/50 px-6 font-display text-sm uppercase tracking-wider text-straw transition-colors hover:bg-straw hover:text-night disabled:opacity-60"
          >
            {createOrder.isPending && mode === 'pay' ? t('order.processing') : t('order.submit')}
          </button>
        </div>
        <p className="text-center text-xs text-shiro/40">{t('order.inquiryHint')}</p>
      </form>
    </AuthShell>
  )
}
