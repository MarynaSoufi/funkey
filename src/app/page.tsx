import { redirect } from 'next/navigation'

export default function HomePage({ children }: { children: React.ReactNode }) {
  redirect('/activities')
  return <div className="px-20 py-10 m-auto max-w-4xl">{children}</div>
}
