import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { nanoid } from 'nanoid'
import probe from 'probe-image-size'

export async function POST(request: Request) {
    try {
        const { title, description, imageUrl, originalUrl, user_id, campaign_id } = await request.json()

        // Validate image and get dimensions
        let dimensions
        try {
            dimensions = await probe(imageUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            })
        } catch (error) {
            console.error('Image probe error:', error)
            return NextResponse.json({ error: 'Invalid image URL or image not accessible' }, { status: 400 })
        }

        const slug = nanoid(8) // Generate a short 8-char slug

        const { data, error } = await supabaseAdmin
            .from('cards')
            .insert([
                {
                    title,
                    description,
                    image_url: imageUrl,
                    slug,
                    image_width: dimensions.width,
                    image_height: dimensions.height,
                    original_url: originalUrl,
                    user_id: user_id || null,
                    campaign_id: campaign_id || null,
                },
            ])
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ slug: data.slug })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const { id, title, description, imageUrl, originalUrl, user_id, campaign_id } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        // Validate image and get dimensions
        let dimensions
        try {
            dimensions = await probe(imageUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            })
        } catch (error) {
            console.error('Image probe error:', error)
            return NextResponse.json({ error: 'Invalid image URL or image not accessible' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('cards')
            .update({
                title,
                description,
                image_url: imageUrl,
                image_width: dimensions.width,
                image_height: dimensions.height,
                original_url: originalUrl,
                campaign_id: campaign_id || null,
            })
            .eq('id', id)
            .eq('user_id', user_id) // Ensure ownership
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ slug: data.slug })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
