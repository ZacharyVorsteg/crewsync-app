import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { schedule_id, latitude, longitude } = body

  // Get the crew member
  const { data: crewMember } = await supabase
    .from('crew_members')
    .select('*, companies(*)')
    .eq('user_id', user.id)
    .single()

  if (!crewMember) {
    return NextResponse.json({ error: 'Crew member not found' }, { status: 404 })
  }

  // Get the schedule
  const { data: schedule } = await supabase
    .from('schedules')
    .select('*, site:sites(*)')
    .eq('id', schedule_id)
    .single()

  if (!schedule) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
  }

  // Calculate if within geofence
  let isVerified = true
  const geofenceRadius = (crewMember.companies as any)?.geofence_radius || 100

  if (schedule.site?.latitude && schedule.site?.longitude && latitude && longitude) {
    const distance = calculateDistance(
      latitude,
      longitude,
      schedule.site.latitude,
      schedule.site.longitude
    )
    isVerified = distance <= geofenceRadius
  }

  // Create time entry
  const { data: timeEntry, error: entryError } = await supabase
    .from('time_entries')
    .insert({
      company_id: crewMember.company_id,
      schedule_id,
      crew_member_id: crewMember.id,
      site_id: schedule.site_id,
      clock_in: new Date().toISOString(),
      clock_in_latitude: latitude,
      clock_in_longitude: longitude,
      clock_in_verified: isVerified,
    })
    .select()
    .single()

  if (entryError) {
    return NextResponse.json({ error: entryError.message }, { status: 500 })
  }

  // Update schedule status
  await supabase
    .from('schedules')
    .update({ status: 'in_progress' })
    .eq('id', schedule_id)

  // Create alert if off-site
  if (!isVerified) {
    await supabase.from('alerts').insert({
      company_id: crewMember.company_id,
      type: 'off_site_clockin',
      schedule_id,
      crew_member_id: crewMember.id,
      site_id: schedule.site_id,
      message: `${crewMember.name} clocked in outside the geofence area at ${schedule.site?.name}`,
    })
  }

  return NextResponse.json({
    ...timeEntry,
    verified: isVerified,
  })
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}
