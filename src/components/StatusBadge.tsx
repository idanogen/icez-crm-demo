import type { OrderStatus, QuoteStatus, Order } from '../types'

export const orderConfig: Record<OrderStatus, { label: string; className: string }> = {
  new:             { label: 'נכנסה',              className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  approved:        { label: 'אושרה',              className: 'bg-blue-100 text-blue-800 border-blue-200' },
  paid:            { label: 'שולמה',              className: 'bg-green-100 text-green-800 border-green-200' },
  sent_warehouse:  { label: 'נשלחה למחסן',        className: 'bg-orange-100 text-orange-800 border-orange-200' },
  shipped:         { label: 'יצאה לשילוח',        className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered:       { label: 'סופקה',              className: 'bg-purple-100 text-purple-800 border-purple-200' },
  pending_install: { label: 'ממתינה להתקנה',      className: 'bg-amber-100 text-amber-800 border-amber-200' },
  completed:       { label: 'הושלמה',             className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled:       { label: 'בוטלה',              className: 'bg-red-100 text-red-800 border-red-200' },
  returned:        { label: 'הוחזרה',             className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const quoteConfig: Record<QuoteStatus, { label: string; className: string }> = {
  sent:       { label: 'נשלחה',       className: 'bg-blue-100 text-blue-800 border-blue-200' },
  approved:   { label: 'אושרה',       className: 'bg-green-100 text-green-800 border-green-200' },
  closed:     { label: 'נסגרה',       className: 'bg-purple-100 text-purple-800 border-purple-200' },
  irrelevant: { label: 'לא רלוונטי',  className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = orderConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export function QuoteStatusBadge({ status, daysOld }: { status: QuoteStatus; daysOld?: number }) {
  const cfg = quoteConfig[status]
  const isOverdue = status === 'sent' && daysOld !== undefined && daysOld >= 7
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${isOverdue ? 'bg-red-100 text-red-800 border-red-300' : cfg.className}`}>
      {cfg.label}
      {isOverdue && <span className="mr-1">⚠</span>}
    </span>
  )
}

export function getNextStatus(order: Order): OrderStatus | null {
  switch (order.status) {
    case 'new':            return 'approved'
    case 'approved':       return 'paid'
    case 'paid':           return 'sent_warehouse'
    case 'sent_warehouse': return 'shipped'
    case 'shipped':        return 'delivered'
    case 'delivered':      return order.requiresInstallation ? 'pending_install' : 'completed'
    case 'pending_install':return 'completed'
    case 'completed':      return null
    case 'cancelled':      return null
    case 'returned':       return null
  }
}

export const ORDER_STATUS_LABELS = orderConfig
export const QUOTE_STATUS_LABELS = quoteConfig
