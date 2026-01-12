import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple hash function for password
function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, original_url, password, user_id, campaign_id } = body

        if (!original_url || !password || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (password.length < 4) {
            return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 })
        }

        const slug = nanoid(8)
        const password_hash = hashPassword(password)

        const { data, error } = await supabase
            .from('password_protected_links')
            .insert({
                slug,
                title: title || null,
                original_url,
                password_hash,
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

        return NextResponse.json({ slug: data.slug, id: data.id })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, title, original_url, password, user_id, campaign_id } = body

        if (!id || !original_url || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const updateData: Record<string, string | null> = {
            title: title || null,
            original_url,
            campaign_id: campaign_id || null,
        }

        // Only update password if provided
        if (password && password.length >= 4) {
            updateData.password_hash = hashPassword(password)
        }

        const { data, error } = await supabase
            .from('password_protected_links')
            .update(updateData)
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
