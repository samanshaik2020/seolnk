import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { slug, password } = body

        if (!slug || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Fetch the link
        const { data: link, error } = await supabase
            .from('password_protected_links')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 })
        }

        if (!link.is_active) {
            return NextResponse.json({ error: 'Link is inactive' }, { status: 403 })
        }

        // Verify password
        const inputHash = hashPassword(password)
        if (inputHash !== link.password_hash) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
        }

        // Log analytics with referrer and user agent
        try {
            const referrer = request.headers.get('referer') || null
            const userAgent = request.headers.get('user-agent') || null

            await supabase.from('password_link_analytics').insert({
                link_id: link.id,
                referrer,
                user_agent: userAgent,
            })
        } catch (e) {
            console.error('Analytics error:', e)
        }

        // Return the destination URL
        return NextResponse.json({ url: link.original_url })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
