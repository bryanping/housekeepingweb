import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 用 service role key 繞過 RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName, phone, role } = await request.json()

    if (!userId || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 先確認 profile 不存在（防止重複）
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, existing: true })
    }

    const { error } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      email,
      full_name: fullName || '',
      phone: phone || '',
      role,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
