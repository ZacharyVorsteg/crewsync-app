'use client'

import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconColor: string
}

function StatCard({ title, value, change, changeLabel, icon, iconColor }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconColor)}>{icon}</div>
      </div>
    </Card>
  )
}

interface StatsCardsProps {
  onTimeRate: number
  activeCrew: number
  totalCrew: number
  alertsCount: number
  completedToday: number
  scheduledToday: number
}

export function StatsCards({
  onTimeRate,
  activeCrew,
  totalCrew,
  alertsCount,
  completedToday,
  scheduledToday,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="On-Time Rate"
        value={`${onTimeRate}%`}
        change={2.5}
        changeLabel="vs last week"
        icon={<Clock className="h-6 w-6 text-blue-600" />}
        iconColor="bg-blue-100"
      />
      <StatCard
        title="Active Crew"
        value={`${activeCrew}/${totalCrew}`}
        icon={<Users className="h-6 w-6 text-green-600" />}
        iconColor="bg-green-100"
      />
      <StatCard
        title="Alerts"
        value={alertsCount}
        icon={<AlertCircle className="h-6 w-6 text-red-600" />}
        iconColor="bg-red-100"
      />
      <StatCard
        title="Completed Today"
        value={`${completedToday}/${scheduledToday}`}
        icon={<CheckCircle className="h-6 w-6 text-purple-600" />}
        iconColor="bg-purple-100"
      />
    </div>
  )
}
