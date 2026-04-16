import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import HeaderGuest from '@/components/HeaderGuest'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'My blog',
  description: 'kabochanのブログ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <HeaderGuest />
        <main className="mx-auto w-full max-w-3xl px-4 py-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
