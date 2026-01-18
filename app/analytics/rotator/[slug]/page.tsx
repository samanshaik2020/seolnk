'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    ArrowLeft, Globe, MousePointer2, Repeat, TrendingUp,
    BarChart3, ExternalLink, Loader2, Activity, MapPin
} from 'lucide-react'
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart'
import { StatsCard } from '@/components/analytics/StatsCard'
import { DeviceBreakdownSimple } from '@/components/analytics/DeviceBreakdown'

interface ClickEntry {
    id: string
    clicked_at: string
    url_id: string
    referrer: string
    device_type: string
    country: string
}

interface RotatorUrl {
    id: string
    url: string
}

interface RotatorData {
    id: string
    slug: string
    title: string
    created_at: string
}

export default function RotatorAnalyticsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [loading, setLoading] = useState(true)
    const [rotator, setRotator] = useState<RotatorData | null>(null)
    const [urls, setUrls] = useState<RotatorUrl[]>([])
    const [clicks, setClicks] = useState<ClickEntry[]>([])

    useEffect(() => {
        async function fetchData() {
            const { data: rotatorData } = await supabase
                .from('rotators')
                .select('*')
                .eq('slug', slug)
                .single()

            if (rotatorData) {
                setRotator(rotatorData)

                const { data: urlsData } = await supabase
                    .from('rotator_urls')
                    .select('id, url')
                    .eq('rotator_id', rotatorData.id)

                setUrls(urlsData || [])

                const { data: clicksData } = await supabase
                    .from('rotator_clicks')
                    .select('*')
                    .eq('rotator_id', rotatorData.id)
                    .order('clicked_at', { ascending: false })

                setClicks(clicksData || [])
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

    if (!rotator) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Rotator Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard?tab=rotators">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Aggregations
    const totalClicks = clicks.length

    // Generate chart data (last 14 days)
    const chartData = generateChartData(clicks, 14)

    // Clicks per URL
    const clicksPerUrl = urls.map(url => ({
        url: url.url,
        count: clicks.filter(c => c.url_id === url.id).length
    })).sort((a, b) => b.count - a.count)

    // Device Breakdown
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 }
    clicks.forEach(c => {
        const device = c.device_type?.toLowerCase() || ''
        if (device === 'mobile') deviceCounts.mobile++
        else if (device === 'tablet') deviceCounts.tablet++
        else deviceCounts.desktop++
    })

    // Top Countries
    const countryCounts: Record<string, number> = {}
    clicks.forEach(c => {
        const country = c.country || 'Unknown'
        countryCounts[country] = (countryCounts[country] || 0) + 1
    })
    const topCountries = Object.entries(countryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    // Top Referrers
    const referrerCounts: Record<string, number> = {}
    clicks.forEach(c => {
        const ref = c.referrer || 'Direct'
        referrerCounts[ref] = (referrerCounts[ref] || 0) + 1
    })
    const topReferrers = Object.entries(referrerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    // Calculate trends
    const last7Days = clicks.filter(c => {
        const date = new Date(c.clicked_at)
        const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays < 7
    }).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-500/5">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard?tab=rotators">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Rotator Analytics</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Repeat className="h-3 w-3" /> {rotator.title || 'Untitled Rotator'}
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href={`/r/${slug}`} target="_blank">
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
                            title="Total Clicks"
                            value={totalClicks}
                            icon={MousePointer2}
                            subtitle="All destinations combined"
                            trend={last7Days > 0 ? { value: last7Days, label: 'this week', positive: true } : undefined}
                        />
                        <StatsCard
                            title="This Week"
                            value={last7Days}
                            icon={TrendingUp}
                            subtitle="Last 7 days"
                        />
                        <StatsCard
                            title="Destinations"
                            value={urls.length}
                            icon={Repeat}
                            subtitle="URLs in rotation"
                        />
                        <StatsCard
                            title="Top Country"
                            value={topCountries[0]?.[0] || 'N/A'}
                            icon={MapPin}
                            subtitle={topCountries[0] ? `${topCountries[0][1]} clicks` : 'No data yet'}
                        />
                    </div>

                    {/* Line Chart */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-cyan-500" />
                                        Clicks Over Time
                                    </CardTitle>
                                    <CardDescription>Last 14 days performance</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <AnalyticsLineChart
                                data={chartData}
                                height={300}
                                gradientColor="#06b6d4"
                            />
                        </CardContent>
                    </Card>

                    {/* Clicks per URL */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-cyan-500" />
                                Clicks per Destination
                            </CardTitle>
                            <CardDescription>Performance of each URL in rotation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {clicksPerUrl.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No URLs configured yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {clicksPerUrl.map((item, i) => {
                                        const maxCount = clicksPerUrl[0]?.count || 1
                                        const percentage = (item.count / Math.max(totalClicks, 1)) * 100
                                        return (
                                            <div key={i} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium truncate max-w-[60%]" title={item.url}>
                                                        {item.url}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {item.count} ({percentage.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Device Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-cyan-500" />
                                    Device Breakdown
                                </CardTitle>
                                <CardDescription>Visitor device types</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DeviceBreakdownSimple
                                    mobile={deviceCounts.mobile}
                                    desktop={deviceCounts.desktop}
                                    tablet={deviceCounts.tablet}
                                />
                            </CardContent>
                        </Card>

                        {/* Top Countries */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-cyan-500" />
                                    Top Countries
                                </CardTitle>
                                <CardDescription>Geographic distribution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {topCountries.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No country data yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {topCountries.map(([country, count], i) => {
                                            const maxCount = topCountries[0][1]
                                            const percentage = (count / Math.max(totalClicks, 1)) * 100
                                            return (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-medium">{country}</span>
                                                        <span className="text-muted-foreground">
                                                            {count} ({percentage.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-cyan-500/60 rounded-full transition-all duration-500"
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

                    {/* Top Referrers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MousePointer2 className="h-5 w-5 text-cyan-500" />
                                Top Referrers
                            </CardTitle>
                            <CardDescription>Traffic sources</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topReferrers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No referrer data yet</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {topReferrers.map(([ref, count], i) => (
                                        <div key={i} className="p-4 rounded-xl bg-muted/50 text-center">
                                            <p className="text-2xl font-bold">{count}</p>
                                            <p className="text-sm text-muted-foreground truncate" title={ref}>{ref}</p>
                                        </div>
                                    ))}
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
function generateChartData(clicks: ClickEntry[], days: number) {
    const data: { date: string; views: number; label: string }[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const views = clicks.filter(c => {
            const cDate = new Date(c.clicked_at).toISOString().split('T')[0]
            return cDate === dateStr
        }).length

        data.push({
            date: dateStr,
            views,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
    }

    return data
}
