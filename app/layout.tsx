import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Los Piratas',
  description: 'Portal da organização Los Piratas RP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
