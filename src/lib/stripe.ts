// Stripe configuration and plan definitions

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 79,
    locations: 10,
  },
  professional: {
    name: 'Professional',
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    price: 149,
    locations: 30,
  },
  growth: {
    name: 'Growth',
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    price: 249,
    locations: 75,
  },
};

export type PlanId = keyof typeof PLANS;
