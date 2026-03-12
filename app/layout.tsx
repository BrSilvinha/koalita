import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Para ti, koalita',
  description: 'Una página hecha con cariño',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
