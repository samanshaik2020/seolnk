import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Color options for campaigns
const CAMPAIGN_COLORS = [
    '#6366f1', // Indigo (default)
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ef4444', // Red
    '#06b6d4', // Cyan
]

// GET - List all campaigns for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('user_id')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const { data: campaigns, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get link counts for each campaign
        const campaignsWithCounts = await Promise.all(
            campaigns.map(async (campaign) => {
                const [cards, rotators, expiring, protected_links, aliases] = await Promise.all([
                    supabase.from('cards').select('id', { count: 'exact' }).eq('campaign_id', campaign.id),
                    supabase.from('rotators').select('id', { count: 'exact' }).eq('campaign_id', campaign.id),
                    supabase.from('expiring_links').select('id', { count: 'exact' }).eq('campaign_id', campaign.id),
                    supabase.from('password_protected_links').select('id', { count: 'exact' }).eq('campaign_id', campaign.id),
                    supabase.from('custom_aliases').select('id', { count: 'exact' }).eq('campaign_id', campaign.id),
                ])

                return {
                    ...campaign,
                    link_count: (cards.count || 0) + (rotators.count || 0) + (expiring.count || 0) + (protected_links.count || 0) + (aliases.count || 0)
                }
            })
        )

        return NextResponse.json({ campaigns: campaignsWithCounts, colors: CAMPAIGN_COLORS })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new campaign
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description, color, user_id } = body

        if (!name || !user_id) {
            return NextResponse.json({ error: 'Name and user_id are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('campaigns')
            .insert({
                name,
                description: description || null,
                color: color || '#6366f1',
                user_id,
                is_active: true
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ campaign: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT - Update a campaign
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, description, color, user_id } = body

        if (!id || !user_id) {
            return NextResponse.json({ error: 'Campaign ID and user_id are required' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (name) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (color) updateData.color = color

        const { data, error } = await supabase
            .from('campaigns')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ campaign: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete a campaign
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const userId = searchParams.get('user_id')

        if (!id || !userId) {
            return NextResponse.json({ error: 'Campaign ID and user_id are required' }, { status: 400 })
        }

        // Remove campaign_id from all links first (set to null)
        await Promise.all([
            supabase.from('cards').update({ campaign_id: null }).eq('campaign_id', id),
            supabase.from('rotators').update({ campaign_id: null }).eq('campaign_id', id),
            supabase.from('expiring_links').update({ campaign_id: null }).eq('campaign_id', id),
            supabase.from('password_protected_links').update({ campaign_id: null }).eq('campaign_id', id),
            supabase.from('custom_aliases').update({ campaign_id: null }).eq('campaign_id', id),
        ])

        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

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
