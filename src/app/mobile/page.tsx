'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/contexts/ToastContext'
import { ScheduleWithRelations, SiteChecklist, TimeEntry } from '@/types/database'
import { format } from 'date-fns'
import { calculateDistance, getCurrentPosition } from '@/lib/utils'
import { MapPin, Clock, CheckCircle, Play, Square, Building2, AlertCircle } from 'lucide-react'

export default function MobilePage() {
  const [schedules, setSchedules] = useState<ScheduleWithRelations[]>([])
  const [checklist, setChecklist] = useState<SiteChecklist[]>([])
  const [completedItems, setCompletedItems] = useState<string[]>([])
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClockingIn, setIsClockingIn] = useState(false)
  const [isClockingOut, setIsClockingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [crewMemberId, setCrewMemberId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [geofenceRadius, setGeofenceRadius] = useState(100)

  const supabase = createClient()
  const toast = useToast()
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get crew member
    const { data: crewMember } = await supabase
      .from('crew_members')
      .select('*, companies(*)')
      .eq('user_id', user.id)
      .single()

    if (!crewMember) {
      // Maybe user is a manager - get company
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (company) {
        setCompanyId(company.id)
        setGeofenceRadius(company.geofence_radius)
      }
      setIsLoading(false)
      return
    }

    setCrewMemberId(crewMember.id)
    setCompanyId(crewMember.company_id)
    if (crewMember.companies) {
      setGeofenceRadius((crewMember.companies as any).geofence_radius || 100)
    }

    // Get today's schedules for this crew member
    const { data: schedulesData } = await supabase
      .from('schedules')
      .select(`
        *,
        site:sites(*)
      `)
      .eq('crew_member_id', crewMember.id)
      .eq('scheduled_date', today)
      .order('start_time')

    setSchedules(schedulesData || [])

    // Get active time entry
    const { data: activeEntryData } = await supabase
      .from('time_entries')
      .select('*')
      .eq('crew_member_id', crewMember.id)
      .is('clock_out', null)
      .single()

    if (activeEntryData) {
      setActiveEntry(activeEntryData)

      // Load checklist for active site
      if (activeEntryData.site_id) {
        const { data: checklistData } = await supabase
          .from('site_checklists')
          .select('*')
          .eq('site_id', activeEntryData.site_id)
          .order('sort_order')

        setChecklist(checklistData || [])

        // Load completed items
        const { data: completions } = await supabase
          .from('checklist_completions')
          .select('checklist_item_id')
          .eq('time_entry_id', activeEntryData.id)

        setCompletedItems(completions?.map((c) => c.checklist_item_id!) || [])
      }
    }

    setIsLoading(false)
  }

  const handleClockIn = async (schedule: ScheduleWithRelations) => {
    if (!crewMemberId || !companyId) return
    setIsClockingIn(true)
    setError(null)

    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords

      // Check if within geofence
      let isVerified = true
      if (schedule.site?.latitude && schedule.site?.longitude) {
        const distance = calculateDistance(
          latitude,
          longitude,
          schedule.site.latitude,
          schedule.site.longitude
        )
        isVerified = distance <= geofenceRadius
      }

      // Create time entry
      const { data: entry, error: entryError } = await supabase
        .from('time_entries')
        .insert({
          company_id: companyId,
          schedule_id: schedule.id,
          crew_member_id: crewMemberId,
          site_id: schedule.site_id,
          clock_in: new Date().toISOString(),
          clock_in_latitude: latitude,
          clock_in_longitude: longitude,
          clock_in_verified: isVerified,
        })
        .select()
        .single()

      if (entryError) throw entryError

      // If not verified, create alert
      if (!isVerified) {
        await supabase.from('alerts').insert({
          company_id: companyId,
          type: 'off_site_clockin',
          schedule_id: schedule.id,
          crew_member_id: crewMemberId,
          site_id: schedule.site_id,
          message: `Crew member clocked in outside the geofence area`,
        })
      }

      // Update schedule status
      await supabase
        .from('schedules')
        .update({ status: 'in_progress' })
        .eq('id', schedule.id)

      toast.success('Clock in successful')
      loadData()
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to clock in. Please enable location services.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsClockingIn(false)
    }
  }

  const handleClockOut = async () => {
    if (!activeEntry) return
    setIsClockingOut(true)
    setError(null)

    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords

      // Calculate total hours
      const clockIn = new Date(activeEntry.clock_in!)
      const clockOut = new Date()
      const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)

      // Update time entry
      await supabase
        .from('time_entries')
        .update({
          clock_out: clockOut.toISOString(),
          clock_out_latitude: latitude,
          clock_out_longitude: longitude,
          clock_out_verified: true,
          total_hours: totalHours,
        })
        .eq('id', activeEntry.id)

      // Update schedule status
      if (activeEntry.schedule_id) {
        await supabase
          .from('schedules')
          .update({ status: 'completed' })
          .eq('id', activeEntry.schedule_id)
      }

      toast.success('Clock out successful')
      loadData()
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to clock out'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsClockingOut(false)
    }
  }

  const handleChecklistToggle = async (itemId: string) => {
    if (!activeEntry) return

    if (completedItems.includes(itemId)) {
      // Remove completion
      await supabase
        .from('checklist_completions')
        .delete()
        .eq('time_entry_id', activeEntry.id)
        .eq('checklist_item_id', itemId)

      setCompletedItems(completedItems.filter((id) => id !== itemId))
    } else {
      // Add completion
      await supabase.from('checklist_completions').insert({
        time_entry_id: activeEntry.id,
        checklist_item_id: itemId,
        completed_at: new Date().toISOString(),
      })

      setCompletedItems([...completedItems, itemId])
    }
  }

  const activeSchedule = schedules.find((s) => s.id === activeEntry?.schedule_id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CrewSync</span>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">{format(new Date(), 'EEEE')}</p>
            <p className="font-semibold">{format(new Date(), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {error && (
          <Alert variant="danger">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        ) : activeEntry ? (
          // Clocked in view
          <div className="space-y-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Currently clocked in</p>
                  <p className="font-bold text-green-800">
                    {activeSchedule?.site?.name || 'Unknown Site'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-green-700 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Started: {format(new Date(activeEntry.clock_in!), 'h:mm a')}
                  </span>
                </div>
                {activeEntry.clock_in_verified ? (
                  <Badge variant="success" size="sm">GPS Verified</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Off-site</Badge>
                )}
              </div>

              <Button
                onClick={handleClockOut}
                isLoading={isClockingOut}
                className="w-full bg-red-500 hover:bg-red-600"
                size="lg"
                leftIcon={<Square className="h-5 w-5" />}
              >
                Clock Out
              </Button>
            </Card>

            {/* Checklist */}
            {checklist.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Cleaning Checklist</h3>
                <div className="space-y-3">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChecklistToggle(item.id)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <Checkbox
                        checked={completedItems.includes(item.id)}
                        onChange={() => {}}
                      />
                      <span
                        className={
                          completedItems.includes(item.id)
                            ? 'line-through text-gray-400'
                            : 'text-gray-900'
                        }
                      >
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  {completedItems.length} of {checklist.length} tasks completed
                </p>
              </Card>
            )}
          </div>
        ) : schedules.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments today
            </h3>
            <p className="text-gray-500">
              Check back later or contact your manager
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Today&apos;s Assignments</h2>
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {schedule.site?.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {schedule.site?.address}
                    </p>
                  </div>
                  {schedule.status === 'completed' ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="default">Scheduled</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                  </span>
                </div>

                {schedule.status !== 'completed' && (
                  <Button
                    onClick={() => handleClockIn(schedule)}
                    isLoading={isClockingIn}
                    className="w-full"
                    size="lg"
                    leftIcon={<Play className="h-5 w-5" />}
                  >
                    Clock In
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
