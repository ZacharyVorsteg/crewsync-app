'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AlertCircle, Clock, MapPinOff, ArrowRight, X, Bell } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AlertWithRelations } from '@/types/database'

interface AlertsPanelProps {
  alerts: AlertWithRelations[]
  onDismiss?: (alertId: string) => void
}

export function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const visibleAlerts = alerts.filter((a) => !dismissedIds.includes(a.id))

  const handleDismiss = (alertId: string) => {
    setDismissedIds([...dismissedIds, alertId])
    onDismiss?.(alertId)
  }

  const getAlertIcon = (type: string | null) => {
    switch (type) {
      case 'no_show':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'late_arrival':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'off_site_clockin':
        return <MapPinOff className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertBadge = (type: string | null) => {
    switch (type) {
      case 'no_show':
        return <Badge variant="danger" size="sm">No Show</Badge>
      case 'late_arrival':
        return <Badge variant="warning" size="sm">Late</Badge>
      case 'off_site_clockin':
        return <Badge variant="warning" size="sm">Off-Site</Badge>
      default:
        return <Badge variant="default" size="sm">Alert</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Alerts</CardTitle>
          {visibleAlerts.length > 0 && (
            <span className="h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {visibleAlerts.length}
            </span>
          )}
        </div>
        <Link
          href="/dashboard?tab=alerts"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {visibleAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No active alerts</p>
            <p className="text-sm mt-1">Everything is running smoothly</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getAlertBadge(alert.type)}
                    <span className="text-xs text-gray-500">
                      {formatDate(alert.created_at, 'time')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  {alert.site && (
                    <p className="text-xs text-gray-500 mt-1">
                      Site: {alert.site.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {visibleAlerts.length > 5 && (
              <Link
                href="/dashboard?tab=alerts"
                className="block text-center text-sm text-blue-600 hover:underline py-2"
              >
                View {visibleAlerts.length - 5} more alerts
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
