import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Housekeeping Web</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="/" className="hover:text-brand-600 transition-colors">首頁</a>
          <a href="/services" className="hover:text-brand-600 transition-colors">服務項目</a>
          <a href="/about" className="hover:text-brand-600 transition-colors">關於我們</a>
          <a href="/contact" className="hover:text-brand-600 transition-colors">聯絡我們</a>
        </nav>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
