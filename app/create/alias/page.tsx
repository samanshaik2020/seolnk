'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, Zap, Sparkles, ArrowLeft, ArrowRight, CheckCircle, XCircle, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { CampaignSelector } from '@/components/CampaignSelector'
import { useUrlSafety } from '@/hooks/useUrlSafety'

function AliasContent() {
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const [availability, setAvailability] = useState<{
        available: boolean | null
        error?: string
        suggestions?: string[]
    }>({ available: null })
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')
    const [userId, setUserId] = useState<string | null>(null)
    const [campaignId, setCampaignId] = useState<string | null>(null)
    const [createdId, setCreatedId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        originalUrl: '',
        alias: ''
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
            const fetchAlias = async () => {
                const { data } = await supabase
                    .from('custom_aliases')
                    .select('*')
                    .eq('id', editId)
                    .single()

                if (data) {
                    setFormData({
                        title: data.title || '',
                        originalUrl: data.original_url,
                        alias: data.alias
                    })
                    if (data.campaign_id) setCampaignId(data.campaign_id)
                    setAvailability({ available: true })
                }
            }
            fetchAlias()
        }
    }, [editId])

    // Debounced alias check
    const checkAvailability = useCallback(async (alias: string) => {
        if (alias.length < 3) {
            setAvailability({ available: null })
            return
        }

        setChecking(true)
        try {
            const res = await fetch(`/api/alias?alias=${encodeURIComponent(alias)}`)
            const data = await res.json()
            setAvailability({
                available: data.available,
                error: data.error,
                suggestions: data.suggestions
            })
        } catch {
            setAvailability({ available: null })
        } finally {
            setChecking(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.alias && !editId) {
                checkAvailability(formData.alias)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [formData.alias, editId, checkAvailability])

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

    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
        setFormData(prev => ({ ...prev, alias: value }))
        setAvailability({ available: null })
    }

    const useSuggestion = (suggestion: string) => {
        setFormData(prev => ({ ...prev, alias: suggestion }))
        checkAvailability(suggestion)
    }

    const handleCampaignChange = async (newCampaignId: string | null) => {
        setCampaignId(newCampaignId)
        const targetId = editId || createdId
        if (!targetId || !userId) return

        try {
            await fetch('/api/alias', {
                method: 'PUT',
                body: JSON.stringify({
                    id: targetId,
                    title: formData.title,
                    original_url: formData.originalUrl,
                    alias: formData.alias,
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

        if (!editId && !availability.available) {
            alert('Please choose an available alias')
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

            const res = await fetch('/api/alias', {
                method: editId ? 'PUT' : 'POST',
                body: JSON.stringify({
                    id: editId,
                    title: formData.title,
                    original_url: formData.originalUrl,
                    alias: formData.alias,
                    user_id: user.id,
                    campaign_id: campaignId
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const json = await res.json()

            if (json.alias) {
                setGeneratedUrl(`${window.location.origin}/a/${json.alias}`)
                if (json.id) setCreatedId(json.id)
            } else if (json.error) {
                alert(json.error)
                if (json.suggestions) {
                    setAvailability({
                        available: false,
                        error: json.error,
                        suggestions: json.suggestions
                    })
                }
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
        setFormData({ title: '', originalUrl: '', alias: '' })
        setAvailability({ available: null })
        router.push('/create/alias')
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
                        <Link href="/dashboard?tab=aliases">
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
                                    <Zap className="h-5 w-5 text-primary" />
                                    {editId ? 'Edit Custom Alias' : 'Create Custom Alias'}
                                </CardTitle>
                                <CardDescription>
                                    {editId ? 'Update your custom alias settings.' : 'Create a memorable, branded short link.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!generatedUrl ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3 text-sm">
                                            <Zap className="h-5 w-5 text-primary shrink-0" />
                                            <div>
                                                <p className="font-semibold mb-1 text-foreground">Custom Alias</p>
                                                <p className="text-muted-foreground">Create a branded link like <span className="font-mono text-primary">seolnk.com/your-brand</span></p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="alias">Custom Alias</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground shrink-0">seolnk.com/a/</span>
                                                <div className="relative flex-1">
                                                    <Input
                                                        id="alias"
                                                        name="alias"
                                                        placeholder="your-brand"
                                                        required
                                                        minLength={3}
                                                        maxLength={30}
                                                        value={formData.alias}
                                                        onChange={handleAliasChange}
                                                        className={`bg-background/50 pr-10 ${availability.available === true ? 'border-green-500 focus-visible:ring-green-500' :
                                                            availability.available === false ? 'border-destructive focus-visible:ring-destructive' : ''
                                                            }`}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        {checking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                                        {!checking && availability.available === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                        {!checking && availability.available === false && <XCircle className="h-4 w-4 text-destructive" />}
                                                    </div>
                                                </div>
                                            </div>
                                            {availability.available === true && (
                                                <p className="text-xs text-green-600 flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" /> This alias is available!
                                                </p>
                                            )}
                                            {availability.error && (
                                                <p className="text-xs text-destructive flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" /> {availability.error}
                                                </p>
                                            )}
                                            {availability.suggestions && availability.suggestions.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-muted-foreground">Try these instead:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {availability.suggestions.map((suggestion) => (
                                                            <Button
                                                                key={suggestion}
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs"
                                                                onClick={() => useSuggestion(suggestion)}
                                                            >
                                                                {suggestion}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                3-30 characters. Letters, numbers, and hyphens only.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="title">Link Title (Optional)</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="e.g., My Portfolio"
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
                                                    placeholder="https://your-site.com/page"
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



                                        <Button
                                            type="submit"
                                            className="w-full h-11 text-base"
                                            disabled={loading || isUnsafe || isCheckingUrl || (!editId && availability.available !== true)}
                                        >
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
                                                    {editId ? 'Update Alias' : 'Create Alias'} <ArrowRight className="ml-2 h-4 w-4" />
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
                                                <p className="font-semibold">{editId ? 'Alias Updated!' : 'Alias Created!'}</p>
                                                <p className="text-sm opacity-90">Your custom link is ready to share.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Your Custom Link</Label>
                                            <div className="flex items-center gap-2">
                                                <Input value={generatedUrl} readOnly className="font-mono text-sm bg-muted/50" />
                                                <Button size="icon" onClick={copyToClipboard} className="shrink-0">
                                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <CampaignSelector
                                                userId={userId}
                                                selectedCampaignId={campaignId}
                                                onCampaignChange={handleCampaignChange}
                                            />
                                        </div>

                                        <Button variant="outline" className="w-full" onClick={resetForm}>
                                            Create Another Alias
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
                            <h3 className="text-2xl font-semibold mb-2">Custom Aliases</h3>
                            <p className="text-muted-foreground mb-6">
                                Create memorable, branded short links that are easy to share.
                            </p>
                        </div>

                        <Card className="border-border/50 bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-lg">Examples</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <span className="text-muted-foreground">YouTuber:</span>
                                    <code className="text-primary font-mono text-sm">seolnk.com/a/subscribe</code>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <span className="text-muted-foreground">Freelancer:</span>
                                    <code className="text-primary font-mono text-sm">seolnk.com/a/portfolio</code>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <span className="text-muted-foreground">Business:</span>
                                    <code className="text-primary font-mono text-sm">seolnk.com/a/sale-2026</code>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-lg">Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p>✅ Lowercase letters (a-z)</p>
                                <p>✅ Numbers (0-9)</p>
                                <p>✅ Hyphens (-)</p>
                                <p>❌ No spaces</p>
                                <p>❌ No special characters</p>
                                <p>❌ No emojis</p>
                                <p className="pt-2 text-xs">Length: 3-30 characters</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default function AliasPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <AliasContent />
        </Suspense>
    )
}
