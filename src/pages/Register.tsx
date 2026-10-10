import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthShell, FormError, inputClass, labelClass, primaryButton } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { safeNext } from './Login'

export function Register() {
  const { t } = useTranslation()
  const { signUp, session } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  if (session) return <Navigate to={next} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) return setError(t('auth.errors.short'))
    if (!accepted) return setError(t('auth.errors.terms'))
    setBusy(true)
    setError(null)
    const { error, needsConfirmation } = await signUp(email.trim(), password, name.trim())
    setBusy(false)
    if (error) setError(error)
    else if (needsConfirmation) setCheckEmail(true)
    else navigate(next, { replace: true })
  }

  if (checkEmail) {
    return (
      <AuthShell title={t('auth.registerTitle')}>
        <p className="mt-6 leading-relaxed text-shiro/70">{t('auth.checkEmail')}</p>
        <Link to="/login" className={`${primaryButton} mt-7 flex items-center justify-center`}>
          {t('auth.login')}
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={t('auth.registerTitle')}>
      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <label className="block">
          <span className={labelClass}>{t('auth.name')}</span>
          <input required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>{t('auth.email')}</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>{t('auth.password')}</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <span className="mt-1.5 block text-xs text-shiro/40">{t('auth.passwordHint')}</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-shiro/65">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-aka"
          />
          <span>
            {t('auth.acceptTerms')} (
            <Link to="/terms" target="_blank" className="text-straw hover:underline">
              {t('footer.terms')}
            </Link>
            ,{' '}
            <Link to="/privacy" target="_blank" className="text-straw hover:underline">
              {t('footer.privacy')}
            </Link>
            )
          </span>
        </label>
        <FormError message={error} />
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? '...' : t('auth.register')}
        </button>
      </form>
      <p className="mt-6 text-sm text-shiro/50">
        {t('auth.haveAccount')}{' '}
        <Link to={`/login?next=${encodeURIComponent(next)}`} className="text-straw hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </AuthShell>
  )
}
