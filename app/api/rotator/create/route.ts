import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, urls, user_id, campaign_id } = body

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'At least one URL is required' },
                { status: 400 }
            )
        }

        const slug = nanoid(6)

        // 1. Create the rotator entry
        const { data: rotator, error: rotatorError } = await supabase
            .from('rotators')
            .insert({
                slug,
                title: title || 'Untitled Rotator',
                user_id: user_id || null,
                campaign_id: campaign_id || null,
            })
            .select()
            .single()

        if (rotatorError) {
            console.error('Error creating rotator:', rotatorError)
            return NextResponse.json(
                { error: 'Failed to create rotator' },
                { status: 500 }
            )
        }

        // 2. Create the URL entries
        const urlEntries = urls.map((url: string) => ({
            rotator_id: rotator.id,
            url,
        }))

        const { error: urlsError } = await supabase
            .from('rotator_urls')
            .insert(urlEntries)

        if (urlsError) {
            console.error('Error adding URLs:', urlsError)
            // Ideally we should rollback here, but for simplicity we'll just error out
            // In a real app, we might want to delete the rotator we just created
            await supabase.from('rotators').delete().eq('id', rotator.id)

            return NextResponse.json(
                { error: 'Failed to add URLs' },
                { status: 500 }
            )
        }

        return NextResponse.json({ slug, rotator })
    } catch (error) {
        console.error('Error in rotator creation:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, title, urls, user_id, campaign_id } = body

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'At least one URL is required' },
                { status: 400 }
            )
        }

        // 1. Update the rotator entry
        const { data: rotator, error: rotatorError } = await supabase
            .from('rotators')
            .update({
                title: title || 'Untitled Rotator',
                campaign_id: campaign_id || null,
            })
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (rotatorError) {
            console.error('Error updating rotator:', rotatorError)
            return NextResponse.json(
                { error: 'Failed to update rotator' },
                { status: 500 }
            )
        }

        // 2. Delete existing URLs
        const { error: deleteError } = await supabase
            .from('rotator_urls')
            .delete()
            .eq('rotator_id', id)

        if (deleteError) {
            console.error('Error deleting old URLs:', deleteError)
            return NextResponse.json(
                { error: 'Failed to update URLs' },
                { status: 500 }
            )
        }

        // 3. Create new URL entries
        const urlEntries = urls.map((url: string) => ({
            rotator_id: id,
            url,
        }))

        const { error: urlsError } = await supabase
            .from('rotator_urls')
            .insert(urlEntries)

        if (urlsError) {
            console.error('Error adding URLs:', urlsError)
            return NextResponse.json(
                { error: 'Failed to add URLs' },
                { status: 500 }
            )
        }

        return NextResponse.json({ slug: rotator.slug, rotator })
    } catch (error) {
        console.error('Error in rotator update:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
