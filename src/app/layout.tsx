import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vacuum Erection Device Pakistan | Discreet ED Treatment - MediPro",
  description: "Medical-grade Vacuum Erection Device in Pakistan. Safe, effective, non-surgical ED treatment. 100% discreet packaging, cash on delivery. Free shipping across Pakistan.",
  keywords: [
    "vacuum erection device Pakistan",
    "ED treatment Pakistan",
    "erectile dysfunction device",
    "VED Pakistan",
    "male enhancement device",
    "vacuum pump Pakistan",
    "non-surgical ED treatment",
    "medical device Pakistan",
    "discreet delivery Pakistan",
    "vacuum therapy device",
    "erectile dysfunction pump",
    "VED device Karachi",
    "VED device Lahore",
    "VED device Islamabad",
  ],
  authors: [{ name: "MediPro" }],
  creator: "MediPro",
  publisher: "MediPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph for social media
  openGraph: {
    title: "Vacuum Erection Device Pakistan - Safe ED Treatment | MediPro",
    description: "Medical-grade Vacuum Erection Device with discreet delivery across Pakistan. Safe, effective, non-surgical treatment. Cash on delivery available.",
    url: "https://medipro.pk",
    siteName: "MediPro",
    images: [
      {
        url: "https://medipro.pk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MediPro - Vacuum Erection Device Pakistan",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  
  
  
  // Robots meta
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification (replace with your actual codes)
  verification: {
    google: "google-site-verification=8msVYh_cdDtTAURDTdZsnIHsBj0Au0dqu7BWYsiTIlk",
    // yandex: "your-yandex-verification-code",
  },
  
  // Canonical URL
  alternates: {
    canonical: "https://medipro.pk",
  },
  
  // Additional metadata
  category: "Medical Devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK" className="scroll-smooth">
      <head>
        {/* Google Analytics - Replace G-XXXXXXXXXX with your actual Google Analytics ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YNMP0RTX67"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YNMP0RTX67', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* Meta Pixel (Facebook) - Optional, replace with your pixel ID */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
        
        {/* Structured Data - Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "MediPro",
              "description": "Your Online Health Partner in Pakistan - Medical device supplier",
              "url": "https://medipro.pk",
              "logo": "https://medipro.pk/medipro-logo4.png",
              "image": "https://medipro.pk/og-image.jpg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-314-620-0998",
                "contactType": "Customer Service",
                "availableLanguage": ["English", "Urdu"],
                "areaServed": "PK"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK"
              },
              "sameAs": [
                "https://www.instagram.com/medipro.pk"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}