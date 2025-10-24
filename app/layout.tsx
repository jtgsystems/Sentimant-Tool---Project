import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sentiment Tool - Conversation Sentiment Analyzer',
  description: 'A modern web application to analyze sentiment in conversation text through customizable keyword categories. Highlights keywords, calculates sentiment scores, and visualizes results with detailed context.',
  keywords: ['sentiment analysis', 'conversation analyzer', 'text analysis', 'keyword detection', 'emotion detection'],
  authors: [{ name: 'John Gallie', url: 'https://www.jtgsystems.com' }],
  creator: 'John Gallie - JTG Systems',
  openGraph: {
    title: 'Sentiment Tool - Conversation Sentiment Analyzer',
    description: 'Analyze sentiment in conversation text through customizable keyword categories',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
