'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { Users, Search, X } from 'lucide-react'
import { USERS } from '@/lib/data'

const S='#FAF7F2',W='#FFFFFF',B='#E8E2D9',P='#2563EB',T='#1E293B',M='#64748B'

const depts = ['Semua',...Array.from(new Set(USERS.map(u=>u.departemen)))]

const initial = (name:string) => name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()

const colors = ['#DBEAFE','#DCFCE7','#FEF9C3','#F3E8FF','#FEE2E2','#E0F2FE']
const textColors = ['#1D4ED8','#16A34A','#A16207','#7E22CE','#DC2626','#0369A1']

export default function KaryawanPage() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('Semua')
  const [selected, setSelected] = useState<typeof USERS[0]|null>(null)

  const filtered = USERS.filter(u=>
    (dept==='Semua'||u.departemen===dept)&&
    (u.nama.toLowerCase().includes(search.toLowerCase())||u.jabatan.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Data Karyawan" subtitle="Direktori karyawan RSU Royal Prima" />
      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label:'Total Karyawan', val:USERS.length,                                   color:P,        bg:'#DBEAFE' },
            { label:'Dokter',         val:USERS.filter(u=>u.jabatan.includes('Dr.')).length, color:'#7E22CE',bg:'#F3E8FF' },
            { label:'Perawat / Staf', val:USERS.filter(u=>!u.jabatan.includes('Dr.')).length,color:'#16A34A',bg:'#DCFCE7' },
            { label:'Departemen',     val:depts.length-1,                                 color:'#A16207',bg:'#FEF9C3' },
          ].map(s=>(
            <div key={s.label} className="rounded-2xl p-4" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background:s.bg }}>
                <Users className="w-4 h-4" style={{ color:s.color }}/>
              </div>
              <div className="text-2xl font-bold" style={{ color:s.color }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color:M }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color:'#94A3B8' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama / jabatan..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none" style={{ background:W,border:`1px solid ${B}`,color:T,width:220 }}/>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {depts.map(d=>(
              <button key={d} onClick={()=>setDept(d)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background:dept===d?P:W,color:dept===d?W:M,border:dept===d?`1px solid ${P}`:`1px solid ${B}` }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((u,i)=>{
            const ci = i % colors.length
            return (
              <button key={u.id} onClick={()=>setSelected(u)}
                className="rounded-2xl p-5 text-left transition-all hover:shadow-md"
                style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background:colors[ci],color:textColors[ci] }}>
                    {initial(u.nama)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color:T }}>{u.nama}</div>
                    <div className="text-xs truncate" style={{ color:M }}>{u.jabatan}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-lg font-medium" style={{ background:S,color:M }}>{u.departemen}</span>
                  <span className="text-xs font-mono" style={{ color:'#94A3B8' }}>{u.nik}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail modal */}
      {selected&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(15,23,42,0.45)' }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ background:W }}>
            <div className="px-6 py-5 flex items-start justify-between" style={{ background:S,borderBottom:`1px solid ${B}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold" style={{ background:'#DBEAFE',color:'#1D4ED8' }}>
                  {initial(selected.nama)}
                </div>
                <div>
                  <div className="font-bold" style={{ color:T }}>{selected.nama}</div>
                  <div className="text-xs" style={{ color:M }}>{selected.jabatan}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:W,border:`1px solid ${B}` }}>
                <X className="w-4 h-4" style={{ color:M }}/>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                ['NIK',         selected.nik],
                ['Email',       selected.email],
                ['Departemen',  selected.departemen],
                ['Shift',       selected.shift],
                ['Bergabung',   selected.bergabung],
                ['Role',        selected.role],
              ].map(([l,v])=>(
                <div key={l} className="flex justify-between items-center py-2" style={{ borderBottom:'1px solid #F5F0EA' }}>
                  <span className="text-xs" style={{ color:M }}>{l}</span>
                  <span className="text-xs font-semibold" style={{ color:T }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
