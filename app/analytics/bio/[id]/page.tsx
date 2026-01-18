'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Loader2, ArrowLeft, Eye, MousePointerClick, TrendingUp,
    Link as LinkIcon, ExternalLink, Calendar, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart'
import { StatsCard } from '@/components/analytics/StatsCard'
import { DeviceBreakdownSimple } from '@/components/analytics/DeviceBreakdown'

interface AnalyticsData {
    summary: {
        totalViews: number
        totalClicks: number
        viewsInPeriod: number
        clicksInPeriod: number
        clickRate: string
    }
    topLink: { id: string; title: string; clicks: number } | null
    deviceBreakdown: {
        mobile: number
        desktop: number
        tablet: number
    }
    dailyViews: Record<string, number>
    links: Array<{ id: string; title: string; clicks: number }>
}

export default function BioAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [days, setDays] = useState('30')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                const res = await fetch(`/api/bio-analytics?bio_page_id=${id}&user_id=${user.id}&days=${days}`)
                if (!res.ok) {
                    throw new Error('Failed to load analytics')
                }
                const data = await res.json()
                setAnalytics(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load analytics')
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [id, days, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !analytics) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-destructive mb-4">{error || 'Failed to load analytics'}</p>
                <Button asChild>
                    <Link href="/bio-links">Back to Linktree</Link>
                </Button>
            </div>
        )
    }

    // Generate chart data from dailyViews
    const chartData = Object.entries(analytics.dailyViews)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, views]) => ({
            date,
            views,
            label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-pink-500/5">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/bio-links">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Bio Page Analytics</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Linktree Performance
                            </p>
                        </div>
                    </div>
                    <Select value={days} onValueChange={setDays}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Views"
                            value={analytics.summary.totalViews}
                            icon={Eye}
                            subtitle="All time page views"
                            trend={{ value: analytics.summary.viewsInPeriod, label: `in last ${days} days`, positive: analytics.summary.viewsInPeriod > 0 }}
                        />
                        <StatsCard
                            title="Total Clicks"
                            value={analytics.summary.totalClicks}
                            icon={MousePointerClick}
                            subtitle="Link clicks"
                            trend={{ value: analytics.summary.clicksInPeriod, label: `in last ${days} days`, positive: analytics.summary.clicksInPeriod > 0 }}
                        />
                        <StatsCard
                            title="Click Rate"
                            value={`${analytics.summary.clickRate}%`}
                            icon={TrendingUp}
                            subtitle="Clicks per view"
                        />
                        <StatsCard
                            title="Top Link"
                            value={analytics.topLink?.title || 'N/A'}
                            icon={LinkIcon}
                            subtitle={analytics.topLink ? `${analytics.topLink.clicks} clicks` : 'No clicks yet'}
                        />
                    </div>

                    {/* Line Chart */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-pink-500" />
                                        Views Over Time
                                    </CardTitle>
                                    <CardDescription>Page views in the last {days} days</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <AnalyticsLineChart
                                data={chartData}
                                height={300}
                                gradientColor="#ec4899"
                            />
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Device Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-pink-500" />
                                    Device Breakdown
                                </CardTitle>
                                <CardDescription>Where your visitors come from</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DeviceBreakdownSimple
                                    mobile={analytics.deviceBreakdown.mobile}
                                    desktop={analytics.deviceBreakdown.desktop}
                                    tablet={analytics.deviceBreakdown.tablet}
                                />
                            </CardContent>
                        </Card>

                        {/* Link Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5 text-pink-500" />
                                    Link Performance
                                </CardTitle>
                                <CardDescription>Clicks per link</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analytics.links.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No links yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {analytics.links.slice(0, 5).map((link, index) => {
                                            const maxClicks = analytics.links[0]?.clicks || 1
                                            const percentage = maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0
                                            return (
                                                <div key={link.id} className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="truncate flex-1 mr-4 font-medium">
                                                            {index + 1}. {link.title}
                                                        </span>
                                                        <span className="text-muted-foreground shrink-0">{link.clicks} clicks</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
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

                    {/* All Links Table */}
                    {analytics.links.length > 5 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5 text-pink-500" />
                                    All Links
                                </CardTitle>
                                <CardDescription>Complete link performance breakdown</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Link Title</th>
                                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">% of Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {analytics.links.map((link, index) => {
                                                const percentage = analytics.summary.totalClicks > 0
                                                    ? ((link.clicks / analytics.summary.totalClicks) * 100).toFixed(1)
                                                    : '0.0'
                                                return (
                                                    <tr key={link.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="py-3 px-4 text-muted-foreground">{index + 1}</td>
                                                        <td className="py-3 px-4 font-medium">{link.title}</td>
                                                        <td className="py-3 px-4 text-right">{link.clicks}</td>
                                                        <td className="py-3 px-4 text-right text-muted-foreground">{percentage}%</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Back Button */}
                    <div className="text-center">
                        <Button variant="ghost" asChild>
                            <Link href="/bio-links">← Back to Linktree</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
