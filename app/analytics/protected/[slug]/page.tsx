import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Globe, Smartphone, MousePointer2, Lock, CheckCircle, XCircle } from 'lucide-react'

type Props = {
    params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

async function getProtectedLinkAnalytics(slug: string) {
    // 1. Get Protected Link
    const { data: link } = await supabase
        .from('password_protected_links')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!link) return null

    // 2. Get Analytics
    const { data: analytics } = await supabase
        .from('password_link_analytics')
        .select('*')
        .eq('link_id', link.id)

    return { link, analytics: analytics || [] }
}

export default async function ProtectedAnalyticsPage({ params }: Props) {
    const { slug } = await params
    const data = await getProtectedLinkAnalytics(slug)

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Link Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard?tab=protected">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const { link, analytics } = data

    // Aggregations
    const totalUnlocks = analytics.length

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

    // Recent Activity (last 10)
    const recentActivity = analytics
        .sort((a, b) => new Date(b.clicked_at).getTime() - new Date(a.clicked_at).getTime())
        .slice(0, 10)

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard?tab=protected">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Lock className="h-4 w-4" /> {link.title || 'Protected Link'}
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/s/${slug}`} target="_blank">
                            Visit Link
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Successful Unlocks</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{totalUnlocks}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total times the link was accessed with correct password
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Link Status</CardTitle>
                            {link.is_active ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{link.is_active ? 'Active' : 'Inactive'}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Created {new Date(link.created_at).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>

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

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MousePointer2 className="h-5 w-5" />
                            Recent Unlocks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-muted-foreground">
                                            {new Date(activity.clicked_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground truncate max-w-[40%]">
                                        {activity.referrer || 'Direct'}
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
