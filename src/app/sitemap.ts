import type {MetadataRoute} from 'next'

export const dynamic = "force-static"; // これを追加！！

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://katsu1101.github.io/trumps-game/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
  ]
}
