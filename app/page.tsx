'use client'

import { useState } from 'react'
import Link from 'next/link'

const services = [
  { id: 1, icon: '🧹', title: '家庭清潔', desc: '全室深度清潔，客廳、廚房、臥室一次搞定' },
  { id: 2, icon: '🍳', title: '廚房料理', desc: '專業廚師到府，為您準備健康美味餐點' },
  { id: 3, icon: '👵', title: '老人看護', desc: '專業護理人員，提供貼心居家照護服務' },
  { id: 4, icon: '👶', title: '兒童看護', desc: '專業育兒師陪伴，讓孩子快樂成長' },
]

const categories = [
  { id: 'all', name: '全部' },
  { id: 'cleaning', name: '清潔' },
  { id: 'cooking', name: '料理' },
  { id: 'care', name: '照護' },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Housekeeping<span className="text-brand-400">Web</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            配對雇主與家政人員，減少訊息差，取代傳統家政公司
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-brand-400 hover:bg-brand-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              立即開始
            </Link>
            <a
              href="#how"
              className="border-2 border-brand-400 text-brand-400 hover:bg-brand-50 font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-4 bg-white mt-2">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">如何使用</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: '雇主發包', desc: '填寫房屋坪數、房數、廚廁數量及特殊要求' },
              { step: '2', title: '家政接單', desc: '家政人員瀏覽訂單、報價、勾選清潔 todo' },
              { step: '3', title: '彈性計價', desc: '根據服務內容與需求，價格透明浮動' },
            ].map(s => (
              <div key={s.step} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-brand-400 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">服務項目</h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-brand-400 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-400">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">立即體驗 HousekeepingWeb</h2>
          <p className="text-lg mb-8 opacity-90">簡化家政服務流程，輕鬆配對合適人選</p>
          <Link
            href="/register"
            className="bg-white text-brand-400 hover:bg-gray-100 font-bold py-3 px-10 rounded-xl text-lg transition-colors inline-block"
          >
            免費註冊
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-center text-gray-400 text-sm">
        <p className="font-semibold text-white text-lg mb-2">HousekeepingWeb</p>
        <p>重新定義家政服務，讓雇主與家政人員更有效率地配對</p>
        <p className="mt-4">© {new Date().getFullYear()} HousekeepingWeb. All rights reserved.</p>
      </footer>
    </div>
  )
}
