'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield, Clock, TrendingUp, Users, Zap } from 'lucide-react'

const DEMO_USERS = [
  { email: 'ahmad@royalprima.com',  password: 'admin123',    role: 'Admin',    initial: 'AM' },
  { email: 'siti@royalprima.com',   password: 'hr123',       role: 'HR',       initial: 'SR' },
  { email: 'budi@royalprima.com',   password: 'manajer123',  role: 'Manajer',  initial: 'BS' },
  { email: 'dewi@royalprima.com',   password: 'karyawan123', role: 'Karyawan', initial: 'DL' },
]

const stats = [
  { icon: Users,     val: '248',    label: 'Total Karyawan' },
  { icon: Clock,     val: '60 Hk',  label: 'Waktu Pengerjaan' },
  { icon: TrendingUp,val: '<6 Bln', label: 'ROI Balik Modal' },
  { icon: Zap,       val: '15 Jam', label: 'Hemat HR/Minggu' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 700))
    const found = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (found) router.push('/dashboard')
    else setError('Email atau password salah. Gunakan akun demo di bawah.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF7F2' }}>

      {/* ── Left panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 px-16 py-12"
        style={{ background: '#1E3A5F' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: '#2563EB' }}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest" style={{ color: '#93C5FD' }}>RSU ROYAL PRIMA</div>
            <div className="text-white font-bold text-lg leading-tight">HR Digital System</div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white leading-snug mb-4">
          Transformasi Digital<br />
          <span style={{ color: '#93C5FD' }}>Manajemen SDM</span>
        </h1>
        <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Sistem terintegrasi untuk absensi, lembur, izin, cuti, penjadwalan, dan sinkronisasi fingerprint ke ERP secara real-time.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(37,99,235,0.5)' }}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">{s.val}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#2563EB' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider" style={{ color: '#2563EB' }}>RSU ROYAL PRIMA</div>
              <div className="font-bold" style={{ color: '#1E293B' }}>HR Digital System</div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8"
            style={{ background: '#FFFFFF', border: '1px solid #E8E2D9', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>

            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1E293B' }}>Selamat Datang</h2>
            <p className="text-sm mb-7" style={{ color: '#64748B' }}>Masuk untuk mengakses dashboard HR</p>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="nama@royalprima.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#FAF7F2', border: '1.5px solid #E8E2D9', color: '#1E293B' }} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: '#FAF7F2', border: '1.5px solid #E8E2D9', color: '#1E293B' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-3.5" style={{ color: '#94A3B8' }}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all mt-2"
                style={{ background: loading ? '#93C5FD' : '#2563EB', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                {loading ? 'Memverifikasi...' : 'Masuk →'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #E8E2D9' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>AKUN DEMO — klik untuk isi otomatis</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_USERS.map(u => (
                  <button key={u.email}
                    onClick={() => { setEmail(u.email); setPassword(u.password) }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{ background: '#FAF7F2', border: '1px solid #E8E2D9' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{u.initial}</div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: '#1E293B' }}>{u.role}</div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>{u.email.split('@')[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
