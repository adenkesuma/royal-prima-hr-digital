'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { Clock, CheckCircle, XCircle, Plus, Search } from 'lucide-react'
import { LEMBUR_DATA, Lembur } from '@/lib/data'

const S = '#FAF7F2', W = '#FFFFFF', B = '#E8E2D9', P = '#2563EB', T = '#1E293B', M = '#64748B'

const badge = (s: string) => {
  const map: any = {
    pending:   { bg: '#FEF9C3', color: '#A16207' , label: 'Menunggu'  },
    disetujui: { bg: '#DCFCE7', color: '#16A34A' , label: 'Disetujui' },
    ditolak:   { bg: '#FEE2E2', color: '#DC2626' , label: 'Ditolak'   },
  }
  const v = map[s] || { bg: '#F1F5F9', color: '#64748B', label: s }
  return <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: v.bg, color: v.color }}>{v.label}</span>
}

export default function LemburPage() {
  const [data, setData] = useState<Lembur[]>(LEMBUR_DATA)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('semua')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ karyawan: '', tanggal: '', mulai: '', selesai: '', uraian: '' })

  const filtered = data.filter(l =>
    (filter === 'semua' || l.status === filter) &&
    (l.karyawan.toLowerCase().includes(search.toLowerCase()) || l.departemen.toLowerCase().includes(search.toLowerCase()))
  )

  const approve = (id: string) => setData(d => d.map(l => l.id === id ? { ...l, status: 'disetujui' as const } : l))
  const reject  = (id: string) => setData(d => d.map(l => l.id === id ? { ...l, status: 'ditolak'   as const } : l))

  const submit = () => {
    setData(d => [{
      id: 'lb'+Date.now(), karyawanId:'u1', karyawan: form.karyawan||'Karyawan Baru',
      departemen:'IGD', tanggal:form.tanggal, mulai:form.mulai, selesai:form.selesai,
      totalJam: 0, uraian:form.uraian, status:'pending', diajukan:new Date().toLocaleDateString('id-ID')
    }, ...d])
    setShowModal(false)
    setForm({ karyawan:'', tanggal:'', mulai:'', selesai:'', uraian:'' })
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Manajemen Lembur" subtitle="Kelola pengajuan dan persetujuan lembur" />
      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Menunggu Approval', val: data.filter(l=>l.status==='pending').length,   sub:`${data.filter(l=>l.status==='pending').reduce((s,l)=>s+l.totalJam,0)} jam`, color:'#A16207', bg:'#FEF9C3' },
            { label:'Disetujui',         val: data.filter(l=>l.status==='disetujui').length, sub:`${data.filter(l=>l.status==='disetujui').reduce((s,l)=>s+l.totalJam,0)} jam`, color:'#16A34A', bg:'#DCFCE7' },
            { label:'Ditolak',           val: data.filter(l=>l.status==='ditolak').length,   sub:'Tidak diproses', color:'#DC2626', bg:'#FEE2E2' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 flex items-center gap-4" style={{ background:W, border:`1px solid ${B}`, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background:s.bg }}>
                <Clock className="w-5 h-5" style={{ color:s.color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color:M }}>{s.label}</p>
                <p className="text-2xl font-bold" style={{ color:T }}>{s.val}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color:s.color }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['semua','pending','disetujui','ditolak'].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{ background:filter===f?P:W, color:filter===f?W:M, border:filter===f?`1px solid ${P}`:`1px solid ${B}` }}>
                {f==='semua'?'Semua':f==='pending'?'Menunggu':f==='disetujui'?'Disetujui':'Ditolak'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5" style={{ color:'#94A3B8' }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari karyawan..."
                className="pl-8 pr-3 py-2 rounded-xl text-xs outline-none" style={{ background:W, border:`1px solid ${B}`, color:T, width:180 }} />
            </div>
            <button onClick={()=>setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background:P, boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
              <Plus className="w-3.5 h-3.5" /> Tambah Lembur
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background:W, border:`1px solid ${B}`, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background:S, borderBottom:`1px solid ${B}` }}>
                {['Karyawan','Dept','Tanggal','Mulai','Selesai','Total','Uraian','Status','Aksi'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color:M }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l,i)=>(
                <tr key={l.id} style={{ borderBottom:`1px solid #F5F0EA`, background:i%2===0?W:'#FDFCFA' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:'#DBEAFE', color:'#1D4ED8' }}>
                        {l.karyawan.split(' ').map(w=>w[0]).join('').slice(0,2)}
                      </div>
                      <span className="font-medium text-xs" style={{ color:T }}>{l.karyawan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:M }}>{l.departemen}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:T }}>{new Date(l.tanggal).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:T }}>{l.mulai}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:T }}>{l.selesai}</td>
                  <td className="px-4 py-3"><span className="text-xs font-bold" style={{ color:P }}>{l.totalJam}</span><span className="text-xs ml-1" style={{ color:M }}>jam</span></td>
                  <td className="px-4 py-3 text-xs max-w-[140px] truncate" style={{ color:M }}>{l.uraian}</td>
                  <td className="px-4 py-3">{badge(l.status)}</td>
                  <td className="px-4 py-3">
                    {l.status==='pending'&&(
                      <div className="flex gap-1">
                        <button onClick={()=>approve(l.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'#DCFCE7' }}><CheckCircle className="w-3.5 h-3.5" style={{ color:'#16A34A' }} /></button>
                        <button onClick={()=>reject(l.id)}  className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'#FEE2E2' }}><XCircle  className="w-3.5 h-3.5" style={{ color:'#DC2626' }} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(15,23,42,0.45)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background:W }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background:S, borderBottom:`1px solid ${B}` }}>
              <div>
                <h3 className="font-bold" style={{ color:T }}>Tambah Pengajuan Lembur</h3>
                <p className="text-xs mt-0.5" style={{ color:M }}>Isi detail waktu lembur</p>
              </div>
              <button onClick={()=>setShowModal(false)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background:W, border:`1px solid ${B}`, color:M }}>Tutup</button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[{label:'Nama Karyawan',key:'karyawan',type:'text',ph:'Nama karyawan'},{label:'Tanggal',key:'tanggal',type:'date',ph:''},{label:'Jam Mulai',key:'mulai',type:'time',ph:''},{label:'Jam Selesai',key:'selesai',type:'time',ph:''}].map(f=>(
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]}
                    onChange={e=>setForm(x=>({...x,[f.key]:e.target.value}))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background:S, border:`1.5px solid ${B}`, color:T }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>Uraian Tugas</label>
                <textarea rows={2} value={form.uraian} onChange={e=>setForm(x=>({...x,uraian:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background:S, border:`1.5px solid ${B}`, color:T }} />
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3" style={{ background:S, borderTop:`1px solid ${B}` }}>
              <button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background:W, border:`1px solid ${B}`, color:M }}>Batal</button>
              <button onClick={submit} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:P }}>Ajukan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
