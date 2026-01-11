import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'crew-get', RATE_LIMITS.api)
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
    const activeOnly = searchParams.get('active') === 'true'

    let query = supabase
      .from('crew_members')
      .select('*')
      .eq('company_id', companyId)

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query.order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch crew members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'crew-post', RATE_LIMITS.api)
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

    // Whitelist allowed fields to prevent mass assignment
    const { data, error } = await supabase
      .from('crew_members')
      .insert({
        company_id: companyId,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        role: body.role || 'cleaner',
        hourly_rate: body.hourly_rate || null,
        pin: body.pin || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to create crew member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'crew-put', RATE_LIMITS.api)
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
      return NextResponse.json({ error: 'Crew member ID required' }, { status: 400 })
    }

    // Whitelist allowed fields to prevent mass assignment
    const updateData: Record<string, unknown> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.role !== undefined) updateData.role = body.role
    if (body.hourly_rate !== undefined) updateData.hourly_rate = body.hourly_rate
    if (body.pin !== undefined) updateData.pin = body.pin
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    // Only update if crew member belongs to user's company
    const { data, error } = await supabase
      .from('crew_members')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyData.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to update crew member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'crew-delete', RATE_LIMITS.api)
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
      return NextResponse.json({ error: 'Crew member ID required' }, { status: 400 })
    }

    // Soft delete only if crew member belongs to user's company
    const { error } = await supabase
      .from('crew_members')
      .update({ is_active: false })
      .eq('id', id)
      .eq('company_id', companyData.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete crew member' }, { status: 500 })
  }
}
