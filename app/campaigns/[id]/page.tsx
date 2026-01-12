'use client'

import { useState, useEffect, Suspense, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, FolderOpen, Link as LinkIcon, Copy, Check, Trash2, Edit, BarChart3, Repeat, Clock, Lock, Zap, ExternalLink, Plus, Move, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Campaign {
    id: string
    name: string
    description: string | null
    color: string
}

interface LinkItem {
    id: string
    title?: string
    slug?: string
    alias?: string
    original_url: string
    created_at: string
    type: 'card' | 'rotator' | 'expiring' | 'protected' | 'alias' | 'quick'
}

interface QuickLink {
    id: string
    title: string
    original_url: string
    slug: string | null
    created_at: string
}

function CampaignDetailContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const campaignId = resolvedParams.id

    const [loading, setLoading] = useState(true)
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [links, setLinks] = useState<LinkItem[]>([])
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [moveDialogOpen, setMoveDialogOpen] = useState(false)
    const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
    const [selectedLinkType, setSelectedLinkType] = useState<string | null>(null)
    const [targetCampaignId, setTargetCampaignId] = useState<string>('')

    // Quick Link dialog state
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [saving, setSaving] = useState(false)
    const [quickLinkForm, setQuickLinkForm] = useState({
        title: '',
        url: '',
        createShortLink: false
    })
    const [deleteQuickLinkId, setDeleteQuickLinkId] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) {
                    router.push('/login')
                    return
                }
                setUserId(user.id)

                // Fetch campaign details
                const { data: campaignData } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('id', campaignId)
                    .single()

                if (!campaignData) {
                    router.push('/campaigns')
                    return
                }

                setCampaign(campaignData)

                // Fetch all campaigns for move dialog
                const campaignsRes = await fetch(`/api/campaigns?user_id=${user.id}`)
                const campaignsData = await campaignsRes.json()
                if (campaignsData.campaigns) {
                    setCampaigns(campaignsData.campaigns)
                }

                // Fetch links in this campaign
                const linksRes = await fetch(`/api/campaigns/links?campaign_id=${campaignId}&user_id=${user.id}`)
                const linksData = await linksRes.json()

                // Fetch quick links
                const quickRes = await fetch(`/api/quick-links?campaign_id=${campaignId}&user_id=${user.id}`)
                const quickData = await quickRes.json()
                if (quickData.links) {
                    setQuickLinks(quickData.links)
                }

                // Combine all links with type
                const allLinks: LinkItem[] = [
                    ...(linksData.cards || []).map((l: LinkItem) => ({ ...l, type: 'card' as const })),
                    ...(linksData.rotators || []).map((l: LinkItem) => ({ ...l, type: 'rotator' as const })),
                    ...(linksData.expiring_links || []).map((l: LinkItem) => ({ ...l, type: 'expiring' as const })),
                    ...(linksData.protected_links || []).map((l: LinkItem) => ({ ...l, type: 'protected' as const })),
                    ...(linksData.custom_aliases || []).map((l: LinkItem) => ({ ...l, type: 'alias' as const })),
                ]

                // Sort by created_at
                allLinks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setLinks(allLinks)

            } catch (err) {
                console.error('Fetch error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [campaignId, router])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const getLinkUrl = (link: LinkItem) => {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        switch (link.type) {
            case 'card':
                return `${origin}/p/${link.slug}`
            case 'rotator':
                return `${origin}/r/${link.slug}`
            case 'expiring':
                return `${origin}/e/${link.slug}`
            case 'protected':
                return `${origin}/s/${link.slug}`
            case 'alias':
                return `${origin}/a/${link.alias}`
            default:
                return ''
        }
    }

    const getLinkIcon = (type: string) => {
        switch (type) {
            case 'card': return <LinkIcon className="h-4 w-4" />
            case 'rotator': return <Repeat className="h-4 w-4" />
            case 'expiring': return <Clock className="h-4 w-4" />
            case 'protected': return <Lock className="h-4 w-4" />
            case 'alias': return <Zap className="h-4 w-4" />
            default: return <LinkIcon className="h-4 w-4" />
        }
    }

    const getLinkTypeName = (type: string) => {
        switch (type) {
            case 'card': return 'Preview'
            case 'rotator': return 'Rotator'
            case 'expiring': return 'Expiring'
            case 'protected': return 'Protected'
            case 'alias': return 'Alias'
            default: return 'Link'
        }
    }

    const getAnalyticsUrl = (link: LinkItem) => {
        switch (link.type) {
            case 'card': return `/analytics/preview/${link.slug}`
            case 'rotator': return `/analytics/rotator/${link.slug}`
            case 'protected': return `/analytics/protected/${link.slug}`
            case 'alias': return `/analytics/alias/${link.alias}`
            default: return '#'
        }
    }

    const openMoveDialog = (linkId: string, linkType: string) => {
        setSelectedLinkId(linkId)
        setSelectedLinkType(linkType)
        setTargetCampaignId('')
        setMoveDialogOpen(true)
    }

    const handleMoveLink = async () => {
        if (!selectedLinkId || !selectedLinkType || !userId) return

        try {
            await fetch('/api/campaigns/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    link_ids: [selectedLinkId],
                    link_type: selectedLinkType === 'card' ? 'cards' :
                        selectedLinkType === 'rotator' ? 'rotators' :
                            selectedLinkType === 'expiring' ? 'expiring' :
                                selectedLinkType === 'protected' ? 'protected' : 'aliases',
                    campaign_id: targetCampaignId || null,
                    user_id: userId
                })
            })

            // Remove from current list
            setLinks(links.filter(l => l.id !== selectedLinkId))
            setMoveDialogOpen(false)
        } catch (err) {
            console.error('Move error:', err)
        }
    }

    // Quick Link handlers
    const handleAddQuickLink = async () => {
        if (!quickLinkForm.title || !quickLinkForm.url || !userId) return
        setSaving(true)

        try {
            new URL(quickLinkForm.url)
        } catch {
            alert('Please enter a valid URL')
            setSaving(false)
            return
        }

        try {
            const res = await fetch('/api/quick-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: quickLinkForm.title,
                    original_url: quickLinkForm.url,
                    campaign_id: campaignId,
                    create_short_link: quickLinkForm.createShortLink,
                    user_id: userId
                })
            })
            const data = await res.json()
            if (data.link) {
                setQuickLinks([data.link, ...quickLinks])
                setShowAddDialog(false)
                setQuickLinkForm({ title: '', url: '', createShortLink: false })
            }
        } catch (err) {
            console.error('Add quick link error:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteQuickLink = async () => {
        if (!deleteQuickLinkId || !userId) return
        try {
            await fetch(`/api/quick-links?id=${deleteQuickLinkId}&user_id=${userId}`, {
                method: 'DELETE'
            })
            setQuickLinks(quickLinks.filter(l => l.id !== deleteQuickLinkId))
            setDeleteQuickLinkId(null)
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Campaign Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/campaigns">Go to Campaigns</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/campaigns">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: campaign.color }}
                                />
                                {campaign.name}
                            </h1>
                            {campaign.description && (
                                <p className="text-muted-foreground">{campaign.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add URL
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                            <LinkIcon className="h-4 w-4" />
                            {links.length + quickLinks.length} links
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                    {['card', 'rotator', 'expiring', 'protected', 'alias'].map((type) => {
                        const count = links.filter(l => l.type === type).length
                        return (
                            <Card key={type} className="bg-card/50">
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        {getLinkIcon(type)}
                                        <span className="text-xs">{getLinkTypeName(type)}</span>
                                    </div>
                                    <div className="text-2xl font-bold">{count}</div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Quick Links Section */}
                {quickLinks.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Bookmark className="h-5 w-5 text-primary" />
                                Quick Links ({quickLinks.length})
                            </h2>
                            <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add URL
                            </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {quickLinks.map((link) => (
                                <Card key={link.id} className="group hover:shadow-md transition-shadow">
                                    <CardContent className="pt-4">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate flex items-center gap-2">
                                                    <Bookmark className="h-4 w-4 text-primary shrink-0" />
                                                    {link.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate mt-1">
                                                    {new URL(link.original_url).hostname}
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                                                Quick
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-8 text-xs"
                                                onClick={() => copyToClipboard(link.slug ? `${window.location.origin}/q/${link.slug}` : link.original_url, link.id)}
                                            >
                                                {copiedId === link.id ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                                                {copiedId === link.id ? 'Copied' : 'Copy'}
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                                                <a href={link.original_url} target="_blank">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => setDeleteQuickLinkId(link.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Links Grid */}
                {links.length === 0 && quickLinks.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg bg-muted/10">
                        <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No links in this campaign</h2>
                        <p className="text-muted-foreground mb-6">Add links to this campaign or save URLs directly</p>
                        <div className="flex items-center justify-center gap-3">
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add URL
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/dashboard">
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : links.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {links.map((link, index) => (
                                <motion.div
                                    key={link.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Card className="group hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="truncate text-base flex items-center gap-2">
                                                        {getLinkIcon(link.type)}
                                                        {link.title || link.alias || link.slug || 'Untitled'}
                                                    </CardTitle>
                                                    <CardDescription className="truncate mt-1 text-xs">
                                                        {new URL(link.original_url).hostname}
                                                    </CardDescription>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                                                    {getLinkTypeName(link.type)}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-8 text-xs"
                                                    onClick={() => copyToClipboard(getLinkUrl(link), link.id)}
                                                >
                                                    {copiedId === link.id ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                                                    {copiedId === link.id ? 'Copied' : 'Copy'}
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                                                    <a href={getLinkUrl(link)} target="_blank">
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                                {link.type !== 'expiring' && (
                                                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={getAnalyticsUrl(link)}>
                                                            <BarChart3 className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => openMoveDialog(link.id, link.type)}
                                                >
                                                    <Move className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : null}
            </div>

            {/* Move Dialog */}
            <AlertDialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Move Link</AlertDialogTitle>
                        <AlertDialogDescription>
                            Select a campaign to move this link to, or remove from campaign.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Select value={targetCampaignId} onValueChange={setTargetCampaignId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select campaign..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uncategorized">No Campaign (Uncategorized)</SelectItem>
                                {campaigns.filter(c => c.id !== campaignId).map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                                            {c.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMoveLink}>
                            Move Link
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add Quick Link Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bookmark className="h-5 w-5 text-primary" />
                            Add URL to Campaign
                        </DialogTitle>
                        <DialogDescription>
                            Quickly save any URL to this campaign for easy access.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="quick-title">Title</Label>
                            <Input
                                id="quick-title"
                                placeholder="e.g., My Portfolio"
                                value={quickLinkForm.title}
                                onChange={(e) => setQuickLinkForm({ ...quickLinkForm, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quick-url">URL</Label>
                            <Input
                                id="quick-url"
                                placeholder="https://example.com"
                                value={quickLinkForm.url}
                                onChange={(e) => setQuickLinkForm({ ...quickLinkForm, url: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="create-short"
                                checked={quickLinkForm.createShortLink}
                                onChange={(e) => setQuickLinkForm({ ...quickLinkForm, createShortLink: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="create-short" className="text-sm font-normal cursor-pointer">
                                Also create a short link for this URL
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddQuickLink} disabled={!quickLinkForm.title || !quickLinkForm.url || saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add URL
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Quick Link Confirmation */}
            <AlertDialog open={!!deleteQuickLinkId} onOpenChange={(open) => !open && setDeleteQuickLinkId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Quick Link?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this URL from your campaign.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteQuickLink} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CampaignDetailContent params={params} />
        </Suspense>
    )
}
