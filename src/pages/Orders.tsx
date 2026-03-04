import { useState } from 'react'
import { useCRMStore } from '../store'
import type { OrderStatus } from '../types'
import { OrderStatusBadge, ORDER_STATUS_LABELS, getNextStatus } from '../components/StatusBadge'
import { Plus, ChevronDown, ArrowLeft } from 'lucide-react'
import { format, differenceInHours } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const PRODUCTS = [
  "IceZ Pro 100 (צ'ילר)",
  "IceZ Cedar (אמבטיה מעץ)",
  "IceZ Acrylic",
  "IceZ Octagon (מתנפחת)",
  "IceZ AIO Duo (חום+קור)",
  "פילטר בסיסי",
  "פילטר מתקדם",
  "כיסוי מגן",
  "כיסוי מגן פרמיום",
]

// Products that require installation by default
const REQUIRES_INSTALL_PRODUCTS = [
  "IceZ Pro 100 (צ'ילר)",
  "IceZ AIO Duo (חום+קור)",
]

const ALL_STATUSES: OrderStatus[] = [
  'new', 'approved', 'paid', 'sent_warehouse',
  'shipped', 'delivered', 'pending_install',
  'completed', 'cancelled', 'returned',
]

function StatusDropdown({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [open, setOpen] = useState(false)
  const updateOrderStatus = useCRMStore((s) => s.updateOrderStatus)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex items-center gap-1 cursor-pointer"
      >
        <OrderStatusBadge status={current} />
        <ChevronDown size={12} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-44 py-1 overflow-hidden">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation()
                  updateOrderStatus(orderId, s)
                  setOpen(false)
                }}
                className={`w-full text-right px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors cursor-pointer ${s === current ? 'bg-gray-50 font-medium' : ''}`}
              >
                {ORDER_STATUS_LABELS[s].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AddOrderModal({ onClose }: { onClose: () => void }) {
  const { customers, addOrder } = useCRMStore()
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    product: PRODUCTS[0],
    amount: '',
    notes: '',
    requiresInstallation: REQUIRES_INSTALL_PRODUCTS.includes(PRODUCTS[0]),
  })

  const handleProductChange = (product: string) => {
    setForm({
      ...form,
      product,
      requiresInstallation: REQUIRES_INSTALL_PRODUCTS.includes(product),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerId || !form.product) return
    addOrder({
      customerId: form.customerId,
      product: form.product,
      amount: Number(form.amount) || 0,
      status: 'new',
      requiresInstallation: form.requiresInstallation,
      notes: form.notes,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1a3a5c] text-lg">הזמנה חדשה</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">לקוח *</label>
            <select
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מוצר *</label>
            <select
              value={form.product}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white"
            >
              {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סכום (₪)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 resize-none"
              placeholder="הערות על ההזמנה..."
            />
          </div>

          {/* Installation checkbox */}
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-[#4fc3f7] hover:bg-[#4fc3f7]/5 transition-colors">
            <input
              type="checkbox"
              checked={form.requiresInstallation}
              onChange={(e) => setForm({ ...form, requiresInstallation: e.target.checked })}
              className="w-4 h-4 rounded accent-[#1a3a5c] cursor-pointer"
            />
            <div>
              <div className="text-sm font-medium text-[#1a3a5c]">המוצר דורש התקנה</div>
              <div className="text-xs text-gray-400">הסטטוס "ממתינה להתקנה" יופיע לפני השלמה</div>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1a3a5c] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
            >
              צור הזמנה
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Orders() {
  const { customers, orders, updateOrderStatus } = useCRMStore()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)

  const getCustomer = (id: string) => customers.find((c) => c.id === id)

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus)

  const sorted = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">הזמנות</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          הזמנה חדשה
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${filterStatus === 'all' ? 'bg-[#1a3a5c] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
        >
          הכל ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length
          if (count === 0) return null
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${filterStatus === s ? 'bg-[#1a3a5c] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
            >
              {ORDER_STATUS_LABELS[s].label} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">מספר</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600">לקוח</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden md:table-cell">מוצר</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">סכום</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600">סטטוס</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">עודכן</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((order) => {
                const customer = getCustomer(order.customerId)
                const hrs = differenceInHours(new Date(), order.updatedAt)
                const isStale = hrs >= 48 && !['completed', 'cancelled', 'returned'].includes(order.status)
                const nextStatus = getNextStatus(order)

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${isStale ? 'bg-orange-50/40' : ''}`}
                    onClick={() => navigate(`/customers/${order.customerId}`)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-xs text-gray-500">{order.orderNumber}</div>
                      {order.requiresInstallation && (
                        <div className="text-[10px] text-amber-600 mt-0.5">דורש התקנה</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#1a3a5c]">{customer?.name || '—'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell max-w-48 truncate">
                      {order.product}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#1a3a5c] hidden sm:table-cell">
                      {order.amount.toLocaleString('he-IL')}₪
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown orderId={order.id} current={order.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="text-xs text-gray-500">{format(order.updatedAt, 'dd/MM/yy HH:mm')}</div>
                      {isStale && <div className="text-xs text-orange-500 mt-0.5">לא עודכן {hrs}ש'</div>}
                    </td>
                    {/* Next step button */}
                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                      {nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          className="flex items-center gap-1 text-xs font-medium text-[#1a3a5c] bg-[#1a3a5c]/5 hover:bg-[#4fc3f7]/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap border border-[#1a3a5c]/10"
                          title={`קדם ל: ${ORDER_STATUS_LABELS[nextStatus].label}`}
                        >
                          {ORDER_STATUS_LABELS[nextStatus].label}
                          <ArrowLeft size={11} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                    אין הזמנות בסטטוס זה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          מציג {sorted.length} הזמנות
        </div>
      </div>

      {showAdd && <AddOrderModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
