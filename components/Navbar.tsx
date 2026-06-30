'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchProfile(data.user.id)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const dashboardHref = profile?.role === 'employer' ? '/employer/dashboard' : '/housekeeper/dashboard'

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-brand-400 tracking-tight">
            HousekeepingWeb
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="text-sm text-gray-600 hover:text-brand-400 transition-colors">服務項目</Link>
            <Link href="/#how" className="text-sm text-gray-600 hover:text-brand-400 transition-colors">如何使用</Link>

            {user ? (
              <>
                <Link href={dashboardHref} className="text-sm text-gray-600 hover:text-brand-400 transition-colors">
                  我的主頁
                </Link>
                <span className="text-sm text-gray-400 truncate max-w-[120px]">{profile?.full_name ?? user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-brand-400 transition-colors">
                  登入
                </Link>
                <Link href="/register" className="text-sm bg-brand-400 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors">
                  立即註冊
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-600 hover:text-brand-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link href="/#services" className="block py-2 text-sm text-gray-600 hover:text-brand-400">服務項目</Link>
          <Link href="/#how" className="block py-2 text-sm text-gray-600 hover:text-brand-400">如何使用</Link>
          {user ? (
            <>
              <Link href={dashboardHref} className="block py-2 text-sm text-gray-600 hover:text-brand-400">我的主頁</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-sm text-gray-600 hover:text-brand-400">登出</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm text-gray-600 hover:text-brand-400">登入</Link>
              <Link href="/register" className="block py-2 text-sm bg-brand-400 text-white text-center rounded-lg hover:bg-brand-500">立即註冊</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
