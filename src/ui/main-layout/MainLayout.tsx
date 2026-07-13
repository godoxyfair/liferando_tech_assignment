import type { ReactNode } from 'react'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <main className="main-layout__content">{children}</main>
    </div>
  )
}

export default MainLayout
