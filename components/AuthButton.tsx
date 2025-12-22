'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, LayoutDashboard, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) {
                    // If there's an error fetching user (like invalid token), sign out to clear stale data
                    if (error.message.includes('refresh_token_not_found') || error.message.includes('Invalid Refresh Token')) {
                        await supabase.auth.signOut()
                        setUser(null)
                    } else if (error.message.includes('Auth session missing!')) {
                        // This is expected logic when the user is not logged in, no need to log as error
                        setUser(null)
                    } else {
                        console.error('Error fetching user:', error.message)
                    }
                } else {
                    setUser(user)
                }
            } catch (err) {
                console.error('Unexpected error in getUser:', err)
            } finally {
                setLoading(false)
            }
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
            if (event === 'SIGNED_OUT') {
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    if (loading) {
        return <Button variant="ghost" disabled>Loading...</Button>
    }

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                </Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
    )
}
