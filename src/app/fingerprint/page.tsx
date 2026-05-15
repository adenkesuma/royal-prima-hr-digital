'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { Fingerprint, RefreshCw, CheckCircle, AlertCircle, WifiOff } from 'lucide-react'

const S='#FAF7F2',W='#FFFFFF',B='#E8E2D9',P='#2563EB',T='#1E293B',M='#64748B'

const devices = [
  { id:'FP-001', lokasi:'Lobby Utama (Lt.1)',    status:'online',  lastSync:'2 menit lalu', total:48, error:0  },
  { id:'FP-002', lokasi:'IGD (Lt.1)',             status:'online',  lastSync:'5 menit lalu', total:32, error:1  },
  { id:'FP-003', lokasi:'ICU / ICCU (Lt.3)',      status:'online',  lastSync:'8 menit lalu', total:21, error:0  },
  { id:'FP-004', lokasi:'Farmasi (Lt.2)',         status:'offline', lastSync:'2 jam lalu',   total:0,  error:0  },
  { id:'FP-005', lokasi:'Radiologi & Lab (Lt.2)', status:'warning', lastSync:'45 menit lalu',total:15, error:3  },
]

const auditLog = [
  { time:'08:02', user:'Dr. Budi Santoso', device:'FP-002', action:'Absen Masuk',  status:'ok'  },
  { time:'07:58', user:'Siti Rahayu',      device:'FP-001', action:'Absen Masuk',  status:'ok'  },
  { time:'07:55', user:'Ahmad Fauzi',      device:'FP-005', action:'Absen Masuk',  status:'err' },
  { time:'07:52', user:'Maya Putri',       device:'FP-003', action:'Absen Masuk',  status:'ok'  },
  { time:'07:41', user:'Rizky Pratama',    device:'FP-002', action:'Absen Masuk',  status:'ok'  },
]

const statusDev = (s:string) => {
  if(s==='online')  return {bg:'#DCFCE7',color:'#16A34A',icon:CheckCircle,label:'Online'}
  if(s==='warning') return {bg:'#FEF9C3',color:'#A16207',icon:AlertCircle,label:'Peringatan'}
  return {bg:'#FEE2E2',color:'#DC2626',icon:WifiOff,label:'Offline'}
}

export default function FingerprintPage() {
  const [syncing, setSyncing] = useState<string|null>(null)

  const sync = (id:string) => {
    setSyncing(id)
    setTimeout(()=>setSyncing(null),1800)
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Integrasi Fingerprint" subtitle="Monitor & sinkronisasi perangkat absensi ke ERP" />
      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label:'Total Perangkat',    val:devices.length,                         color:P,        bg:'#DBEAFE' },
            { label:'Online',             val:devices.filter(d=>d.status==='online').length,  color:'#16A34A',bg:'#DCFCE7' },
            { label:'Peringatan / Error', val:devices.filter(d=>d.status==='warning').length, color:'#A16207',bg:'#FEF9C3' },
            { label:'Offline',            val:devices.filter(d=>d.status==='offline').length, color:'#DC2626',bg:'#FEE2E2' },
          ].map(s=>(
            <div key={s.label} className="rounded-2xl p-4" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background:s.bg }}>
                <Fingerprint className="w-4 h-4" style={{ color:s.color }}/>
              </div>
              <div className="text-2xl font-bold" style={{ color:s.color }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color:M }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Device table */}
          <div className="col-span-3 rounded-2xl overflow-hidden" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-3.5" style={{ background:S,borderBottom:`1px solid ${B}` }}>
              <h3 className="font-semibold text-sm" style={{ color:T }}>Status Perangkat</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:S,borderBottom:`1px solid ${B}` }}>
                  {['ID','Lokasi','Status','Sync Terakhir','Record','Aksi'].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color:M }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {devices.map((d,i)=>{
                  const st = statusDev(d.status)
                  return (
                    <tr key={d.id} style={{ borderBottom:'1px solid #F5F0EA',background:i%2===0?W:'#FDFCFA' }}>
                      <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color:P }}>{d.id}</td>
                      <td className="px-4 py-3 text-xs" style={{ color:T }}>{d.lokasi}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:st.bg,color:st.color }}>
                          <st.icon className="w-3 h-3"/>{st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:M }}>{d.lastSync}</td>
                      <td className="px-4 py-3 text-xs" style={{ color:T }}>{d.total > 0 ? `${d.total} rec` : '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={()=>sync(d.id)} disabled={syncing===d.id||d.status==='offline'}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium disabled:opacity-40 transition-all"
                          style={{ background:'#DBEAFE',color:P }}>
                          <RefreshCw className={`w-3 h-3 ${syncing===d.id?'animate-spin':''}`}/> Sync
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Audit log */}
          <div className="col-span-2 rounded-2xl overflow-hidden" style={{ background:W,border:`1px solid ${B}`,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ background:S,borderBottom:`1px solid ${B}` }}>
              <h3 className="font-semibold text-sm" style={{ color:T }}>Audit Trail Hari Ini</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background:'#DCFCE7',color:'#16A34A' }}>Live</span>
            </div>
            <div className="divide-y" style={{ borderColor:'#F5F0EA' }}>
              {auditLog.map((log,i)=>(
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:log.status==='ok'?'#16A34A':'#DC2626' }}/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color:T }}>{log.user}</div>
                    <div className="text-xs" style={{ color:M }}>{log.action} · {log.device}</div>
                  </div>
                  <div className="text-xs font-mono shrink-0" style={{ color:M }}>{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
