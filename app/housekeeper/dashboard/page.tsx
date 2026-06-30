'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Order, Profile } from '@/types'

const STATUS_LABEL: Record<Order['status'], string> = {
  open: '待接單', assigned: '已配對', in_progress: '進行中', completed: '已完成', cancelled: '已取消',
}
const STATUS_COLOR: Record<Order['status'], string> = {
  open: 'bg-blue-100 text-blue-700', assigned: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-orange-100 text-orange-700', completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function HousekeeperDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [openOrders, setOpenOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'browse' | 'my'>('browse')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!p || p.role !== 'housekeeper') { router.push('/'); return }
      setProfile(p)

      const [{ data: open }, { data: mine }] = await Promise.all([
        supabase.from('orders').select('*').eq('status', 'open').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').eq('assigned_housekeeper_id', user.id).order('created_at', { ascending: false }),
      ])
      setOpenOrders(open ?? [])
      setMyOrders(mine ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleApply = async (orderId: string) => {
    const priceStr = prompt('請輸入您的報價（新台幣）：')
    if (!priceStr) return
    const price = Number(priceStr)
    if (isNaN(price) || price <= 0) return

    const { error } = await supabase.from('applications').insert({
      order_id: orderId,
      housekeeper_id: profile?.id,
      proposed_price: price,
      message: '',
      status: 'pending',
    })
    if (error) alert(error.message)
    else alert('已成功投遞申請！雇主確認後會通知您。')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">載入中...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">家政人員主頁</h1>
          <p className="text-sm text-gray-500 mt-1">歡迎回來，{profile?.full_name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '可接訂單', count: openOrders.length },
          { label: '進行中', count: myOrders.filter(o => o.status === 'in_progress').length },
          { label: '已完成', count: myOrders.filter(o => o.status === 'completed').length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-brand-400">{s.count}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {([['browse', '瀏覽訂單'], ['my', '我的訂單']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'browse' && (
        <div className="space-y-3">
          {openOrders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-500 text-sm">目前沒有開放中的訂單</p>
            </div>
          ) : openOrders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{order.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.address} · {order.area_ping} 坪 · {order.rooms} 房 {order.living_rooms} 廳 {order.bathrooms} 衛
                  </p>
                  {order.special_requirements && (
                    <p className="text-xs text-gray-400 mt-1 truncate">備註：{order.special_requirements}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">服務日期：{order.scheduled_date}</p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <p className="text-sm font-semibold text-brand-400">
                    ${order.budget_min}–${order.budget_max}
                  </p>
                  <button
                    onClick={() => handleApply(order.id)}
                    className="text-xs bg-brand-400 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    立即接單
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'my' && (
        <div className="space-y-3">
          {myOrders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500 text-sm">還沒有接單紀錄</p>
              <button onClick={() => setTab('browse')} className="mt-3 text-brand-400 text-sm hover:underline">去瀏覽訂單 →</button>
            </div>
          ) : myOrders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{order.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{order.address} · {order.scheduled_date}</p>
                </div>
                <Link
                  href={`/housekeeper/order/${order.id}`}
                  className="text-xs text-brand-400 hover:underline shrink-0"
                >
                  查看詳情 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
