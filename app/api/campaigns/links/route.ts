import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Assign links to a campaign
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { link_ids, link_type, campaign_id, user_id } = body

        if (!link_ids || !link_type || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Map link_type to table name
        const tableMap: Record<string, string> = {
            'cards': 'cards',
            'rotators': 'rotators',
            'expiring': 'expiring_links',
            'protected': 'password_protected_links',
            'aliases': 'custom_aliases',
        }

        const tableName = tableMap[link_type]
        if (!tableName) {
            return NextResponse.json({ error: 'Invalid link type' }, { status: 400 })
        }

        // Update links with campaign_id
        const { error } = await supabase
            .from(tableName)
            .update({ campaign_id: campaign_id || null })
            .in('id', link_ids)
            .eq('user_id', user_id)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// GET - Get links for a specific campaign
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const campaignId = searchParams.get('campaign_id')
        const userId = searchParams.get('user_id')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Build query condition
        const condition = campaignId === 'uncategorized'
            ? { campaign_id: null }
            : campaignId
                ? { campaign_id: campaignId }
                : {}

        // Fetch all link types
        const [cards, rotators, expiring, protected_links, aliases] = await Promise.all([
            supabase.from('cards').select('*').eq('user_id', userId).match(condition).order('created_at', { ascending: false }),
            supabase.from('rotators').select('*').eq('user_id', userId).match(condition).order('created_at', { ascending: false }),
            supabase.from('expiring_links').select('*').eq('user_id', userId).match(condition).order('created_at', { ascending: false }),
            supabase.from('password_protected_links').select('*').eq('user_id', userId).match(condition).order('created_at', { ascending: false }),
            supabase.from('custom_aliases').select('*').eq('user_id', userId).match(condition).order('created_at', { ascending: false }),
        ])

        return NextResponse.json({
            cards: cards.data || [],
            rotators: rotators.data || [],
            expiring_links: expiring.data || [],
            protected_links: protected_links.data || [],
            custom_aliases: aliases.data || [],
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
