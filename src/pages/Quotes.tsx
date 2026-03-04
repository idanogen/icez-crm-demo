import { useState } from 'react'
import { useCRMStore } from '../store'
import type { QuoteStatus, QuoteItem } from '../types'
import { QuoteStatusBadge, QUOTE_STATUS_LABELS } from '../components/StatusBadge'
import { differenceInDays, format } from 'date-fns'
import { Plus, ChevronDown, X, FileText, UserPlus, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { QuotePDFModal } from '../components/QuotePDFModal'

const PRODUCTS = [
  { name: "IceZ Pro 100 (צ'ילר)", price: 4800 },
  { name: "IceZ Cedar (אמבטיה מעץ)", price: 2200 },
  { name: "IceZ Acrylic", price: 1400 },
  { name: "IceZ Octagon (מתנפחת)", price: 890 },
  { name: "IceZ AIO Duo (חום+קור)", price: 7900 },
  { name: "פילטר בסיסי", price: 200 },
  { name: "פילטר מתקדם", price: 350 },
  { name: "כיסוי מגן", price: 380 },
  { name: "כיסוי מגן פרמיום", price: 400 },
]

const ALL_STATUSES: QuoteStatus[] = ['sent', 'approved', 'closed', 'irrelevant']

function QuoteStatusDropdown({ quoteId, current }: { quoteId: string; current: QuoteStatus }) {
  const [open, setOpen] = useState(false)
  const updateQuoteStatus = useCRMStore((s) => s.updateQuoteStatus)
  const daysOld = differenceInDays(new Date(), useCRMStore((s) => s.quotes.find((q) => q.id === quoteId)!.sentAt))

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex items-center gap-1 cursor-pointer"
      >
        <QuoteStatusBadge status={current} daysOld={daysOld} />
        <ChevronDown size={12} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-36 py-1">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation()
                  updateQuoteStatus(quoteId, s)
                  setOpen(false)
                }}
                className={`w-full text-right px-4 py-2.5 text-xs hover:bg-gray-50 cursor-pointer transition-colors ${s === current ? 'bg-gray-50 font-medium' : ''}`}
              >
                {QUOTE_STATUS_LABELS[s].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function QuoteDetailModal({ quoteId, onClose, onOpenPDF }: { quoteId: string; onClose: () => void; onOpenPDF: () => void }) {
  const { quotes, customers } = useCRMStore()
  const quote = quotes.find((q) => q.id === quoteId)
  if (!quote) return null
  const customer = customers.find((c) => c.id === quote.customerId)
  const days = differenceInDays(new Date(), quote.sentAt)

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white gap-3">
          <div>
            <h2 className="font-bold text-[#1a3a5c] text-lg">{quote.quoteNumber}</h2>
            <div className="text-sm text-gray-500">{customer?.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPDF}
              className="flex items-center gap-1.5 bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
            >
              <FileText size={13} />
              הצג PDF
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Status & dates */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <QuoteStatusBadge status={quote.status} daysOld={days} />
            <div className="text-xs text-gray-500">
              נשלחה: {format(quote.sentAt, 'dd/MM/yyyy')}
              {days > 0 && ` (לפני ${days} ימים)`}
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">פריטים</h3>
            <div className="space-y-2">
              {quote.items.map((item, i) => {
                const lineTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
                    <div>
                      <div className="font-medium text-[#1a3a5c]">{item.product}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {item.unitPrice.toLocaleString('he-IL')}₪
                        {item.discount > 0 && ` (הנחה ${item.discount}%)`}
                      </div>
                    </div>
                    <div className="font-semibold text-[#1a3a5c]">{lineTotal.toLocaleString('he-IL')}₪</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-[#1a3a5c]/5 rounded-xl px-4 py-3">
            <span className="font-bold text-[#1a3a5c]">סה"כ</span>
            <span className="font-bold text-[#1a3a5c] text-lg">{quote.totalAmount.toLocaleString('he-IL')}₪</span>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">הערות</h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{quote.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AddQuoteModal({ onClose }: { onClose: () => void }) {
  const { customers, addQuote, addCustomer } = useCRMStore()
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing')
  const [customerId, setCustomerId] = useState(customers[0]?.id || '')
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' })
  const [items, setItems] = useState<QuoteItem[]>([
    { product: PRODUCTS[0].name, quantity: 1, unitPrice: PRODUCTS[0].price, discount: 0 }
  ])
  const [notes, setNotes] = useState('')

  const updateItem = (i: number, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) => prev.map((item, idx) => {
      if (idx !== i) return item
      if (field === 'product') {
        const p = PRODUCTS.find((p) => p.name === value)
        return { ...item, product: String(value), unitPrice: p?.price ?? item.unitPrice }
      }
      return { ...item, [field]: Number(value) }
    }))
  }

  const total = items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice * (1 - item.discount / 100)
  }, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let targetCustomerId = customerId

    if (customerMode === 'new') {
      if (!newCustomer.name.trim()) return
      // Create customer with notInAccounting = true
      const tempId = `c${Date.now()}`
      addCustomer({
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim(),
        source: 'direct',
        type: 'private',
        status: 'active',
        notInAccounting: true,
      })
      // The store pushes to the front, so grab the first customer after add
      targetCustomerId = tempId
      // Use the store directly to get the newly created id
      const allCustomers = useCRMStore.getState().customers
      targetCustomerId = allCustomers[0].id
    }

    addQuote({ customerId: targetCustomerId, items, totalAmount: Math.round(total), discount: 0, notes, status: 'sent' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-[#1a3a5c] text-lg">הצעת מחיר חדשה</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Customer mode toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">לקוח</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-3">
              <button
                type="button"
                onClick={() => setCustomerMode('existing')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors cursor-pointer ${customerMode === 'existing' ? 'bg-[#1a3a5c] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Users size={15} />
                לקוח קיים
              </button>
              <button
                type="button"
                onClick={() => setCustomerMode('new')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors cursor-pointer ${customerMode === 'new' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <UserPlus size={15} />
                לקוח חדש
              </button>
            </div>

            {customerMode === 'existing' ? (
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.notInAccounting ? ' ★ לא ברווחית' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="border-2 border-amber-300 bg-amber-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus size={15} className="text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">לקוח חדש — ייווצר במערכת ויסומן "לא ברווחית"</span>
                </div>
                <input
                  type="text"
                  placeholder="שם מלא *"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  required={customerMode === 'new'}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="טלפון"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="email"
                    placeholder="אימייל"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">פריטים</label>
              <button
                type="button"
                onClick={() => setItems([...items, { product: PRODUCTS[0].name, quantity: 1, unitPrice: PRODUCTS[0].price, discount: 0 }])}
                className="text-xs text-[#4fc3f7] hover:text-[#1a3a5c] cursor-pointer flex items-center gap-1"
              >
                <Plus size={13} /> הוסף פריט
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={item.product}
                      onChange={(e) => updateItem(i, 'product', e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#4fc3f7]"
                    >
                      {PRODUCTS.map((p) => <option key={p.name}>{p.name}</option>)}
                    </select>
                    {items.length > 1 && (
                      <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 cursor-pointer">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">כמות</label>
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#4fc3f7]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">מחיר יחידה</label>
                      <input type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#4fc3f7]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">הנחה %</label>
                      <input type="number" min={0} max={100} value={item.discount} onChange={(e) => updateItem(i, 'discount', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#4fc3f7]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#1a3a5c]/5 rounded-xl px-4 py-3">
            <span className="font-bold text-[#1a3a5c] text-sm">סה"כ</span>
            <span className="font-bold text-[#1a3a5c]">{Math.round(total).toLocaleString('he-IL')}₪</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] resize-none"
              placeholder="הערות על ההצעה..." />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-[#1a3a5c] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer">
              צור הצעה
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Quotes() {
  const { quotes, customers } = useCRMStore()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'all'>('all')
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)
  const [pdfQuoteId, setPdfQuoteId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const getCustomer = (id: string) => customers.find((c) => c.id === id)

  const filtered = filterStatus === 'all'
    ? quotes
    : quotes.filter((q) => q.status === filterStatus)

  const sorted = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">הצעות מחיר</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          הצעה חדשה
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${filterStatus === 'all' ? 'bg-[#1a3a5c] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
        >
          הכל ({quotes.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const count = quotes.filter((q) => q.status === s).length
          const overdueCount = s === 'sent' ? quotes.filter((q) => q.status === 'sent' && differenceInDays(new Date(), q.sentAt) >= 7).length : 0
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${filterStatus === s ? 'bg-[#1a3a5c] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
            >
              {QUOTE_STATUS_LABELS[s].label} ({count})
              {overdueCount > 0 && <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{overdueCount}</span>}
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
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden md:table-cell">סכום</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600">סטטוס</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">נשלחה</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600">ימים</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((quote) => {
                const customer = getCustomer(quote.customerId)
                const days = differenceInDays(new Date(), quote.sentAt)
                const isOverdue = quote.status === 'sent' && days >= 7
                return (
                  <tr
                    key={quote.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${isOverdue ? 'bg-red-50/40' : ''}`}
                    onClick={() => setSelectedQuoteId(quote.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-xs text-gray-500">{quote.quoteNumber}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        className="font-medium text-[#1a3a5c] hover:text-[#4fc3f7] cursor-pointer text-right"
                        onClick={(e) => { e.stopPropagation(); navigate(`/customers/${quote.customerId}`) }}
                      >
                        {customer?.name || '—'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#1a3a5c] hidden md:table-cell">
                      {quote.totalAmount.toLocaleString('he-IL')}₪
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <QuoteStatusDropdown quoteId={quote.id} current={quote.status} />
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden sm:table-cell">
                      {format(quote.sentAt, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : days >= 4 ? 'text-orange-500' : 'text-gray-500'}`}>
                        {days === 0 ? 'היום' : `${days}י'`}
                        {isOverdue && ' ⚠'}
                      </span>
                    </td>
                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setPdfQuoteId(quote.id)}
                        className="flex items-center gap-1 text-[#1a3a5c]/50 hover:text-[#1a3a5c] transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-[#1a3a5c]/5"
                        title="הצג PDF"
                      >
                        <FileText size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    אין הצעות בסטטוס זה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          מציג {sorted.length} הצעות
        </div>
      </div>

      {selectedQuoteId && (
        <QuoteDetailModal
          quoteId={selectedQuoteId}
          onClose={() => setSelectedQuoteId(null)}
          onOpenPDF={() => { setPdfQuoteId(selectedQuoteId); setSelectedQuoteId(null) }}
        />
      )}
      {pdfQuoteId && <QuotePDFModal quoteId={pdfQuoteId} onClose={() => setPdfQuoteId(null)} />}
      {showAdd && <AddQuoteModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
