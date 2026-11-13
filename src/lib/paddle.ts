// Paddle catalogue. VITE_PADDLE_ENV picks the account: 'sandbox' (test
// cards) or 'production' (real money). Sandbox IDs come from the TatamiHub
// seed-paddle-*.ts scripts; production IDs from scripts/paddle-go-live.ts.
// All prices include VAT.

export type PlanId = 'site' | 'club' | 'club_pro' | 'store' | 'custom'

export interface Plan {
  id: PlanId
  setup: number
  monthly: number
  // Quoted plans show "from" prices and can only be ordered as an inquiry.
  quoted: boolean
  setupPriceId?: string
  monthlyPriceId?: string
}

type Ids = { setup: string; monthly: string }
type Catalogue = { site: Ids; club: Ids; club_pro: Ids; domain: string }

const PRICE_IDS: Record<'sandbox' | 'production', Catalogue> = {
  sandbox: {
    site: { setup: 'pri_01m4rt4kfab1wgvbedff085dhw', monthly: 'pri_01m4rt4ktq4p9313ea6x4qnz5y' },
    // Monthly is the 110 EUR price (seed-paddle-club-110.ts); the old 99 EUR one is archived.
    club: { setup: 'pri_01m4rt4m419vtj6qp5348qk1x0', monthly: 'pri_01m5g58xhs8kr2tjrpnt8yg3fw' },
    club_pro: { setup: 'pri_01m4rt4md82qyyrkevr1c806na', monthly: 'pri_01m4rt4mnvppztqrxa0cn9pqea' },
    domain: 'pri_01m4kn78jwx9r5bet4ys86y2jv',
  },
  // Paste the output of scripts/paddle-go-live.ts here. While empty, live
  // checkout stays off (orders can still be sent as inquiries).
  production: {
    site: { setup: '', monthly: '' },
    club: { setup: '', monthly: '' },
    club_pro: { setup: '', monthly: '' },
    domain: '',
  },
}

export const PADDLE_ENV: 'sandbox' | 'production' = import.meta.env.VITE_PADDLE_ENV === 'production' ? 'production' : 'sandbox'
const ids = PRICE_IDS[PADDLE_ENV]
const orUndefined = (id: string) => id || undefined

export const PLANS: Plan[] = [
  { id: 'site', setup: 250, monthly: 29, quoted: false, setupPriceId: orUndefined(ids.site.setup), monthlyPriceId: orUndefined(ids.site.monthly) },
  { id: 'club', setup: 350, monthly: 110, quoted: false, setupPriceId: orUndefined(ids.club.setup), monthlyPriceId: orUndefined(ids.club.monthly) },
  { id: 'club_pro', setup: 650, monthly: 149, quoted: false, setupPriceId: orUndefined(ids.club_pro.setup), monthlyPriceId: orUndefined(ids.club_pro.monthly) },
  { id: 'store', setup: 800, monthly: 79, quoted: true },
  { id: 'custom', setup: 1500, monthly: 149, quoted: true },
]

export const planById = (id: string | null | undefined): Plan =>
  PLANS.find((p) => p.id === id) ?? PLANS[1]

export const PADDLE_DOMAIN_PRICE_ID = ids.domain
export const DOMAIN_EUR = 10

// Contact addresses shown on the site, in display order.
export const CONTACT_EMAILS = ['deividantonov@gmail.com', 'hristo@varbanov.eu']
