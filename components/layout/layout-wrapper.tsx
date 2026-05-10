import { Navbar } from './navbar'
import { Footer } from './footer'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
