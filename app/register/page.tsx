'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'

function RegisterForm() {
  const [role, setRole] = useState<UserRole>('employer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOAuth = searchParams.get('oauth') === '1'

  useEffect(() => {
    if (isOAuth) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setEmail(data.user.email ?? '')
          setFullName(data.user.user_metadata?.full_name ?? '')
        }
      })
    }
  }, [isOAuth])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let userId: string | undefined

    if (isOAuth) {
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }
      userId = data.user?.id
    }

    if (userId) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, fullName, phone, role }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || '建立帳號失敗'); setLoading(false); return }
    }

    setLoading(false)
    router.push(role === 'employer' ? '/employer/dashboard' : '/housekeeper/dashboard')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">建立帳號</h1>
          <p className="text-sm text-gray-500 mb-6">選擇您的身份開始使用</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === 'employer'
                  ? 'border-brand-400 bg-brand-50 text-brand-400'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🏠</div>
              <div className="text-sm font-medium">雇主</div>
              <div className="text-xs text-gray-500 mt-0.5">發包家政需求</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('housekeeper')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === 'housekeeper'
                  ? 'border-brand-400 bg-brand-50 text-brand-400'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🧹</div>
              <div className="text-sm font-medium">家政人員</div>
              <div className="text-xs text-gray-500 mt-0.5">接單服務</div>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                placeholder="您的真實姓名"
              />
            </div>
            {!isOAuth && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                placeholder="0912-345-678"
              />
            </div>
            {!isOAuth && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  placeholder="至少 6 個字元"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-400 hover:bg-brand-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? '建立中...' : `以${role === 'employer' ? '雇主' : '家政人員'}身份註冊`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            已有帳號？{' '}
            <Link href="/login" className="text-brand-400 hover:underline font-medium">登入</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">載入中...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
