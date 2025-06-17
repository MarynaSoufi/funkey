import { Navbar } from './NavBar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col w-full lg:max-w-8xl lg:mx-auto">
      <Navbar />
      {children}
    </main>
  )
}
