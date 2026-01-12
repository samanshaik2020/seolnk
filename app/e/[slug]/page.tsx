import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function ExpiringRedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // Fetch the expiring link
    const { data: link, error } = await supabase
        .from('expiring_links')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !link) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        This link doesn&apos;t exist or may have been removed.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    // Check if link has expired
    const now = new Date()
    const expiresAt = new Date(link.expires_at)

    if (now > expiresAt || !link.is_active) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-lg">
                    <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                        <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
                    <p className="text-muted-foreground mb-2">
                        This link expired on {expiresAt.toLocaleDateString()} at {expiresAt.toLocaleTimeString()}.
                    </p>
                    {link.title && (
                        <p className="text-sm text-muted-foreground mb-4">
                            Link: {link.title}
                        </p>
                    )}

                    {/* Big Promotional Message */}
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20">
                        <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Create Your Own Expiring Links!
                        </h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Set expiration dates for your links. Perfect for flash sales, limited offers, and time-sensitive content.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            Get Started Free →
                        </Link>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground mt-6"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    // Log analytics (optional - can be async)
    try {
        await supabase.from('expiring_link_analytics').insert({
            link_id: link.id,
        })
    } catch (e) {
        console.error('Analytics error:', e)
    }

    // Redirect to the destination
    redirect(link.original_url)
}
