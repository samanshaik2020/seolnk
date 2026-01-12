import { Metadata } from 'next'
import BioPageClient from './BioPageClient'

interface PageProps {
    params: Promise<{ username: string }>
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/bio-pages?username=${username}`,
            { cache: 'no-store' }
        )

        if (!res.ok) {
            return {
                title: 'Bio Page Not Found',
            }
        }

        const { bioPage } = await res.json()

        return {
            title: bioPage.seo_title || `${bioPage.title} | SEOLnk`,
            description: bioPage.seo_description || bioPage.description || `Check out ${bioPage.title}'s links`,
            openGraph: {
                title: bioPage.seo_title || bioPage.title,
                description: bioPage.seo_description || bioPage.description,
                images: bioPage.avatar_url ? [{ url: bioPage.avatar_url }] : [],
                type: 'profile',
            },
            twitter: {
                card: 'summary',
                title: bioPage.seo_title || bioPage.title,
                description: bioPage.seo_description || bioPage.description,
                images: bioPage.avatar_url ? [bioPage.avatar_url] : [],
            },
        }
    } catch {
        return {
            title: 'Bio Page',
        }
    }
}

export default async function BioPage({ params }: PageProps) {
    const { username } = await params
    return <BioPageClient username={username} />
}
