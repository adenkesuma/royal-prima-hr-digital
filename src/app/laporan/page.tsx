'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

const S='#FAF7F2',W='#FFFFFF',B='#E8E2D9',P='#2563EB',T='#1E293B',M='#64748B'

const tt = { contentStyle:{background:W,border:`1px solid ${B}`,borderRadius:10,color:T,fontSize:12}, labelStyle:{color:T} }

const lemburData = [
  {bulan:'Jan',jam:124,biaya:18600000},{bulan:'Feb',jam:98,biaya:14700000},{bulan:'Mar',jam:156,biaya:23400000},
  {bulan:'Apr',jam:112,biaya:16800000},{bulan:'Mei',jam:134,biaya:20100000},{bulan:'Jun',jam:89,biaya:13350000},
]
const absensiData = [
  {bulan:'Jan',hadir:92,telat:5,izin:3},{bulan:'Feb',hadir:88,telat:7,izin:5},{bulan:'Mar',hadir:95,telat:3,izin:2},
  {bulan:'Apr',hadir:90,telat:6,izin:4},{bulan:'Mei',hadir:93,telat:4,izin:3},{bulan:'Jun',hadir:87,telat:8,izin:5},
]
const izinDist = [
  {name:'Cuti Tahunan',value:38,color:P},
  {name:'Izin Sakit',  value:27,color:'#7C3AED'},
  {name:'Izin Telat',  value:20,color:'#D97706'},
  {name:'Lainnya',     value:15,color:'#059669'},
]
const skiData = [
  {bulan:'Jan',ski:14,noSki:6},{bulan:'Feb',ski:18,noSki:9},{bulan:'Mar',ski:12,noSki:4},
  {bulan:'Apr',ski:16,noSki:7},{bulan:'Mei',ski:20,noSki:5},{bulan:'Jun',ski:15,noSki:8},
]

type Tab = 'ringkasan'|'lembur'|'absensi'|'izin'

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>('ringkasan')

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Laporan & Analitik" subtitle="Business Intelligence HR Dashboard" />
      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {label:'Total Jam Lembur',   val:'713 jam',   note:'Jun YTD',            color:P,        bg:'#DBEAFE'},
            {label:'Biaya Lembur',       val:'Rp 106jt',  note:'Jun YTD',            color:'#A16207',bg:'#FEF9C3'},
            {label:'Rata Kehadiran',     val:'91.2%',     note:'6 bulan terakhir',   color:'#16A34A',bg:'#DCFCE7'},
            {label:'Izin Sakit No SKI',  val:'39 kasus',  note:'Perlu tindaklanjut', color:'#DC2626',bg:'#FEE2E2'},
          ].map(s=>(
            <div key={s.label} className="rounded-2xl p-4" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="inline-flex px-2 py-0.5 rounded-lg mb-3" style={{ background:s.bg }}>
                <span className="text-xs font-semibold" style={{ color:s.color }}>{s.note}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color:s.color }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color:M }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background:S,border:`1px solid ${B}` }}>
          {(['ringkasan','lembur','absensi','izin'] as Tab[]).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
              style={{ background:tab===t?P:S,color:tab===t?W:M }}>
              {t==='ringkasan'?'Ringkasan':t==='lembur'?'Lembur':t==='absensi'?'Absensi':'Izin & Cuti'}
            </button>
          ))}
        </div>

        {tab==='ringkasan'&&(
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color:T }}>Tren Jam Lembur</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={lemburData}>
                    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={P} stopOpacity={0.15}/><stop offset="95%" stopColor={P} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3"/>
                    <XAxis dataKey="bulan" tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                    <Tooltip {...tt}/>
                    <Area type="monotone" dataKey="jam" stroke={P} fill="url(#ag)" strokeWidth={2} name="Jam Lembur"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-2xl p-5" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color:T }}>Distribusi Jenis Izin</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="55%" height={200}>
                    <PieChart><Pie data={izinDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                      {izinDist.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie><Tooltip {...tt}/></PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2.5">
                    {izinDist.map(d=>(
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:d.color }}/>
                        <span className="text-xs flex-1" style={{ color:M }}>{d.name}</span>
                        <span className="text-xs font-bold" style={{ color:T }}>{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='lembur'&&(
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color:T }}>Jam Lembur per Bulan</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={lemburData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3"/>
                  <XAxis dataKey="bulan" tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip {...tt}/>
                  <Bar dataKey="jam" fill={P} radius={[4,4,0,0]} name="Jam"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color:T }}>Biaya Lembur (Rp)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={lemburData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3"/>
                  <XAxis dataKey="bulan" tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tickFormatter={v=>`${(v/1000000).toFixed(0)}jt`} tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip {...tt} formatter={(v:number)=>[`Rp ${v.toLocaleString('id')}`,'']}/>
                  <Bar dataKey="biaya" fill="#A16207" radius={[4,4,0,0]} name="Biaya"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab==='absensi'&&(
          <div className="rounded-2xl p-5" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="font-semibold mb-4 text-sm" style={{ color:T }}>Rekap Kehadiran Bulanan (%)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={absensiData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3"/>
                <XAxis dataKey="bulan" tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip {...tt}/>
                <Legend wrapperStyle={{color:M,fontSize:12}}/>
                <Bar dataKey="hadir" fill={P}        radius={[4,4,0,0]} name="Hadir (%)"/>
                <Bar dataKey="telat" fill="#D97706"  radius={[4,4,0,0]} name="Telat (%)"/>
                <Bar dataKey="izin"  fill="#7C3AED"  radius={[4,4,0,0]} name="Izin (%)"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab==='izin'&&(
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color:T }}>Izin Sakit: Dengan vs Tanpa SKI</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={skiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3"/>
                  <XAxis dataKey="bulan" tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:M,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip {...tt}/>
                  <Legend wrapperStyle={{color:M,fontSize:12}}/>
                  <Bar dataKey="ski"   fill="#16A34A" radius={[4,4,0,0]} name="Dengan SKI"/>
                  <Bar dataKey="noSki" fill="#DC2626" radius={[4,4,0,0]} name="Tanpa SKI"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background:'#FEF9C3',border:'1px solid #FDE68A' }}>
              <span style={{ color:'#A16207' }}>⚠</span>
              <p className="text-xs" style={{ color:'#78350F' }}><strong>39 kasus izin sakit tanpa SKI</strong> sejak Januari 2026 telah ditandai otomatis oleh sistem. HR perlu menindaklanjuti sesuai kebijakan perusahaan.</p>
            </div>
          </div>
        )}

        {/* Export */}
        <div className="flex items-center justify-between rounded-2xl p-4" style={{ background:W,border:`1px solid ${B}` }}>
          <div>
            <div className="text-sm font-semibold" style={{ color:T }}>Export Laporan</div>
            <div className="text-xs" style={{ color:M }}>Download data dalam format Excel atau PDF</div>
          </div>
          <div className="flex gap-2">
            {[{label:'Export Excel',bg:'#DCFCE7',color:'#16A34A'},{label:'Export PDF',bg:'#FEE2E2',color:'#DC2626'},{label:'Kirim Email',bg:'#DBEAFE',color:P}].map(a=>(
              <button key={a.label} className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background:a.bg,color:a.color }}>{a.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
