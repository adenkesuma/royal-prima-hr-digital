'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { Thermometer, CheckCircle, XCircle, Plus, AlertTriangle } from 'lucide-react'
import { IZIN_DATA } from '@/lib/data'

const S='#FAF7F2',W='#FFFFFF',B='#E8E2D9',P='#2563EB',T='#1E293B',M='#64748B'

const badge = (s:string) => {
  const m:any={pending:{bg:'#FEF9C3',c:'#A16207',l:'Menunggu'},disetujui:{bg:'#DCFCE7',c:'#16A34A',l:'Disetujui'},ditolak:{bg:'#FEE2E2',c:'#DC2626',l:'Ditolak'}}
  const v=m[s]||{bg:'#F1F5F9',c:M,l:s}
  return <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:v.bg,color:v.c }}>{v.l}</span>
}

const sakitData = IZIN_DATA.filter(i=>i.jenis==='sakit')

export default function IzinSakitPage() {
  const [data, setData] = useState(sakitData)
  const [filterSKI, setFilterSKI] = useState('semua')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ mulai:'', selesai:'', alasan:'', hasSKI: false })

  const filtered = data.filter(d =>
    filterSKI==='semua'||
    (filterSKI==='ski' && d.hasSKI)||
    (filterSKI==='tanpaSKI' && !d.hasSKI)
  )

  const approve = (id:string) => setData(d=>d.map(i=>i.id===id?{...i,status:'disetujui' as const}:i))
  const reject  = (id:string) => setData(d=>d.map(i=>i.id===id?{...i,status:'ditolak'   as const}:i))

  const submit = () => {
    setData(d=>[{
      id:'sk'+Date.now(),karyawanId:'u1',karyawan:'Dr. Budi Santoso',departemen:'IGD',
      jenis:'sakit' as const,tanggalMulai:form.mulai,tanggalSelesai:form.selesai,
      alasan:form.alasan,status:'pending' as const,hasSKI:form.hasSKI,diajukan:new Date().toLocaleDateString('id-ID')
    },...d])
    setShowModal(false)
    setForm({mulai:'',selesai:'',alasan:'',hasSKI:false})
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Izin Sakit" subtitle="Kelola pengajuan izin sakit karyawan" />
      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* SKI warning */}
        {data.filter(d=>!d.hasSKI&&d.status==='pending').length>0&&(
          <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background:'#FEF9C3',border:'1px solid #FDE68A' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color:'#A16207' }}/>
            <p className="text-xs" style={{ color:'#78350F' }}>
              Terdapat <strong>{data.filter(d=>!d.hasSKI&&d.status==='pending').length} pengajuan tanpa SKI</strong> yang perlu ditindaklanjuti sesuai kebijakan perusahaan.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label:'Total',         val:data.length,                              color:P,        bg:'#DBEAFE' },
            { label:'Dengan SKI',    val:data.filter(d=>d.hasSKI).length,          color:'#16A34A',bg:'#DCFCE7' },
            { label:'Tanpa SKI ⚠',  val:data.filter(d=>!d.hasSKI).length,         color:'#A16207',bg:'#FEF9C3' },
            { label:'Menunggu',      val:data.filter(d=>d.status==='pending').length,color:'#DC2626',bg:'#FEE2E2' },
          ].map(s=>(
            <div key={s.label} className="rounded-2xl p-4" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background:s.bg }}>
                <Thermometer className="w-4 h-4" style={{ color:s.color }}/>
              </div>
              <div className="text-2xl font-bold" style={{ color:s.color }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color:M }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[['semua','Semua'],['ski','Dengan SKI'],['tanpaSKI','Tanpa SKI']].map(([f,l])=>(
              <button key={f} onClick={()=>setFilterSKI(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background:filterSKI===f?P:W,color:filterSKI===f?W:M,border:filterSKI===f?`1px solid ${P}`:`1px solid ${B}` }}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={()=>setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background:P,boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
            <Plus className="w-3.5 h-3.5"/> Ajukan Izin Sakit
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background:S,borderBottom:`1px solid ${B}` }}>
                {['Karyawan','Dept','Tgl Mulai','Tgl Selesai','Alasan','SKI','Status','Aksi'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color:M }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r,i)=>(
                <tr key={r.id} style={{ borderBottom:'1px solid #F5F0EA',background:i%2===0?W:'#FDFCFA' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:'#DBEAFE',color:'#1D4ED8' }}>
                        {r.karyawan.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <span className="text-xs font-medium" style={{ color:T }}>{r.karyawan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:M }}>{r.departemen}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:T }}>{r.tanggalMulai}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:T }}>{r.tanggalSelesai}</td>
                  <td className="px-4 py-3 text-xs max-w-[140px] truncate" style={{ color:M }}>{r.alasan}</td>
                  <td className="px-4 py-3">
                    {r.hasSKI
                      ? <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:'#DCFCE7',color:'#16A34A' }}>Ada</span>
                      : <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:'#FEF9C3',color:'#A16207' }}>Tidak</span>
                    }
                  </td>
                  <td className="px-4 py-3">{badge(r.status)}</td>
                  <td className="px-4 py-3">
                    {r.status==='pending'&&(
                      <div className="flex gap-1">
                        <button onClick={()=>approve(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'#DCFCE7' }}><CheckCircle className="w-3.5 h-3.5" style={{ color:'#16A34A' }}/></button>
                        <button onClick={()=>reject(r.id)}  className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'#FEE2E2' }}><XCircle  className="w-3.5 h-3.5" style={{ color:'#DC2626' }}/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(15,23,42,0.45)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background:W }}>
            <div className="px-6 py-4" style={{ background:S,borderBottom:`1px solid ${B}` }}>
              <h3 className="font-bold" style={{ color:T }}>Ajukan Izin Sakit</h3>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[{label:'Tanggal Mulai',key:'mulai',type:'date'},{label:'Tanggal Selesai',key:'selesai',type:'date'}].map(f=>(
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e=>setForm(x=>({...x,[f.key]:e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background:S,border:`1.5px solid ${B}`,color:T }}/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>Alasan</label>
                <textarea rows={2} value={form.alasan} onChange={e=>setForm(x=>({...x,alasan:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background:S,border:`1.5px solid ${B}`,color:T }}/>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasSKI} onChange={e=>setForm(x=>({...x,hasSKI:e.target.checked}))}
                  className="rounded" style={{ accentColor:P }}/>
                <span className="text-xs font-medium" style={{ color:T }}>Sertakan Surat Keterangan Izin (SKI) dari dokter</span>
              </label>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3" style={{ background:S,borderTop:`1px solid ${B}` }}>
              <button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background:W,border:`1px solid ${B}`,color:M }}>Batal</button>
              <button onClick={submit} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:P }}>Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
