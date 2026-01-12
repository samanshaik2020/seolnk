import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { validateAlias, normalizeAlias, generateSuggestions } from '@/lib/alias-validation'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, original_url, alias, user_id, campaign_id } = body

        if (!original_url || !alias || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Normalize and validate alias
        const normalizedAlias = normalizeAlias(alias)
        const validation = validateAlias(normalizedAlias)

        if (!validation.valid) {
            return NextResponse.json({
                error: validation.error,
                suggestions: validation.suggestions
            }, { status: 400 })
        }

        // Check if alias already exists
        const { data: existing } = await supabase
            .from('custom_aliases')
            .select('id')
            .eq('alias', normalizedAlias)
            .single()

        if (existing) {
            const suggestions = generateSuggestions(normalizedAlias)

            // Check which suggestions are available
            const { data: takenAliases } = await supabase
                .from('custom_aliases')
                .select('alias')
                .in('alias', suggestions)

            const takenSet = new Set(takenAliases?.map(a => a.alias) || [])
            const availableSuggestions = suggestions.filter(s => !takenSet.has(s))

            return NextResponse.json({
                error: 'This alias is already taken',
                suggestions: availableSuggestions.slice(0, 4)
            }, { status: 409 })
        }

        // Create the alias
        const { data, error } = await supabase
            .from('custom_aliases')
            .insert({
                alias: normalizedAlias,
                title: title || null,
                original_url,
                user_id,
                is_active: true,
                is_locked: false,
                campaign_id: campaign_id || null
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ alias: data.alias })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, title, original_url, alias, user_id, campaign_id } = body

        if (!id || !original_url || !user_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if the alias is locked
        const { data: currentAlias } = await supabase
            .from('custom_aliases')
            .select('*')
            .eq('id', id)
            .eq('user_id', user_id)
            .single()

        if (!currentAlias) {
            return NextResponse.json({ error: 'Alias not found' }, { status: 404 })
        }

        if (currentAlias.is_locked && alias !== currentAlias.alias) {
            return NextResponse.json({ error: 'This alias is locked and cannot be changed' }, { status: 403 })
        }

        const updateData: Record<string, unknown> = {
            title: title || null,
            original_url,
            updated_at: new Date().toISOString(),
            campaign_id: campaign_id || null
        }

        // If alias is being changed
        if (alias && alias !== currentAlias.alias) {
            const normalizedAlias = normalizeAlias(alias)
            const validation = validateAlias(normalizedAlias)

            if (!validation.valid) {
                return NextResponse.json({
                    error: validation.error,
                    suggestions: validation.suggestions
                }, { status: 400 })
            }

            // Check if new alias already exists
            const { data: existing } = await supabase
                .from('custom_aliases')
                .select('id')
                .eq('alias', normalizedAlias)
                .neq('id', id)
                .single()

            if (existing) {
                return NextResponse.json({ error: 'This alias is already taken' }, { status: 409 })
            }

            updateData.alias = normalizedAlias
        }

        const { data, error } = await supabase
            .from('custom_aliases')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ alias: data.alias })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Check alias availability
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const alias = searchParams.get('alias')

        if (!alias) {
            return NextResponse.json({ error: 'Alias is required' }, { status: 400 })
        }

        const normalizedAlias = normalizeAlias(alias)
        const validation = validateAlias(normalizedAlias)

        if (!validation.valid) {
            return NextResponse.json({
                available: false,
                error: validation.error,
                suggestions: validation.suggestions
            })
        }

        const { data: existing } = await supabase
            .from('custom_aliases')
            .select('id')
            .eq('alias', normalizedAlias)
            .single()

        if (existing) {
            const suggestions = generateSuggestions(normalizedAlias)
            return NextResponse.json({
                available: false,
                error: 'This alias is already taken',
                suggestions: suggestions.slice(0, 4)
            })
        }

        return NextResponse.json({ available: true, alias: normalizedAlias })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
