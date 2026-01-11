import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'sites-get', RATE_LIMITS.api)
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

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('company_id', companyId)
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'sites-post', RATE_LIMITS.api)
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
      .from('sites')
      .insert({
        company_id: companyId,
        name: body.name,
        address: body.address || null,
        contact_name: body.contact_name || null,
        contact_phone: body.contact_phone || null,
        contact_email: body.contact_email || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        geofence_radius: body.geofence_radius || 100,
        notes: body.notes || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to create site' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'sites-put', RATE_LIMITS.api)
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
      return NextResponse.json({ error: 'Site ID required' }, { status: 400 })
    }

    // Whitelist allowed fields to prevent mass assignment
    const updateData: Record<string, unknown> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.address !== undefined) updateData.address = body.address
    if (body.contact_name !== undefined) updateData.contact_name = body.contact_name
    if (body.contact_phone !== undefined) updateData.contact_phone = body.contact_phone
    if (body.contact_email !== undefined) updateData.contact_email = body.contact_email
    if (body.latitude !== undefined) updateData.latitude = body.latitude
    if (body.longitude !== undefined) updateData.longitude = body.longitude
    if (body.geofence_radius !== undefined) updateData.geofence_radius = body.geofence_radius
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    // Only update if site belongs to user's company
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyData.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to update site' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'sites-delete', RATE_LIMITS.api)
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
      return NextResponse.json({ error: 'Site ID required' }, { status: 400 })
    }

    // Soft delete only if site belongs to user's company
    const { error } = await supabase
      .from('sites')
      .update({ is_active: false })
      .eq('id', id)
      .eq('company_id', companyData.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete site' }, { status: 500 })
  }
}
