import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import probe from 'probe-image-size'

export async function POST(request: Request) {
    try {
        const { title, description, imageUrl, originalUrl } = await request.json()

        // Validate image and get dimensions
        let dimensions
        try {
            dimensions = await probe(imageUrl)
        } catch {
            return NextResponse.json({ error: 'Invalid image URL or image not accessible' }, { status: 400 })
        }

        const slug = nanoid(8) // Generate a short 8-char slug

        const { data, error } = await supabase
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
