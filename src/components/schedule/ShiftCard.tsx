'use client'

import { useDrag } from 'react-dnd'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Clock, MapPin, MoreVertical } from 'lucide-react'
import { ScheduleWithRelations } from '@/types/database'

interface ShiftCardProps {
  schedule: ScheduleWithRelations
  onClick?: () => void
  compact?: boolean
}

export function ShiftCard({ schedule, onClick, compact = false }: ShiftCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'SHIFT',
    item: { id: schedule.id, schedule },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300'
      case 'in_progress':
        return 'bg-blue-100 border-blue-300'
      case 'missed':
        return 'bg-red-100 border-red-300'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>
      case 'in_progress':
        return <Badge variant="info" size="sm">In Progress</Badge>
      case 'missed':
        return <Badge variant="danger" size="sm">Missed</Badge>
      default:
        return null
    }
  }

  if (compact) {
    return (
      <div
        ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
        onClick={onClick}
        className={cn(
          'p-2 rounded border cursor-pointer transition-all',
          getStatusColor(schedule.status),
          isDragging ? 'opacity-50' : 'hover:shadow-sm'
        )}
      >
        <div className="flex items-center gap-2">
          <Avatar name={schedule.crew_member?.name || 'U'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {schedule.crew_member?.name || 'Unassigned'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg border cursor-pointer transition-all',
        getStatusColor(schedule.status),
        isDragging ? 'opacity-50' : 'hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar name={schedule.crew_member?.name || 'U'} size="sm" />
          <div>
            <p className="font-medium text-gray-900">
              {schedule.crew_member?.name || 'Unassigned'}
            </p>
            {getStatusBadge(schedule.status)}
          </div>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{schedule.site?.name || 'Unknown site'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span>
            {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
          </span>
        </div>
      </div>

      {schedule.is_recurring && (
        <div className="mt-2">
          <Badge variant="default" size="sm">Recurring</Badge>
        </div>
      )}
    </div>
  )
}
