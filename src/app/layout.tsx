import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MediPro - Medical Vacuum Erection Device | Pakistan",
  description: "Medical-grade Vacuum Erection Device - Safe, Effective, Discreet Delivery across Pakistan. FDA Approved Technology, 100% Discreet Packaging, Cash on Delivery Available.",
  keywords: "vacuum erection device, erectile dysfunction, medical device, Pakistan, discreet delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
