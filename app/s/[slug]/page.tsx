import { createClient } from '@supabase/supabase-js'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import PasswordPage from './PasswordPage'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function ProtectedRedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // Fetch the protected link
    const { data: link, error } = await supabase
        .from('password_protected_links')
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

    if (!link.is_active) {
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

    // Show password page
    return <PasswordPage slug={slug} title={link.title} />
}
