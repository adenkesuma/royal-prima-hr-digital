'use client'
import { useState, useRef } from 'react'
import Topbar from '@/components/Topbar'
import { USERS } from '@/lib/data'
import { Plus, X, Clock, Upload, Eye, Check, XCircle, ImageIcon, Trash2, AlertTriangle } from 'lucide-react'

type Status = 'pending' | 'disetujui' | 'ditolak'

const statusStyle: Record<Status, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#FEF9C3', color: '#A16207', label: 'Menunggu' },
  disetujui: { bg: '#DCFCE7', color: '#166534', label: 'Disetujui' },
  ditolak:   { bg: '#FEE2E2', color: '#991B1B', label: 'Ditolak' },
}

const initialData = [
  { id: 't1', karyawan: 'Ahmad Fauzi',   dept: 'Lab',        tanggal: '2026-05-14', shiftMulai: '07:00', waktuMasuk: '07:38', selisih: '38 menit', alasan: 'Macet panjang', status: 'pending' as Status,   buktiUrl: null },
  { id: 't2', karyawan: 'Rizky Pratama', dept: 'Radiologi',  tanggal: '2026-05-13', shiftMulai: '07:00', waktuMasuk: '07:22', selisih: '22 menit', alasan: 'Ban bocor',    status: 'disetujui' as Status, buktiUrl: null },
  { id: 't3', karyawan: 'Dewi Lestari',  dept: 'Farmasi',    tanggal: '2026-05-12', shiftMulai: '14:00', waktuMasuk: '14:15', selisih: '15 menit', alasan: 'Urusan keluarga', status: 'ditolak' as Status, buktiUrl: null },
  { id: 't4', karyawan: 'Siti Rahayu',   dept: 'ICU',        tanggal: '2026-05-11', shiftMulai: '21:00', waktuMasuk: '21:45', selisih: '45 menit', alasan: 'Sakit mendadak', status: 'pending' as Status,  buktiUrl: null },
]

