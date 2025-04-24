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
  description: "かわいい #とじょりん が、７ならべで対決！",
  robots: "index, follow",
  icons: {
    icon: "https://katsu1101.github.io/trumps-game/favicon-32.png",
    shortcut: "https://katsu1101.github.io/trumps-game/favicon-32.png",
    apple: "https://katsu1101.github.io/trumps-game/apple-touch-icon.png",
  },
  openGraph: {
    title: "とじょりん７ならべ",
    description: "かわいい #とじょりん が、７ならべで対決！",
    url: "https://katsu1101.github.io/trumps-game/",
    siteName: "とじょりん７ならべ",
    images: [
      {
        url: "https://katsu1101.github.io/trumps-game/ogp.png",
        width: 1200,
        height: 630,
        alt: "とじょりん７ならべのイメージ画像"
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
    images: [{
      url: "https://katsu1101.github.io/trumps-game/icon-800.png",
      alt: "とじょりん７ならべのアイコン画像"
    }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "とじょりん７ならべ"
  }
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
      <link rel="canonical" href="https://katsu1101.github.io/trumps-game/"/>
      <meta name="theme-color" content="#CC3333"/>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://katsu1101.github.io/trumps-game/",
            "name": "とじょりん７ならべ",
            "description": "かわいい #とじょりん が、７ならべで対決！",
            "publisher": {
              "@type": "Person",
              "name": "かつき"
            }
          }),
        }}
      ></script>
    </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
