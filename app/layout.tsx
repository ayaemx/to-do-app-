import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TaskProvider } from "@/contexts/task-context"
import { FolderProvider } from "@/contexts/folder-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { BlogProvider } from "@/contexts/blog-context"
import { CalendarProvider } from "@/contexts/calendar-context"
import { AppProvider } from "@/contexts/app-context"
import { AppContent } from "@/components/app-content"

export const metadata: Metadata = {
  title: "coursology-ayooya",
  description: "Professional task management app for Coursology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://coursology-qbank.com/coursology_logo.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/fonts.css" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TaskProvider>
            <FolderProvider>
              <AppProvider>
                <NotificationProvider>
                  <BlogProvider>
                    <CalendarProvider>
                      <AppContent>{children}</AppContent>
                    </CalendarProvider>
                  </BlogProvider>
                </NotificationProvider>
              </AppProvider>
            </FolderProvider>
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
