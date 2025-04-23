import {Geist, Geist_Mono} from "next/font/google";
import React               from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "とじょりん７ならべ",
  description: "ばけごろうやミニばけたちと対戦できる7ならべゲーム！",
  icons: {
    icon: "https://yourusername.github.io/trumps-game/favicon-32.png",
    shortcut: "https://yourusername.github.io/trumps-game/favicon-32.png",
    apple: "https://yourusername.github.io/trumps-game/apple-touch-icon.png",
  },
  openGraph: {
    title: "とじょりん７ならべ",
    description: "VTuberキャラと7ならべ！遊んでね！",
    url: "https://yourusername.github.io/trumps-game/",
    siteName: "とじょりん７ならべ",
    images: [
      {
        url: "https://yourusername.github.io/trumps-game/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@あなたのTwitter",
    title: "とじょりん７ならべ",
    description: "VTuberキャラと7ならべ対戦！",
    images: ["https://yourusername.github.io/trumps-game/ogp.png"],
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
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
