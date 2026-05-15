'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Clock, Calendar, AlertCircle, Thermometer,
  CalendarDays, Fingerprint, Users, FileBarChart, LogOut, Shield, ChevronRight
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',            badge: null },
  { href: '/lembur',      icon: Clock,           label: 'Manajemen Lembur',      badge: '2'  },
  { href: '/cuti',        icon: Calendar,        label: 'Izin Cuti',             badge: '2'  },
  { href: '/izin-telat',  icon: AlertCircle,     label: 'Izin Telat',            badge: null },
  { href: '/izin-sakit',  icon: Thermometer,     label: 'Izin Sakit',            badge: null },
  { href: '/jadwal',      icon: CalendarDays,    label: 'Penjadwalan Dinas',     badge: null },
  { href: '/fingerprint', icon: Fingerprint,     label: 'Integrasi Fingerprint', badge: null },
  { href: '/karyawan',    icon: Users,           label: 'Data Karyawan',         badge: null },
  { href: '/laporan',     icon: FileBarChart,    label: 'Laporan & Analitik',    badge: null },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="flex flex-col w-64 h-screen sticky top-0 shrink-0" style={{ background: '#1E3A5F', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2563EB' }}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">HR Digital</div>
          <div className="text-xs font-medium" style={{ color: '#93C5FD' }}>RSU Royal Prima</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-0.5">
        <p className="text-xs font-semibold px-3 mb-3 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Menu Utama</p>
        {NAV.map(item => {
          const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{ background: active ? 'rgba(37,99,235,0.85)' : 'transparent', color: active ? '#FFFFFF' : 'rgba(255,255,255,0.58)' }}>
              <item.icon className="shrink-0" style={{ width: 17, height: 17 }} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{item.badge}</span>}
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
        <div className="flex items-center gap-3 px-3 pt-4 pb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: '#2563EB', color: '#fff' }}>SR</div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">Siti Rahayu</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>HR Manager</div>
          </div>
        </div>
        <Link href="/login" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ color: 'rgba(252,165,165,0.8)' }}>
          <LogOut className="w-4 h-4" /><span>Keluar</span>
        </Link>
      </div>
    </aside>
  )
}
