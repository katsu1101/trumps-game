'use client'

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {useEffect}         from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      document.body.classList.add('android');
    }
  }, []);
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
