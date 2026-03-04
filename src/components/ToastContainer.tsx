import { useCRMStore } from '../store'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useCRMStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info
        const colors = {
          success: 'bg-emerald-600 text-white',
          error: 'bg-red-600 text-white',
          info: 'bg-[#1a3a5c] text-white',
        }
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-64 ${colors[toast.type]} animate-slide-in`}
            style={{ animation: 'slideInLeft 0.3s ease-out' }}
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white cursor-pointer"
              aria-label="סגור"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
