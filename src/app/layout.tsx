import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://discover-sierra-leone-tourism-pink.vercel.app"),
  title: "Sierra Leone Tourism | Discover the Lion Mountain",
  description: "Explore Sierra Leone's pristine beaches, wildlife sanctuaries, and rich cultural heritage. Plan your authentic West African adventure today.",
  openGraph: {
    title: "Sierra Leone Tourism | Discover the Lion Mountain",
    description: "Explore Sierra Leone's pristine beaches, wildlife sanctuaries, and rich cultural heritage.",
    images: ["/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sierra Leone Tourism | Discover the Lion Mountain",
    description: "Explore Sierra Leone's pristine beaches, wildlife sanctuaries, and rich cultural heritage.",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-sans">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="a29adf43-7e98-417c-aefd-75668f7c760a"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
