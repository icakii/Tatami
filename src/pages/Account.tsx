import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Footer, Nav } from '../components/Brand'
import { useAuth } from '../hooks/useAuth'
import { useCancelOrder, useOrders, usePaddle, type Order } from '../hooks/useOrders'

const STATUS_STYLE: Record<Order['status'], string> = {
  inquiry: 'bg-ai-soft/20 text-[#a9c1e6] ring-ai-soft/50',
  pending_payment: 'bg-kin/15 text-straw ring-kin/40',
  paid: 'bg-jade/20 text-[#8fd1ac] ring-jade/50',
  in_progress: 'bg-ai-soft/25 text-[#a9c1e6] ring-ai-soft/60',
  live: 'bg-jade/25 text-[#8fd1ac] ring-jade/60',
  cancelled: 'bg-shiro/5 text-shiro/50 ring-shiro/15',
}

export function Account() {
  const { t } = useTranslation()
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const justPaid = params.get('paid') === '1'
  const justAsked = params.get('inquiry') === '1'
  const { data: orders, isLoading } = useOrders(session?.user.id)
  const cancelOrder = useCancelOrder()
  const [confirming, setConfirming] = useState<Order | null>(null)

  const refetchSoon = () => {
    // The webhook lands a moment after Paddle's client event.
    for (const ms of [0, 3000, 8000]) {
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['orders'] }), ms)
    }
  }
  const { ready, openCheckout } = usePaddle(refetchSoon)

  useEffect(() => {
    if (justPaid) refetchSoon()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justPaid])

  return (
    <div className="tatami-weave flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-straw">{session?.user.email}</p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-wide text-shiro">{t('account.title')}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              to="/order"
              className="rounded-full bg-aka px-5 py-2.5 font-display text-xs uppercase tracking-wider text-shiro"
            >
              + {t('account.newOrder')}
            </Link>
            <button
              type="button"
              onClick={async () => {
                await signOut()
                navigate('/')
              }}
              className="rounded-full border border-shiro/15 px-5 py-2.5 font-display text-xs uppercase tracking-wider text-shiro/70 hover:text-straw"
            >
              {t('account.logout')}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {justAsked && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-ai-soft/60 bg-ai/30 px-5 py-4 text-sm text-[#c2d4ee]"
            >
              {t('account.inquiryNote')}
            </motion.p>
          )}
          {justPaid && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-jade/50 bg-jade/15 px-5 py-4 text-sm text-[#a6dcbd]"
            >
              {t('account.paidNote')}
            </motion.p>
          )}
        </AnimatePresence>

        <h2 className="mt-10 font-display text-sm uppercase tracking-[0.25em] text-shiro/50">{t('account.orders')}</h2>
        {isLoading && <p className="mt-4 text-shiro/50">...</p>}
        {!isLoading && orders?.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-shiro/15 p-8 text-center text-shiro/50">
            {t('account.none')}
          </div>
        )}

        <div className="mt-4 space-y-4">
          {orders?.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative overflow-hidden rounded-2xl border border-shiro/10 bg-night-2 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-semibold uppercase tracking-wide text-shiro">{order.club_name}</p>
                  <p className="mt-1 text-sm text-shiro/50">
                    {t(`account.domainOption.${order.domain_option}`)}
                    {order.domain ? ` · ${order.domain}` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide ring-1 ${STATUS_STYLE[order.status]}`}>
                  {t(`account.status.${order.status}`)}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-shiro/10 pt-4 text-sm">
                <div className="text-shiro/60">
                  {order.cancel_at ? (
                    <span className="text-sakura">
                      {t('account.cancelAt')} {order.cancel_at}
                    </span>
                  ) : order.paid_until ? (
                    <span>
                      {t('account.paidUntil')} <span className="text-shiro">{order.paid_until}</span>
                    </span>
                  ) : (
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {order.status === 'pending_payment' && (
                    <button
                      type="button"
                      disabled={!ready}
                      onClick={() => openCheckout(order)}
                      className="rounded-full bg-aka px-5 py-2 font-display text-xs uppercase tracking-wider text-shiro disabled:opacity-50"
                    >
                      {t('account.pay')}
                    </button>
                  )}
                  {order.status !== 'cancelled' && !order.cancel_at && (
                    <button
                      type="button"
                      onClick={() => setConfirming(order)}
                      className="rounded-full border border-shiro/15 px-5 py-2 font-display text-xs uppercase tracking-wider text-shiro/60 hover:border-aka hover:text-sakura"
                    >
                      {order.status === 'inquiry'
                        ? t('account.cancelInquiry')
                        : order.status === 'pending_payment'
                          ? t('account.cancelPending')
                          : t('account.cancel')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirming(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 px-5"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-shiro/10 bg-night-2 p-7"
            >
              <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-shiro">{t('account.cancelTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-shiro/65">
                {confirming.status === 'pending_payment' || confirming.status === 'inquiry'
                  ? t('account.cancelPendingBody')
                  : t('account.cancelBody')}
              </p>
              {cancelOrder.isError && <p className="mt-3 text-sm text-sakura">{t('auth.errors.generic')}</p>}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="min-h-11 rounded-full border border-shiro/15 font-display text-xs uppercase tracking-wider text-shiro/70"
                >
                  {t('account.keep')}
                </button>
                <button
                  type="button"
                  disabled={cancelOrder.isPending}
                  onClick={() =>
                    cancelOrder.mutate(confirming.id, { onSuccess: () => setConfirming(null) })
                  }
                  className="min-h-11 rounded-full bg-aka font-display text-xs uppercase tracking-wider text-shiro disabled:opacity-60"
                >
                  {cancelOrder.isPending ? '...' : t('account.cancelConfirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
