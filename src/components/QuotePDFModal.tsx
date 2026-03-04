import { useState, useCallback, useEffect, useRef } from 'react'
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { X, Download, MessageCircle, Loader2, FileText, Info } from 'lucide-react'
import { QuotePDFDocument } from './QuotePDF'
import { useCRMStore } from '../store'

interface Props {
  quoteId: string
  onClose: () => void
}

export function QuotePDFModal({ quoteId, onClose }: Props) {
  const { quotes, customers } = useCRMStore()
  const quote = quotes.find((q) => q.id === quoteId)
  const customer = customers.find((c) => c.id === quote?.customerId)

  const [desktopHint, setDesktopHint] = useState(false)
  // Pre-generate PDF blob in the background as soon as the modal opens
  const blobRef = useRef<Blob | null>(null)
  const [blobReady, setBlobReady] = useState(false)

  useEffect(() => {
    if (!quote || !customer) return
    let cancelled = false
    const doc = <QuotePDFDocument quote={quote} customer={customer} />
    pdf(doc).toBlob().then((blob) => {
      if (!cancelled) { blobRef.current = blob; setBlobReady(true) }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [quote?.id, customer?.id])

  const handleWhatsApp = useCallback(() => {
    if (!quote || !customer) return

    const cleaned = customer.phone.replace(/\D/g, '')
    const withoutLeadingZero = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned
    const message = `שלום ${customer.name},\nמצורפת הצעת המחיר ${quote.quoteNumber} מ-ICEZ בסך ₪${quote.totalAmount.toLocaleString('he-IL')}.\nלשאלות ופרטים נוספים אנחנו כאן!`
    const waUrl = `https://wa.me/972${withoutLeadingZero}?text=${encodeURIComponent(message)}`

    // Open WhatsApp FIRST — directly from click event, before anything else
    window.open(waUrl, '_blank')

    // Then download the PDF if blob is ready
    const blob = blobRef.current
    if (blob) {
      const fileName = `${quote.quoteNumber}_ICEZ.pdf`
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = fileName
      a.click()
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
      setDesktopHint(true)
    }
  }, [quote, customer])

  if (!quote || !customer) return null

  const fileName = `${quote.quoteNumber}_ICEZ.pdf`

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-[#1a3a5c] flex items-center justify-between px-5 py-3 shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4fc3f7] rounded-lg flex items-center justify-center shrink-0">
            <FileText size={16} className="text-[#1a3a5c]" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{quote.quoteNumber}</div>
            <div className="text-[#4fc3f7] text-xs">{customer.name} · ₪{quote.totalAmount.toLocaleString('he-IL')}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            {!blobReady
              ? <Loader2 size={16} className="animate-spin" />
              : <MessageCircle size={16} />
            }
            <span className="hidden sm:inline">שלח בוואטסאפ</span>
          </button>

          {/* Download */}
          <PDFDownloadLink
            document={<QuotePDFDocument quote={quote} customer={customer} />}
            fileName={fileName}
          >
            {({ loading }) => (
              <button
                disabled={loading}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer border border-white/20"
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Download size={16} />
                }
                <span className="hidden sm:inline">הורד PDF</span>
              </button>
            )}
          </PDFDownloadLink>

          {/* Close */}
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="סגור"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Desktop attach hint — shown after download+WhatsApp open */}
      {desktopHint && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-start gap-3 shrink-0">
          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 flex-1">
            <strong>הקובץ הורד + ווטסאפ נפתח עם הודעה מוכנה.</strong>
            <span className="block mt-0.5 text-amber-700">
              בחלון הווטסאפ: לחץ על <strong>📎</strong> ← <strong>בחר קובץ</strong> ← בחר את ה-PDF שהורד ← שלח.
            </span>
          </div>
          <button
            onClick={() => setDesktopHint(false)}
            className="text-amber-500 hover:text-amber-700 cursor-pointer shrink-0"
            aria-label="סגור"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-800 overflow-hidden">
        <PDFViewer
          width="100%"
          height="100%"
          showToolbar={false}
          style={{ border: 'none' }}
        >
          <QuotePDFDocument quote={quote} customer={customer} />
        </PDFViewer>
      </div>

      {/* Bottom hint */}
      <div className="bg-[#1a3a5c]/90 text-center py-2 text-xs text-[#4fc3f7] shrink-0">
        בנייד — הקובץ נשלח ישירות לווטסאפ · בדסקטופ — הקובץ יורד ווטסאפ נפתח לצ'אט של הלקוח
      </div>
    </div>
  )
}
