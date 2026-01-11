'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 79,
    description: 'Perfect for small operations just getting started.',
    features: [
      { name: 'Up to 10 crew members', included: true },
      { name: 'Up to 20 sites', included: true },
      { name: 'GPS clock-in/out', included: true },
      { name: 'Basic scheduling', included: true },
      { name: 'Time tracking reports', included: true },
      { name: 'Email support', included: true },
      { name: 'No-show alerts', included: false },
      { name: 'Client portal', included: false },
      { name: 'Profitability tracking', included: false },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: 149,
    description: 'For growing companies that need more control.',
    features: [
      { name: 'Up to 25 crew members', included: true },
      { name: 'Up to 50 sites', included: true },
      { name: 'GPS clock-in/out', included: true },
      { name: 'Advanced scheduling', included: true },
      { name: 'Time tracking reports', included: true },
      { name: 'Priority support', included: true },
      { name: 'No-show alerts', included: true },
      { name: 'Client portal', included: true },
      { name: 'Profitability tracking', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Growth',
    price: 249,
    description: 'Full-featured platform for serious operations.',
    features: [
      { name: 'Unlimited crew members', included: true },
      { name: 'Unlimited sites', included: true },
      { name: 'GPS clock-in/out', included: true },
      { name: 'Advanced scheduling', included: true },
      { name: 'Time tracking reports', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'No-show alerts', included: true },
      { name: 'Client portal', included: true },
      { name: 'Profitability tracking', included: true },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No hidden fees. No long-term contracts. Start free and upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-sm ${
                plan.popular ? 'ring-2 ring-blue-600' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <Link href="/signup" className="block mt-8">
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={feature.included ? 'text-gray-700' : 'text-gray-400'}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need a custom plan for a large operation?{' '}
            <a href="mailto:sales@crewsync.com" className="text-blue-600 hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
