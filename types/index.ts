export type UserRole = 'employer' | 'housekeeper'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface Order {
  id: string
  employer_id: string
  title: string
  description: string
  address: string
  area_ping: number       // 坪數
  rooms: number           // 房數
  living_rooms: number    // 客廳數
  kitchens: number        // 廚房數
  bathrooms: number       // 廁所數
  special_requirements?: string
  budget_min: number
  budget_max: number
  scheduled_date: string
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assigned_housekeeper_id?: string
  created_at: string
}

export interface OrderTodo {
  id: string
  order_id: string
  task: string
  completed: boolean
}

export interface Application {
  id: string
  order_id: string
  housekeeper_id: string
  proposed_price: number
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}
