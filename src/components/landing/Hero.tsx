'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle, Building2 } from 'lucide-react'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CrewSync</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Trusted by 500+ cleaning companies
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Never Lose Another Client to a{' '}
            <span className="text-blue-600">Missed Cleaning</span>
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            GPS-verified clock-ins, real-time no-show alerts, and job profitability tracking.
            Finally, software built specifically for commercial cleaning operations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Start 14-Day Free Trial
              </Button>
            </Link>
            <a href="#demo" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Watch Demo →
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto max-w-5xl pb-20">
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-gray-50 rounded-lg p-4">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'On-Time Rate', value: '94%', color: 'text-green-600' },
                      { label: 'Active Crew', value: '12', color: 'text-blue-600' },
                      { label: 'Alerts', value: '2', color: 'text-red-600' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-xs text-gray-500">{stat.label}</div>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 h-48">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-green-100 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
