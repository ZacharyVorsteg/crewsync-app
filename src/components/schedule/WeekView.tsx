'use client'

import { useMemo } from 'react'
import { useDrop } from 'react-dnd'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { ShiftCard } from './ShiftCard'
import { ScheduleWithRelations } from '@/types/database'
import { Plus } from 'lucide-react'

interface WeekViewProps {
  currentDate: Date
  schedules: ScheduleWithRelations[]
  onShiftClick?: (schedule: ScheduleWithRelations) => void
  onSlotClick?: (date: Date) => void
  onDrop?: (scheduleId: string, newDate: Date) => void
}

interface DayColumnProps {
  date: Date
  schedules: ScheduleWithRelations[]
  isToday: boolean
  onShiftClick?: (schedule: ScheduleWithRelations) => void
  onSlotClick?: (date: Date) => void
  onDrop?: (scheduleId: string, newDate: Date) => void
}

function DayColumn({
  date,
  schedules,
  isToday,
  onShiftClick,
  onSlotClick,
  onDrop,
}: DayColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'SHIFT',
    drop: (item: { id: string }) => {
      onDrop?.(item.id, date)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        'flex-1 min-w-[140px] border-r border-gray-200 last:border-r-0',
        isOver && 'bg-blue-50'
      )}
    >
      {/* Day header */}
      <div
        className={cn(
          'sticky top-0 bg-white border-b border-gray-200 p-3 text-center',
          isToday && 'bg-blue-50'
        )}
      >
        <p className={cn('text-xs font-medium', isToday ? 'text-blue-600' : 'text-gray-500')}>
          {format(date, 'EEE')}
        </p>
        <p
          className={cn(
            'text-lg font-bold',
            isToday ? 'text-blue-600' : 'text-gray-900'
          )}
        >
          {format(date, 'd')}
        </p>
      </div>

      {/* Shifts */}
      <div className="p-2 space-y-2 min-h-[400px]">
        {schedules.length === 0 ? (
          <button
            onClick={() => onSlotClick?.(date)}
            className="w-full h-20 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add shift</span>
          </button>
        ) : (
          <>
            {schedules.map((schedule) => (
              <ShiftCard
                key={schedule.id}
                schedule={schedule}
                onClick={() => onShiftClick?.(schedule)}
                compact
              />
            ))}
            <button
              onClick={() => onSlotClick?.(date)}
              className="w-full py-2 text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function WeekView({
  currentDate,
  schedules,
  onShiftClick,
  onSlotClick,
  onDrop,
}: WeekViewProps) {
  const today = new Date()
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(weekStart, i)
      return {
        date,
        schedules: schedules.filter((s) =>
          isSameDay(new Date(s.scheduled_date), date)
        ),
        isToday: isSameDay(date, today),
      }
    })
  }, [weekStart, schedules, today])

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex overflow-x-auto">
        {days.map((day) => (
          <DayColumn
            key={day.date.toISOString()}
            date={day.date}
            schedules={day.schedules}
            isToday={day.isToday}
            onShiftClick={onShiftClick}
            onSlotClick={onSlotClick}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  )
}
