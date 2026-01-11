import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (companyError || !companyData) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  const companyId = companyData.id

  const searchParams = request.nextUrl.searchParams
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const crewMemberId = searchParams.get('crew_member_id')
  const siteId = searchParams.get('site_id')

  let query = supabase
    .from('schedules')
    .select(`
      *,
      site:sites(*),
      crew_member:crew_members(*)
    `)
    .eq('company_id', companyId)

  if (startDate) {
    query = query.gte('scheduled_date', startDate)
  }
  if (endDate) {
    query = query.lte('scheduled_date', endDate)
  }
  if (crewMemberId) {
    query = query.eq('crew_member_id', crewMemberId)
  }
  if (siteId) {
    query = query.eq('site_id', siteId)
  }

  const { data, error } = await query.order('scheduled_date').order('start_time')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (companyError || !companyData) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  const companyId = companyData.id
  const body = await request.json()

  // Check for scheduling conflicts (same crew member, same date, overlapping times)
  if (body.crew_member_id && body.scheduled_date && body.start_time && body.end_time) {
    const { data: conflicts } = await supabase
      .from('schedules')
      .select('id, site:sites(name), start_time, end_time')
      .eq('company_id', companyId)
      .eq('crew_member_id', body.crew_member_id)
      .eq('scheduled_date', body.scheduled_date)
      .neq('status', 'canceled')

    // Check for time overlap
    const hasConflict = conflicts?.some((existing) => {
      const newStart = body.start_time
      const newEnd = body.end_time
      const existingStart = existing.start_time
      const existingEnd = existing.end_time

      // Overlap: new starts before existing ends AND new ends after existing starts
      return newStart < existingEnd && newEnd > existingStart
    })

    if (hasConflict) {
      const conflictingSite = conflicts?.find((c) => {
        return body.start_time < c.end_time && body.end_time > c.start_time
      })
      return NextResponse.json(
        {
          error: 'Schedule conflict detected',
          message: `This crew member is already scheduled at ${(conflictingSite?.site as any)?.name || 'another site'} during this time`,
          conflict: conflictingSite
        },
        { status: 409 }
      )
    }
  }

  const { data, error } = await supabase
    .from('schedules')
    .insert({
      ...body,
      company_id: companyId,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updateData } = body

  if (!id) {
    return NextResponse.json({ error: 'Schedule ID required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('schedules')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Schedule ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
