import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'alerts-get', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

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
  const unreadOnly = searchParams.get('unread') === 'true'
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase
    .from('alerts')
    .select(`
      *,
      site:sites(*),
      crew_member:crew_members(*),
      schedule:schedules(*)
    `)
    .eq('company_id', companyId)

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'alerts-put', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

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
  const { id, is_read } = body

  if (!id) {
    return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
  }

  if (typeof is_read !== 'boolean') {
    return NextResponse.json({ error: 'is_read must be a boolean' }, { status: 400 })
  }

  // Only update if alert belongs to user's company
  const { data, error } = await supabase
    .from('alerts')
    .update({ is_read })
    .eq('id', id)
    .eq('company_id', companyData.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Alert not found or access denied' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// Mark all alerts as read
export async function PATCH(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'alerts-patch', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

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

  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('company_id', companyId)
    .eq('is_read', false)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
