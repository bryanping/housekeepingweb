'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const services = [
    {
      id: 1,
      title: "家庭清潔",
      description: "專業家政人員提供全面家庭清潔服務",
      icon: "🧹"
    },
    {
      id: 2,
      title: "廚房料理",
      description: "專業廚師為您準備美味餐點",
      icon: "🍳"
    },
    {
      id: 3,
      title: "老人看護",
      description: "專業護理人員提供貼心照護服務",
      icon: "👵"
    },
    {
      id: 4,
      title: "兒童看護",
      description: "專業育兒師陪伴孩子成長",
      icon: "👶"
    }
  ];

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'cleaning', name: '清潔' },
    { id: 'cooking', name: '料理' },
    { id: 'care', name: '照護' },
    { id: 'childcare', name: '育兒' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Housekeeping<span className="text-brand-400">Web</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            配對顧主與家政人員，減少訊息差、取代傳統家政公司
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-brand-400 hover:bg-brand-500 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
              立即開始
            </button>
            <button className="border-2 border-brand-400 text-brand-400 hover:bg-brand-50 font-semibold py-3 px-8 rounded-lg transition duration-300">
              了解更多
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">如何使用</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition duration-300">
              <div className="text-5xl mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">雇主發包</h3>
              <p className="text-gray-600">描述家裡大小、房數、客廳、廚房、廁所數量及特定要求</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition duration-300">
              <div className="text-5xl mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">家政註冊</h3>
              <p className="text-gray-600">家政老師註冊帳號、接單、勾選todo list</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition duration-300">
              <div className="text-5xl mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">價格浮動</h3>
              <p className="text-gray-600">根據服務內容與需求制定價格浮動規則</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">服務項目</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-brand-400 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-400 to-brand-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">立即體驗 HousekeepingWeb</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            簡化家政服務流程，讓您輕鬆找到合適的家政人員
          </p>
          <button className="bg-white text-brand-400 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg text-lg transition duration-300 transform hover:scale-105">
            開始使用
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">HousekeepingWeb</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            重新定義家政服務，讓雇主與家政人員更有效率地配對
          </p>
          <div className="border-t border-gray-800 pt-8 text-gray-500">
            <p>© {new Date().getFullYear()} HousekeepingWeb. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}