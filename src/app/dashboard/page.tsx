import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { StatsCards, TodaySchedule, ActiveCrew, AlertsPanel, WeekGlance } from '@/components/dashboard'
import { format, startOfWeek, addDays } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company) {
    redirect('/onboarding')
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  // Get today's schedules with relations
  const { data: schedules } = await supabase
    .from('schedules')
    .select(`
      *,
      site:sites(*),
      crew_member:crew_members(*)
    `)
    .eq('company_id', company.id)
    .eq('scheduled_date', today)
    .order('start_time')

  // Get crew members with current time entries
  const { data: crewMembers } = await supabase
    .from('crew_members')
    .select(`
      *
    `)
    .eq('company_id', company.id)
    .eq('is_active', true)

  // Get active time entries (clocked in today, not clocked out)
  const { data: activeEntries } = await supabase
    .from('time_entries')
    .select(`
      *,
      site:sites(*)
    `)
    .eq('company_id', company.id)
    .not('clock_in', 'is', null)
    .is('clock_out', null)

  // Map active entries to crew members
  const crewWithEntries = crewMembers?.map(member => ({
    ...member,
    currentEntry: activeEntries?.find(e => e.crew_member_id === member.id)
  })) || []

  // Get unread alerts
  const { data: alerts } = await supabase
    .from('alerts')
    .select(`
      *,
      site:sites(*),
      crew_member:crew_members(*),
      schedule:schedules(*)
    `)
    .eq('company_id', company.id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get week data for chart
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    format(addDays(weekStart, i), 'yyyy-MM-dd')
  )

  const { data: weekSchedules } = await supabase
    .from('schedules')
    .select('scheduled_date, status')
    .eq('company_id', company.id)
    .in('scheduled_date', weekDates)

  const weekData = weekDates.map(dateStr => {
    const daySchedules = weekSchedules?.filter(s => s.scheduled_date === dateStr) || []
    return {
      date: new Date(dateStr),
      scheduled: daySchedules.length,
      completed: daySchedules.filter(s => s.status === 'completed').length
    }
  })

  // Calculate stats
  const todaySchedules = schedules || []
  const completedToday = todaySchedules.filter(s => s.status === 'completed').length
  const activeCrew = crewWithEntries.filter(c => c.currentEntry).length
  const totalCrew = crewWithEntries.length

  // Calculate on-time rate (last 7 days)
  const { data: recentEntries } = await supabase
    .from('time_entries')
    .select('clock_in_verified')
    .eq('company_id', company.id)
    .not('clock_in', 'is', null)
    .gte('clock_in', format(addDays(new Date(), -7), 'yyyy-MM-dd'))

  const onTimeRate = recentEntries?.length
    ? Math.round((recentEntries.filter(e => e.clock_in_verified).length / recentEntries.length) * 100)
    : 100

  return (
    <DashboardLayout
      user={{ email: user.email, name: user.user_metadata?.name }}
      companyName={company.name}
    >
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats cards */}
        <StatsCards
          onTimeRate={onTimeRate}
          activeCrew={activeCrew}
          totalCrew={totalCrew}
          alertsCount={alerts?.length || 0}
          completedToday={completedToday}
          scheduledToday={todaySchedules.length}
        />

        {/* Week glance */}
        <WeekGlance weekData={weekData} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodaySchedule schedules={todaySchedules} />
          </div>
          <div className="space-y-6">
            <ActiveCrew crewMembers={crewWithEntries} />
            <AlertsPanel alerts={alerts || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
