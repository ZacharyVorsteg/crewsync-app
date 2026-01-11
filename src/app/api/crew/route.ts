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
  const activeOnly = searchParams.get('active') === 'true'

  let query = supabase
    .from('crew_members')
    .select('*')
    .eq('company_id', companyId)

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query.order('name')

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

  const { data, error } = await supabase
    .from('crew_members')
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
  const { id, ...updateData } = body

  if (!id) {
    return NextResponse.json({ error: 'Crew member ID required' }, { status: 400 })
  }

  // Only update if crew member belongs to user's company
  const { data, error } = await supabase
    .from('crew_members')
    .update(updateData)
    .eq('id', id)
    .eq('company_id', companyData.id)
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
