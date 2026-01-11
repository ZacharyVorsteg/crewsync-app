import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrewSync - Commercial Cleaning Operations Platform',
  description:
    'GPS-verified clock-ins, real-time no-show alerts, and job profitability tracking. Software built for commercial cleaning operations.',
  keywords: [
    'commercial cleaning software',
    'cleaning crew management',
    'GPS clock in',
    'janitorial management',
    'cleaning business software',
  ],
  openGraph: {
    title: 'CrewSync - Commercial Cleaning Operations Platform',
    description: 'Never Lose Another Client to a Missed Cleaning',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
