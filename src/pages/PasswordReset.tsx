import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthShell, FormError, inputClass, labelClass, primaryButton } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'

export function ForgotPassword() {
  const { t } = useTranslation()
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    // Same message whether or not the account exists, so the form can't be
    // used to find out who has an account.
    await sendPasswordReset(email.trim())
    setBusy(false)
    setSent(true)
  }

  return (
    <AuthShell title={t('auth.forgot')}>
      {sent ? (
        <p className="mt-6 leading-relaxed text-shiro/70">{t('auth.resetSent')}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className={labelClass}>{t('auth.email')}</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </label>
          <button type="submit" disabled={busy} className={primaryButton}>
            {busy ? '...' : t('auth.sendReset')}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

export function ResetPassword() {
  const { t } = useTranslation()
  const { updatePassword, session } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) return setError(t('auth.errors.short'))
    setBusy(true)
    const { error } = await updatePassword(password)
    setBusy(false)
    if (error) setError(error)
    else setDone(true)
  }

  return (
    <AuthShell title={t('auth.newPassword')}>
      {done ? (
        <>
          <p className="mt-6 text-shiro/70">{t('auth.passwordSaved')}</p>
          <Link to="/account" className={`${primaryButton} mt-6 flex items-center justify-center`}>
            {t('nav.account')}
          </Link>
        </>
      ) : !session ? (
        <p className="mt-6 text-shiro/60">...</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className={labelClass}>{t('auth.newPassword')}</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <FormError message={error} />
          <button type="submit" disabled={busy} className={primaryButton}>
            {busy ? '...' : t('auth.savePassword')}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
