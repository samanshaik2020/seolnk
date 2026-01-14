import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { checkUrlSafety, getThreatDescription } from '@/lib/safe-browsing'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - List quick links
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('user_id')
        const campaignId = searchParams.get('campaign_id')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        let query = supabase
            .from('quick_links')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (campaignId) {
            if (campaignId === 'uncategorized') {
                query = query.is('campaign_id', null)
            } else {
                query = query.eq('campaign_id', campaignId)
            }
        }

        const { data, error } = await query

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ links: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a quick link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, original_url, campaign_id, notes, create_short_link, user_id } = body

        if (!title || !original_url || !user_id) {
            return NextResponse.json({ error: 'Title, URL and user_id are required' }, { status: 400 })
        }

        // Validate URL
        try {
            new URL(original_url)
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
        }

        // Check URL safety before proceeding
        const safetyCheck = await checkUrlSafety(original_url)
        if (!safetyCheck.safe) {
            const threatType = safetyCheck.threats[0]?.threatType || 'UNKNOWN'
            return NextResponse.json({
                error: 'Unsafe URL detected',
                message: getThreatDescription(threatType),
                threatType
            }, { status: 400 })
        }

        const linkData: Record<string, unknown> = {
            title,
            original_url,
            campaign_id: campaign_id || null,
            notes: notes || null,
            user_id,
            is_active: true
        }

        // Generate short link if requested
        if (create_short_link) {
            linkData.slug = nanoid(6)
        }

        const { data, error } = await supabase
            .from('quick_links')
            .insert(linkData)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ link: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT - Update a quick link
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, title, original_url, campaign_id, notes, user_id } = body

        if (!id || !user_id) {
            return NextResponse.json({ error: 'Link ID and user_id are required' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (title) updateData.title = title
        if (original_url) updateData.original_url = original_url
        if (campaign_id !== undefined) updateData.campaign_id = campaign_id || null
        if (notes !== undefined) updateData.notes = notes

        const { data, error } = await supabase
            .from('quick_links')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ link: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete a quick link
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const userId = searchParams.get('user_id')

        if (!id || !userId) {
            return NextResponse.json({ error: 'Link ID and user_id are required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('quick_links')
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
