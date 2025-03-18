import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SummaryDojo - AI Document Search Engine",
  description: "Upload, analyze, and search your documents with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark scroll-smooth">
        <body
          className={`${inter.className} min-h-screen antialiased`}
          style={{
            backgroundColor: "var(--dark-bg)",
            color: "var(--dark-text)",
          }}
        >
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">{children}</div>
            <SignedOut>
              <Footer />
            </SignedOut>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
