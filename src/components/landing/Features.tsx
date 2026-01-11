'use client'

import {
  MapPin,
  Bell,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Smartphone,
  Globe,
  Shield,
  BarChart3,
  CheckCircle2,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: MapPin,
    name: 'GPS-Verified Clock-In',
    description:
      'Crew members can only clock in when physically at the job site. Know exactly when your team arrives and leaves.',
  },
  {
    icon: Bell,
    name: 'No-Show Alerts',
    description:
      'Get instant notifications when crew members haven\'t clocked in. Catch problems before your clients do.',
  },
  {
    icon: DollarSign,
    name: 'Job Profitability',
    description:
      'Track labor costs against budget for every site. Know which accounts are making money and which are bleeding it.',
  },
  {
    icon: Calendar,
    name: 'Smart Scheduling',
    description:
      'Drag-and-drop schedule builder with recurring shifts. Assign the right crew to the right sites.',
  },
  {
    icon: Users,
    name: 'Crew Management',
    description:
      'Track certifications, performance metrics, and availability. Build your A-team.',
  },
  {
    icon: Smartphone,
    name: 'Mobile-First App',
    description:
      'Simple, multi-language app for field workers. One-tap clock in/out with site checklists.',
  },
  {
    icon: Globe,
    name: 'Client Portal',
    description:
      'Give clients visibility into their cleaning schedule. Build trust with service transparency.',
  },
  {
    icon: BarChart3,
    name: 'Detailed Reports',
    description:
      'On-time rates, labor hours, profitability by site. Export for payroll in one click.',
  },
]

const painPoints = [
  {
    before: 'Clients calling about missed cleanings',
    after: 'Real-time alerts before clients notice',
  },
  {
    before: 'Time theft and buddy punching',
    after: 'GPS verification at every clock-in',
  },
  {
    before: 'Losing money on some accounts',
    after: 'Know profitability of every site',
  },
  {
    before: 'Chaotic paper schedules',
    after: 'Drag-and-drop digital scheduling',
  },
  {
    before: 'Hours spent on payroll',
    after: 'One-click time report exports',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Pain points section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From Chaos to Control
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            We know the problems because we&apos;ve lived them. CrewSync solves the real
            challenges of running a cleaning operation.
          </p>

          <div className="max-w-3xl mx-auto">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 text-right">
                  <span className="text-gray-400 line-through">{point.before}</span>
                </div>
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-gray-900 font-medium">{point.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features grid */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Crew
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for commercial cleaning companies. No bloat, no complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
