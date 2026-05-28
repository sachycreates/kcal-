import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KCAL',
  description: 'No crashes. All day fuel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}