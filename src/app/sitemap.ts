import type {MetadataRoute} from 'next'
export const dynamic = "force-static"; // これを追加！！

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourusername.github.io/trumps-game/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    // {
    //   url: 'https://yourusername.github.io/trumps-game/about',
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.8
    // }
  ]
}
