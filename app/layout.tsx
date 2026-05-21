import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kyla Kim C. Sto. Domingo — Class of 2026",
  description:
    "A luxury graduation celebration page for Kyla Kim C. Sto. Domingo, Bachelor of Arts in Sociology, Class of 2026. Elegant, personal, and built around the woman who made every hard season look graceful.",
  keywords: ["Kyla Kim", "graduation", "sociology", "class of 2026", "Sto. Domingo"],
  openGraph: {
    title: "Kyla Kim C. Sto. Domingo — Class of 2026",
    description: "A luxury graduation celebration for the brilliant Kyla Kim.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#02040a] text-white selection:bg-pink-500/30 selection:text-pink-200">
        {children}
      </body>
    </html>
  );
}
