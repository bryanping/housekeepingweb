// 修改内容: 從 @supabase/ssr 引入正確的 client factories
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const createServerClientWithCookies = (): SupabaseClient => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll()
        },
        setAll() {
          // Server Components 無法設置 cookies，由 middleware 處理
        },
      },
    }
  ) as unknown as SupabaseClient
}