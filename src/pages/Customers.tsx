import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRMStore } from '../store'
import type { LeadSource, CustomerType } from '../types'
import { Search, Plus, Building2, User, Globe, MessageCircle, Share2, Handshake } from 'lucide-react'
import { format } from 'date-fns'

const sourceLabels: Record<LeadSource, { label: string; icon: React.ElementType; color: string }> = {
  website:  { label: 'אתר', icon: Globe, color: 'text-blue-600 bg-blue-50' },
  whatsapp: { label: 'וואטסאפ', icon: MessageCircle, color: 'text-green-600 bg-green-50' },
  social:   { label: 'סושיאל', icon: Share2, color: 'text-purple-600 bg-purple-50' },
  direct:   { label: 'ישיר', icon: Handshake, color: 'text-orange-600 bg-orange-50' },
}

function AddCustomerModal({ onClose }: { onClose: () => void }) {
  const addCustomer = useCRMStore((s) => s.addCustomer)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    source: 'website' as LeadSource,
    type: 'private' as CustomerType,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addCustomer({ ...form, status: 'active', notInAccounting: false })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1a3a5c] text-lg">לקוח חדש</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20"
              placeholder="שם הלקוח"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20"
                placeholder="05X-XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20"
                placeholder="example@mail.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מקור</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white"
              >
                <option value="website">אתר</option>
                <option value="whatsapp">וואטסאפ</option>
                <option value="social">סושיאל</option>
                <option value="direct">ישיר</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CustomerType })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white"
              >
                <option value="private">פרטי</option>
                <option value="business">עסקי</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1a3a5c] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
            >
              הוסף לקוח
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

export function Customers() {
  const { customers, orders, quotes } = useCRMStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterSource, setFilterSource] = useState<LeadSource | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchSource = filterSource === 'all' || c.source === filterSource
    return matchSearch && matchSource
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">לקוחות</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          לקוח חדש
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
          <input
            type="text"
            placeholder="חיפוש לפי שם, טלפון, אימייל..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm bg-white focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20"
          />
        </div>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value as LeadSource | 'all')}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#4fc3f7] cursor-pointer"
        >
          <option value="all">כל המקורות</option>
          <option value="website">אתר</option>
          <option value="whatsapp">וואטסאפ</option>
          <option value="social">סושיאל</option>
          <option value="direct">ישיר</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">שם</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">טלפון</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden md:table-cell">אימייל</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600">מקור</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">כניסה</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600">פעילות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => {
                const src = sourceLabels[customer.source]
                const SrcIcon = src.icon
                const customerOrders = orders.filter((o) => o.customerId === customer.id).length
                const customerQuotes = quotes.filter((q) => q.customerId === customer.id).length
                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1a3a5c]/10 flex items-center justify-center shrink-0">
                          {customer.type === 'business'
                            ? <Building2 size={14} className="text-[#1a3a5c]" />
                            : <User size={14} className="text-[#1a3a5c]" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#1a3a5c]">{customer.name}</span>
                            {customer.notInAccounting && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 leading-none">
                                לא ברווחית
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{customer.type === 'business' ? 'עסקי' : 'פרטי'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">{customer.phone}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{customer.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${src.color}`}>
                        <SrcIcon size={11} />
                        {src.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden lg:table-cell">
                      {format(customer.createdAt, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 rounded-full px-2 py-0.5">{customerOrders} הזמנות</span>
                        <span className="bg-gray-100 rounded-full px-2 py-0.5">{customerQuotes} הצעות</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    לא נמצאו לקוחות
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          מציג {filtered.length} מתוך {customers.length} לקוחות
        </div>
      </div>

      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
