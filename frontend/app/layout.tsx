import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgencyRoom',
  description: 'Client portal and reporting for agencies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}
