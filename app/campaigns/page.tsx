'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, FolderPlus, Edit, Trash2, X, Check, Sparkles, ArrowLeft, FolderOpen, Link as LinkIcon, BarChart3 } from 'lucide-react'
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

interface Campaign {
    id: string
    name: string
    description: string | null
    color: string
    created_at: string
    link_count: number
}

const CAMPAIGN_COLORS = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
]

function CampaignsContent() {
    const [loading, setLoading] = useState(true)
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#6366f1'
    })

    useEffect(() => {
        const checkUserAndFetch = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) {
                    router.push('/login')
                    return
                }
                setUserId(user.id)
                fetchCampaigns(user.id)
            } catch (err) {
                console.error('Auth error:', err)
                router.push('/login')
            }
        }
        checkUserAndFetch()
    }, [router])

    const fetchCampaigns = async (uid: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/campaigns?user_id=${uid}`)
            const data = await res.json()
            if (data.campaigns) {
                setCampaigns(data.campaigns)
            }
        } catch (err) {
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formData.name || !userId) return
        setSaving(true)
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    color: formData.color,
                    user_id: userId
                })
            })
            const data = await res.json()
            if (data.campaign) {
                setCampaigns([{ ...data.campaign, link_count: 0 }, ...campaigns])
                setShowCreateDialog(false)
                setFormData({ name: '', description: '', color: '#6366f1' })
            }
        } catch (err) {
            console.error('Create error:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = async () => {
        if (!editingCampaign || !userId) return
        setSaving(true)
        try {
            const res = await fetch('/api/campaigns', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingCampaign.id,
                    name: formData.name,
                    description: formData.description,
                    color: formData.color,
                    user_id: userId
                })
            })
            const data = await res.json()
            if (data.campaign) {
                setCampaigns(campaigns.map(c =>
                    c.id === editingCampaign.id
                        ? { ...data.campaign, link_count: c.link_count }
                        : c
                ))
                setShowEditDialog(false)
                setEditingCampaign(null)
            }
        } catch (err) {
            console.error('Edit error:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId || !userId) return
        try {
            await fetch(`/api/campaigns?id=${deleteId}&user_id=${userId}`, {
                method: 'DELETE'
            })
            setCampaigns(campaigns.filter(c => c.id !== deleteId))
            setDeleteId(null)
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    const openEditDialog = (campaign: Campaign) => {
        setEditingCampaign(campaign)
        setFormData({
            name: campaign.name,
            description: campaign.description || '',
            color: campaign.color
        })
        setShowEditDialog(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                            <Link href="/dashboard">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <FolderOpen className="h-8 w-8 text-primary" />
                                Campaigns
                            </h1>
                            <p className="text-muted-foreground">Organize your links into folders</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        New Campaign
                    </Button>
                </div>

                {/* Campaigns Grid */}
                {campaigns.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 border rounded-lg bg-muted/10"
                    >
                        <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No campaigns yet</h2>
                        <p className="text-muted-foreground mb-6">Create your first campaign to organize your links</p>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Create Campaign
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence>
                            {campaigns.map((campaign, index) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: campaign.color }}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="truncate text-lg flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full shrink-0"
                                                            style={{ backgroundColor: campaign.color }}
                                                        />
                                                        {campaign.name}
                                                    </CardTitle>
                                                    {campaign.description && (
                                                        <CardDescription className="truncate mt-1">
                                                            {campaign.description}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <LinkIcon className="h-4 w-4" />
                                                    <span>{campaign.link_count} links</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(campaign.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                                    <Link href={`/campaigns/${campaign.id}`}>
                                                        <FolderOpen className="mr-2 h-4 w-4" />
                                                        Open
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="icon" onClick={() => openEditDialog(campaign)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(campaign.id)} className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FolderPlus className="h-5 w-5 text-primary" />
                            Create New Campaign
                        </DialogTitle>
                        <DialogDescription>
                            Create a folder to organize your links
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Instagram Campaign"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Brief description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {CAMPAIGN_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-8 h-8 rounded-full transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData({ ...formData, color })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={!formData.name || saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Create Campaign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-primary" />
                            Edit Campaign
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Campaign Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {CAMPAIGN_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-8 h-8 rounded-full transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData({ ...formData, color })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={!formData.name || saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the campaign but keep all links inside it. The links will become uncategorized.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default function CampaignsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CampaignsContent />
        </Suspense>
    )
}
