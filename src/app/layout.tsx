import './globals.css'

export const metadata = {
  title: 'FindScan - Bollinger KLinerChart',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
