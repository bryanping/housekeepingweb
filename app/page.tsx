import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      <Header />
      
      <main className="container py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            家庭清潔服務
            <span className="block text-brand-600">專業、安心、省心</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            我們提供高品質的家庭清潔服務，讓您的家煥然一新，享受舒適生活
          </p>
          <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full text-lg">
            立即預約
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                    <span className="text-brand-600 font-bold">{item}</span>
                  </div>
                  <CardTitle>服務項目 {item}</CardTitle>
                  <CardDescription>
                    這是一個示範的服務介紹，具體內容需要根據實際服務調整
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">了解更多</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">為什麼選擇我們？</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">專業團隊</h3>
              <p className="text-gray-600">擁有多年經驗的清潔師傅，使用專業工具和環保產品</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">品質保證</h3>
              <p className="text-gray-600">提供滿意度保證，不滿意可免費重新服務</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
