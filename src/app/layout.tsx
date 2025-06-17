import { Layout } from '@/components/Layout'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funkey App',
  description: 'My fullstack app with Next.js and Drizzle ORM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900 antialiased bg-red-50">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
