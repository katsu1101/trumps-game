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
    icon: "https://katsu1101.github.io/trumps-game/favicon-32.png",
    shortcut: "https://katsu1101.github.io/trumps-game/favicon-32.png",
    apple: "https://katsu1101.github.io/trumps-game/apple-touch-icon.png",
  },
  openGraph: {
    title: "とじょりん７ならべ",
    description: "VTuberキャラと7ならべ！遊んでね！",
    url: "https://katsu1101.github.io/trumps-game/",
    siteName: "とじょりん７ならべ",
    images: [
      {
        url: "https://katsu1101.github.io/trumps-game/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@katsu1101",
    title: "とじょりん７ならべ",
    description: "かわいい #とじょりん が、7ならべ対戦！",
    images: ["https://katsu1101.github.io/trumps-game/icon-800.png"],
  },
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
    <head>
      <link rel="manifest" href={`${basePath}/manifest.json`}/>
      <meta name="theme-color" content="#4ADE80"/>
    </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
