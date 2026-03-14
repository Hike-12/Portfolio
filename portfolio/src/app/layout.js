import { Geist, Geist_Mono, Dancing_Script, Plus_Jakarta_Sans, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing-script',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-figtree',
});

// Fix: Allow user zooming (WCAG 2.1 SC 1.4.4 compliance)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

const SITE_URL = 'https://aliqyaan.vercel.app';
const SITE_TITLE = 'Aliqyaan Mahimwala | Full Stack Developer & Portfolio';
const SITE_DESCRIPTION = 'Aliqyaan Mahimwala is a Full Stack Developer and Computer Engineering student specializing in modern web applications, interactive 3D experiences, and AI integration. Explore projects, skills, and get in touch.';

export const metadata = {
  // Core SEO
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },

  // Author & Creator
  authors: [{ name: 'Aliqyaan Mahimwala', url: SITE_URL }],
  creator: 'Aliqyaan Mahimwala',
  publisher: 'Aliqyaan Mahimwala',

  // Keywords
  keywords: [
    'Aliqyaan Mahimwala',
    'Full Stack Developer',
    'Computer Engineering',
    'Web Developer',
    'React Developer',
    'Next.js Developer',
    'Django Developer',
    'Portfolio',
    'Three.js',
    'WebVR',
    'AI Integration',
    'Mumbai Developer',
  ],

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (Social sharing)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Aliqyaan Mahimwala Portfolio',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aliqyaan Mahimwala — Full Stack Developer Portfolio',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@aliqyaan_12',
  },

  // Icons
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  // Category
  category: 'technology',

  // Other
  other: {
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

export default function RootLayout({ children }) {
  // JSON-LD Structured Data
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Aliqyaan Mahimwala',
    url: SITE_URL,
    image: `${SITE_URL}/Me.jpg`,
    email: 'mailto:aliqyaan12@gmail.com',
    jobTitle: 'Full Stack Developer',
    description: SITE_DESCRIPTION,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bandra',
        addressRegion: 'Mumbai',
        addressCountry: 'IN',
      },
    },
    knowsAbout: [
      'Full Stack Development',
      'React',
      'Next.js',
      'Django',
      'Three.js',
      'WebVR',
      'AI Integration',
      'JavaScript',
      'Python',
      'Computer Engineering',
    ],
    sameAs: [
      'https://github.com/Hike-12',
      'https://www.linkedin.com/in/aliqyaan-mahimwala-362568292/',
      'https://instagram.com/aliqyaan_12',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aliqyaan Mahimwala Portfolio',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: 'Aliqyaan Mahimwala',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="llms" href="/llms.txt" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${plusJakartaSans.variable} ${figtree.variable} antialiased`}
      >
        {/* Accessibility: Skip to main content link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}