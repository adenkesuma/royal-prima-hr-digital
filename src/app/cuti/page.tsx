'use client'
import { useState, useRef } from 'react'
import Topbar from '@/components/Topbar'
import { IZIN_DATA, USERS } from '@/lib/data'
import { Plus, X, Calendar, Upload, Eye, Check, XCircle, ImageIcon, Trash2 } from 'lucide-react'

type Status = 'pending' | 'disetujui' | 'ditolak'

const statusStyle: Record<Status, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#FEF9C3', color: '#A16207', label: 'Menunggu' },
  disetujui: { bg: '#DCFCE7', color: '#166534', label: 'Disetujui' },
  ditolak:   { bg: '#FEE2E2', color: '#991B1B', label: 'Ditolak' },
}

const cutiData = IZIN_DATA.filter(i => i.jenis === 'cuti')

export default function CutiPage() {
  const [showModal, setShowModal] = useState(false)
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('semua')
  const [data, setData] = useState(cutiData)
  const [form, setForm] = useState({
    mulai: '', selesai: '', jenis: 'Cuti Tahunan', alasan: '', delegasi: '',
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = filterStatus === 'semua' ? data : data.filter(d => d.status === filterStatus)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setUploadedFile({ name: file.name, url })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleSubmit() {
    const newEntry = {
      id: `izin-${Date.now()}`,
      karyawanId: 'u1',
      karyawan: 'Dr. Budi Santoso',
      departemen: 'IGD',
      jenis: 'cuti' as const,
      tanggalMulai: form.mulai,
      tanggalSelesai: form.selesai,
      alasan: form.alasan,
      status: 'pending' as const,
      delegasi: form.delegasi,
      diajukan: new Date().toISOString().split('T')[0],
      buktiUrl: uploadedFile?.url,
    }
    setData(prev => [newEntry, ...prev])
    setShowModal(false)
    setForm({ mulai: '', selesai: '', jenis: 'Cuti Tahunan', alasan: '', delegasi: '' })
    setUploadedFile(null)
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Izin Cuti" subtitle="Manajemen pengajuan cuti karyawan" />

      <div className="flex-1 overflow-auto p-6 space-y-5">

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
                <Calendar style={{ color: s.color, width: 18, height: 18 }} />
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
            <Plus className="w-4 h-4" /> Ajukan Cuti
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #E2E8F0' }}>
                {['Karyawan','Departemen','Periode','Jenis','Delegasi','Bukti','Status','Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const st = statusStyle[row.status as Status]
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#FFFFFF' : '#FDFCFA' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                          {row.karyawan.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <span className="font-medium" style={{ color: '#1E293B' }}>{row.karyawan}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{row.departemen}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                      {row.tanggalMulai} → {row.tanggalSelesai}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                        {row.jenis === 'cuti' ? 'Cuti Tahunan' : row.jenis}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: row.delegasi ? '#1E293B' : '#CBD5E1' }}>
                      {row.delegasi || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {(row as any).buktiUrl ? (
                        <button onClick={() => setPreviewImg((row as any).buktiUrl)}
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
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
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

      {/* MODAL: Ajukan Cuti */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#FFFFFF' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E8F0', background: '#FAF7F2' }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#1E293B' }}>Ajukan Izin Cuti</h2>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Lengkapi form & upload bukti pendukung</p>
              </div>
              <button onClick={() => { setShowModal(false); setUploadedFile(null) }}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: '#F1F5F9' }}>
                <X className="w-4 h-4" style={{ color: '#64748B' }} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Jenis cuti */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Jenis Cuti</label>
                <select value={form.jenis} onChange={e => setForm(p => ({ ...p, jenis: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }}>
                  {['Cuti Tahunan','Cuti Sakit','Cuti Melahirkan','Cuti Besar','Izin Khusus'].map(j => (
                    <option key={j}>{j}</option>
                  ))}
                </select>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Tanggal Mulai</label>
                  <input type="date" value={form.mulai} onChange={e => setForm(p => ({ ...p, mulai: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Tanggal Selesai</label>
                  <input type="date" value={form.selesai} onChange={e => setForm(p => ({ ...p, selesai: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }} />
                </div>
              </div>

              {/* Delegasi */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>
                  Delegasi Tugas <span style={{ color: '#EF4444' }}>*</span>
                  <span className="font-normal ml-1" style={{ color: '#94A3B8' }}>(wajib untuk shift worker)</span>
                </label>
                <select value={form.delegasi} onChange={e => setForm(p => ({ ...p, delegasi: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }}>
                  <option value="">— Pilih karyawan pengganti —</option>
                  {USERS.filter(u => u.id !== 'u1').map(u => (
                    <option key={u.id} value={u.nama}>{u.nama} ({u.jabatan})</option>
                  ))}
                </select>
              </div>

              {/* Alasan */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>Alasan / Keterangan</label>
                <textarea rows={3} value={form.alasan} onChange={e => setForm(p => ({ ...p, alasan: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ background: '#FAF7F2', border: '1.5px solid #E2E8F0', color: '#1E293B' }}
                  placeholder="Jelaskan alasan pengajuan cuti..." />
              </div>

              {/* Upload Bukti */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#374151' }}>
                  Upload Bukti Pendukung
                  <span className="font-normal ml-1" style={{ color: '#94A3B8' }}>(foto/scan surat, opsional)</span>
                </label>

                {!uploadedFile ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-8"
                    style={{
                      borderColor: dragOver ? '#2563EB' : '#E2E8F0',
                      background: dragOver ? '#EFF6FF' : '#FAF7F2',
                    }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                      style={{ background: '#DBEAFE' }}>
                      <Upload className="w-6 h-6" style={{ color: '#2563EB' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#1E293B' }}>Klik atau drag & drop gambar</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>JPG, PNG, WEBP · Maks. 5 MB</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #DBEAFE', background: '#EFF6FF' }}>
                    <div className="relative">
                      <img src={uploadedFile.url} alt="preview"
                        className="w-full object-cover rounded-t-xl" style={{ maxHeight: 200 }} />
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

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #E2E8F0', background: '#FAF7F2' }}>
              <button onClick={() => { setShowModal(false); setUploadedFile(null) }}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B' }}>
                Batal
              </button>
              <button onClick={handleSubmit}
                disabled={!form.mulai || !form.selesai || !form.delegasi}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
                style={{ background: '#2563EB' }}>
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview gambar bukti */}
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
