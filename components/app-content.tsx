"use client"

import { useApp } from "@/contexts/app-context"
import { NetflixIntro } from "@/components/intro/netflix-intro"
import { Navbar } from "@/components/navigation/navbar"
import { CoursologyBanner } from "@/components/ads/coursology-banner"
import { Sidebar } from "@/components/navigation/sidebar"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { ToastContainer } from "@/components/notifications/toast-container"
import "./intro/developer-glow.css"

interface AppContentProps {
  children: React.ReactNode
}

export function AppContent({ children }: AppContentProps) {
  const { isIntroPlaying } = useApp()

  return (
    <>
      <NetflixIntro />
      {!isIntroPlaying && (
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <div className="sticky top-[56px] z-30">
            <CoursologyBanner />
          </div>
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 md:ml-64 min-h-0 p-4">{children}</main>
          </div>
          <MobileNav />
          <footer className="hidden md:block bg-muted/50 border-t py-4 text-center text-sm text-muted-foreground mt-auto">
            This front-end app made for Coursology by <span className="developer-glow">ayooya</span>
          </footer>
        </div>
      )}
      <ToastContainer />
    </>
  )
}
