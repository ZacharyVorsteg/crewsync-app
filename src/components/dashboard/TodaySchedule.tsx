'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ScheduleWithRelations } from '@/types/database'

interface TodayScheduleProps {
  schedules: ScheduleWithRelations[]
}

export function TodaySchedule({ schedules }: TodayScheduleProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
      case 'missed':
        return <Badge variant="danger">Missed</Badge>
      default:
        return <Badge variant="default">Scheduled</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today&apos;s Schedule</CardTitle>
        <Link
          href="/schedule"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No schedules for today</p>
            <Link
              href="/schedule"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Create a schedule
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.slice(0, 5).map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar
                  name={schedule.crew_member?.name || 'Unassigned'}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {schedule.crew_member?.name || 'Unassigned'}
                    </p>
                    {getStatusBadge(schedule.status)}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {schedule.site?.name || 'Unknown site'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {schedule.start_time} - {schedule.end_time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {schedules.length > 5 && (
              <Link
                href="/schedule"
                className="block text-center text-sm text-blue-600 hover:underline py-2"
              >
                View {schedules.length - 5} more
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
