// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'hr' | 'manajer' | 'karyawan';

export interface User {
  id: string;
  nama: string;
  nik: string;
  jabatan: string;
  departemen: string;
  role: Role;
  avatar: string;
  email: string;
  shift: string;
  bergabung: string;
}

export interface Lembur {
  id: string;
  karyawanId: string;
  karyawan: string;
  departemen: string;
  tanggal: string;
  mulai: string;
  selesai: string;
  totalJam: number;
  uraian: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  diajukan: string;
}

export interface Izin {
  id: string;
  karyawanId: string;
  karyawan: string;
  departemen: string;
  jenis: 'cuti' | 'sakit' | 'telat' | 'izin';
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  hasSKI?: boolean;
  delegasi?: string;
  buktiUrl?: string;
  diajukan: string;
}

export interface JadwalDinas {
  id: string;
  karyawanId: string;
  karyawan: string;
  departemen: string;
  tanggal: string;
  shift: 'Pagi' | 'Siang' | 'Malam';
  jamMulai: string;
  jamSelesai: string;
  lokasi: string;
}

export interface AbsensiRecord {
  id: string;
  karyawanId: string;
  karyawan: string;
  departemen: string;
  tanggal: string;
  jamMasuk: string | null;
  jamKeluar: string | null;
  status: 'hadir' | 'telat' | 'absen' | 'izin' | 'cuti';
  sumber: 'fingerprint' | 'manual';
}

// ─── Dummy Users ─────────────────────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'u1', nama: 'Dr. Ahmad Fauzi', nik: 'RSP-001', jabatan: 'Direktur', departemen: 'Manajemen', role: 'admin', avatar: 'AF', email: 'ahmad@royalprima.com', shift: 'Reguler', bergabung: '2018-01-15' },
  { id: 'u2', nama: 'Siti Rahayu', nik: 'RSP-002', jabatan: 'Manajer HRD', departemen: 'HRD', role: 'hr', avatar: 'SR', email: 'siti@royalprima.com', shift: 'Reguler', bergabung: '2019-03-10' },
  { id: 'u3', nama: 'Budi Santoso', nik: 'RSP-003', jabatan: 'Kepala Perawat', departemen: 'Keperawatan', role: 'manajer', avatar: 'BS', email: 'budi@royalprima.com', shift: 'Pagi', bergabung: '2020-06-01' },
  { id: 'u4', nama: 'Dewi Lestari', nik: 'RSP-004', jabatan: 'Perawat Senior', departemen: 'Keperawatan', role: 'karyawan', avatar: 'DL', email: 'dewi@royalprima.com', shift: 'Siang', bergabung: '2021-02-14' },
  { id: 'u5', nama: 'Rizky Pratama', nik: 'RSP-005', jabatan: 'Dokter Umum', departemen: 'IGD', role: 'karyawan', avatar: 'RP', email: 'rizky@royalprima.com', shift: 'Malam', bergabung: '2022-07-20' },
  { id: 'u6', nama: 'Nurul Hidayah', nik: 'RSP-006', jabatan: 'Admin Farmasi', departemen: 'Farmasi', role: 'karyawan', avatar: 'NH', email: 'nurul@royalprima.com', shift: 'Pagi', bergabung: '2021-11-05' },
  { id: 'u7', nama: 'Hendra Wijaya', nik: 'RSP-007', jabatan: 'Radiografer', departemen: 'Radiologi', role: 'karyawan', avatar: 'HW', email: 'hendra@royalprima.com', shift: 'Siang', bergabung: '2020-09-18' },
  { id: 'u8', nama: 'Fitri Amalia', nik: 'RSP-008', jabatan: 'Bidan', departemen: 'Kebidanan', role: 'karyawan', avatar: 'FA', email: 'fitri@royalprima.com', shift: 'Malam', bergabung: '2023-01-03' },
];

// ─── Dummy Lembur ─────────────────────────────────────────────────────────────

