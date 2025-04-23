import type {MetadataRoute} from 'next'

export const dynamic = "force-static"; // これを追加！！

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/'
    },
    sitemap: 'https://katsu1101.github.io/trumps-game/sitemap.xml'
  }
}
