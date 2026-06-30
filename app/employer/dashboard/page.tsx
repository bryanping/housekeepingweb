'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Order, Profile } from '@/types'

const STATUS_LABEL: Record<Order['status'], string> = {
  open: '待接單',
  assigned: '已配對',
  in_progress: '進行中',
  completed: '已完成',
  cancelled: '已取消',
}
const STATUS_COLOR: Record<Order['status'], string> = {
  open: 'bg-blue-100 text-blue-700',
  assigned: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function EmployerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!p || p.role !== 'employer') { router.push('/'); return }
      setProfile(p)

      const { data: o } = await supabase
        .from('orders')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(o ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">載入中...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">雇主主頁</h1>
          <p className="text-sm text-gray-500 mt-1">歡迎回來，{profile?.full_name}</p>
        </div>
        <Link
          href="/employer/post"
          className="bg-brand-400 hover:bg-brand-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          + 新增發包
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '全部訂單', count: orders.length },
          { label: '待接單', count: orders.filter(o => o.status === 'open').length },
          { label: '進行中', count: orders.filter(o => o.status === 'in_progress').length },
          { label: '已完成', count: orders.filter(o => o.status === 'completed').length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-brand-400">{s.count}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">我的訂單</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm mb-4">還沒有發包紀錄</p>
          <Link href="/employer/post" className="text-brand-400 text-sm font-medium hover:underline">立即發包 →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('zh-TW')}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 truncate">{order.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{order.address} · {order.area_ping} 坪 · {order.rooms} 房</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-brand-400">
                    ${order.budget_min}–${order.budget_max}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.scheduled_date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
