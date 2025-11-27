import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import RedirectComponent from '@/components/RedirectComponent'

type Props = {
    params: Promise<{ slug: string }>
}

async function getCard(slug: string) {
    const { data } = await supabase
        .from('cards')
        .select('*')
        .eq('slug', slug)
        .single()
    return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const card = await getCard(slug)

    if (!card) {
        return {
            title: 'Card Not Found',
        }
    }

    return {
        title: card.title,
        description: card.description,
        openGraph: {
            title: card.title,
            description: card.description,
            images: [
                {
                    url: card.image_url,
                    width: card.image_width,
                    height: card.image_height,
                    alt: card.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: card.title,
            description: card.description,
            images: [card.image_url],
        },
    }
}

export default async function CardPage({ params }: Props) {
    const { slug } = await params
    const card = await getCard(slug)

    if (!card) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Card Not Found</h1>
                    <p className="mt-2 text-gray-600">The link you are looking for does not exist.</p>
                    <Button asChild className="mt-4">
                        <Link href="/">Create New Link</Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (card.original_url) {
        return <RedirectComponent url={card.original_url} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md overflow-hidden">
                <div className="relative w-full" style={{ aspectRatio: `${card.image_width} / ${card.image_height}` }}>
                    <Image
                        src={card.image_url}
                        alt={card.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/">Create Your Own</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
