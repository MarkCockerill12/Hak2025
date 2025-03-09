import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '~/components/custom/header'

export const metadata: Metadata = {
  title: 'green socks',
  description: 'Created with Monster',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <Header />
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
