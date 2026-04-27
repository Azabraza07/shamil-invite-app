import type { Metadata } from 'next'
import { Cormorant, Raleway } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500'],
  variable: '--font-raleway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Шамиль & Милана — 26 июня 2026',
  description: 'Приглашение на свадьбу Шамиля и Миланы',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Шамиль & Милана — 26 июня 2026',
    description: 'Мы приглашаем вас разделить с нами этот особенный день',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  )
}
