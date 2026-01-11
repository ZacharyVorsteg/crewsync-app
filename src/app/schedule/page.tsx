'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { WeekView, MonthView, AssignmentModal } from '@/components/schedule'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { ScheduleWithRelations, Site, CrewMember, Schedule } from '@/types/database'
import { format, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Calendar, Grid3X3 } from 'lucide-react'

type ViewType = 'week' | 'month'

function ScheduleContent() {
  const searchParams = useSearchParams()
  const initialDate = searchParams.get('date')

  const [currentDate, setCurrentDate] = useState(
    initialDate ? new Date(initialDate) : new Date()
  )
  const [view, setView] = useState<ViewType>('week')
  const [schedules, setSchedules] = useState<ScheduleWithRelations[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithRelations | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [companyId, setCompanyId] = useState<string | null>(null)

  const supabase = createClient()
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [currentDate, view])

  const loadData = async () => {
    setIsLoading(true)

    // Get company
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!company) return
    setCompanyId(company.id)

    // Calculate date range
    const rangeStart = view === 'week'
      ? format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      : format(startOfMonth(currentDate), 'yyyy-MM-dd')

    const rangeEnd = view === 'week'
      ? format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      : format(endOfMonth(currentDate), 'yyyy-MM-dd')

    // Load schedules
    const { data: schedulesData } = await supabase
      .from('schedules')
      .select(`
        *,
        site:sites(*),
        crew_member:crew_members(*)
      `)
      .eq('company_id', company.id)
      .gte('scheduled_date', rangeStart)
      .lte('scheduled_date', rangeEnd)
      .order('start_time')

    setSchedules(schedulesData || [])

    // Load sites
    const { data: sitesData } = await supabase
      .from('sites')
      .select('*')
      .eq('company_id', company.id)
      .eq('is_active', true)

    setSites(sitesData || [])

    // Load crew members
    const { data: crewData } = await supabase
      .from('crew_members')
      .select('*')
      .eq('company_id', company.id)
      .eq('is_active', true)

    setCrewMembers(crewData || [])

    setIsLoading(false)
  }

  const handlePrevious = () => {
    if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleShiftClick = (schedule: ScheduleWithRelations) => {
    setSelectedSchedule(schedule)
    setSelectedDate(undefined)
    setModalOpen(true)
  }

  const handleSlotClick = (date: Date) => {
    setSelectedSchedule(null)
    setSelectedDate(date)
    setModalOpen(true)
  }

  const handleDrop = async (scheduleId: string, newDate: Date) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ scheduled_date: format(newDate, 'yyyy-MM-dd') })
        .eq('id', scheduleId)

      if (error) throw error
      toast.success('Assignment saved')
      loadData()
    } catch (error) {
      toast.error('Failed to update schedule')
    }
  }

  const handleSave = async (data: Partial<Schedule>) => {
    if (!companyId) return

    try {
      if (selectedSchedule) {
        // Update existing
        const { error } = await supabase
          .from('schedules')
          .update(data)
          .eq('id', selectedSchedule.id)

        if (error) throw error
        toast.success('Assignment saved')
      } else {
        // Create new
        const { error } = await supabase
          .from('schedules')
          .insert({ ...data, company_id: companyId })

        if (error) throw error
        toast.success('Schedule created')
      }

      loadData()
    } catch (error) {
      toast.error('Failed to save schedule')
      throw error
    }
  }

  const getDateRangeLabel = () => {
    if (view === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
    }
    return format(currentDate, 'MMMM yyyy')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
              <p className="text-gray-500">Manage your cleaning schedule</p>
            </div>
            <Button onClick={() => handleSlotClick(new Date())} leftIcon={<Plus className="h-4 w-4" />}>
              Add Schedule
            </Button>
          </div>

          {/* Calendar controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="ml-4 text-lg font-semibold text-gray-900">
                {getDateRangeLabel()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                    view === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                    view === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Month
                </button>
              </div>
            </div>
          </div>

          {/* Calendar view */}
          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading schedule...</p>
            </div>
          ) : view === 'week' ? (
            <WeekView
              currentDate={currentDate}
              schedules={schedules}
              onShiftClick={handleShiftClick}
              onSlotClick={handleSlotClick}
              onDrop={handleDrop}
            />
          ) : (
            <MonthView
              currentDate={currentDate}
              schedules={schedules}
              onShiftClick={handleShiftClick}
              onDateClick={handleSlotClick}
            />
          )}
        </div>

        {/* Assignment modal */}
        <AssignmentModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedSchedule(null)
            setSelectedDate(undefined)
          }}
          onSave={handleSave}
          schedule={selectedSchedule}
          sites={sites}
          crewMembers={crewMembers}
          selectedDate={selectedDate}
        />
      </DashboardLayout>
    </DndProvider>
  )
}

export default function SchedulePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading schedule...</p>
        </div>
      </DashboardLayout>
    }>
      <ScheduleContent />
    </Suspense>
  )
}
