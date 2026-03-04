export type LeadSource = 'website' | 'whatsapp' | 'social' | 'direct'
export type CustomerType = 'private' | 'business'
export type CustomerStatus = 'active' | 'inactive'

export type OrderStatus =
  | 'new'              // נכנסה
  | 'approved'         // אושרה
  | 'paid'             // שולמה
  | 'sent_warehouse'   // נשלחה למחסן
  | 'shipped'          // יצאה לשילוח
  | 'delivered'        // סופקה
  | 'pending_install'  // ממתינה להתקנה
  | 'completed'        // הושלמה
  | 'cancelled'        // בוטלה
  | 'returned'         // הוחזרה

export type QuoteStatus = 'sent' | 'approved' | 'closed' | 'irrelevant'

export interface Note {
  id: string
  text: string
  createdAt: Date
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  source: LeadSource
  type: CustomerType
  status: CustomerStatus
  notInAccounting: boolean   // טרם הוכנס לרווחית
  createdAt: Date
  notes: Note[]
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  product: string
  amount: number
  status: OrderStatus
  requiresInstallation: boolean
  createdAt: Date
  updatedAt: Date
  notes: string
}

export interface QuoteItem {
  product: string
  quantity: number
  unitPrice: number
  discount: number
}

export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  items: QuoteItem[]
  totalAmount: number
  discount: number
  status: QuoteStatus
  sentAt: Date
  notes: string
  createdAt: Date
}
