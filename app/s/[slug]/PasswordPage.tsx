'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface PasswordPageProps {
    slug: string
    title: string | null
}

export default function PasswordPage({ slug, title }: PasswordPageProps) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/protected/verify', {
                method: 'POST',
                body: JSON.stringify({ slug, password }),
                headers: { 'Content-Type': 'application/json' },
            })

            const json = await res.json()

            if (res.ok && json.url) {
                // Redirect to the destination
                window.location.href = json.url
            } else {
                setError(json.error || 'Incorrect password')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
                        <Sparkles className="h-6 w-6 text-primary" />
                        SEOLnk
                    </Link>
                </div>

                <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Password Required</CardTitle>
                        <CardDescription>
                            {title ? `"${title}" is protected.` : 'This link is password protected.'}
                            <br />
                            Enter the password to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoFocus
                                    className="bg-background/50"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Unlock Link
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Promotional Message */}
                        <div className="mt-6 pt-6 border-t text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Want to create your own protected links?
                            </p>
                            <Link
                                href="/signup"
                                className="text-sm text-primary font-medium hover:underline"
                            >
                                Get Started Free →
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
