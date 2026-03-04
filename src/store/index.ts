import { create } from 'zustand'
import type { Customer, Order, Quote, OrderStatus, QuoteStatus, Note } from '../types'
import { seedCustomers, seedOrders, seedQuotes } from '../data/seed'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface CRMStore {
  customers: Customer[]
  orders: Order[]
  quotes: Quote[]
  toasts: Toast[]

  // Customers
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt' | 'notes'>) => void
  updateCustomer: (id: string, fields: Partial<Pick<Customer, 'name' | 'phone' | 'email' | 'source' | 'type' | 'notInAccounting'>>) => void
  addCustomerNote: (customerId: string, text: string) => void

  // Orders
  addOrder: (o: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  updateOrderNotes: (orderId: string, notes: string) => void

  // Quotes
  addQuote: (q: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'sentAt'>) => void
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => void

  // Toasts
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

let orderCounter = seedOrders.length + 1
let quoteCounter = seedQuotes.length + 1
let customerCounter = seedCustomers.length + 1

export const useCRMStore = create<CRMStore>((set, get) => ({
  customers: seedCustomers,
  orders: seedOrders,
  quotes: seedQuotes,
  toasts: [],

  addCustomer: (c) => {
    const id = `c${customerCounter++}`
    const newCustomer: Customer = {
      ...c,
      id,
      createdAt: new Date(),
      notes: [],
    }
    set((s) => ({ customers: [newCustomer, ...s.customers] }))
    get().addToast(`לקוח "${c.name}" נוסף בהצלחה`)
  },

  updateCustomer: (id, fields) => {
    set((s) => ({
      customers: s.customers.map((c) =>
        c.id === id ? { ...c, ...fields } : c
      ),
    }))
    get().addToast('פרטי הלקוח עודכנו בהצלחה')
  },

  addCustomerNote: (customerId, text) => {
    const note: Note = { id: `n${Date.now()}`, text, createdAt: new Date() }
    set((s) => ({
      customers: s.customers.map((c) =>
        c.id === customerId ? { ...c, notes: [...c.notes, note] } : c
      ),
    }))
  },

  addOrder: (o) => {
    const id = `o${Date.now()}`
    const orderNumber = `ORD-2025-${String(orderCounter++).padStart(3, '0')}`
    const newOrder: Order = {
      ...o,
      id,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((s) => ({ orders: [newOrder, ...s.orders] }))
    get().addToast(`הזמנה ${orderNumber} נוצרה בהצלחה`)
  },

  updateOrderStatus: (orderId, status) => {
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
      ),
    }))
    const labels: Record<OrderStatus, string> = {
      new:             'נכנסה',
      approved:        'אושרה',
      paid:            'שולמה',
      sent_warehouse:  'נשלחה למחסן',
      shipped:         'יצאה לשילוח',
      delivered:       'סופקה',
      pending_install: 'ממתינה להתקנה',
      completed:       'הושלמה',
      cancelled:       'בוטלה',
      returned:        'הוחזרה',
    }
    get().addToast(`סטטוס עודכן: ${labels[status]}`)
  },

  updateOrderNotes: (orderId, notes) => {
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, notes, updatedAt: new Date() } : o
      ),
    }))
  },

  addQuote: (q) => {
    const id = `q${Date.now()}`
    const quoteNumber = `QUO-2025-${String(quoteCounter++).padStart(3, '0')}`
    const newQuote: Quote = {
      ...q,
      id,
      quoteNumber,
      createdAt: new Date(),
      sentAt: new Date(),
      status: 'sent',
    }
    set((s) => ({ quotes: [newQuote, ...s.quotes] }))
    get().addToast(`הצעת מחיר ${quoteNumber} נוצרה בהצלחה`)
  },

  updateQuoteStatus: (quoteId, status) => {
    set((s) => ({
      quotes: s.quotes.map((q) =>
        q.id === quoteId ? { ...q, status } : q
      ),
    }))
    const labels: Record<QuoteStatus, string> = {
      sent: 'נשלחה',
      approved: 'אושרה',
      closed: 'נסגרה',
      irrelevant: 'לא רלוונטי',
    }
    get().addToast(`סטטוס הצעה עודכן: ${labels[status]}`)
  },

  addToast: (message, type = 'success') => {
    const id = `t${Date.now()}`
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => get().removeToast(id), 3500)
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))
