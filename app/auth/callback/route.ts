import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    if (code) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        try {
            await supabase.auth.exchangeCodeForSession(code)
        } catch (error) {
            console.error('Error exchanging code for session:', error)
            // Redirect to login with error on failure
            return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(next, request.url))
}
