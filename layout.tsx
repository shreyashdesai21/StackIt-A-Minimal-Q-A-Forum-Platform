import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { RealtimeProvider } from "@/hooks/use-realtime"
import { LiteModeProvider } from "@/components/lite-mode-toggle"
import { AIChatbot } from "@/components/ai-chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StackIt - Q&A Platform",
  description:
    "A modern Q&A platform for developers with AI assistance, real-time features, and comprehensive analytics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark bg-gray-950 text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LiteModeProvider>
            <AuthProvider>
              <RealtimeProvider>
                {children}
                <AIChatbot />
                <Toaster />
              </RealtimeProvider>
            </AuthProvider>
          </LiteModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
