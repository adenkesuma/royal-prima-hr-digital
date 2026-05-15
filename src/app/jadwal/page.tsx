'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { CalendarDays, Plus, AlertTriangle, X } from 'lucide-react'
import { JADWAL_DATA, USERS } from '@/lib/data'

const S='#FAF7F2',W='#FFFFFF',B='#E8E2D9',P='#2563EB',T='#1E293B',M='#64748B'

const shiftColor: Record<string,{bg:string,color:string}> = {
  Pagi:  {bg:'#DBEAFE',color:'#1D4ED8'},
  Siang: {bg:'#FEF9C3',color:'#A16207'},
  Malam: {bg:'#E0E7FF',color:'#4338CA'},
}

const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min']

export default function JadwalPage() {
  const [data, setData] = useState(JADWAL_DATA)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ karyawanId:'', shift:'Pagi', tanggal:'' })

  const submit = () => {
    const user = USERS.find(u=>u.id===form.karyawanId)
    if(!user) return
    const exists = data.find(d=>d.karyawanId===form.karyawanId&&d.tanggal===form.tanggal)
    if(!exists) {
      setData(d=>[...d,{
        id:'jd'+Date.now(),karyawanId:form.karyawanId,karyawan:user.nama,
        departemen:user.departemen,tanggal:form.tanggal,shift:form.shift as any,status:'aktif' as any
      }])
    }
    setShowModal(false)
    setForm({karyawanId:'',shift:'Pagi',tanggal:''})
  }

  const shifts = ['Pagi','Siang','Malam']

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Penjadwalan Dinas" subtitle="Atur jadwal shift karyawan per departemen" />
      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {shifts.map(sh=>(
            <div key={sh} className="rounded-2xl p-4 flex items-center gap-3" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:shiftColor[sh].bg }}>
                <CalendarDays className="w-5 h-5" style={{ color:shiftColor[sh].color }}/>
              </div>
              <div>
                <p className="text-xs" style={{ color:M }}>Shift {sh}</p>
                <p className="text-2xl font-bold" style={{ color:T }}>{data.filter(d=>d.shift===sh).length}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex justify-end">
          <button onClick={()=>setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background:P,boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
            <Plus className="w-3.5 h-3.5"/> Assign Jadwal
          </button>
        </div>

        {/* Shift columns */}
        <div className="grid grid-cols-3 gap-4">
          {shifts.map(sh=>{
            const sc = shiftColor[sh]
            return (
              <div key={sh} className="rounded-2xl overflow-hidden" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background:sc.bg,borderBottom:`1px solid ${B}` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background:sc.color }}/>
                  <span className="font-semibold text-sm" style={{ color:sc.color }}>Shift {sh}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color:sc.color }}>{data.filter(d=>d.shift===sh).length} org</span>
                </div>
                <div className="p-3 space-y-2">
                  {data.filter(d=>d.shift===sh).map(d=>(
                    <div key={d.id} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:S,border:`1px solid ${B}` }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:sc.bg,color:sc.color }}>
                        {d.karyawan.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color:T }}>{d.karyawan}</div>
                        <div className="text-xs" style={{ color:M }}>{d.tanggal}</div>
                      </div>
                    </div>
                  ))}
                  {data.filter(d=>d.shift===sh).length===0&&(
                    <div className="text-xs text-center py-4" style={{ color:'#CBD5E1' }}>Belum ada jadwal</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(15,23,42,0.45)' }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ background:W }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background:S,borderBottom:`1px solid ${B}` }}>
              <h3 className="font-bold" style={{ color:T }}>Assign Jadwal Dinas</h3>
              <button onClick={()=>setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:W,border:`1px solid ${B}` }}>
                <X className="w-3.5 h-3.5" style={{ color:M }}/>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>Karyawan</label>
                <select value={form.karyawanId} onChange={e=>setForm(x=>({...x,karyawanId:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background:S,border:`1.5px solid ${B}`,color:T }}>
                  <option value="">— Pilih karyawan —</option>
                  {USERS.map(u=><option key={u.id} value={u.id}>{u.nama} ({u.departemen})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>Shift</label>
                <div className="grid grid-cols-3 gap-2">
                  {shifts.map(sh=>(
                    <button key={sh} onClick={()=>setForm(x=>({...x,shift:sh}))}
                      className="py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{ background:form.shift===sh?P:shiftColor[sh].bg, color:form.shift===sh?W:shiftColor[sh].color, border:`1.5px solid ${form.shift===sh?P:B}` }}>
                      {sh}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>Tanggal</label>
                <input type="date" value={form.tanggal} onChange={e=>setForm(x=>({...x,tanggal:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background:S,border:`1.5px solid ${B}`,color:T }}/>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3" style={{ background:S,borderTop:`1px solid ${B}` }}>
              <button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background:W,border:`1px solid ${B}`,color:M }}>Batal</button>
              <button onClick={submit} disabled={!form.karyawanId||!form.tanggal}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background:P }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
