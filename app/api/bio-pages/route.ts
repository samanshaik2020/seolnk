import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Get bio pages for a user or a single bio page by username
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('user_id')
        const username = searchParams.get('username')
        const id = searchParams.get('id')

        if (username) {
            // Get single bio page by username (public)
            const { data, error } = await supabase
                .from('bio_pages')
                .select(`
                    *,
                    bio_links (*)
                `)
                .eq('username', username)
                .eq('is_active', true)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return NextResponse.json({ error: 'Bio page not found' }, { status: 404 })
                }
                console.error('Supabase error:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            // Sort bio_links by order_index
            if (data.bio_links) {
                data.bio_links = data.bio_links
                    .filter((link: { is_active: boolean }) => link.is_active)
                    .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
            }

            return NextResponse.json({ bioPage: data })
        }

        if (id) {
            // Get single bio page by ID (for editing)
            const { data, error } = await supabase
                .from('bio_pages')
                .select(`
                    *,
                    bio_links (*)
                `)
                .eq('id', id)
                .single()

            if (error) {
                console.error('Supabase error:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            // Sort bio_links by order_index
            if (data.bio_links) {
                data.bio_links = data.bio_links.sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
            }

            return NextResponse.json({ bioPage: data })
        }

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Get all bio pages for user
        const { data, error } = await supabase
            .from('bio_pages')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ bioPages: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new bio page
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            user_id,
            username,
            title,
            description,
            avatar_url,
            theme,
            theme_config,
            social_links,
            seo_title,
            seo_description,
            show_branding
        } = body

        if (!user_id || !username || !title) {
            return NextResponse.json({ error: 'User ID, username, and title are required' }, { status: 400 })
        }

        // Validate username format (alphanumeric, underscores, hyphens)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/
        if (!usernameRegex.test(username)) {
            return NextResponse.json({
                error: 'Username can only contain letters, numbers, underscores, and hyphens'
            }, { status: 400 })
        }

        if (username.length < 3 || username.length > 30) {
            return NextResponse.json({
                error: 'Username must be between 3 and 30 characters'
            }, { status: 400 })
        }

        // Check if username is taken
        const { data: existing } = await supabase
            .from('bio_pages')
            .select('id')
            .eq('username', username.toLowerCase())
            .single()

        if (existing) {
            return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
        }

        const { data, error } = await supabase
            .from('bio_pages')
            .insert({
                user_id,
                username: username.toLowerCase(),
                title,
                description: description || null,
                avatar_url: avatar_url || null,
                theme: theme || 'default',
                theme_config: theme_config || {},
                social_links: social_links || {},
                seo_title: seo_title || null,
                seo_description: seo_description || null,
                show_branding: show_branding !== false,
                is_active: true
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ bioPage: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT - Update a bio page
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            id,
            user_id,
            username,
            title,
            description,
            avatar_url,
            theme,
            theme_config,
            social_links,
            seo_title,
            seo_description,
            show_branding,
            is_active
        } = body

        if (!id || !user_id) {
            return NextResponse.json({ error: 'Bio page ID and user_id are required' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (username !== undefined) {
            // Validate and check username uniqueness if changing
            const usernameRegex = /^[a-zA-Z0-9_-]+$/
            if (!usernameRegex.test(username)) {
                return NextResponse.json({
                    error: 'Username can only contain letters, numbers, underscores, and hyphens'
                }, { status: 400 })
            }

            const { data: existing } = await supabase
                .from('bio_pages')
                .select('id')
                .eq('username', username.toLowerCase())
                .neq('id', id)
                .single()

            if (existing) {
                return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
            }

            updateData.username = username.toLowerCase()
        }

        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url
        if (theme !== undefined) updateData.theme = theme
        if (theme_config !== undefined) updateData.theme_config = theme_config
        if (social_links !== undefined) updateData.social_links = social_links
        if (seo_title !== undefined) updateData.seo_title = seo_title
        if (seo_description !== undefined) updateData.seo_description = seo_description
        if (show_branding !== undefined) updateData.show_branding = show_branding
        if (is_active !== undefined) updateData.is_active = is_active

        const { data, error } = await supabase
            .from('bio_pages')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ bioPage: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete a bio page
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const userId = searchParams.get('user_id')

        if (!id || !userId) {
            return NextResponse.json({ error: 'Bio page ID and user_id are required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('bio_pages')
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
