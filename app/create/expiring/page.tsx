'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, Clock, Sparkles, BarChart3, ArrowLeft, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { CampaignSelector } from '@/components/CampaignSelector'

function ExpiringContent() {
    const [loading, setLoading] = useState(false)
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')
    const [userId, setUserId] = useState<string | null>(null)
    const [campaignId, setCampaignId] = useState<string | null>(null)
    const [createdId, setCreatedId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        originalUrl: '',
        expiresAt: ''
    })

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        checkUser()

        if (editId) {
            const fetchLink = async () => {
                const { data } = await supabase
                    .from('expiring_links')
                    .select('*')
                    .eq('id', editId)
                    .single()

                if (data) {
                    setFormData({
                        title: data.title || '',
                        originalUrl: data.original_url,
                        expiresAt: new Date(data.expires_at).toISOString().slice(0, 16)
                    })
                    if (data.campaign_id) setCampaignId(data.campaign_id)
                }
            }
            fetchLink()
        }
    }, [editId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCampaignChange = async (newCampaignId: string | null) => {
        setCampaignId(newCampaignId)
        const targetId = editId || createdId
        if (!targetId || !userId) return

        try {
            await fetch('/api/expiring', {
                method: 'PUT',
                body: JSON.stringify({
                    id: targetId,
                    title: formData.title,
                    original_url: formData.originalUrl,
                    expires_at: new Date(formData.expiresAt).toISOString(),
                    user_id: userId,
                    campaign_id: newCampaignId
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (error) {
            console.error('Failed to update campaign', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // Validate URL
        try {
            new URL(formData.originalUrl)
        } catch {
            alert('Please enter a valid URL')
            setLoading(false)
            return
        }

        // Validate expiration date
        const expiresAt = new Date(formData.expiresAt)
        if (expiresAt <= new Date()) {
            alert('Expiration date must be in the future')
            setLoading(false)
            return
        }

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                router.push('/login')
                return
            }

            const res = await fetch('/api/expiring', {
                method: editId ? 'PUT' : 'POST',
                body: JSON.stringify({
                    id: editId,
                    title: formData.title,
                    original_url: formData.originalUrl,
                    expires_at: expiresAt.toISOString(),
                    user_id: user.id,
                    campaign_id: campaignId
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const json = await res.json()
            if (json.slug) {
                setGeneratedUrl(`${window.location.origin}/e/${json.slug}`)
                if (json.id) setCreatedId(json.id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const resetForm = () => {
        setGeneratedUrl('')
        setFormData({ title: '', originalUrl: '', expiresAt: '' })
        router.push('/create/expiring')
    }

    // Quick expiration options
    const setQuickExpiry = (hours: number) => {
        const date = new Date()
        date.setHours(date.getHours() + hours)
        setFormData(prev => ({
            ...prev,
            expiresAt: date.toISOString().slice(0, 16)
        }))
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        SEOLnk
                    </Link>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard?tab=expiring">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Link>
                    </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    {editId ? 'Edit Expiring Link' : 'Create Expiring Link'}
                                </CardTitle>
                                <CardDescription>
                                    {editId ? 'Update your expiring link settings.' : 'Create a link that automatically expires after a set date.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!generatedUrl ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3 text-sm text-yellow-600 dark:text-yellow-400">
                                            <AlertTriangle className="h-5 w-5 shrink-0" />
                                            <div>
                                                <p className="font-semibold mb-1">Important</p>
                                                <p>Once the link expires, visitors will see an &quot;expired&quot; message and won&apos;t be redirected.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="title">Link Title (Optional)</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="e.g., Limited Time Offer"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="originalUrl">Destination URL</Label>
                                            <Input
                                                id="originalUrl"
                                                name="originalUrl"
                                                placeholder="https://your-site.com/page"
                                                required
                                                value={formData.originalUrl}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="expiresAt">Expiration Date & Time</Label>
                                            <Input
                                                id="expiresAt"
                                                name="expiresAt"
                                                type="datetime-local"
                                                required
                                                value={formData.expiresAt}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => setQuickExpiry(1)}>
                                                    1 Hour
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => setQuickExpiry(24)}>
                                                    24 Hours
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => setQuickExpiry(72)}>
                                                    3 Days
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => setQuickExpiry(168)}>
                                                    1 Week
                                                </Button>
                                            </div>
                                        </div>



                                        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                                            {loading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <span className="flex items-center">
                                                    {editId ? 'Update Expiring Link' : 'Create Expiring Link'} <ArrowRight className="ml-2 h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="space-y-6 py-4">
                                        <div className="p-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-500/20 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{editId ? 'Link Updated Successfully!' : 'Link Created Successfully!'}</p>
                                                <p className="text-sm opacity-90">Your link is ready to share.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Your Short Link</Label>
                                            <div className="flex items-center gap-2">
                                                <Input value={generatedUrl} readOnly className="font-mono text-sm bg-muted/50" />
                                                <Button size="icon" onClick={copyToClipboard} className="shrink-0">
                                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4 inline mr-2" />
                                            Expires: {new Date(formData.expiresAt).toLocaleString()}
                                        </div>

                                        <div className="space-y-2">
                                            <CampaignSelector
                                                userId={userId}
                                                selectedCampaignId={campaignId}
                                                onCampaignChange={handleCampaignChange}
                                            />
                                        </div>

                                        <Button variant="outline" className="w-full" onClick={resetForm}>
                                            Create Another Link
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:sticky lg:top-24 space-y-6"
                    >
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-semibold mb-2">Expiring Links</h3>
                            <p className="text-muted-foreground mb-6">
                                Perfect for time-sensitive promotions, limited offers, or temporary access links.
                            </p>
                        </div>

                        <Card className="border-border/50 bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-lg">Use Cases</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">1</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Flash sales and limited-time promotions that end at a specific time.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">2</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Temporary download links for files or resources.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">3</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Event registration links that close after a deadline.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">4</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Secure sharing of sensitive links that auto-expire.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div >
    )
}

export default function ExpiringPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ExpiringContent />
        </Suspense>
    )
}
