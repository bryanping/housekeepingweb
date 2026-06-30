'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Order, OrderTodo } from '@/types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [todos, setTodos] = useState<OrderTodo[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: o }, { data: t }] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).single(),
        supabase.from('order_todos').select('*').eq('order_id', id).order('id'),
      ])
      setOrder(o)
      setTodos(t ?? [])
      setLoading(false)
    }
    init()
  }, [id, router])

  const toggleTodo = async (todo: OrderTodo) => {
    const newVal = !todo.completed
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: newVal } : t))
    await supabase.from('order_todos').update({ completed: newVal }).eq('id', todo.id)
  }

  const completedCount = todos.filter(t => t.completed).length
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  const handleComplete = async () => {
    if (!order) return
    if (!confirm('確認標記此訂單為已完成？')) return
    await supabase.from('orders').update({ status: 'completed' }).eq('id', order.id)
    router.push('/housekeeper/dashboard')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">載入中...</div>
  if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-400">找不到訂單</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/housekeeper/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">← 返回</Link>
        <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
      </div>

      {/* 訂單資訊 */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">訂單資訊</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-500">地址</span><span className="text-gray-800">{order.address}</span>
          <span className="text-gray-500">房屋大小</span><span className="text-gray-800">{order.area_ping} 坪 · {order.rooms} 房 {order.living_rooms} 廳 {order.bathrooms} 衛</span>
          <span className="text-gray-500">服務日期</span><span className="text-gray-800">{order.scheduled_date}</span>
          <span className="text-gray-500">預算</span><span className="text-gray-800 font-medium text-brand-400">${order.budget_min}–${order.budget_max}</span>
          {order.special_requirements && (
            <>
              <span className="text-gray-500">特殊要求</span>
              <span className="text-gray-800">{order.special_requirements}</span>
            </>
          )}
        </div>
      </div>

      {/* Todo 進度 */}
      {todos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">清潔進度</h2>
            <span className="text-sm font-semibold text-brand-400">{completedCount}/{todos.length}</span>
          </div>

          {/* 進度條 */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <div
              className="bg-brand-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-2">
            {todos.map(todo => (
              <label
                key={todo.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-400 focus:ring-brand-400"
                />
                <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.task}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {order.status !== 'completed' && order.status !== 'cancelled' && (
        <button
          onClick={handleComplete}
          disabled={todos.length > 0 && progress < 100}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {todos.length > 0 && progress < 100
            ? `完成所有項目後才能提交 (${progress}%)`
            : '✅ 標記為已完成'}
        </button>
      )}

      {order.status === 'completed' && (
        <div className="text-center py-6 bg-green-50 rounded-xl">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-green-700 font-medium">此訂單已完成</p>
        </div>
      )}
    </div>
  )
}
