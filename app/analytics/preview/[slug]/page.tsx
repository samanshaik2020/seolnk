'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    ArrowLeft, Globe, MousePointer2, Share2, TrendingUp,
    Calendar, ExternalLink, Loader2, Activity
} from 'lucide-react'
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart'
import { StatsCard } from '@/components/analytics/StatsCard'
import { DeviceBreakdownSimple } from '@/components/analytics/DeviceBreakdown'

interface AnalyticsEntry {
    id: string
    created_at: string
    referrer: string
    user_agent: string
}

interface CardData {
    id: string
    title: string
    slug: string
    views: number
    created_at: string
}

export default function PreviewAnalyticsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [loading, setLoading] = useState(true)
    const [card, setCard] = useState<CardData | null>(null)
    const [analytics, setAnalytics] = useState<AnalyticsEntry[]>([])

    useEffect(() => {
        async function fetchData() {
            const { data: cardData } = await supabase
                .from('cards')
                .select('*')
                .eq('slug', slug)
                .single()

            if (cardData) {
                setCard(cardData)
                const { data: analyticsData } = await supabase
                    .from('analytics')
                    .select('*')
                    .eq('card_id', cardData.id)
                    .order('created_at', { ascending: false })

                setAnalytics(analyticsData || [])
            }
            setLoading(false)
        }
        fetchData()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!card) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Link Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Aggregations
    const totalViews = card.views || analytics.length

    // Generate chart data (last 14 days)
    const chartData = generateChartData(analytics, 14)

    // Device Breakdown
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 }
    analytics.forEach(a => {
        const ua = a.user_agent?.toLowerCase() || ''
        if (ua.includes('mobile')) deviceCounts.mobile++
        else if (ua.includes('tablet') || ua.includes('ipad')) deviceCounts.tablet++
        else deviceCounts.desktop++
    })

    // Top Referrers
    const referrerCounts: Record<string, number> = {}
    analytics.forEach(a => {
        let ref = a.referrer || 'Direct'
        if (ref.startsWith('http')) {
            try {
                ref = new URL(ref).hostname
            } catch { }
        }
        referrerCounts[ref] = (referrerCounts[ref] || 0) + 1
    })
    const topReferrers = Object.entries(referrerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    // Recent Activity
    const recentActivity = analytics.slice(0, 10)

    // Calculate trends
    const last7Days = analytics.filter(a => {
        const date = new Date(a.created_at)
        const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays < 7
    }).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Preview Link Analytics</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Share2 className="h-3 w-3" /> {card.title}
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href={`/p/${slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                            Visit Link
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Views"
                            value={totalViews}
                            icon={MousePointer2}
                            subtitle="All time views"
                            trend={last7Days > 0 ? { value: last7Days, label: 'this week', positive: true } : undefined}
                        />
                        <StatsCard
                            title="This Week"
                            value={last7Days}
                            icon={TrendingUp}
                            subtitle="Last 7 days"
                        />
                        <StatsCard
                            title="Avg Daily"
                            value={Math.round(last7Days / 7)}
                            icon={Activity}
                            subtitle="Views per day"
                        />
                        <StatsCard
                            title="Created"
                            value={new Date(card.created_at).toLocaleDateString()}
                            icon={Calendar}
                            subtitle="Link creation date"
                        />
                    </div>

                    {/* Line Chart */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        Views Over Time
                                    </CardTitle>
                                    <CardDescription>Last 14 days performance</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <AnalyticsLineChart
                                data={chartData}
                                height={300}
                                gradientColor="#8b5cf6"
                            />
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Device Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Device Breakdown
                                </CardTitle>
                                <CardDescription>Where your visitors come from</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DeviceBreakdownSimple
                                    mobile={deviceCounts.mobile}
                                    desktop={deviceCounts.desktop}
                                    tablet={deviceCounts.tablet}
                                />
                            </CardContent>
                        </Card>

                        {/* Top Referrers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    Top Referrers
                                </CardTitle>
                                <CardDescription>Traffic sources</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {topReferrers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No referrer data yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {topReferrers.map(([ref, count], i) => {
                                            const maxCount = topReferrers[0][1]
                                            const percentage = (count / totalViews) * 100
                                            return (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-medium truncate max-w-[60%]">{ref}</span>
                                                        <span className="text-muted-foreground">
                                                            {count} ({percentage.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary/60 rounded-full transition-all duration-500"
                                                            style={{ width: `${(count / maxCount) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MousePointer2 className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Latest visitors to your link</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No views yet. Share your link to start tracking!
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Referrer</th>
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Device</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {recentActivity.map((entry) => {
                                                const ua = entry.user_agent?.toLowerCase() || ''
                                                let device = 'Desktop'
                                                if (ua.includes('mobile')) device = 'Mobile'
                                                else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet'

                                                return (
                                                    <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="py-3 px-4">
                                                            {new Date(entry.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground truncate max-w-[200px]">
                                                            {entry.referrer !== 'unknown' ? entry.referrer : 'Direct'}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${device === 'Mobile' ? 'bg-blue-500/10 text-blue-500' :
                                                                    device === 'Tablet' ? 'bg-purple-500/10 text-purple-500' :
                                                                        'bg-green-500/10 text-green-500'
                                                                }`}>
                                                                {device}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

// Helper function to generate chart data
function generateChartData(analytics: AnalyticsEntry[], days: number) {
    const data: { date: string; views: number; label: string }[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const views = analytics.filter(a => {
            const aDate = new Date(a.created_at).toISOString().split('T')[0]
            return aDate === dateStr
        }).length

        data.push({
            date: dateStr,
            views,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
    }

    return data
}
