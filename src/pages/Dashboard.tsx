import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRMStore } from '../store'
import { OrderStatusBadge } from '../components/StatusBadge'
import {
  ShoppingCart, FileText, Users, AlertTriangle, Clock
} from 'lucide-react'
import { differenceInHours, differenceInDays, format } from 'date-fns'
import { he } from 'date-fns/locale'

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-[#1a3a5c]">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export function Dashboard() {
  const { customers, orders, quotes } = useCRMStore()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const openOrders = orders.filter(
      (o) => !['completed', 'cancelled', 'returned'].includes(o.status)
    ).length

    const pendingQuotes = quotes.filter((q) => q.status === 'sent').length

    const newCustomers = customers.filter(
      (c) => c.createdAt >= thisMonthStart
    ).length

    return { openOrders, pendingQuotes, newCustomers }
  }, [customers, orders, quotes])

  const needsAttention = useMemo(() => {
    return orders
      .filter((o) => {
        const hrs = differenceInHours(new Date(), o.updatedAt)
        return hrs >= 48 && !['completed', 'cancelled', 'returned'].includes(o.status)
      })
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
  }, [orders])

  const followUpQuotes = useMemo(() => {
    return quotes
      .filter((q) => q.status === 'sent')
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())
  }, [quotes])

  const getCustomer = (id: string) => customers.find((c) => c.id === id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3a5c]">לוח בקרה</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {format(new Date(), "EEEE, d בMMMM yyyy", { locale: he })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="הזמנות פתוחות"
          value={stats.openOrders}
          icon={ShoppingCart}
          color="bg-[#1a3a5c]"
          sub="טעונות טיפול"
        />
        <StatCard
          label="הצעות ממתינות"
          value={stats.pendingQuotes}
          icon={FileText}
          color="bg-[#4fc3f7]"
          sub="לא נסגרו עדיין"
        />
        <StatCard
          label="לקוחות החודש"
          value={stats.newCustomers}
          icon={Users}
          color="bg-emerald-500"
          sub="הצטרפו החודש"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders needing attention */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <AlertTriangle size={18} className="text-orange-500" />
            <h2 className="font-semibold text-[#1a3a5c]">הזמנות דורשות טיפול</h2>
            <span className="mr-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {needsAttention.length}
            </span>
          </div>
          {needsAttention.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              אין הזמנות דורשות טיפול
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {needsAttention.map((order) => {
                const customer = getCustomer(order.customerId)
                const hrs = differenceInHours(new Date(), order.updatedAt)
                return (
                  <div
                    key={order.id}
                    className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/orders')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-[#1a3a5c]">{order.orderNumber}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          {customer?.name} · {order.product}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 text-xs shrink-0">
                        <Clock size={13} />
                        {hrs < 72 ? `${hrs}ש'` : `${Math.floor(hrs / 24)}י'`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Follow-up quotes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <FileText size={18} className="text-[#4fc3f7]" />
            <h2 className="font-semibold text-[#1a3a5c]">הצעות מחיר לטיפול</h2>
            <span className="mr-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {followUpQuotes.length}
            </span>
          </div>
          {followUpQuotes.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              אין הצעות ממתינות
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {followUpQuotes.map((quote) => {
                const customer = getCustomer(quote.customerId)
                const days = differenceInDays(new Date(), quote.sentAt)
                const isOverdue = days >= 7
                return (
                  <div
                    key={quote.id}
                    className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/quotes')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[#1a3a5c]">{quote.quoteNumber}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {customer?.name} · {quote.totalAmount.toLocaleString('he-IL')}₪
                        </div>
                      </div>
                      <div className={`text-xs font-medium shrink-0 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                        {days === 0 ? 'היום' : `לפני ${days} ימים`}
                        {isOverdue && ' ⚠'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
