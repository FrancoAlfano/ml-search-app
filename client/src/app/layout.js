import { Inter } from 'next/font/google';
import '../styles/globals.scss';
import Header from '../components/Header/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mercado Libre',
  description: 'Generated by create next app'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter}>
        <Header />
        {children}
      </body>
    </html>
  );
}