export default function IzinTelatPage() {
  const [data, setData]             = useState(initialData)
  const [showModal, setShowModal]   = useState(false)
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [dragOver, setDragOver]     = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)
  const [filterStatus, setFilterStatus] = useState('semua')
  const [autoRejectWarning, setAutoRejectWarning] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ tanggal: '', shiftMulai: '', waktuMasuk: '', alasan: '' })

  const filtered = filterStatus === 'semua' ? data : data.filter(d => d.status === filterStatus)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploadedFile({ name: file.name, url: URL.createObjectURL(file) })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }

  function checkAutoReject() {
    if (!form.tanggal || !form.shiftMulai || !form.waktuMasuk) return
    const shift = new Date(`${form.tanggal}T${form.shiftMulai}`)
    const masuk = new Date(`${form.tanggal}T${form.waktuMasuk}`)
    setAutoRejectWarning(masuk <= shift)
  }

  function getSelisih() {
    if (!form.shiftMulai || !form.waktuMasuk) return ''
    const [sh, sm] = form.shiftMulai.split(':').map(Number)
    const [mh, mm] = form.waktuMasuk.split(':').map(Number)
    const diff = (mh * 60 + mm) - (sh * 60 + sm)
    if (diff <= 0) return '0 menit'
    return diff >= 60 ? `${Math.floor(diff/60)} jam ${diff%60} menit` : `${diff} menit`
  }

  function handleSubmit() {
    const newEntry = {
      id: `t${Date.now()}`,
      karyawan: 'Dr. Budi Santoso',
      dept: 'IGD',
      tanggal: form.tanggal,
      shiftMulai: form.shiftMulai,
      waktuMasuk: form.waktuMasuk,
      selisih: getSelisih(),
      alasan: form.alasan,
      status: 'pending' as Status,
      buktiUrl: uploadedFile?.url || null,
    }
    setData(prev => [newEntry, ...prev])
    setShowModal(false)
    setForm({ tanggal: '', shiftMulai: '', waktuMasuk: '', alasan: '' })
    setUploadedFile(null)
    setAutoRejectWarning(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Izin Telat" subtitle="Pengajuan izin keterlambatan masuk kerja" />

      <div className="flex-1 overflow-auto p-6 space-y-5">

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: '#FEF9C3', border: '1px solid #FDE68A' }}>
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#A16207' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#78350F' }}>
            <strong>Peraturan:</strong> Izin telat <u>wajib diajukan sebelum shift dimulai</u>. Pengajuan setelah waktu masuk akan <strong>ditolak otomatis</strong> oleh sistem. Sertakan bukti foto sebagai pendukung pengajuan.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Pengajuan', val: data.length,   color: '#2563EB', bg: '#DBEAFE' },
            { label: 'Menunggu',        val: data.filter(d=>d.status==='pending').length,   color: '#A16207', bg: '#FEF9C3' },
            { label: 'Disetujui',       val: data.filter(d=>d.status==='disetujui').length, color: '#166534', bg: '#DCFCE7' },
            { label: 'Ditolak',         val: data.filter(d=>d.status==='ditolak').length,   color: '#991B1B', bg: '#FEE2E2' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3" style={{ background: s.bg }}>
                <Clock style={{ color: s.color, width: 18, height: 18 }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['semua','pending','disetujui','ditolak'].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: filterStatus === f ? '#2563EB' : '#FFFFFF',
                  color: filterStatus === f ? '#FFFFFF' : '#64748B',
                  border: filterStatus === f ? '1px solid #2563EB' : '1px solid #E2E8F0',
                }}>
                {f === 'semua' ? 'Semua' : f === 'pending' ? 'Menunggu' : f === 'disetujui' ? 'Disetujui' : 'Ditolak'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#2563EB', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
            <Plus className="w-4 h-4" /> Ajukan Izin Telat
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #E2E8F0' }}>
                {['Karyawan','Tanggal','Shift','Masuk','Terlambat','Alasan','Bukti','Status','Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const st = statusStyle[row.status]
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9', background: i%2===0 ? '#FFFFFF' : '#FDFCFA' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: '#FEF9C3', color: '#A16207' }}>
                          {row.karyawan.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div className="font-medium text-xs" style={{ color: '#1E293B' }}>{row.karyawan}</div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>{row.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{row.tanggal}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1E293B' }}>{row.shiftMulai}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1E293B' }}>{row.waktuMasuk}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                        style={{ background: '#FEE2E2', color: '#991B1B' }}>{row.selisih}</span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[150px] truncate" style={{ color: '#64748B' }}>{row.alasan}</td>
                    <td className="px-4 py-3">
                      {row.buktiUrl ? (
                        <button onClick={() => setPreviewImg(row.buktiUrl!)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: '#DCFCE7', color: '#166534' }}>
                          <Eye className="w-3 h-3" /> Lihat
                        </button>
                      ) : (
                        <span className="text-xs flex items-center gap-1" style={{ color: '#CBD5E1' }}>
                          <ImageIcon className="w-3 h-3" /> —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      {row.status === 'pending' && (
                        <div className="flex gap-1">
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                            <Check className="w-3.5 h-3.5" style={{ color: '#166534' }} />
                          </button>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                            <XCircle className="w-3.5 h-3.5" style={{ color: '#991B1B' }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E8F0', background: '#FAF7F2' }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#1E293B' }}>Ajukan Izin Telat</h2>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Pengajuan harus dilakukan sebelum jam masuk shift</p>
              </div>
              <button onClick={() => { setShowModal(false); setUploadedFile(null); setAutoRejectWarning(false) }}
                className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                <X className="w-4 h-4" style={{ color: '#64748B' }} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Auto-reject warning */}
              {autoRejectWarning && (
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5" style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#991B1B' }} />
                  <p className="text-xs" style={{ color: '#7F1D1D' }}>
                    <strong>Perhatian:</strong> Waktu masuk yang anda input <u>tidak melebihi</u> waktu shift. Pastikan anda mengisi waktu masuk aktual dengan benar.
                  </p>
                </div>
              )}

              {/* Tanggal & Shift */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Tanggal</label>
                  <input type="date" value={form.tanggal}
                    onChange={e => { setForm(p => ({ ...p, tanggal: e.target.value })); setTimeout(checkAutoReject,100) }}
                    onBlur={checkAutoReject}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Jam Mulai Shift</label>
                  <input type="time" value={form.shiftMulai}
                    onChange={e => { setForm(p => ({ ...p, shiftMulai: e.target.value })); setTimeout(checkAutoReject,100) }}
                    onBlur={checkAutoReject}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }} />
                </div>
              </div>

              {/* Waktu masuk aktual */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>
                  Perkiraan Waktu Masuk Aktual
                </label>
                <input type="time" value={form.waktuMasuk}
                  onChange={e => { setForm(p => ({ ...p, waktuMasuk: e.target.value })); setTimeout(checkAutoReject,100) }}
                  onBlur={checkAutoReject}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }} />
                {form.shiftMulai && form.waktuMasuk && (
                  <p className="text-xs mt-1.5 font-medium" style={{ color: '#A16207' }}>
                    Estimasi keterlambatan: <strong>{getSelisih()}</strong>
                  </p>
                )}
              </div>

              {/* Alasan */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Alasan Keterlambatan</label>
                <textarea rows={3} value={form.alasan}
                  onChange={e => setForm(p => ({ ...p, alasan: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }}
                  placeholder="Jelaskan alasan keterlambatan..." />
              </div>

              {/* Upload Bukti — WAJIB untuk izin telat */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>
                  Upload Bukti Pendukung <span style={{ color: '#EF4444' }}>*</span>
                  <span className="font-normal ml-1" style={{ color: '#94A3B8' }}>(foto kondisi jalan, tangkapan layar, dll)</span>
                </label>

                {!uploadedFile ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className="rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-8"
                    style={{
                      borderColor: dragOver ? '#2563EB' : '#E2E8F0',
                      background: dragOver ? '#EFF6FF' : '#FAF7F2',
                    }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#DBEAFE' }}>
                      <Upload className="w-6 h-6" style={{ color: '#2563EB' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#1E293B' }}>Klik atau drag & drop bukti foto</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>JPG, PNG, WEBP · Maks. 5 MB</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #DBEAFE', background: '#EFF6FF' }}>
                    <div className="relative">
                      <img src={uploadedFile.url} alt="preview" className="w-full object-cover rounded-t-xl" style={{ maxHeight: 200 }} />
                      <button onClick={() => setUploadedFile(null)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.55)' }}>
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <ImageIcon className="w-4 h-4 shrink-0" style={{ color: '#2563EB' }} />
                      <span className="text-xs truncate font-medium" style={{ color: '#1D4ED8' }}>{uploadedFile.name}</span>
                      <span className="ml-auto text-xs" style={{ color: '#166534', background: '#DCFCE7', borderRadius: 6, padding: '2px 8px' }}>✓ Terupload</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #E2E8F0', background: '#FAF7F2' }}>
              <button onClick={() => { setShowModal(false); setUploadedFile(null); setAutoRejectWarning(false) }}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B' }}>
                Batal
              </button>
              <button onClick={handleSubmit}
                disabled={!form.tanggal || !form.shiftMulai || !form.waktuMasuk || !uploadedFile}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
                style={{ background: '#2563EB' }}>
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-2xl w-full">
            <img src={previewImg} alt="Bukti" className="w-full rounded-2xl shadow-2xl object-contain" style={{ maxHeight: '80vh' }} />
            <button onClick={() => setPreviewImg(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)' }}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
