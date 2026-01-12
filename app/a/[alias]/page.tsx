import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AliasRedirectPage({
    params,
}: {
    params: Promise<{ alias: string }>
}) {
    const { alias } = await params

    // Fetch the custom alias
    const { data: aliasData, error } = await supabase
        .from('custom_aliases')
        .select('*')
        .eq('alias', alias)
        .single()

    if (error || !aliasData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The alias &quot;{alias}&quot; doesn&apos;t exist or may have been removed.
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

    // Check if link is inactive
    if (!aliasData.is_active) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link Inactive</h1>
                    <p className="text-muted-foreground mb-6">
                        This link has been deactivated by its owner.
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
    if (aliasData.expires_at && new Date(aliasData.expires_at) < new Date()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-lg">
                    <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                        <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
                    <p className="text-muted-foreground mb-2">
                        This custom alias has expired.
                    </p>
                    {aliasData.title && (
                        <p className="text-sm text-muted-foreground mb-4">
                            Link: {aliasData.title}
                        </p>
                    )}

                    {/* Promotional Message */}
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20">
                        <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Create Your Own Custom Aliases!
                        </h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Create memorable, branded short links for your business or personal use.
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

    // Log analytics
    try {
        await supabase.from('custom_alias_analytics').insert({
            alias_id: aliasData.id,
        })

        // Increment click count
        await supabase
            .from('custom_aliases')
            .update({ click_count: (aliasData.click_count || 0) + 1 })
            .eq('id', aliasData.id)
    } catch (e) {
        console.error('Analytics error:', e)
    }

    // Redirect to the destination
    redirect(aliasData.original_url)
}
