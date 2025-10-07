import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { Navbar } from '@/components/navbar/navbar';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Freezer Finds',
  description: 'Browse your favorite frozen foods from grocery stores and review them!',
  icons: {
    icon: '/app_logo.png'
  }
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin']
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <div className="h-16"></div>
          {children}
        </ThemeProvider>
        <ToastContainer aria-label={'Notification'} />
      </body>
    </html>
  );
}
