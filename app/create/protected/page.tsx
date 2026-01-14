'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, Lock, Sparkles, ArrowLeft, ArrowRight, Eye, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { CampaignSelector } from '@/components/CampaignSelector'
import { useUrlSafety } from '@/hooks/useUrlSafety'

function ProtectedContent() {
    const [loading, setLoading] = useState(false)
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')
    const [userId, setUserId] = useState<string | null>(null)
    const [campaignId, setCampaignId] = useState<string | null>(null)
    const [createdId, setCreatedId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        originalUrl: '',
        password: ''
    })

    // URL Safety Check Hook
    const { isChecking: isCheckingUrl, isUnsafe, threatMessage, checkUrl, reset: resetUrlCheck } = useUrlSafety()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        checkUser()

        if (editId) {
            const fetchLink = async () => {
                const { data } = await supabase
                    .from('password_protected_links')
                    .select('*')
                    .eq('id', editId)
                    .single()

                if (data) {
                    setFormData({
                        title: data.title || '',
                        originalUrl: data.original_url,
                        password: '' // Don't show existing password
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
        if (name === 'originalUrl') {
            resetUrlCheck()
        }
    }

    // Check URL safety when user leaves the URL input field
    const handleUrlBlur = async () => {
        if (formData.originalUrl) {
            await checkUrl(formData.originalUrl)
        }
    }

    const handleCampaignChange = async (newCampaignId: string | null) => {
        setCampaignId(newCampaignId)
        const targetId = editId || createdId
        if (!targetId || !userId) return

        try {
            await fetch('/api/protected', {
                method: 'PUT',
                body: JSON.stringify({
                    id: targetId,
                    title: formData.title,
                    original_url: formData.originalUrl,
                    password: formData.password || undefined,
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

        // Validate password for new links
        if (!editId && formData.password.length < 4) {
            alert('Password must be at least 4 characters')
            setLoading(false)
            return
        }

        // Check URL safety before submitting
        const isSafe = await checkUrl(formData.originalUrl)
        if (!isSafe) {
            setLoading(false)
            return
        }

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                router.push('/login')
                return
            }

            const res = await fetch('/api/protected', {
                method: editId ? 'PUT' : 'POST',
                body: JSON.stringify({
                    id: editId,
                    title: formData.title,
                    original_url: formData.originalUrl,
                    password: formData.password || undefined,
                    user_id: user.id,
                    campaign_id: campaignId
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const json = await res.json()
            if (json.slug) {
                setGeneratedUrl(`${window.location.origin}/s/${json.slug}`)
                if (json.id) setCreatedId(json.id)
            } else if (json.error) {
                alert(json.error)
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
        setFormData({ title: '', originalUrl: '', password: '' })
        router.push('/create/protected')
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
                        <Link href="/dashboard?tab=protected">
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
                                    <Lock className="h-5 w-5 text-primary" />
                                    {editId ? 'Edit Protected Link' : 'Create Protected Link'}
                                </CardTitle>
                                <CardDescription>
                                    {editId ? 'Update your password protected link.' : 'Create a link that requires a password to access.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!generatedUrl ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3 text-sm text-blue-600 dark:text-blue-400">
                                            <Lock className="h-5 w-5 shrink-0" />
                                            <div>
                                                <p className="font-semibold mb-1">Password Protected</p>
                                                <p>Visitors must enter the correct password to access the destination URL.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="title">Link Title (Optional)</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="e.g., Private Document"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="originalUrl">Destination URL</Label>
                                            <div className="relative">
                                                <Input
                                                    id="originalUrl"
                                                    name="originalUrl"
                                                    placeholder="https://your-site.com/private-page"
                                                    required
                                                    value={formData.originalUrl}
                                                    onChange={handleInputChange}
                                                    onBlur={handleUrlBlur}
                                                    className={`bg-background/50 pr-10 ${isUnsafe ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                />
                                                {isCheckingUrl && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                                {!isCheckingUrl && formData.originalUrl && !isUnsafe && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <ShieldCheck className="h-4 w-4 text-green-500" />
                                                    </div>
                                                )}
                                                {isUnsafe && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <ShieldAlert className="h-4 w-4 text-red-500" />
                                                    </div>
                                                )}
                                            </div>
                                            {isUnsafe && threatMessage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                                                >
                                                    <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold">Dangerous URL Detected!</p>
                                                        <p>{threatMessage}</p>
                                                        <p className="mt-1 text-xs opacity-80">This link cannot be created for safety reasons.</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password {editId && <span className="text-muted-foreground font-normal">(leave blank to keep current)</span>}
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder={editId ? '••••••••' : 'Enter a secure password'}
                                                    required={!editId}
                                                    minLength={4}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="bg-background/50 pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Minimum 4 characters. Share this password with people you want to give access.</p>
                                        </div>



                                        <Button type="submit" className="w-full h-11 text-base" disabled={loading || isUnsafe || isCheckingUrl}>
                                            {loading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : isCheckingUrl ? (
                                                <span className="flex items-center">
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking URL Safety...
                                                </span>
                                            ) : isUnsafe ? (
                                                <span className="flex items-center">
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> URL Blocked
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    {editId ? 'Update Protected Link' : 'Create Protected Link'} <ArrowRight className="ml-2 h-4 w-4" />
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
                                                <p className="text-sm opacity-90">Your protected link is ready to share.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Your Protected Link</Label>
                                            <div className="flex items-center gap-2">
                                                <Input value={generatedUrl} readOnly className="font-mono text-sm bg-muted/50" />
                                                <Button size="icon" onClick={copyToClipboard} className="shrink-0">
                                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                                            <Lock className="h-4 w-4 inline mr-2" />
                                            Don&apos;t forget to share the password with authorized users!
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
                            <h3 className="text-2xl font-semibold mb-2">Password Protection</h3>
                            <p className="text-muted-foreground mb-6">
                                Add an extra layer of security to your shared links.
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
                                    <p className="text-sm text-muted-foreground">Share confidential documents with specific people only.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">2</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Protect exclusive content for members or subscribers.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">3</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Share preview links with clients before public launch.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">4</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Control access to private resources or downloads.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div >
    )
}

export default function ProtectedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ProtectedContent />
        </Suspense>
    )
}
