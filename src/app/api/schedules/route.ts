import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'schedules-get', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

  try {
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

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'schedules-post', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

  try {
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
            message: `This crew member is already scheduled at ${(conflictingSite?.site as { name?: string })?.name || 'another site'} during this time`,
          },
          { status: 409 }
        )
      }
    }

    // Whitelist allowed fields to prevent mass assignment
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        company_id: companyId,
        site_id: body.site_id,
        crew_member_id: body.crew_member_id,
        scheduled_date: body.scheduled_date,
        start_time: body.start_time,
        end_time: body.end_time,
        status: body.status || 'scheduled',
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'schedules-put', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify company ownership
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (companyError || !companyData) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Schedule ID required' }, { status: 400 })
    }

    // Verify schedule belongs to user's company
    const { data: schedule } = await supabase
      .from('schedules')
      .select('company_id')
      .eq('id', id)
      .single()

    if (!schedule || schedule.company_id !== companyData.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Whitelist allowed fields to prevent mass assignment
    const updateData: Record<string, unknown> = {}
    if (body.site_id !== undefined) updateData.site_id = body.site_id
    if (body.crew_member_id !== undefined) updateData.crew_member_id = body.crew_member_id
    if (body.scheduled_date !== undefined) updateData.scheduled_date = body.scheduled_date
    if (body.start_time !== undefined) updateData.start_time = body.start_time
    if (body.end_time !== undefined) updateData.end_time = body.end_time
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes

    const { data, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'schedules-delete', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify company ownership
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (companyError || !companyData) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Schedule ID required' }, { status: 400 })
    }

    // Verify schedule belongs to user's company
    const { data: schedule } = await supabase
      .from('schedules')
      .select('company_id')
      .eq('id', id)
      .single()

    if (!schedule || schedule.company_id !== companyData.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 })
  }
}
