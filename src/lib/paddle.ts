// Sandbox catalog IDs (TatamiHub scripts/seed-paddle-catalog.ts,
// seed-paddle-domain-addon.ts and seed-paddle-plans.ts). Swap for live IDs
// when going live. All prices include VAT.

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

export const PLANS: Plan[] = [
  {
    id: 'site',
    setup: 250,
    monthly: 29,
    quoted: false,
    setupPriceId: 'pri_01m4rt4kfab1wgvbedff085dhw',
    monthlyPriceId: 'pri_01m4rt4ktq4p9313ea6x4qnz5y',
  },
  {
    id: 'club',
    setup: 350,
    monthly: 99,
    quoted: false,
    setupPriceId: 'pri_01m4rt4m419vtj6qp5348qk1x0',
    monthlyPriceId: 'pri_01m4gns82gsevvr8dn491mq5xh',
  },
  {
    id: 'club_pro',
    setup: 650,
    monthly: 149,
    quoted: false,
    setupPriceId: 'pri_01m4rt4md82qyyrkevr1c806na',
    monthlyPriceId: 'pri_01m4rt4mnvppztqrxa0cn9pqea',
  },
  { id: 'store', setup: 800, monthly: 79, quoted: true },
  { id: 'custom', setup: 1500, monthly: 149, quoted: true },
]

export const planById = (id: string | null | undefined): Plan =>
  PLANS.find((p) => p.id === id) ?? PLANS[1]

export const PADDLE_DOMAIN_PRICE_ID = 'pri_01m4kn78jwx9r5bet4ys86y2jv'
export const DOMAIN_EUR = 10

// Contact addresses shown on the site, in display order.
export const CONTACT_EMAILS = ['deividantonov@gmail.com', 'hristo@varbanov.eu']
