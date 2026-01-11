'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Phone, Mail, Clock, DollarSign, MoreVertical } from 'lucide-react'
import { Site } from '@/types/database'
import { formatCurrency } from '@/lib/utils'

interface SiteCardProps {
  site: Site
  actualHours?: number
  onClick?: () => void
}

export function SiteCard({ site, actualHours, onClick }: SiteCardProps) {
  const getFrequencyLabel = (frequency: string | null) => {
    switch (frequency) {
      case 'daily':
        return 'Daily'
      case 'weekly':
        return 'Weekly'
      case 'biweekly':
        return 'Bi-weekly'
      case 'monthly':
        return 'Monthly'
      default:
        return 'Not set'
    }
  }

  const profitMargin = site.budget_hours && actualHours
    ? ((site.budget_hours - actualHours) / site.budget_hours) * 100
    : null

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{site.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{site.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={site.is_active ? 'success' : 'default'} size="sm">
            {site.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {site.client_name && (
        <div className="mb-3 pb-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">{site.client_name}</p>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            {site.client_phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {site.client_phone}
              </span>
            )}
            {site.client_email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {site.client_email}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Service Frequency</p>
          <p className="text-sm font-medium text-gray-900">
            {getFrequencyLabel(site.service_frequency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Budget Hours</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {site.budget_hours ? `${site.budget_hours}h` : 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {site.budget_hours && actualHours !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Profitability</span>
            <div className="flex items-center gap-2">
              <DollarSign
                className={`h-4 w-4 ${
                  profitMargin && profitMargin >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  profitMargin && profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {profitMargin !== null ? `${profitMargin >= 0 ? '+' : ''}${profitMargin.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${profitMargin && profitMargin >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{
                width: `${Math.min(Math.abs(profitMargin || 0) + 50, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Actual: {actualHours.toFixed(1)}h</span>
            <span>Budget: {site.budget_hours}h</span>
          </div>
        </div>
      )}
    </Card>
  )
}
