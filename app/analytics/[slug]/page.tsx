import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Eye, Clock, Globe } from 'lucide-react'
import Image from 'next/image'

type Props = {
    params: Promise<{ slug: string }>
}

async function getCardAndAnalytics(slug: string) {
    const { data: card } = await supabase
        .from('cards')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!card) return { card: null, analytics: [], totalViews: 0 }

    const { data: analytics, count } = await supabase
        .from('analytics')
        .select('*', { count: 'exact' })
        .eq('card_id', card.id)
        .order('created_at', { ascending: false })

    return { card, analytics, totalViews: count || 0 }
}

export default async function AnalyticsPage({ params }: Props) {
    const { slug } = await params
    const { card, analytics, totalViews } = await getCardAndAnalytics(slug)

    if (!card) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Card Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                            <p className="text-muted-foreground">Stats for your link</p>
                        </div>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/p/${slug}`} target="_blank">
                            Visit Link
                        </Link>
                    </Button>
                </div>

                {/* Card Preview & Key Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Link Preview Card */}
                    <Card className="overflow-hidden h-fit">
                        <div className="relative aspect-[1.91/1] w-full bg-muted">
                            <Image
                                src={card.image_url}
                                alt={card.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg line-clamp-1">{card.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{card.description}</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Stats */}
                    <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{totalViews}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    All time clicks
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Visited</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analytics && analytics.length > 0
                                        ? new Date(analytics[0].created_at).toLocaleDateString()
                                        : 'Never'}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {analytics && analytics.length > 0
                                        ? new Date(analytics[0].created_at).toLocaleTimeString()
                                        : '-'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest 50 visits to your link</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 font-medium">Date & Time</th>
                                        <th className="p-4 font-medium">Referrer</th>
                                        <th className="p-4 font-medium">User Agent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {analytics?.slice(0, 50).map((entry: any) => (
                                        <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                {new Date(entry.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4 max-w-[200px] truncate" title={entry.referrer}>
                                                {entry.referrer !== 'unknown' ? entry.referrer : '-'}
                                            </td>
                                            <td className="p-4 max-w-[300px] truncate text-muted-foreground" title={entry.user_agent}>
                                                {entry.user_agent}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!analytics || analytics.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                                No views yet. Share your link to start tracking!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
