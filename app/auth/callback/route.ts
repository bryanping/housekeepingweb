import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // 讀取角色決定跳轉目標
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Google 新用戶：自動建立 profile（若不存在）
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // 新用戶 → 讓他選角色
          return NextResponse.redirect(`${origin}/register?oauth=1&uid=${user.id}`)
        }

        return NextResponse.redirect(
          `${origin}${profile.role === 'employer' ? '/employer/dashboard' : '/housekeeper/dashboard'}`
        )
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
