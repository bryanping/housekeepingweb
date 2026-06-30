'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const DEFAULT_TODOS = [
  '清潔客廳地板', '清潔廚房爐台', '清潔廁所馬桶', '清潔廁所地板',
  '拖地（全室）', '擦拭桌面家具', '清理垃圾桶', '整理床鋪',
  '清潔浴室鏡面', '吸地毯', '清潔窗台', '清洗鍋具',
]

export default function PostOrderPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    address: '',
    area_ping: 20,
    rooms: 2,
    living_rooms: 1,
    kitchens: 1,
    bathrooms: 1,
    special_requirements: '',
    budget_min: 1000,
    budget_max: 2000,
    scheduled_date: '',
  })
  const [selectedTodos, setSelectedTodos] = useState<string[]>([])
  const [customTodo, setCustomTodo] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUserId(data.user.id)
    })
  }, [router])

  const toggleTodo = (t: string) =>
    setSelectedTodos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const addCustomTodo = () => {
    if (customTodo.trim()) {
      setSelectedTodos(prev => [...prev, customTodo.trim()])
      setCustomTodo('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const { data: order, error } = await supabase.from('orders').insert({
      employer_id: userId,
      ...form,
      status: 'open',
    }).select().single()

    if (error) { alert(error.message); setLoading(false); return }

    if (order && selectedTodos.length > 0) {
      await supabase.from('order_todos').insert(
        selectedTodos.map(task => ({ order_id: order.id, task, completed: false }))
      )
    }

    setLoading(false)
    setSuccess(true)
    setTimeout(() => router.push('/employer/dashboard'), 1500)
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )

  const numInput = (key: keyof typeof form, min: number, max: number) => (
    <input
      type="number"
      min={min}
      max={max}
      value={form[key] as number}
      onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
    />
  )

  if (success) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-lg font-semibold text-gray-800">發包成功！</p>
        <p className="text-sm text-gray-500 mt-1">正在跳轉到主頁...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/employer/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">← 返回</Link>
        <h1 className="text-2xl font-bold text-gray-900">新增發包</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本資訊 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide text-gray-400">基本資訊</h2>
          <Field label="標題">
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="例：3房2廳週末大掃除"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </Field>
          <Field label="地址">
            <input
              type="text"
              required
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="台北市信義區..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </Field>
          <Field label="預計服務日期">
            <input
              type="date"
              required
              value={form.scheduled_date}
              onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </Field>
        </div>

        {/* 房屋規格 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-400 mb-4">房屋規格</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="坪數">{numInput('area_ping', 5, 300)}</Field>
            <Field label="房間數">{numInput('rooms', 0, 20)}</Field>
            <Field label="客廳數">{numInput('living_rooms', 0, 5)}</Field>
            <Field label="廚房數">{numInput('kitchens', 0, 5)}</Field>
            <Field label="廁所數">{numInput('bathrooms', 0, 10)}</Field>
          </div>
        </div>

        {/* 清潔項目 Todo */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-400 mb-4">清潔項目</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {DEFAULT_TODOS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTodo(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedTodos.includes(t)
                    ? 'bg-brand-400 text-white border-brand-400'
                    : 'border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTodo}
              onChange={e => setCustomTodo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTodo())}
              placeholder="自訂清潔項目..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="button"
              onClick={addCustomTodo}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              新增
            </button>
          </div>
          {selectedTodos.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">已選 {selectedTodos.length} 項</p>
          )}
        </div>

        {/* 預算 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-400 mb-4">預算範圍（新台幣）</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="最低">{numInput('budget_min', 0, 100000)}</Field>
            <Field label="最高">{numInput('budget_max', 0, 100000)}</Field>
          </div>
        </div>

        {/* 特殊要求 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <Field label="特殊要求（選填）">
            <textarea
              value={form.special_requirements}
              onChange={e => setForm(f => ({ ...f, special_requirements: e.target.value }))}
              rows={3}
              placeholder="例：需自備清潔用品、有寵物、高齡老人同住請輕手..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-400 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? '發布中...' : '發布需求'}
        </button>
      </form>
    </div>
  )
}
