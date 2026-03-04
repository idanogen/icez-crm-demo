import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'
import type { Quote, Customer } from '../types'

// Register Hebrew-compatible font (TTF served from /public/fonts)
const origin = typeof window !== 'undefined' ? window.location.origin : ''
Font.register({
  family: 'Rubik',
  fonts: [
    { src: `${origin}/fonts/Rubik-Regular.ttf` },
    { src: `${origin}/fonts/Rubik-Bold.ttf`, fontWeight: 'bold' },
  ],
})

const NAVY = '#1a3a5c'
const BLUE = '#4fc3f7'
const LIGHT = '#e8f4fd'
const GRAY = '#64748b'
const LIGHT_GRAY = '#f8fafc'
const BORDER = '#e2e8f0'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Rubik',
    fontSize: 10,
    color: NAVY,
    backgroundColor: '#ffffff',
    direction: 'rtl',
  },

  // Header band
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BLUE,
    letterSpacing: 3,
  },
  brandTagline: {
    fontSize: 9,
    color: '#93c5fd',
    marginTop: 3,
    letterSpacing: 1,
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  docTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  docNumber: {
    fontSize: 11,
    color: BLUE,
    marginTop: 4,
    textAlign: 'left',
  },
  docDate: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 3,
    textAlign: 'left',
  },

  // Blue accent bar
  accentBar: {
    height: 4,
    backgroundColor: BLUE,
  },

  // Body
  body: {
    paddingHorizontal: 40,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // Two-column info section
  infoRow: {
    flexDirection: 'row-reverse',
    gap: 16,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  infoBoxTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'right',
  },
  infoLine: {
    fontSize: 10,
    color: NAVY,
    marginBottom: 3,
    textAlign: 'right',
  },
  infoLineMuted: {
    fontSize: 9,
    color: GRAY,
    textAlign: 'right',
  },

  // Items table
  tableTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 8,
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: NAVY,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 1,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: LIGHT_GRAY,
  },
  tableCell: {
    fontSize: 10,
    color: NAVY,
    textAlign: 'right',
  },
  tableCellMuted: {
    fontSize: 9,
    color: GRAY,
    textAlign: 'right',
  },
  colProduct: { flex: 3 },
  colQty:     { flex: 1 },
  colPrice:   { flex: 1.5 },
  colDiscount:{ flex: 1 },
  colTotal:   { flex: 1.5 },

  // Totals
  totalsSection: {
    marginTop: 16,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  totalsBox: {
    width: 220,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    overflow: 'hidden',
  },
  totalsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalsLabel: {
    fontSize: 9,
    color: GRAY,
    textAlign: 'right',
  },
  totalsValue: {
    fontSize: 10,
    color: NAVY,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  totalsFinalRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: NAVY,
  },
  totalsFinalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  totalsFinalValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: BLUE,
    textAlign: 'left',
  },

  // Notes
  notesSection: {
    marginTop: 20,
    backgroundColor: LIGHT,
    borderRadius: 6,
    padding: 14,
    borderRightWidth: 3,
    borderRightColor: BLUE,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 5,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 10,
    color: GRAY,
    lineHeight: 1.6,
    textAlign: 'right',
  },

  // Validity strip
  validityStrip: {
    marginTop: 20,
    backgroundColor: '#fff7ed',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  validityText: {
    fontSize: 9,
    color: '#92400e',
    textAlign: 'right',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: LIGHT_GRAY,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 40,
    paddingVertical: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: GRAY,
    textAlign: 'right',
  },
  footerBrand: {
    fontSize: 9,
    fontWeight: 'bold',
    color: NAVY,
    textAlign: 'left',
  },
  footerWebsite: {
    fontSize: 8,
    color: BLUE,
    textAlign: 'left',
  },
})

