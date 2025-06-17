'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function Navbar() {
  const pathname = usePathname()

  const linkClasses = (path: string) =>
    clsx('px-4 py-2 hover:underline', {
      'underline font-bold': pathname.startsWith(path),
    })

  return (
    <nav className="bg-white border-b p-4 flex gap-4">
      <Link href="/activities" className={linkClasses('/activities')}>
        Activities
      </Link>
      <Link href="/categories" className={linkClasses('/categories')}>
        Categories
      </Link>
    </nav>
  )
}
