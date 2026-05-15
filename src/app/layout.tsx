import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HR Digital — RSU Royal Prima',
  description: 'Sistem Manajemen SDM Digital Terintegrasi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
