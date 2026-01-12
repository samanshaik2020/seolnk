'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Copy, Check, Sparkles, ArrowRight, Upload, BarChart3, ArrowLeft, AlertTriangle } from 'lucide-react'
import { LinkPreview } from '@/components/LinkPreview'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CampaignSelector } from '@/components/CampaignSelector'

function PreviewContent() {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
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
        description: '',
        imageUrl: '',
        originalUrl: ''
    })

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        checkUser()

        if (editId) {
            const fetchCard = async () => {
                const { data } = await supabase
                    .from('cards')
                    .select('*')
                    .eq('id', editId)
                    .single()

                if (data) {
                    setFormData({
                        title: data.title,
                        description: data.description,
                        imageUrl: data.image_url,
                        originalUrl: data.original_url
                    })
                    if (data.campaign_id) setCampaignId(data.campaign_id)
                }
            }
            fetchCard()
        }
    }, [editId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, imageUrl: data.publicUrl }))
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleCampaignChange = async (newCampaignId: string | null) => {
        setCampaignId(newCampaignId)
        const targetId = editId || createdId
        if (!targetId || !userId) return

        try {
            await fetch('/api/create', {
                method: 'PUT',
                body: JSON.stringify({
                    ...formData,
                    id: targetId,
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

        // Basic URL validation
        try {
            new URL(formData.originalUrl)
            if (formData.imageUrl) new URL(formData.imageUrl)
        } catch {
            alert('Please enter valid URLs')
            setLoading(false)
            return
        }

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                router.push('/login')
                return
            }

            const res = await fetch('/api/create', {
                method: editId ? 'PUT' : 'POST',
                body: JSON.stringify({
                    ...formData,
                    id: editId,
                    user_id: user.id,
                    campaign_id: campaignId
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const json = await res.json()
            if (json.slug) {
                setGeneratedUrl(`${window.location.origin}/p/${json.slug}`)
            }
            if (json.id) {
                setCreatedId(json.id)
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
        setFormData({ title: '', description: '', imageUrl: '', originalUrl: '' })
        router.push('/create/preview')
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
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    {editId ? 'Edit Preview Link' : 'Create Preview Link'}
                                </CardTitle>
                                <CardDescription>
                                    {editId ? 'Update your link details.' : 'Create a link with a custom social media preview.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!generatedUrl ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3 text-sm text-yellow-600 dark:text-yellow-400">
                                            <AlertTriangle className="h-5 w-5 shrink-0" />
                                            <div>
                                                <p className="font-semibold mb-1">Important Precaution</p>
                                                <p>Ensure your Target URL and Image URL are publicly accessible. Test your links before sharing to guarantee they appear correctly on social media.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="e.g., My Awesome Article"
                                                required
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="originalUrl">Target URL</Label>
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
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder="A brief summary that appears below the title..."
                                                required
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="bg-background/50 min-h-[100px]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="imageUrl">Image URL</Label>
                                            <Input
                                                id="imageUrl"
                                                name="imageUrl"
                                                placeholder="https://example.com/image.jpg"
                                                required
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="imageUpload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={uploading}
                                                    />
                                                    <Label
                                                        htmlFor="imageUpload"
                                                        className="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {uploading ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Upload className="h-4 w-4" />
                                                        )}
                                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                                    </Label>
                                                </div>
                                                <span className="text-xs text-muted-foreground">or paste URL above</span>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                                            {loading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <span className="flex items-center">
                                                    {editId ? 'Update Preview Link' : 'Generate Preview Link'} <ArrowRight className="ml-2 h-4 w-4" />
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

                                        <div className="space-y-2">
                                            <CampaignSelector
                                                userId={userId}
                                                selectedCampaignId={campaignId}
                                                onCampaignChange={handleCampaignChange}
                                            />
                                        </div>

                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/analytics/preview/${generatedUrl.split('/').pop()}`}>
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
                                See how your link will look on Twitter, Facebook, and LinkedIn.
                            </p>
                        </div>

                        <LinkPreview
                            title={formData.title}
                            description={formData.description}
                            imageUrl={formData.imageUrl}
                            domain={(() => {
                                try {
                                    return formData.originalUrl ? new URL(formData.originalUrl).hostname : ''
                                } catch {
                                    return ''
                                }
                            })()}
                        />

                        <div className="bg-muted/30 rounded-lg p-6 border border-border/50 text-sm text-muted-foreground">
                            <h4 className="font-semibold text-foreground mb-2">Pro Tip</h4>
                            <p>
                                Images with a 1.91:1 aspect ratio (e.g., 1200x630px) work best for social media previews.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div >
    )
}

export default function PreviewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <PreviewContent />
        </Suspense>
    )
}
