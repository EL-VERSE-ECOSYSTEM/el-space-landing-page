import React from 'react';
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LoaderProvider } from '@/components/loader-provider'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EL SPACE - Freelance Without the Friction',
  description: 'Join the top 5% of tech talent on EL SPACE. Escrow-protected freelance marketplace with instant pay, vetted talent, and fair pricing.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LoaderProvider>
              {children}
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </LoaderProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
