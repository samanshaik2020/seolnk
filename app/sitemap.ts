import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://seolnk.com'

    const routes = [
        '',
        '/features',
        '/pricing',
        '/analytics-info',
        '/privacy',
        '/terms',
        '/contact',
        '/cookies',
        '/blog/preview-links',
        '/blog/alias-links',
        '/blog/rotator-links',
        '/blog/expiring-links',
        '/blog/protected-links',
        '/blog/bio-links',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route.includes('blog') ? 'weekly' as const : 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))
}
