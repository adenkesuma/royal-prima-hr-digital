'use client'
import { Bell, Search } from 'lucide-react'
import { useState } from 'react'
import { NOTIFIKASI } from '@/lib/data'

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [showNotif, setShowNotif] = useState(false)
  const unread = NOTIFIKASI.filter(n => !n.dibaca).length

  return (
    <header className="flex items-center justify-between px-6 h-16 shrink-0"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div>
        <h1 className="text-base font-bold" style={{ color: '#1E293B' }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: '#64748B' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: '#94A3B8' }} />
          <input className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#FAF7F2', border: '1px solid #E2E8F0', color: '#1E293B', width: 200 }}
            placeholder="Cari..." />
        </div>
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FAF7F2', border: '1px solid #E2E8F0' }}>
            <Bell className="w-4 h-4" style={{ color: '#64748B' }} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#EF4444', fontSize: 9 }}>{unread}</span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
                <span className="font-semibold text-sm" style={{ color: '#1E293B' }}>Notifikasi</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{unread} baru</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {NOTIFIKASI.map(n => (
                  <div key={n.id} className="flex gap-3 px-4 py-3 text-sm"
                    style={{ borderBottom: '1px solid #F1F5F9', background: n.dibaca ? 'transparent' : '#EFF6FF' }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: n.dibaca ? '#CBD5E1' : '#2563EB' }} />
                    <div className="flex-1">
                      <p style={{ color: '#334155' }} className="leading-snug">{n.pesan}</p>
                      <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{n.waktu}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs font-medium" style={{ color: '#2563EB' }}>Lihat semua notifikasi</button>
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs font-medium" style={{ color: '#1E293B' }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>
    </header>
  )
}
