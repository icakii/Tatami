import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { PADDLE_DOMAIN_PRICE_ID, planById, type PlanId } from '../lib/paddle'
import { supabase } from '../lib/supabaseClient'

export type DomainOption = 'subdomain' | 'own' | 'new'

export interface Order {
  id: string
  club_name: string
  plan: PlanId
  contact_name: string
  email: string
  domain_option: DomainOption
  domain: string | null
  status: 'inquiry' | 'pending_payment' | 'paid' | 'in_progress' | 'live' | 'cancelled'
  paid_until: string | null
  cancel_at: string | null
  created_at: string
}

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, club_name, plan, contact_name, email, domain_option, domain, status, paid_until, cancel_at, created_at')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Order[]
    },
    enabled: !!userId,
  })
}

export interface NewOrder {
  contact_name: string
  email: string
  phone: string | null
  club_name: string
  city: string | null
  student_count: number | null
  domain_option: DomainOption
  domain: string | null
  notes: string | null
  status: 'inquiry' | 'pending_payment'
  plan: PlanId
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (order: NewOrder): Promise<string> => {
      const { data, error } = await supabase
        .from('orders')
        .insert({ ...order, terms_accepted_at: new Date().toISOString() })
        .select('id')
        .single()
      if (error) throw error
      return data.id as string
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase.functions.invoke('cancel-order', { body: { order_id: orderId } })
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
}

// Paddle.js loaded once per page. `onCompleted` fires when the overlay
// reports a successful payment; the webhook updates the order shortly after.
export function usePaddle(onCompleted: () => void) {
  const [paddle, setPaddle] = useState<Paddle | null>(null)

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined
    const environment = import.meta.env.VITE_PADDLE_ENV as 'sandbox' | 'production' | undefined
    if (!token || !environment) return
    initializePaddle({
      token,
      environment,
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') onCompleted()
      },
    }).then((p) => p && setPaddle(p))
    // onCompleted is captured once on purpose: Paddle keeps the first callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Setup fee (one-off) + first month (+ domain add-on), all in one checkout;
  // Paddle charges the one-off price once and renews the monthly ones.
  function openCheckout(order: { id: string; email: string; domain_option: DomainOption; plan: PlanId }) {
    const plan = planById(order.plan)
    if (!plan.setupPriceId || !plan.monthlyPriceId) return
    paddle?.Checkout.open({
      items: [
        { priceId: plan.setupPriceId, quantity: 1 },
        { priceId: plan.monthlyPriceId, quantity: 1 },
        ...(order.domain_option === 'new' ? [{ priceId: PADDLE_DOMAIN_PRICE_ID, quantity: 1 }] : []),
      ],
      customer: { email: order.email },
      customData: { order_id: order.id },
    })
  }

  return { ready: !!paddle, openCheckout }
}
