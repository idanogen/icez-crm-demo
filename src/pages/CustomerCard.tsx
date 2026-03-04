import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCRMStore } from '../store'
import { OrderStatusBadge, QuoteStatusBadge } from '../components/StatusBadge'
import {
  ArrowRight, Phone, Mail, Globe, MessageCircle, Share2, Handshake,
  Building2, User, Plus, ShoppingCart, FileText, Clock, StickyNote,
  Pencil, Check, X as XIcon
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import type { LeadSource } from '../types'
import { QuotePDFModal } from '../components/QuotePDFModal'

const sourceConfig: Record<LeadSource, { label: string; icon: React.ElementType; color: string }> = {
  website:  { label: 'אתר', icon: Globe, color: 'text-blue-600 bg-blue-50' },
  whatsapp: { label: 'וואטסאפ', icon: MessageCircle, color: 'text-green-600 bg-green-50' },
  social:   { label: 'סושיאל', icon: Share2, color: 'text-purple-600 bg-purple-50' },
  direct:   { label: 'ישיר', icon: Handshake, color: 'text-orange-600 bg-orange-50' },
}

const INSTALL_PRODUCTS = ["IceZ Pro 100 (צ'ילר)", "IceZ AIO Duo (חום+קור)"]

function AddOrderModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const addOrder = useCRMStore((s) => s.addOrder)
  const PRODUCTS = [
    { name: "IceZ Pro 100 (צ'ילר)", price: 4800 },
    { name: "IceZ Cedar (אמבטיה מעץ)", price: 2200 },
    { name: "IceZ Acrylic", price: 1400 },
    { name: "IceZ Octagon (מתנפחת)", price: 890 },
    { name: "IceZ AIO Duo (חום+קור)", price: 7900 },
    { name: "פילטר בסיסי", price: 200 },
    { name: "פילטר מתקדם", price: 350 },
    { name: "כיסוי מגן", price: 380 },
  ]
  const [form, setForm] = useState({
    product: PRODUCTS[0].name,
    amount: String(PRODUCTS[0].price),
    notes: '',
    requiresInstallation: INSTALL_PRODUCTS.includes(PRODUCTS[0].name),
  })

  const handleProductChange = (name: string) => {
    const p = PRODUCTS.find((p) => p.name === name)
    setForm({ ...form, product: name, amount: String(p?.price || 0), requiresInstallation: INSTALL_PRODUCTS.includes(name) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addOrder({ customerId, product: form.product, amount: Number(form.amount), status: 'new', requiresInstallation: form.requiresInstallation, notes: form.notes })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1a3a5c] text-lg">הזמנה חדשה ללקוח</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מוצר</label>
            <select value={form.product} onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white">
              {PRODUCTS.map((p) => <option key={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סכום (₪)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-[#4fc3f7] hover:bg-[#4fc3f7]/5 transition-colors">
            <input type="checkbox" checked={form.requiresInstallation}
              onChange={(e) => setForm({ ...form, requiresInstallation: e.target.checked })}
              className="w-4 h-4 rounded accent-[#1a3a5c] cursor-pointer" />
            <div>
              <div className="text-sm font-medium text-[#1a3a5c]">המוצר דורש התקנה</div>
              <div className="text-xs text-gray-400">הסטטוס "ממתינה להתקנה" יופיע לפני השלמה</div>
            </div>
          </label>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 bg-[#1a3a5c] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer">
              צור הזמנה
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

function AddQuoteModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const addQuote = useCRMStore((s) => s.addQuote)
  const PRODUCTS = [
    { name: "IceZ Pro 100 (צ'ילר)", price: 4800 },
    { name: "IceZ Cedar (אמבטיה מעץ)", price: 2200 },
    { name: "IceZ Acrylic", price: 1400 },
    { name: "IceZ Octagon (מתנפחת)", price: 890 },
    { name: "IceZ AIO Duo (חום+קור)", price: 7900 },
    { name: "פילטר בסיסי", price: 200 },
    { name: "פילטר מתקדם", price: 350 },
  ]
  const [product, setProduct] = useState(PRODUCTS[0].name)
  const [price, setPrice] = useState(String(PRODUCTS[0].price))
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addQuote({
      customerId,
      items: [{ product, quantity: 1, unitPrice: Number(price), discount: 0 }],
      totalAmount: Number(price),
      discount: 0,
      notes,
      status: 'sent',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1a3a5c] text-lg">הצעת מחיר ללקוח</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מוצר</label>
            <select value={product}
              onChange={(e) => {
                const p = PRODUCTS.find((p) => p.name === e.target.value)
                setProduct(e.target.value)
                setPrice(String(p?.price || 0))
              }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] bg-white"
            >
              {PRODUCTS.map((p) => <option key={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מחיר (₪)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
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

export function CustomerCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customers, orders, quotes, addCustomerNote, updateCustomer } = useCRMStore()

  const customer = customers.find((c) => c.id === id)
  if (!customer) return (
    <div className="text-center py-20 text-gray-500">
      <div>לקוח לא נמצא</div>
      <button onClick={() => navigate('/customers')} className="mt-3 text-[#4fc3f7] cursor-pointer">
        חזור ללקוחות
      </button>
    </div>
  )

  const customerOrders = orders
    .filter((o) => o.customerId === id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const customerQuotes = quotes
    .filter((q) => q.customerId === id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const totalRevenue = customerOrders
    .filter((o) => ['completed', 'shipped', 'warehouse'].includes(o.status))
    .reduce((sum, o) => sum + o.amount, 0)

  const src = sourceConfig[customer.source]
  const SrcIcon = src.icon

  const [noteText, setNoteText] = useState('')
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [showAddQuote, setShowAddQuote] = useState(false)
  const [pdfQuoteId, setPdfQuoteId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    source: customer.source,
    type: customer.type,
  })

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) return
    updateCustomer(customer.id, editForm)
    setEditing(false)
  }

  const handleCancelEdit = () => {
    setEditForm({ name: customer.name, phone: customer.phone, email: customer.email, source: customer.source, type: customer.type })
    setEditing(false)
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addCustomerNote(customer.id, noteText)
    setNoteText('')
  }

  // Build timeline
  type TimelineItem = {
    id: string; type: 'order' | 'quote' | 'note'; date: Date; content: React.ReactNode
  }
  const timeline: TimelineItem[] = [
    ...customerOrders.map((o) => ({
      id: o.id, type: 'order' as const, date: o.createdAt,
      content: (
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-[#1a3a5c]">{o.orderNumber}</span>
              <OrderStatusBadge status={o.status} />
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{o.product} · {o.amount.toLocaleString('he-IL')}₪</div>
            {o.notes && <div className="text-xs text-gray-400 mt-0.5 italic">{o.notes}</div>}
          </div>
          <span className="text-xs text-gray-400 shrink-0">{format(o.createdAt, 'dd/MM/yy')}</span>
        </div>
      ),
    })),
    ...customerQuotes.map((q) => ({
      id: q.id, type: 'quote' as const, date: q.createdAt,
      content: (
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-[#1a3a5c]">{q.quoteNumber}</span>
              <QuoteStatusBadge status={q.status} daysOld={differenceInDays(new Date(), q.sentAt)} />
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{q.totalAmount.toLocaleString('he-IL')}₪</div>
            {q.notes && <div className="text-xs text-gray-400 mt-0.5 italic">{q.notes}</div>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPdfQuoteId(q.id)}
              className="text-[#1a3a5c]/40 hover:text-[#1a3a5c] transition-colors cursor-pointer p-1 rounded hover:bg-[#1a3a5c]/5"
              title="הצג PDF"
            >
              <FileText size={14} />
            </button>
            <span className="text-xs text-gray-400">{format(q.createdAt, 'dd/MM/yy')}</span>
          </div>
        </div>
      ),
    })),
    ...customer.notes.map((n) => ({
      id: n.id, type: 'note' as const, date: n.createdAt,
      content: (
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm text-gray-700">{n.text}</div>
          <span className="text-xs text-gray-400 shrink-0">{format(n.createdAt, 'dd/MM/yy HH:mm')}</span>
        </div>
      ),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const typeConfig = {
    order: { icon: ShoppingCart, color: 'bg-[#1a3a5c] text-white', label: 'הזמנה' },
    quote: { icon: FileText, color: 'bg-[#4fc3f7] text-[#1a3a5c]', label: 'הצעה' },
    note:  { icon: StickyNote, color: 'bg-yellow-400 text-yellow-900', label: 'הערה' },
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a3a5c] transition-colors cursor-pointer"
      >
        <ArrowRight size={16} />
        חזור ללקוחות
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-[#1a3a5c]/10 flex items-center justify-center shrink-0">
              {(editing ? editForm.type : customer.type) === 'business'
                ? <Building2 size={26} className="text-[#1a3a5c]" />
                : <User size={26} className="text-[#1a3a5c]" />
              }
            </div>

            {editing ? (
              /* ── Edit mode ── */
              <div className="flex-1 min-w-0 space-y-3">
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full text-lg font-bold border-b-2 border-[#4fc3f7] bg-transparent focus:outline-none text-[#1a3a5c] pb-0.5"
                  placeholder="שם הלקוח"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#4fc3f7] focus-within:ring-2 focus-within:ring-[#4fc3f7]/20 bg-white">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="flex-1 text-sm bg-transparent focus:outline-none text-[#1a3a5c] min-w-0"
                      placeholder="טלפון"
                    />
                  </label>
                  <label className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#4fc3f7] focus-within:ring-2 focus-within:ring-[#4fc3f7]/20 bg-white">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="flex-1 text-sm bg-transparent focus:outline-none text-[#1a3a5c] min-w-0"
                      placeholder="אימייל"
                    />
                  </label>
                  <select
                    value={editForm.source}
                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value as typeof editForm.source })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4fc3f7]"
                  >
                    <option value="website">אתר</option>
                    <option value="whatsapp">וואטסאפ</option>
                    <option value="social">סושיאל</option>
                    <option value="direct">ישיר</option>
                  </select>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as typeof editForm.type })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4fc3f7]"
                  >
                    <option value="private">פרטי</option>
                    <option value="business">עסקי</option>
                  </select>
                </div>
              </div>
            ) : (
              /* ── View mode ── */
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-[#1a3a5c]">{customer.name}</h1>
                  {customer.notInAccounting && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300">
                      ⚠ לא ברווחית
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${src.color}`}>
                    <SrcIcon size={11} />
                    {src.label}
                  </span>
                  <span className="text-xs text-gray-500">{customer.type === 'business' ? 'עסקי' : 'פרטי'}</span>
                  <span className="text-xs text-gray-400">לקוח מ-{format(customer.createdAt, 'dd/MM/yyyy')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats + edit toggle */}
          <div className="flex items-start gap-4">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-[#1a3a5c]">{customerOrders.length}</div>
                <div className="text-xs text-gray-500">הזמנות</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#1a3a5c]">{customerQuotes.length}</div>
                <div className="text-xs text-gray-500">הצעות</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-emerald-600">{totalRevenue.toLocaleString('he-IL')}₪</div>
                <div className="text-xs text-gray-500">הכנסה</div>
              </div>
            </div>

            {/* Edit / Save / Cancel */}
            {editing ? (
              <div className="flex gap-1.5">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <Check size={14} />
                  שמור
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-[#1a3a5c] border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <Pencil size={13} />
                עריכה
              </button>
            )}
          </div>
        </div>

        {/* Contact info (view mode only) */}
        {!editing && (
          <div className="flex gap-4 mt-5 flex-wrap">
            {customer.phone && (
              <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#4fc3f7] transition-colors cursor-pointer">
                <Phone size={14} />
                {customer.phone}
              </a>
            )}
            {customer.email && (
              <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#4fc3f7] transition-colors cursor-pointer">
                <Mail size={14} />
                {customer.email}
              </a>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setShowAddOrder(true)}
            className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0f2236] transition-colors cursor-pointer"
          >
            <ShoppingCart size={15} />
            הזמנה חדשה
          </button>
          <button
            onClick={() => setShowAddQuote(true)}
            className="flex items-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/5 transition-colors cursor-pointer"
          >
            <FileText size={15} />
            הצעת מחיר חדשה
          </button>
          {customer.notInAccounting && (
            <button
              onClick={() => updateCustomer(customer.id, { notInAccounting: false })}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              ✓ נכנס לרווחית
            </button>
          )}
        </div>
      </div>

      {/* Note input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-[#1a3a5c] mb-3 text-sm">הוסף הערה ללוג</h2>
        <div className="flex gap-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            placeholder="הוסף הערה, פעולה שבוצעה, שיחה..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 resize-none"
          />
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            className="self-end px-4 py-2.5 bg-[#4fc3f7] text-[#1a3a5c] rounded-xl text-sm font-medium hover:bg-[#38b2f5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-[#1a3a5c] mb-4 flex items-center gap-2">
          <Clock size={16} />
          היסטוריית פעילות ({timeline.length})
        </h2>
        {timeline.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">אין פעילות עדיין</div>
        ) : (
          <div className="relative">
            <div className="absolute right-5 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-4">
              {timeline.map((item) => {
                const cfg = typeConfig[item.type]
                const ItemIcon = cfg.icon
                return (
                  <div key={item.id} className="flex gap-4 relative">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${cfg.color}`}>
                      <ItemIcon size={15} />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      {item.content}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showAddOrder && <AddOrderModal customerId={customer.id} onClose={() => setShowAddOrder(false)} />}
      {showAddQuote && <AddQuoteModal customerId={customer.id} onClose={() => setShowAddQuote(false)} />}
      {pdfQuoteId && <QuotePDFModal quoteId={pdfQuoteId} onClose={() => setPdfQuoteId(null)} />}
    </div>
  )
}
