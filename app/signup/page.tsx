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

                                <Button type="submit" className="w-full" disabled={loading}>
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