function formatPrice(n: number) {
  return `₪${n.toLocaleString('he-IL')}`
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

function getValidUntil(sentAt: Date) {
  const d = new Date(sentAt)
  d.setDate(d.getDate() + 30)
  return d
}

interface QuotePDFProps {
  quote: Quote
  customer: Customer
}

export function QuotePDFDocument({ quote, customer }: QuotePDFProps) {
  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const discountAmount = quote.items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice * (item.discount / 100)
  }, 0)
  const total = subtotal - discountAmount
  const validUntil = getValidUntil(quote.sentAt)

  return (
    <Document
      title={`הצעת מחיר ${quote.quoteNumber} - ICEZ`}
      author="ICEZ"
      subject="הצעת מחיר"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerRight}>
            <Text style={s.brandName}>ICEZ</Text>
            <Text style={s.brandTagline}>ICE BATH · CHILLERS · RECOVERY</Text>
          </View>
          <View style={s.headerLeft}>
            <Text style={s.docTitle}>הצעת מחיר</Text>
            <Text style={s.docNumber}>{quote.quoteNumber}</Text>
            <Text style={s.docDate}>תאריך: {formatDate(quote.sentAt)}</Text>
          </View>
        </View>
        <View style={s.accentBar} />

        {/* Body */}
        <View style={s.body}>

          {/* Customer & Company Info */}
          <View style={s.infoRow}>
            {/* Customer */}
            <View style={s.infoBox}>
              <Text style={s.infoBoxTitle}>פרטי הלקוח</Text>
              <Text style={s.infoLine}>{customer.name}</Text>
              {customer.phone && <Text style={s.infoLineMuted}>{customer.phone}</Text>}
              {customer.email && <Text style={s.infoLineMuted}>{customer.email}</Text>}
              <Text style={s.infoLineMuted}>{customer.type === 'business' ? 'לקוח עסקי' : 'לקוח פרטי'}</Text>
            </View>

            {/* Company */}
            <View style={s.infoBox}>
              <Text style={s.infoBoxTitle}>פרטי החברה</Text>
              <Text style={s.infoLine}>ICEZ Technologies Ltd.</Text>
              <Text style={s.infoLineMuted}>icez.life</Text>
              <Text style={s.infoLineMuted}>info@icez.life</Text>
              <Text style={s.infoLineMuted}>ישראל</Text>
            </View>
          </View>

          {/* Items table */}
          <Text style={s.tableTitle}>פירוט ההצעה</Text>

          {/* Table header */}
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, s.colProduct]}>מוצר / שירות</Text>
            <Text style={[s.tableHeaderText, s.colQty]}>כמות</Text>
            <Text style={[s.tableHeaderText, s.colPrice]}>מחיר יחידה</Text>
            <Text style={[s.tableHeaderText, s.colDiscount]}>הנחה</Text>
            <Text style={[s.tableHeaderText, s.colTotal]}>סה"כ שורה</Text>
          </View>

          {/* Table rows */}
          {quote.items.map((item, i) => {
            const lineTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
            return (
              <View key={i} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
                <Text style={[s.tableCell, s.colProduct]}>{item.product}</Text>
                <Text style={[s.tableCell, s.colQty]}>{item.quantity}</Text>
                <Text style={[s.tableCell, s.colPrice]}>{formatPrice(item.unitPrice)}</Text>
                <Text style={[s.tableCellMuted, s.colDiscount]}>
                  {item.discount > 0 ? `${item.discount}%` : '—'}
                </Text>
                <Text style={[s.tableCell, s.colTotal]}>{formatPrice(Math.round(lineTotal))}</Text>
              </View>
            )
          })}

          {/* Totals */}
          <View style={s.totalsSection}>
            <View style={s.totalsBox}>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>סכום לפני הנחה</Text>
                <Text style={s.totalsValue}>{formatPrice(subtotal)}</Text>
              </View>
              {discountAmount > 0 && (
                <View style={s.totalsRow}>
                  <Text style={s.totalsLabel}>הנחה</Text>
                  <Text style={[s.totalsValue, { color: '#16a34a' }]}>- {formatPrice(Math.round(discountAmount))}</Text>
                </View>
              )}
              <View style={s.totalsFinalRow}>
                <Text style={s.totalsFinalLabel}>סה"כ לתשלום</Text>
                <Text style={s.totalsFinalValue}>{formatPrice(Math.round(total))}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {quote.notes && (
            <View style={s.notesSection}>
              <Text style={s.notesTitle}>הערות והבהרות</Text>
              <Text style={s.notesText}>{quote.notes}</Text>
            </View>
          )}

          {/* Validity */}
          <View style={s.validityStrip}>
            <Text style={s.validityText}>
              הצעת מחיר זו בתוקף עד {formatDate(validUntil)}. לאישור ולקבלת פרטי תשלום, צרו קשר עם נציג המכירות שלנו.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <View>
            <Text style={s.footerText}>הצעת מחיר מס' {quote.quoteNumber}</Text>
            <Text style={s.footerText}>תאריך הפקה: {formatDate(new Date())}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.footerBrand}>ICEZ — Ice Bath & Recovery</Text>
            <Text style={s.footerWebsite}>icez.life</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
