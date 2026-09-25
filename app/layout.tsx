import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { JsonLdSeo } from "@/components/JsonLdSeo";

export const metadata: Metadata = {
  metadataBase: new URL("https://jaylensinegal.com"),
  title: {
    default: "Jaylen Sinegal | Executive Brand Strategist and Media IP Consultant",
    template: "%s | Jaylen Sinegal",
  },
  description:
    "Jaylen Sinegal is an executive brand strategist and media IP consultant across Louisiana. Athlete IP, copyright compliance, and athletic performance ecosystems for athletes, schools, brands, and communities.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jaylen Sinegal",
    title: "Jaylen Sinegal | Executive Brand Strategist and Media IP Consultant",
    description:
      "Architecting modern athlete IP, copyright compliance, and athletic performance ecosystems across the Gulf Coast.",
    url: "https://jaylensinegal.com/",
    images: [
      {
        url: "https://jaylensinegal.com/louisiana-storyteller.jpg",
        width: 2000,
        height: 2000,
        alt: "Jaylen Sinegal, executive brand strategist and Louisiana storyteller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaylen Sinegal | Executive Brand Strategist and Media IP Consultant",
    description:
      "Architecting modern athlete IP, copyright compliance, and athletic performance ecosystems across the Gulf Coast.",
    images: ["https://jaylensinegal.com/louisiana-storyteller.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script>
          {`try{if(localStorage.getItem('jaylen_ga4_opt_out')==='true'){window['ga-disable-G-V09SKB92BX']=true;}}catch(e){}`}
        </script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V09SKB92BX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-V09SKB92BX',{anonymize_ip:true});`,
          }}
        />
      </head>
      <body className="min-h-screen bg-midnight text-white">
        <a
          href="#contact"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-midnight"
        >
          Skip to contact
        </a>
        {children}
        <JsonLdSeo />
      </body>
    </html>
  );
}