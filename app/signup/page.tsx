'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

import { Loader2, UserPlus, Sparkles, Zap, ShieldCheck, Link as LinkIcon } from 'lucide-react'

function SignupContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            setSuccess(true)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setGoogleLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
                },
            })

            if (error) throw error
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An error occurred with Google sign up')
            }
            setGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Side: Features */}
            <div className="hidden lg:flex flex-col justify-between bg-muted/30 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="relative h-8 w-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                            <LinkIcon className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl font-serif">SEOLnk</span>
                    </Link>

                    <div className="space-y-8 max-w-md">
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Join the Future of <br />
                            <span className="text-primary">Link Management</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Create an account today and start optimizing your links for maximum engagement.
                        </p>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Beautiful Previews</h3>
                                    <p className="text-sm text-muted-foreground">Stand out in the feed.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Instant Setup</h3>
                                    <p className="text-sm text-muted-foreground">Get started in seconds.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Secure & Reliable</h3>
                                    <p className="text-sm text-muted-foreground">Enterprise-grade infrastructure.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} SEOLnk. All rights reserved.
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex items-center justify-center p-4 lg:p-12 bg-background">
                <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
                    <CardHeader className="space-y-1">
                        <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
                            <div className="relative h-8 w-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl font-serif">SEOLnk</span>
                        </div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Enter your email below to create your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="text-center space-y-4">
                                <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg border border-green-500/20">
                                    <h3 className="font-semibold text-lg mb-2">Account Created!</h3>
                                    <p>Please check your email to confirm your account before logging in.</p>
                                </div>
                                <Button asChild className="w-full">
                                    <Link href="/login">Go to Login</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Google Sign Up Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full mb-4 h-11"
                                    onClick={handleGoogleSignup}
                                    disabled={googleLoading || loading}
                                >
                                    {googleLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                    )}
                                    Continue with Google
                                </Button>

                                {/* Divider */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Or continue with email
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="bg-background"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Must be at least 6 characters long.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center gap-2">
                                            <span className="font-semibold">Error:</span> {error}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                                        {loading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            'Create Account'
                                        )}
                                    </Button>

                                    <div className="text-center text-sm text-muted-foreground mt-4">
                                        Already have an account?{' '}
                                        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="text-primary hover:underline font-medium">
                                            Login
                                        </Link>
                                    </div>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <SignupContent />
        </Suspense>
    )
}
