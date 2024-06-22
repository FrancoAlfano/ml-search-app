'use client';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';
import Header from '../components/Header/Header';
import { SearchProvider } from '../contexts/SearchContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter}>
        <SearchProvider>
          <Header />
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
