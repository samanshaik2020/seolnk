import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Track bio page view or link click
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { type, bio_page_id, link_id, referrer, user_agent } = body

        // Parse user agent for device info
        const deviceType = user_agent?.includes('Mobile') ? 'mobile' :
            user_agent?.includes('Tablet') ? 'tablet' : 'desktop'

        if (type === 'page_view' && bio_page_id) {
            // Track page view
            await supabase
                .from('bio_page_views')
                .insert({
                    bio_page_id,
                    referrer: referrer || null,
                    user_agent: user_agent || null,
                    device_type: deviceType
                })

            // Increment view count
            await supabase.rpc('increment_bio_page_views', { page_id: bio_page_id })

            return NextResponse.json({ success: true })
        }

        if (type === 'link_click' && link_id && bio_page_id) {
            // Track link click
            await supabase
                .from('bio_link_analytics')
                .insert({
                    link_id,
                    bio_page_id,
                    referrer: referrer || null,
                    user_agent: user_agent || null,
                    device_type: deviceType
                })

            // Increment click count
            await supabase.rpc('increment_bio_link_clicks', { link_id_param: link_id })

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// GET - Get analytics for a bio page
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const bioPageId = searchParams.get('bio_page_id')
        const userId = searchParams.get('user_id')
        const days = parseInt(searchParams.get('days') || '30')

        if (!bioPageId || !userId) {
            return NextResponse.json({ error: 'Bio page ID and user_id required' }, { status: 400 })
        }

        // Verify ownership
        const { data: bioPage, error: ownerError } = await supabase
            .from('bio_pages')
            .select('id, views')
            .eq('id', bioPageId)
            .eq('user_id', userId)
            .single()

        if (ownerError || !bioPage) {
            return NextResponse.json({ error: 'Bio page not found or access denied' }, { status: 403 })
        }

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Get page views
        const { data: pageViews } = await supabase
            .from('bio_page_views')
            .select('*')
            .eq('bio_page_id', bioPageId)
            .gte('viewed_at', startDate.toISOString())
            .order('viewed_at', { ascending: false })

        // Get link clicks
        const { data: linkClicks } = await supabase
            .from('bio_link_analytics')
            .select('*')
            .eq('bio_page_id', bioPageId)
            .gte('clicked_at', startDate.toISOString())
            .order('clicked_at', { ascending: false })

        // Get links with their click counts
        const { data: links } = await supabase
            .from('bio_links')
            .select('id, title, clicks')
            .eq('bio_page_id', bioPageId)
            .order('clicks', { ascending: false })

        // Calculate summary stats
        const totalViews = bioPage.views || 0
        const totalClicks = links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0
        const viewsInPeriod = pageViews?.length || 0
        const clicksInPeriod = linkClicks?.length || 0
        const topLink = links?.[0] || null

        // Device breakdown
        const deviceBreakdown = {
            mobile: pageViews?.filter(v => v.device_type === 'mobile').length || 0,
            desktop: pageViews?.filter(v => v.device_type === 'desktop').length || 0,
            tablet: pageViews?.filter(v => v.device_type === 'tablet').length || 0
        }

        // Daily views for chart
        const dailyViews: Record<string, number> = {}
        pageViews?.forEach(view => {
            const date = new Date(view.viewed_at).toISOString().split('T')[0]
            dailyViews[date] = (dailyViews[date] || 0) + 1
        })

        return NextResponse.json({
            summary: {
                totalViews,
                totalClicks,
                viewsInPeriod,
                clicksInPeriod,
                clickRate: viewsInPeriod > 0 ? ((clicksInPeriod / viewsInPeriod) * 100).toFixed(1) : '0'
            },
            topLink,
            deviceBreakdown,
            dailyViews,
            links: links || [],
            recentViews: pageViews?.slice(0, 50) || [],
            recentClicks: linkClicks?.slice(0, 50) || []
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
