import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, original_url, expires_at, user_id, campaign_id } = body

        if (!original_url || !expires_at || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const slug = nanoid(8)

        const { data, error } = await supabase
            .from('expiring_links')
            .insert({
                slug,
                title: title || null,
                original_url,
                expires_at,
                user_id,
                is_active: true,
                campaign_id: campaign_id || null
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ slug: data.slug })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, title, original_url, expires_at, user_id, campaign_id } = body

        if (!id || !original_url || !expires_at || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('expiring_links')
            .update({
                title: title || null,
                original_url,
                expires_at,
                campaign_id: campaign_id || null,
            })
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ slug: data.slug })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
