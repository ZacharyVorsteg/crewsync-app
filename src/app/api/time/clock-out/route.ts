import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'clock-out', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { time_entry_id, latitude, longitude } = body

    // Get the crew member
    const { data: crewMember } = await supabase
      .from('crew_members')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!crewMember) {
      return NextResponse.json({ error: 'Crew member not found' }, { status: 404 })
    }

    // Get the time entry - verify ownership
    const { data: timeEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('id', time_entry_id)
      .eq('crew_member_id', crewMember.id)
      .single()

    if (!timeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 })
    }

    if (timeEntry.clock_out) {
      return NextResponse.json({ error: 'Already clocked out' }, { status: 400 })
    }

    // Calculate total hours
    const clockIn = new Date(timeEntry.clock_in!)
    const clockOut = new Date()
    const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)

    // Update time entry with whitelisted fields only
    const { data: updatedEntry, error: updateError } = await supabase
      .from('time_entries')
      .update({
        clock_out: clockOut.toISOString(),
        clock_out_latitude: typeof latitude === 'number' ? latitude : null,
        clock_out_longitude: typeof longitude === 'number' ? longitude : null,
        clock_out_verified: true,
        total_hours: totalHours,
      })
      .eq('id', time_entry_id)
      .select()
      .single()

    if (updateError) throw updateError

    // Update schedule status
    if (timeEntry.schedule_id) {
      await supabase
        .from('schedules')
        .update({ status: 'completed' })
        .eq('id', timeEntry.schedule_id)
    }

    return NextResponse.json(updatedEntry)
  } catch {
    return NextResponse.json({ error: 'Failed to clock out' }, { status: 500 })
  }
}
