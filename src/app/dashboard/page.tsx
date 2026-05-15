'use client'
import Topbar from '@/components/Topbar'
import { Users, Clock, Calendar, AlertCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { LEMBUR_MONTHLY, ABSENSI_MONTHLY, DEPT_LEMBUR, ABSENSI_DATA, LEMBUR_DATA, IZIN_DATA } from '@/lib/data'

const StatCard = ({ icon: Icon, label, value, sub, color, bg }: any) => (
  <div className="rounded-2xl p-5 flex items-start gap-4"
    style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <p className="text-sm" style={{ color: '#64748B' }}>{label}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: '#1E293B' }}>{value}</p>
      <p className="text-xs mt-1 font-medium" style={{ color }}>{sub}</p>
    </div>
  </div>
)

const statusBadge = (s: string) => {
  const map: any = {
    hadir: ['#DCFCE7','#166534','Hadir'],
    telat: ['#FEF9C3','#A16207','Telat'],
    absen: ['#FEE2E2','#991B1B','Absen'],
    izin:  ['#DBEAFE','#1D4ED8','Izin'],
    cuti:  ['#F3E8FF','#7E22CE','Cuti'],
  }
  const [bg, color, label] = map[s] || ['#F1F5F9','#64748B',s]
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: bg, color }}>{label}</span>
}

export default function Dashboard() {
  const pendingLembur = LEMBUR_DATA.filter(l => l.status === 'pending').length
  const pendingIzin   = IZIN_DATA.filter(i => i.status === 'pending').length
  const hadirHariIni  = ABSENSI_DATA.filter(a => a.status === 'hadir').length
  const telatHariIni  = ABSENSI_DATA.filter(a => a.status === 'telat').length

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Selamat datang di HR Digital RSU Royal Prima" />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}       label="Hadir Hari Ini"  value={`${hadirHariIni}/8`} sub="Karyawan aktif"    color="#166534" bg="#DCFCE7" />
          <StatCard icon={Clock}       label="Lembur Pending"  value={pendingLembur}        sub="Menunggu approval" color="#A16207" bg="#FEF9C3" />
          <StatCard icon={Calendar}    label="Izin Pending"    value={pendingIzin}           sub="Perlu diproses"   color="#7E22CE" bg="#F3E8FF" />
          <StatCard icon={AlertCircle} label="Telat Hari Ini"  value={telatHariIni}          sub="Karyawan terlambat" color="#991B1B" bg="#FEE2E2" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar chart */}
          <div className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold" style={{ color: '#1E293B' }}>Total Jam Lembur</h3>
                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Per bulan 2026</p>
              </div>
              <TrendingUp className="w-5 h-5" style={{ color: '#2563EB' }} />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={LEMBUR_MONTHLY} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="bulan" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, color: '#1E293B' }} />
                <Bar dataKey="jam" fill="#2563EB" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dept lembur */}
          <div className="rounded-2xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1E293B' }}>Lembur per Departemen</h3>
            <div className="space-y-3">
              {DEPT_LEMBUR.map((d, i) => (
                <div key={d.dept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#64748B' }}>{d.dept}</span>
                    <span className="font-semibold" style={{ color: '#1E293B' }}>{d.jam} jam</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#F1F5F9' }}>
                    <div className="h-2 rounded-full" style={{
                      width: `${(d.jam/68)*100}%`,
                      background: ['#2563EB','#7C3AED','#D97706','#DC2626','#059669','#0891B2'][i]
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Absensi line chart */}
          <div className="rounded-2xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1E293B' }}>Tren Kehadiran</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={ABSENSI_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="bulan" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, color: '#1E293B' }} />
                <Line type="monotone" dataKey="hadir" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 3 }} name="Hadir" />
                <Line type="monotone" dataKey="telat" stroke="#D97706" strokeWidth={2} dot={{ fill: '#D97706', r: 3 }} name="Telat" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Absensi hari ini */}
          <div className="rounded-2xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#1E293B' }}>Absensi Hari Ini</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>Live</span>
            </div>
            <div className="space-y-2.5">
              {ABSENSI_DATA.slice(0,6).map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#F1F5F9', color: '#475569' }}>
                      {a.karyawan.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#1E293B' }}>{a.karyawan}</div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>{a.masuk || '—'}</div>
                    </div>
                  </div>
                  {statusBadge(a.status)}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
