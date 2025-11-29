'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, Repeat, Plus, Trash2, Sparkles, BarChart3, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function RotatorContent() {
    const [loading, setLoading] = useState(false)
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')

    // Rotator State
    const [rotatorData, setRotatorData] = useState({
        title: '',
        urls: ['', '']
    })

    useEffect(() => {
        if (editId) {
            const fetchRotator = async () => {
                const { data: rotator } = await supabase
                    .from('rotators')
                    .select('*, rotator_urls(url)')
                    .eq('id', editId)
                    .single()

                if (rotator) {
                    setRotatorData({
                        title: rotator.title,
                        urls: rotator.rotator_urls.map((u: { url: string }) => u.url)
                    })
                }
            }
            fetchRotator()
        }
    }, [editId])

    const handleRotatorChange = (index: number, value: string) => {
        const newUrls = [...rotatorData.urls]
        newUrls[index] = value
        setRotatorData(prev => ({ ...prev, urls: newUrls }))
    }

    const addRotatorUrl = () => {
        setRotatorData(prev => ({ ...prev, urls: [...prev.urls, ''] }))
    }

    const removeRotatorUrl = (index: number) => {
        if (rotatorData.urls.length <= 2) return
        const newUrls = rotatorData.urls.filter((_, i) => i !== index)
        setRotatorData(prev => ({ ...prev, urls: newUrls }))
    }

    const handleRotatorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // Filter out empty URLs
        const validUrls = rotatorData.urls.filter(u => u.trim() !== '')
        if (validUrls.length === 0) {
            alert('Please enter at least one URL')
            setLoading(false)
            return
        }

        // Validate URLs
        try {
            validUrls.forEach(url => new URL(url))
        } catch {
            alert('Please enter valid URLs')
            setLoading(false)
            return
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()

            const res = await fetch('/api/rotator/create', {
                method: editId ? 'PUT' : 'POST',
                body: JSON.stringify({
                    id: editId,
                    title: rotatorData.title,
                    urls: validUrls,
                    user_id: user?.id
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const json = await res.json()
            if (json.slug) {
                setGeneratedUrl(`${window.location.origin}/r/${json.slug}`)
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
        setRotatorData({ title: '', urls: ['', ''] })
        router.push('/create/rotator')
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Link Render
                    </Link>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">
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
                                    <Repeat className="h-5 w-5 text-primary" />
                                    {editId ? 'Edit Rotator Link' : 'Create Rotator Link'}
                                </CardTitle>
                                <CardDescription>
                                    {editId ? 'Update your rotator settings.' : 'Create a link that rotates between multiple destinations.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!generatedUrl ? (
                                    <form onSubmit={handleRotatorSubmit} className="space-y-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3 text-sm text-yellow-600 dark:text-yellow-400">
                                            <AlertTriangle className="h-5 w-5 shrink-0" />
                                            <div>
                                                <p className="font-semibold mb-1">Important Precaution</p>
                                                <p>Test all destination URLs to ensure they are active. The rotator will randomly redirect users to these links, so broken links will affect user experience.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="rotatorTitle">Rotator Title (Optional)</Label>
                                            <Input
                                                id="rotatorTitle"
                                                placeholder="e.g., My A/B Test"
                                                value={rotatorData.title}
                                                onChange={(e) => setRotatorData(prev => ({ ...prev, title: e.target.value }))}
                                                className="bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Destination URLs</Label>
                                            {rotatorData.urls.map((url, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        placeholder={`https://site-${index + 1}.com`}
                                                        value={url}
                                                        onChange={(e) => handleRotatorChange(index, e.target.value)}
                                                        className="bg-background/50"
                                                        required={index < 2} // Require at least 2 URLs initially
                                                    />
                                                    {rotatorData.urls.length > 2 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeRotatorUrl(index)}
                                                            className="shrink-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addRotatorUrl}
                                                className="w-full mt-2 border-dashed"
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add Another URL
                                            </Button>
                                        </div>

                                        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                                            {loading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <span className="flex items-center">
                                                    {editId ? 'Update Rotator Link' : 'Create Rotator Link'} <Repeat className="ml-2 h-4 w-4" />
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
                                                <p className="font-semibold">{editId ? 'Rotator Updated Successfully!' : 'Link Created Successfully!'}</p>
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

                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/analytics/rotator/${generatedUrl.split('/').pop()}`}>
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                View Analytics
                                            </Link>
                                        </Button>

                                        <Button variant="outline" className="w-full" onClick={resetForm}>
                                            Create Another Link
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Live Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:sticky lg:top-24 space-y-6"
                    >
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-semibold mb-2">Live Preview</h3>
                            <p className="text-muted-foreground mb-6">
                                Rotator links will redirect users to one of your destination URLs randomly.
                            </p>
                        </div>

                        <Card className="border-border/50 bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-lg">How Rotators Work</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">1</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">You add multiple destination URLs (e.g., for A/B testing different landing pages).</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">2</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">We generate a single short link for you to share.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">3</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">When someone clicks the link, we randomly redirect them to one of your destinations.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div >
    )
}

export default function RotatorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <RotatorContent />
        </Suspense>
    )
}
