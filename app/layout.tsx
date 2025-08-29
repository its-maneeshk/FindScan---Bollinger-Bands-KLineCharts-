export const metadata = {
  title: "Bollinger Bands • KLineCharts",
  description: "Next.js + KLineCharts demo with custom BB indicator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
