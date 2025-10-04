import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../../contexts/CartContext'
import { AuthProvider } from '../../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fashion EC',
  description: 'トレンドファッションをお届け',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}