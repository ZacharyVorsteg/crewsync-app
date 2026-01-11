import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import { CookieConsent } from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://crewsync.app'),
  title: {
    default: 'CrewSync - Commercial Cleaning Operations Platform',
    template: '%s | CrewSync',
  },
  description:
    'GPS-verified clock-ins, real-time no-show alerts, and job profitability tracking. Software built for commercial cleaning operations.',
  keywords: [
    'commercial cleaning software',
    'cleaning crew management',
    'GPS clock in',
    'janitorial management',
    'cleaning business software',
  ],
  authors: [{ name: 'CrewSync' }],
  creator: 'CrewSync',
  publisher: 'CrewSync',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crewsync.app',
    siteName: 'CrewSync',
    title: 'CrewSync - Never Lose Another Client to a Missed Cleaning',
    description: 'GPS-verified clock-ins, real-time no-show alerts, and job profitability tracking for commercial cleaning companies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CrewSync - Commercial Cleaning Operations Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrewSync - Commercial Cleaning Operations Platform',
    description: 'GPS-verified clock-ins, real-time no-show alerts, and job profitability tracking.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CrewSync',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: 'Commercial cleaning operations platform with GPS-verified clock-ins.',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '49',
      highPrice: '199',
      priceCurrency: 'USD',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
