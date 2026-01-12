import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Globe, Smartphone, MousePointer2, Zap, TrendingUp, Calendar } from 'lucide-react'

type Props = {
    params: Promise<{ alias: string }>
}

export const dynamic = 'force-dynamic'

async function getAliasAnalytics(alias: string) {
    // 1. Get Alias
    const { data: aliasData } = await supabase
        .from('custom_aliases')
        .select('*')
        .eq('alias', alias)
        .single()

    if (!aliasData) return null

    // 2. Get Analytics
    const { data: analytics } = await supabase
        .from('custom_alias_analytics')
        .select('*')
        .eq('alias_id', aliasData.id)

    return { alias: aliasData, analytics: analytics || [] }
}

export default async function AliasAnalyticsPage({ params }: Props) {
    const { alias } = await params
    const data = await getAliasAnalytics(alias)

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Alias Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard?tab=aliases">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const { alias: aliasData, analytics } = data

    // Aggregations
    const totalClicks = aliasData.click_count || analytics.length

    // Device Breakdown
    const deviceCounts: Record<string, number> = {}
    analytics.forEach(a => {
        const ua = a.user_agent?.toLowerCase() || ''
        let device = 'Desktop'
        if (ua.includes('mobile')) device = 'Mobile'
        else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet'

        deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })
    const topDevices = Object.entries(deviceCounts)
        .sort(([, a], [, b]) => b - a)

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

    // Recent clicks (last 10)
    const recentClicks = analytics
        .sort((a, b) => new Date(b.clicked_at).getTime() - new Date(a.clicked_at).getTime())
        .slice(0, 10)

    // Clicks by day (last 7 days)
    const last7Days: Record<string, number> = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const key = date.toLocaleDateString('en-US', { weekday: 'short' })
        last7Days[key] = 0
    }
    analytics.forEach(a => {
        const date = new Date(a.clicked_at)
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays < 7) {
            const key = date.toLocaleDateString('en-US', { weekday: 'short' })
            if (key in last7Days) {
                last7Days[key]++
            }
        }
    })

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard?tab=aliases">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Zap className="h-4 w-4" /> /{aliasData.alias}
                                {aliasData.title && <span className="text-sm">• {aliasData.title}</span>}
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/a/${alias}`} target="_blank">
                            Visit Link
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid sm:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                            <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{totalClicks}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                All time clicks
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {aliasData.is_active ? (
                                    <span className="text-green-600">Active</span>
                                ) : (
                                    <span className="text-destructive">Inactive</span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {aliasData.is_locked ? '🔒 Locked' : '🔓 Editable'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Created</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {new Date(aliasData.created_at).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {aliasData.expires_at ? `Expires: ${new Date(aliasData.expires_at).toLocaleDateString()}` : 'No expiration'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Click Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Last 7 Days
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {Object.entries(last7Days).map(([day, count], i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-primary/20 rounded-t transition-all"
                                        style={{
                                            height: `${Math.max(4, (count / Math.max(...Object.values(last7Days), 1)) * 100)}%`
                                        }}
                                    />
                                    <span className="text-xs text-muted-foreground">{day}</span>
                                    <span className="text-xs font-medium">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Device Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Device Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topDevices.map(([device, count], i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="text-sm">{device}</div>
                                        <div className="font-bold">{count}</div>
                                    </div>
                                ))}
                                {topDevices.length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Referrers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Top Referrers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topReferrers.map(([ref, count], i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="truncate max-w-[70%] text-sm" title={ref}>
                                            {ref}
                                        </div>
                                        <div className="font-bold">{count}</div>
                                    </div>
                                ))}
                                {topReferrers.length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Clicks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MousePointer2 className="h-5 w-5" />
                            Recent Clicks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentClicks.map((click, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                    <span className="text-muted-foreground">
                                        {new Date(click.clicked_at).toLocaleString()}
                                    </span>
                                    <div className="text-muted-foreground truncate max-w-[40%]">
                                        {click.referrer || 'Direct'}
                                    </div>
                                </div>
                            ))}
                            {recentClicks.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No clicks yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
