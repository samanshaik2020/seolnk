import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Get bio links for a bio page
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const bioPageId = searchParams.get('bio_page_id')

        if (!bioPageId) {
            return NextResponse.json({ error: 'Bio page ID required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('bio_links')
            .select('*')
            .eq('bio_page_id', bioPageId)
            .order('order_index', { ascending: true })

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

// POST - Create a new bio link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            bio_page_id,
            title,
            url,
            icon,
            icon_type,
            thumbnail_url,
            animation,
            button_style,
            is_active,
            order_index
        } = body

        if (!bio_page_id || !title || !url) {
            return NextResponse.json({ error: 'Bio page ID, title, and URL are required' }, { status: 400 })
        }

        // Validate URL
        try {
            new URL(url)
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
        }

        // Get the max order_index if not provided
        let finalOrderIndex = order_index
        if (finalOrderIndex === undefined) {
            const { data: maxOrder } = await supabase
                .from('bio_links')
                .select('order_index')
                .eq('bio_page_id', bio_page_id)
                .order('order_index', { ascending: false })
                .limit(1)
                .single()

            finalOrderIndex = maxOrder ? maxOrder.order_index + 1 : 0
        }

        const { data, error } = await supabase
            .from('bio_links')
            .insert({
                bio_page_id,
                title,
                url,
                icon: icon || null,
                icon_type: icon_type || 'emoji',
                thumbnail_url: thumbnail_url || null,
                animation: animation || 'none',
                button_style: button_style || 'default',
                is_active: is_active !== false,
                order_index: finalOrderIndex
            })
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

// PUT - Update a bio link or reorder links
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()

        // Handle bulk reorder
        if (body.reorder && Array.isArray(body.links)) {
            const updates = body.links.map((link: { id: string; order_index: number }) =>
                supabase
                    .from('bio_links')
                    .update({ order_index: link.order_index, updated_at: new Date().toISOString() })
                    .eq('id', link.id)
            )

            await Promise.all(updates)
            return NextResponse.json({ success: true })
        }

        // Single link update
        const {
            id,
            title,
            url,
            icon,
            icon_type,
            thumbnail_url,
            animation,
            button_style,
            is_active,
            order_index
        } = body

        if (!id) {
            return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (title !== undefined) updateData.title = title
        if (url !== undefined) {
            try {
                new URL(url)
                updateData.url = url
            } catch {
                return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
            }
        }
        if (icon !== undefined) updateData.icon = icon
        if (icon_type !== undefined) updateData.icon_type = icon_type
        if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url
        if (animation !== undefined) updateData.animation = animation
        if (button_style !== undefined) updateData.button_style = button_style
        if (is_active !== undefined) updateData.is_active = is_active
        if (order_index !== undefined) updateData.order_index = order_index

        const { data, error } = await supabase
            .from('bio_links')
            .update(updateData)
            .eq('id', id)
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

// DELETE - Delete a bio link
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('bio_links')
            .delete()
            .eq('id', id)

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
