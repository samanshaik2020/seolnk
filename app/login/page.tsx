'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

import { Loader2, LogIn, CheckCircle2, Link as LinkIcon } from 'lucide-react'

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push(next || '/dashboard')
            router.refresh()
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
                            Welcome back to <br />
                            <span className="text-primary">SEOLnk</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Continue managing your links and optimizing your social media presence.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Custom Social Previews</h3>
                                    <p className="text-muted-foreground">Control how your links appear on every platform.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Smart URL Rotators</h3>
                                    <p className="text-muted-foreground">A/B test destinations with a single link.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Real-time Analytics</h3>
                                    <p className="text-muted-foreground">Track clicks and engagement instantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} SEOLnk. All rights reserved.
                </div>
            </div>

            {/* Right Side: Login Form */}
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
                            <LogIn className="h-5 w-5 text-primary" />
                            Sign In
                        </CardTitle>
                        <CardDescription>
                            Enter your email and password to access your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background"
                                />
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
                                    'Sign In'
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground mt-4">
                                Don&apos;t have an account?{' '}
                                <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'} className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
