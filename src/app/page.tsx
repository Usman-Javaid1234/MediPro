import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import Script from "next/script";

export default function Home() {
  // Product Schema for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Vacuum Erection Device",
    "image": [
      "https://medipro.pk/pic2.png",
      "https://medipro.pk/kit-contents.jpg",
      "https://medipro.pk/product-closeup.jpg"
    ],
    "description": "Medical-grade vacuum erection device for erectile dysfunction treatment. Clinically proven, FDA-approved technology with discreet delivery across Pakistan.",
    "brand": {
      "@type": "Brand",
      "name": "MediPro"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://medipro.pk",
      "priceCurrency": "PKR",
      "price": "3500",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "PKR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "PK"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "M.A. from Lahore"
        },
        "reviewBody": "I was skeptical at first, but this device truly changed my life. The discreet packaging gave me confidence to order, and the results exceeded my expectations."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "S.K. from Karachi"
        },
        "reviewBody": "Finally, a solution that works without any medication. Easy to use, effective, and the customer support team was incredibly helpful and understanding."
      }
    ],
    "warranty": "1 year manufacturer warranty"
  };

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this device safe to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our vacuum erection device is made with FDA-approved medical-grade materials and is completely safe for regular use. It's a non-invasive, drug-free solution that has been clinically tested."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver across Pakistan within 3-5 business days for major cities like Karachi, Lahore, and Islamabad. Remote areas may take 5-7 business days."
        }
      },
      {
        "@type": "Question",
        "name": "Is the packaging discreet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Your privacy is our top priority. All orders are shipped in plain, unmarked packaging with no indication of the contents."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept Cash on Delivery (COD) for customers across Pakistan. This allows you to inspect the package and pay only when you're satisfied."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know this will work for me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vacuum therapy is a clinically proven method that works for most men experiencing erectile dysfunction. It's recommended by urologists worldwide as a first-line, non-invasive treatment option."
        }
      }
    ]
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://medipro.pk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Vacuum Erection Device",
        "item": "https://medipro.pk#product"
      }
    ]
  };

  return (
    <>
      {/* Structured Data Scripts */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <ProductShowcase />
        <HowItWorks />
        <WhyChoose />
        <Testimonials />
        <FAQ />
        <Footer />
        <WhatsAppButton />
        <MobileStickyCTA />
      </main>
    </>
  );
}