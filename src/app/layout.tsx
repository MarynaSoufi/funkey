import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funkey App',
  description: 'My fullstack app with Next.js and Drizzle ORM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  )
}
