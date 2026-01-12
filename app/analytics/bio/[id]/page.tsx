'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Loader2, ArrowLeft, Eye, MousePointerClick, TrendingUp,
    Smartphone, Monitor, Tablet, Link as LinkIcon, ExternalLink
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
                    <Link href="/bio-links">Back to Bio Links</Link>
                </Button>
            </div>
        )
    }

    const totalDeviceViews = analytics.deviceBreakdown.mobile + analytics.deviceBreakdown.desktop + analytics.deviceBreakdown.tablet

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/bio-links">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <span className="font-semibold">Bio Page Analytics</span>
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
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Total Views
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{analytics.summary.totalViews.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">
                                    +{analytics.summary.viewsInPeriod} in last {days} days
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <MousePointerClick className="h-4 w-4" />
                                    Total Clicks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{analytics.summary.totalClicks.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">
                                    +{analytics.summary.clicksInPeriod} in last {days} days
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Click Rate
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{analytics.summary.clickRate}%</p>
                                <p className="text-sm text-muted-foreground">
                                    Clicks per view
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" />
                                    Top Link
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analytics.topLink ? (
                                    <>
                                        <p className="text-lg font-bold truncate">{analytics.topLink.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {analytics.topLink.clicks} clicks
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">No clicks yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Device Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Breakdown</CardTitle>
                                <CardDescription>Where your visitors come from</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {totalDeviceViews === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No data yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="h-4 w-4 text-blue-500" />
                                                    <span>Mobile</span>
                                                </div>
                                                <span className="font-medium">
                                                    {((analytics.deviceBreakdown.mobile / totalDeviceViews) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(analytics.deviceBreakdown.mobile / totalDeviceViews) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="h-4 w-4 text-green-500" />
                                                    <span>Desktop</span>
                                                </div>
                                                <span className="font-medium">
                                                    {((analytics.deviceBreakdown.desktop / totalDeviceViews) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${(analytics.deviceBreakdown.desktop / totalDeviceViews) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Tablet className="h-4 w-4 text-purple-500" />
                                                    <span>Tablet</span>
                                                </div>
                                                <span className="font-medium">
                                                    {((analytics.deviceBreakdown.tablet / totalDeviceViews) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full"
                                                    style={{ width: `${(analytics.deviceBreakdown.tablet / totalDeviceViews) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Link Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Link Performance</CardTitle>
                                <CardDescription>Clicks per link</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analytics.links.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No links yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {analytics.links.map((link, index) => {
                                            const maxClicks = analytics.links[0]?.clicks || 1
                                            const percentage = (link.clicks / maxClicks) * 100
                                            return (
                                                <div key={link.id} className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="truncate flex-1 mr-4">
                                                            {index + 1}. {link.title}
                                                        </span>
                                                        <span className="font-medium shrink-0">{link.clicks} clicks</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full transition-all"
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

                    {/* Daily Views Chart (Simple) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Views</CardTitle>
                            <CardDescription>Page views over the last {days} days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(analytics.dailyViews).length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No views yet</p>
                            ) : (
                                <div className="h-48 flex items-end gap-1">
                                    {(() => {
                                        const entries = Object.entries(analytics.dailyViews).sort()
                                        const maxViews = Math.max(...entries.map(([, v]) => v), 1)
                                        return entries.map(([date, views]) => (
                                            <div
                                                key={date}
                                                className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group min-w-[8px]"
                                                style={{ height: `${(views / maxViews) * 100}%`, minHeight: views > 0 ? '4px' : '0' }}
                                            >
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {new Date(date).toLocaleDateString()}: {views} views
                                                </div>
                                            </div>
                                        ))
                                    })()}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Back Button */}
                    <div className="text-center">
                        <Button variant="ghost" asChild>
                            <Link href="/bio-links">← Back to Bio Links</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