export const LEMBUR_DATA: Lembur[] = [
  { id: 'lb1', karyawanId: 'u4', karyawan: 'Dewi Lestari', departemen: 'Keperawatan', tanggal: '2026-05-14', mulai: '21:00', selesai: '24:00', totalJam: 3, uraian: 'Penanganan pasien IGD malam', status: 'pending', diajukan: '2026-05-14 08:00' },
  { id: 'lb2', karyawanId: 'u5', karyawan: 'Rizky Pratama', departemen: 'IGD', tanggal: '2026-05-13', mulai: '20:00', selesai: '23:00', totalJam: 3, uraian: 'Jaga malam tambahan', status: 'disetujui', diajukan: '2026-05-12 14:30' },
  { id: 'lb3', karyawanId: 'u7', karyawan: 'Hendra Wijaya', departemen: 'Radiologi', tanggal: '2026-05-12', mulai: '17:00', selesai: '19:00', totalJam: 2, uraian: 'Pemeriksaan CT-Scan darurat', status: 'disetujui', diajukan: '2026-05-11 16:00' },
  { id: 'lb4', karyawanId: 'u6', karyawan: 'Nurul Hidayah', departemen: 'Farmasi', tanggal: '2026-05-11', mulai: '18:00', selesai: '21:00', totalJam: 3, uraian: 'Inventaris obat bulanan', status: 'ditolak', diajukan: '2026-05-10 09:00' },
  { id: 'lb5', karyawanId: 'u8', karyawan: 'Fitri Amalia', departemen: 'Kebidanan', tanggal: '2026-05-10', mulai: '22:00', selesai: '02:00', totalJam: 4, uraian: 'Pendampingan persalinan malam', status: 'disetujui', diajukan: '2026-05-09 20:00' },
  { id: 'lb6', karyawanId: 'u4', karyawan: 'Dewi Lestari', departemen: 'Keperawatan', tanggal: '2026-05-08', mulai: '17:00', selesai: '20:00', totalJam: 3, uraian: 'Overshift karena kekurangan staf', status: 'disetujui', diajukan: '2026-05-08 16:00' },
];

// ─── Dummy Izin ───────────────────────────────────────────────────────────────

export const IZIN_DATA: Izin[] = [
  { id: 'iz1', karyawanId: 'u4', karyawan: 'Dewi Lestari', departemen: 'Keperawatan', jenis: 'cuti', tanggalMulai: '2026-05-20', tanggalSelesai: '2026-05-22', alasan: 'Cuti tahunan', status: 'pending', delegasi: 'Fitri Amalia', diajukan: '2026-05-13 09:00' },
  { id: 'iz2', karyawanId: 'u5', karyawan: 'Rizky Pratama', departemen: 'IGD', jenis: 'sakit', tanggalMulai: '2026-05-14', tanggalSelesai: '2026-05-15', alasan: 'Demam tinggi', status: 'disetujui', hasSKI: true, diajukan: '2026-05-14 07:00' },
  { id: 'iz3', karyawanId: 'u6', karyawan: 'Nurul Hidayah', departemen: 'Farmasi', jenis: 'telat', tanggalMulai: '2026-05-14', tanggalSelesai: '2026-05-14', alasan: 'Kemacetan jalan', status: 'disetujui', diajukan: '2026-05-14 07:45' },
  { id: 'iz4', karyawanId: 'u7', karyawan: 'Hendra Wijaya', departemen: 'Radiologi', jenis: 'sakit', tanggalMulai: '2026-05-12', tanggalSelesai: '2026-05-13', alasan: 'Flu berat', status: 'disetujui', hasSKI: false, diajukan: '2026-05-12 06:30' },
  { id: 'iz5', karyawanId: 'u8', karyawan: 'Fitri Amalia', departemen: 'Kebidanan', jenis: 'cuti', tanggalMulai: '2026-05-16', tanggalSelesai: '2026-05-16', alasan: 'Urusan keluarga', status: 'pending', delegasi: 'Dewi Lestari', diajukan: '2026-05-13 14:00' },
  { id: 'iz6', karyawanId: 'u5', karyawan: 'Rizky Pratama', departemen: 'IGD', jenis: 'telat', tanggalMulai: '2026-05-10', tanggalSelesai: '2026-05-10', alasan: 'Ban bocor', status: 'ditolak', diajukan: '2026-05-10 10:00' },
];

// ─── Dummy Jadwal ─────────────────────────────────────────────────────────────

export const JADWAL_DATA: JadwalDinas[] = [
  { id: 'jd1', karyawanId: 'u3', karyawan: 'Budi Santoso', departemen: 'Keperawatan', tanggal: '2026-05-14', shift: 'Pagi', jamMulai: '07:00', jamSelesai: '14:00', lokasi: 'Lantai 2 - Bedah' },
  { id: 'jd2', karyawanId: 'u4', karyawan: 'Dewi Lestari', departemen: 'Keperawatan', tanggal: '2026-05-14', shift: 'Siang', jamMulai: '14:00', jamSelesai: '21:00', lokasi: 'Lantai 2 - Bedah' },
  { id: 'jd3', karyawanId: 'u8', karyawan: 'Fitri Amalia', departemen: 'Kebidanan', tanggal: '2026-05-14', shift: 'Malam', jamMulai: '21:00', jamSelesai: '07:00', lokasi: 'Lantai 3 - Kebidanan' },
  { id: 'jd4', karyawanId: 'u5', karyawan: 'Rizky Pratama', departemen: 'IGD', tanggal: '2026-05-14', shift: 'Malam', jamMulai: '21:00', jamSelesai: '07:00', lokasi: 'IGD' },
  { id: 'jd5', karyawanId: 'u6', karyawan: 'Nurul Hidayah', departemen: 'Farmasi', tanggal: '2026-05-14', shift: 'Pagi', jamMulai: '07:00', jamSelesai: '14:00', lokasi: 'Farmasi Lt. 1' },
  { id: 'jd6', karyawanId: 'u7', karyawan: 'Hendra Wijaya', departemen: 'Radiologi', tanggal: '2026-05-14', shift: 'Siang', jamMulai: '14:00', jamSelesai: '21:00', lokasi: 'Radiologi' },
  { id: 'jd7', karyawanId: 'u3', karyawan: 'Budi Santoso', departemen: 'Keperawatan', tanggal: '2026-05-15', shift: 'Pagi', jamMulai: '07:00', jamSelesai: '14:00', lokasi: 'Lantai 2 - Bedah' },
  { id: 'jd8', karyawanId: 'u4', karyawan: 'Dewi Lestari', departemen: 'Keperawatan', tanggal: '2026-05-15', shift: 'Malam', jamMulai: '21:00', jamSelesai: '07:00', lokasi: 'Lantai 2 - Bedah' },
];

