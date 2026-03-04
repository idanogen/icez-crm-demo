import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, ShoppingCart, FileText,
  Menu, Snowflake
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'לוח בקרה', icon: LayoutDashboard },
  { to: '/customers', label: 'לקוחות', icon: Users },
  { to: '/orders', label: 'הזמנות', icon: ShoppingCart },
  { to: '/quotes', label: 'הצעות מחיר', icon: FileText },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-60 bg-[#1a3a5c] flex flex-col z-40
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-[#4fc3f7] rounded-xl flex items-center justify-center">
            <Snowflake size={20} className="text-[#1a3a5c]" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none">ICEZ</div>
            <div className="text-[#4fc3f7] text-xs">מערכת CRM</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer
                ${isActive
                  ? 'bg-[#4fc3f7] text-[#1a3a5c]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="text-white/40 text-xs text-center">
            ICEZ CRM Demo v1.0
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:mr-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-[#1a3a5c] flex items-center justify-between px-4 py-3 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4fc3f7] rounded-lg flex items-center justify-center">
              <Snowflake size={16} className="text-[#1a3a5c]" />
            </div>
            <span className="text-white font-bold">ICEZ CRM</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white p-1 cursor-pointer"
            aria-label="פתח תפריט"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
