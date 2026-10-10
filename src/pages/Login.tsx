import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthShell, FormError, inputClass, labelClass, primaryButton } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'

// Only same-site paths, so ?next= can't bounce someone to another domain.
export function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account'
}

export function Login() {
  const { t } = useTranslation()
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={next} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) setError(error)
    else navigate(next, { replace: true })
  }

  return (
    <AuthShell title={t('auth.loginTitle')}>
      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <label className="block">
          <span className={labelClass}>{t('auth.email')}</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>{t('auth.password')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <FormError message={error} />
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? '...' : t('auth.login')}
        </button>
      </form>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link to="/forgot-password" className="text-shiro/50 hover:text-straw">
          {t('auth.forgot')}
        </Link>
        <span className="text-shiro/50">
          {t('auth.noAccount')}{' '}
          <Link to={`/register?next=${encodeURIComponent(next)}`} className="text-straw hover:underline">
            {t('auth.register')}
          </Link>
        </span>
      </div>
    </AuthShell>
  )
}
