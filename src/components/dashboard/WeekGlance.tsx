'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addDays, format, startOfWeek, isSameDay } from 'date-fns'

interface DayData {
  date: Date
  scheduled: number
  completed: number
}

interface WeekGlanceProps {
  weekData: DayData[]
}

export function WeekGlance({ weekData }: WeekGlanceProps) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(weekStart, i)
      const dayData = weekData.find((d) => isSameDay(d.date, date))
      return {
        date,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        scheduled: dayData?.scheduled || 0,
        completed: dayData?.completed || 0,
        isToday: isSameDay(date, today),
        isPast: date < today && !isSameDay(date, today),
      }
    })
  }, [weekData, weekStart, today])

  const maxScheduled = Math.max(...days.map((d) => d.scheduled), 1)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Week at a Glance</CardTitle>
        <Link
          href="/schedule"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          Full schedule <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {days.map((day) => (
            <Link
              key={day.dayNumber}
              href={`/schedule?date=${format(day.date, 'yyyy-MM-dd')}`}
              className={cn(
                'flex-1 rounded-lg p-3 text-center transition-colors',
                day.isToday
                  ? 'bg-blue-50 ring-2 ring-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              )}
            >
              <p
                className={cn(
                  'text-xs font-medium',
                  day.isToday ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                {day.dayName}
              </p>
              <p
                className={cn(
                  'text-lg font-bold mt-1',
                  day.isToday ? 'text-blue-600' : 'text-gray-900'
                )}
              >
                {day.dayNumber}
              </p>

              {/* Bar chart */}
              <div className="mt-3 h-16 flex items-end justify-center gap-1">
                {day.scheduled > 0 ? (
                  <>
                    <div
                      className="w-3 bg-gray-200 rounded-t transition-all"
                      style={{
                        height: `${(day.scheduled / maxScheduled) * 100}%`,
                      }}
                      title={`${day.scheduled} scheduled`}
                    />
                    <div
                      className={cn(
                        'w-3 rounded-t transition-all',
                        day.isPast || day.isToday ? 'bg-green-500' : 'bg-gray-300'
                      )}
                      style={{
                        height: `${(day.completed / maxScheduled) * 100}%`,
                      }}
                      title={`${day.completed} completed`}
                    />
                  </>
                ) : (
                  <div className="text-xs text-gray-400">-</div>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {day.scheduled > 0 ? (
                  <>
                    {day.completed}/{day.scheduled}
                  </>
                ) : (
                  'No jobs'
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