// ─── Dummy Absensi ────────────────────────────────────────────────────────────

export const ABSENSI_DATA: AbsensiRecord[] = [
  { id: 'ab1', karyawanId: 'u3', karyawan: 'Budi Santoso', departemen: 'Keperawatan', tanggal: '2026-05-14', jamMasuk: '06:58', jamKeluar: null, status: 'hadir', sumber: 'fingerprint' },
  { id: 'ab2', karyawanId: 'u4', karyawan: 'Dewi Lestari', departemen: 'Keperawatan', tanggal: '2026-05-14', jamMasuk: '14:03', jamKeluar: null, status: 'hadir', sumber: 'fingerprint' },
  { id: 'ab3', karyawanId: 'u5', karyawan: 'Rizky Pratama', departemen: 'IGD', tanggal: '2026-05-14', jamMasuk: null, jamKeluar: null, status: 'izin', sumber: 'manual' },
  { id: 'ab4', karyawanId: 'u6', karyawan: 'Nurul Hidayah', departemen: 'Farmasi', tanggal: '2026-05-14', jamMasuk: '07:35', jamKeluar: null, status: 'telat', sumber: 'fingerprint' },
  { id: 'ab5', karyawanId: 'u7', karyawan: 'Hendra Wijaya', departemen: 'Radiologi', tanggal: '2026-05-14', jamMasuk: '14:01', jamKeluar: null, status: 'hadir', sumber: 'fingerprint' },
  { id: 'ab6', karyawanId: 'u8', karyawan: 'Fitri Amalia', departemen: 'Kebidanan', tanggal: '2026-05-14', jamMasuk: null, jamKeluar: null, status: 'absen', sumber: 'fingerprint' },
];

// ─── Chart Data ───────────────────────────────────────────────────────────────

export const LEMBUR_MONTHLY = [
  { bulan: 'Jan', jam: 145, biaya: 12.5 },
  { bulan: 'Feb', jam: 132, biaya: 11.2 },
  { bulan: 'Mar', jam: 168, biaya: 14.8 },
  { bulan: 'Apr', jam: 155, biaya: 13.4 },
  { bulan: 'Mei', jam: 98, biaya: 8.6 },
];

export const ABSENSI_MONTHLY = [
  { bulan: 'Jan', hadir: 87, telat: 8, absen: 3, izin: 2 },
  { bulan: 'Feb', hadir: 85, telat: 9, absen: 4, izin: 2 },
  { bulan: 'Mar', hadir: 90, telat: 6, absen: 2, izin: 2 },
  { bulan: 'Apr', hadir: 88, telat: 7, absen: 3, izin: 2 },
  { bulan: 'Mei', hadir: 91, telat: 5, absen: 2, izin: 2 },
];

export const DEPT_LEMBUR = [
  { dept: 'Keperawatan', jam: 68 },
  { dept: 'IGD', jam: 52 },
  { dept: 'Kebidanan', jam: 44 },
  { dept: 'Farmasi', jam: 28 },
  { dept: 'Radiologi', jam: 22 },
  { dept: 'Lab', jam: 18 },
];

// ─── Notifikasi ───────────────────────────────────────────────────────────────

export const NOTIFIKASI = [
  { id: 'n1', jenis: 'lembur', pesan: 'Dewi Lestari mengajukan lembur 3 jam malam ini', waktu: '5 menit lalu', dibaca: false },
  { id: 'n2', jenis: 'cuti', pesan: 'Pengajuan cuti Fitri Amalia menunggu persetujuan Anda', waktu: '1 jam lalu', dibaca: false },
  { id: 'n3', jenis: 'absensi', pesan: 'Nurul Hidayah tercatat terlambat 35 menit hari ini', waktu: '2 jam lalu', dibaca: true },
  { id: 'n4', jenis: 'sakit', pesan: 'Rizky Pratama izin sakit — SKI sudah diupload', waktu: '3 jam lalu', dibaca: true },
  { id: 'n5', jenis: 'jadwal', pesan: 'Jadwal dinas minggu depan belum dikonfirmasi 3 karyawan', waktu: 'Kemarin', dibaca: true },
];
