'use client'

import { useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { ScheduleWithRelations } from '@/types/database'
import { Plus } from 'lucide-react'

interface MonthViewProps {
  currentDate: Date
  schedules: ScheduleWithRelations[]
  onDateClick?: (date: Date) => void
  onShiftClick?: (schedule: ScheduleWithRelations) => void
}

export function MonthView({
  currentDate,
  schedules,
  onDateClick,
  onShiftClick,
}: MonthViewProps) {
  const today = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const weeks = useMemo(() => {
    const result: { date: Date; schedules: ScheduleWithRelations[] }[][] = []
    let currentDay = calendarStart
    let week: { date: Date; schedules: ScheduleWithRelations[] }[] = []

    while (currentDay <= calendarEnd) {
      week.push({
        date: currentDay,
        schedules: schedules.filter((s) =>
          isSameDay(new Date(s.scheduled_date), currentDay)
        ),
      })

      if (week.length === 7) {
        result.push(week)
        week = []
      }

      currentDay = addDays(currentDay, 1)
    }

    return result
  }, [calendarStart, calendarEnd, schedules])

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {weeks.flat().map((day, index) => {
          const isCurrentMonth = isSameMonth(day.date, currentDate)
          const isToday = isSameDay(day.date, today)

          return (
            <div
              key={index}
              onClick={() => onDateClick?.(day.date)}
              className={cn(
                'min-h-[100px] p-2 border-b border-r border-gray-200 cursor-pointer transition-colors',
                'last:border-r-0 [&:nth-child(7n)]:border-r-0',
                !isCurrentMonth && 'bg-gray-50',
                isToday && 'bg-blue-50',
                'hover:bg-gray-100'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    !isCurrentMonth && 'text-gray-400',
                    isToday && 'text-blue-600',
                    isCurrentMonth && !isToday && 'text-gray-900'
                  )}
                >
                  {format(day.date, 'd')}
                </span>
                {day.schedules.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {day.schedules.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {day.schedules.slice(0, 3).map((schedule) => (
                  <div
                    key={schedule.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onShiftClick?.(schedule)
                    }}
                    className={cn(
                      'px-2 py-1 rounded text-xs truncate cursor-pointer',
                      schedule.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : schedule.status === 'missed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {schedule.crew_member?.name?.split(' ')[0] || 'Unassigned'} - {schedule.start_time.slice(0, 5)}
                  </div>
                ))}
                {day.schedules.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{day.schedules.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
