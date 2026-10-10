import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Account } from './pages/Account'
import { ForgotPassword, ResetPassword } from './pages/PasswordReset'
import { Landing } from './pages/Landing'
import { Privacy, Terms } from './pages/Legal'
import { Login } from './pages/Login'
import { Order } from './pages/Order'
import { Register } from './pages/Register'

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="flex min-h-screen items-center justify-center text-shiro/50">...</div>
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  return <>{children}</>
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { i18n } = useTranslation()
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'bg'
  }, [i18n.resolvedLanguage])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/order"
          element={
            <RequireAuth>
              <Order />
            </RequireAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
