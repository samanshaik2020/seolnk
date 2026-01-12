'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    Loader2, Plus, Trash2, GripVertical, Save, Eye, ArrowLeft,
    User, Link as LinkIcon, Palette, Settings, ExternalLink,
    ChevronDown, ChevronUp, Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import AuthButton from '@/components/AuthButton'

interface BioLink {
    id?: string
    title: string
    url: string
    icon: string
    icon_type: string
    animation: string
    button_style: string
    is_active: boolean
    order_index: number
    isNew?: boolean
    isDeleted?: boolean
}

interface BioPage {
    id?: string
    username: string
    title: string
    description: string
    avatar_url: string
    theme: string
    theme_config: Record<string, string>
    social_links: Record<string, string>
    seo_title: string
    seo_description: string
    show_branding: boolean
    is_active: boolean
}

const themes = [
    { id: 'default', name: 'Default', description: 'Clean and professional' },
    { id: 'dark', name: 'Dark', description: 'Sleek dark mode' },
    { id: 'gradient', name: 'Gradient', description: 'Vibrant purple to orange' },
    { id: 'glassmorphism', name: 'Glassmorphism', description: 'Modern glass effect' },
    { id: 'neon', name: 'Neon', description: 'Cyberpunk vibes' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and clean' },
    { id: 'sunset', name: 'Sunset', description: 'Warm orange to purple' },
    { id: 'ocean', name: 'Ocean', description: 'Cool blue gradient' },
]

const animations = [
    { id: 'none', name: 'None' },
    { id: 'pulse', name: 'Pulse' },
    { id: 'bounce', name: 'Bounce' },
    { id: 'shake', name: 'Shake' },
]

const emojiIcons = ['🔗', '🌐', '📸', '▶️', '🎵', '💼', '📧', '💬', '🛒', '📝', '🎮', '📱', '🎯', '⭐', '❤️', '🔥']

function CreateBioContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('profile')

    // Bio page state
    const [bioPage, setBioPage] = useState<BioPage>({
        username: '',
        title: '',
        description: '',
        avatar_url: '',
        theme: 'default',
        theme_config: {},
        social_links: {},
        seo_title: '',
        seo_description: '',
        show_branding: true,
        is_active: true,
    })

    // Links state
    const [links, setLinks] = useState<BioLink[]>([])
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [editingLink, setEditingLink] = useState<BioLink | null>(null)
    const [newLink, setNewLink] = useState<BioLink>({
        title: '',
        url: '',
        icon: '🔗',
        icon_type: 'emoji',
        animation: 'none',
        button_style: 'default',
        is_active: true,
        order_index: 0,
    })

    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [checkingUsername, setCheckingUsername] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) {
                    router.push('/login')
                    return
                }
                setUserId(user.id)

                if (editId) {
                    // Load existing bio page
                    const res = await fetch(`/api/bio-pages?id=${editId}`)
                    if (res.ok) {
                        const { bioPage: existingPage } = await res.json()
                        if (existingPage) {
                            setBioPage({
                                id: existingPage.id,
                                username: existingPage.username || '',
                                title: existingPage.title || '',
                                description: existingPage.description || '',
                                avatar_url: existingPage.avatar_url || '',
                                theme: existingPage.theme || 'default',
                                theme_config: existingPage.theme_config || {},
                                social_links: existingPage.social_links || {},
                                seo_title: existingPage.seo_title || '',
                                seo_description: existingPage.seo_description || '',
                                show_branding: existingPage.show_branding !== false,
                                is_active: existingPage.is_active !== false,
                            })
                            setLinks(existingPage.bio_links || [])
                            setUsernameAvailable(true)
                        }
                    }
                }
                setLoading(false)
            } catch (err) {
                console.error('Auth check failed:', err)
                router.push('/login')
            }
        }
        checkUser()
    }, [router, editId])

    // Check username availability
    const checkUsername = useCallback(async (username: string) => {
        if (!username || username.length < 3) {
            setUsernameAvailable(null)
            return
        }

        setCheckingUsername(true)
        try {
            const res = await fetch(`/api/bio-pages?username=${username}`)
            if (res.status === 404) {
                setUsernameAvailable(true)
            } else if (res.ok) {
                const { bioPage: existing } = await res.json()
                // Available if it's our own page
                setUsernameAvailable(Boolean(editId && existing.id === editId))
            } else {
                setUsernameAvailable(false)
            }
        } catch {
            setUsernameAvailable(null)
        }
        setCheckingUsername(false)
    }, [editId])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (bioPage.username && !editId) {
                checkUsername(bioPage.username)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [bioPage.username, editId, checkUsername])

    const handleSave = async () => {
        if (!userId) return

        // Validation
        if (!bioPage.username || bioPage.username.length < 3) {
            setError('Username must be at least 3 characters')
            return
        }
        if (!bioPage.title) {
            setError('Title is required')
            return
        }
        if (usernameAvailable === false) {
            setError('Username is already taken')
            return
        }

        setSaving(true)
        setError(null)

        try {
            // Save or update bio page
            const pageRes = await fetch('/api/bio-pages', {
                method: editId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...bioPage,
                    id: editId,
                    user_id: userId,
                }),
            })

            if (!pageRes.ok) {
                const data = await pageRes.json()
                throw new Error(data.error || 'Failed to save bio page')
            }

            const { bioPage: savedPage } = await pageRes.json()

            // Save links
            if (editId) {
                // Update existing links
                for (const link of links) {
                    if (link.isDeleted && link.id) {
                        await fetch(`/api/bio-links?id=${link.id}`, { method: 'DELETE' })
                    } else if (link.isNew) {
                        await fetch('/api/bio-links', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...link,
                                bio_page_id: savedPage.id,
                            }),
                        })
                    } else if (link.id) {
                        await fetch('/api/bio-links', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(link),
                        })
                    }
                }
            } else {
                // Create all new links
                for (const link of links) {
                    if (!link.isDeleted) {
                        await fetch('/api/bio-links', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...link,
                                bio_page_id: savedPage.id,
                            }),
                        })
                    }
                }
            }

            router.push('/bio-links')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const addLink = () => {
        setEditingLink(null)
        setNewLink({
            title: '',
            url: '',
            icon: '🔗',
            icon_type: 'emoji',
            animation: 'none',
            button_style: 'default',
            is_active: true,
            order_index: links.filter(l => !l.isDeleted).length,
        })
        setLinkDialogOpen(true)
    }

    const editLink = (link: BioLink, index: number) => {
        setEditingLink({ ...link, order_index: index })
        setNewLink({ ...link })
        setLinkDialogOpen(true)
    }

    const saveLink = () => {
        if (!newLink.title || !newLink.url) return

        // Validate URL
        try {
            new URL(newLink.url)
        } catch {
            setError('Please enter a valid URL')
            return
        }

        if (editingLink !== null) {
            // Update existing
            setLinks(links.map((l, i) =>
                i === editingLink.order_index ? { ...newLink, id: l.id } : l
            ))
        } else {
            // Add new
            setLinks([...links, { ...newLink, isNew: true }])
        }

        setLinkDialogOpen(false)
        setError(null)
    }

    const deleteLink = (index: number) => {
        const link = links[index]
        if (link.id) {
            // Mark for deletion
            setLinks(links.map((l, i) => i === index ? { ...l, isDeleted: true } : l))
        } else {
            // Remove from array
            setLinks(links.filter((_, i) => i !== index))
        }
    }

    const moveLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...links]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= links.length) return

        [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]]
        // Update order_index
        newLinks.forEach((link, i) => {
            link.order_index = i
        })
        setLinks(newLinks)
    }

    const toggleLinkActive = (index: number) => {
        setLinks(links.map((l, i) =>
            i === index ? { ...l, is_active: !l.is_active } : l
        ))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const activeLinks = links.filter(l => !l.isDeleted)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/bio-links">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <span className="font-semibold">
                            {editId ? 'Edit Bio Page' : 'Create Bio Page'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {editId && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={`/b/${bioPage.username}`} target="_blank" rel="noopener noreferrer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </a>
                            </Button>
                        )}
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save</>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </TabsTrigger>
                            <TabsTrigger value="links" className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Links</span>
                            </TabsTrigger>
                            <TabsTrigger value="theme" className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                <span className="hidden sm:inline">Theme</span>
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        This is how you&apos;ll appear on your bio page
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Username */}
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                                                seolnk.com/b/
                                            </span>
                                            <div className="relative flex-1">
                                                <Input
                                                    id="username"
                                                    value={bioPage.username}
                                                    onChange={(e) => setBioPage({ ...bioPage, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                                                    className="rounded-l-none"
                                                    placeholder="username"
                                                    disabled={!!editId}
                                                />
                                                {checkingUsername && (
                                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                        {usernameAvailable === true && !editId && (
                                            <p className="text-sm text-green-600">✓ Username is available</p>
                                        )}
                                        {usernameAvailable === false && (
                                            <p className="text-sm text-destructive">✗ Username is already taken</p>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Display Name</Label>
                                        <Input
                                            id="title"
                                            value={bioPage.title}
                                            onChange={(e) => setBioPage({ ...bioPage, title: e.target.value })}
                                            placeholder="Your name or brand"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Bio</Label>
                                        <Textarea
                                            id="description"
                                            value={bioPage.description}
                                            onChange={(e) => setBioPage({ ...bioPage, description: e.target.value })}
                                            placeholder="Tell people about yourself..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Avatar */}
                                    <div className="space-y-2">
                                        <Label htmlFor="avatar">Profile Picture URL</Label>
                                        <Input
                                            id="avatar"
                                            value={bioPage.avatar_url}
                                            onChange={(e) => setBioPage({ ...bioPage, avatar_url: e.target.value })}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        {bioPage.avatar_url && (
                                            <div className="mt-2">
                                                <div className="w-20 h-20 rounded-full overflow-hidden border">
                                                    <Image
                                                        src={bioPage.avatar_url}
                                                        alt="Preview"
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Links Tab */}
                        <TabsContent value="links" className="space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Your Links</CardTitle>
                                        <CardDescription>
                                            Add links that you want to share
                                        </CardDescription>
                                    </div>
                                    <Button onClick={addLink}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Link
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {activeLinks.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No links added yet</p>
                                            <p className="text-sm">Click &quot;Add Link&quot; to get started</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {activeLinks.map((link, index) => (
                                                <div
                                                    key={link.id || index}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border bg-card ${!link.is_active ? 'opacity-50' : ''}`}
                                                >
                                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                                    <span className="text-xl">{link.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">{link.title}</p>
                                                        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => moveLink(index, 'up')}
                                                            disabled={index === 0}
                                                        >
                                                            <ChevronUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => moveLink(index, 'down')}
                                                            disabled={index === activeLinks.length - 1}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                        <Switch
                                                            checked={link.is_active}
                                                            onCheckedChange={() => toggleLinkActive(index)}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => editLink(link, index)}
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteLink(index)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Theme Tab */}
                        <TabsContent value="theme" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Choose a Theme</CardTitle>
                                    <CardDescription>
                                        Select a theme for your bio page
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setBioPage({ ...bioPage, theme: theme.id })}
                                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${bioPage.theme === theme.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {/* Theme Preview */}
                                                <div className={`w-full aspect-[3/4] rounded-lg mb-3 ${getThemePreviewClass(theme.id)}`}>
                                                    <div className="p-2">
                                                        <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2" />
                                                        <div className="w-full h-2 rounded bg-white/20 mb-1" />
                                                        <div className="w-full h-2 rounded bg-white/20 mb-1" />
                                                        <div className="w-full h-2 rounded bg-white/20" />
                                                    </div>
                                                </div>
                                                <p className="font-medium text-sm">{theme.name}</p>
                                                <p className="text-xs text-muted-foreground">{theme.description}</p>
                                                {bioPage.theme === theme.id && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                        <span className="text-white text-xs">✓</span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Settings</CardTitle>
                                    <CardDescription>
                                        Optimize your page for search engines
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="seo_title">SEO Title</Label>
                                        <Input
                                            id="seo_title"
                                            value={bioPage.seo_title}
                                            onChange={(e) => setBioPage({ ...bioPage, seo_title: e.target.value })}
                                            placeholder={bioPage.title || 'Page title for search engines'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="seo_description">SEO Description</Label>
                                        <Textarea
                                            id="seo_description"
                                            value={bioPage.seo_description}
                                            onChange={(e) => setBioPage({ ...bioPage, seo_description: e.target.value })}
                                            placeholder={bioPage.description || 'Description for search engines'}
                                            rows={2}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Page Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Page Active</p>
                                            <p className="text-sm text-muted-foreground">Make your page visible to visitors</p>
                                        </div>
                                        <Switch
                                            checked={bioPage.is_active}
                                            onCheckedChange={(checked) => setBioPage({ ...bioPage, is_active: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Show SEOLnk Branding</p>
                                            <p className="text-sm text-muted-foreground">&quot;Powered by SEOLnk&quot; footer</p>
                                        </div>
                                        <Switch
                                            checked={bioPage.show_branding}
                                            onCheckedChange={(checked) => setBioPage({ ...bioPage, show_branding: checked })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Add/Edit Link Dialog */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
                        <DialogDescription>
                            Add a link to your bio page
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="link_title">Title</Label>
                            <Input
                                id="link_title"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                placeholder="My Website"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link_url">URL</Label>
                            <Input
                                id="link_url"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <div className="flex flex-wrap gap-2">
                                {emojiIcons.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setNewLink({ ...newLink, icon: emoji })}
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xl transition-all ${newLink.icon === emoji
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Animation</Label>
                            <Select
                                value={newLink.animation}
                                onValueChange={(value) => setNewLink({ ...newLink, animation: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {animations.map((anim) => (
                                        <SelectItem key={anim.id} value={anim.id}>
                                            {anim.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveLink} disabled={!newLink.title || !newLink.url}>
                            {editingLink ? 'Update' : 'Add'} Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function getThemePreviewClass(themeId: string): string {
    const classes: Record<string, string> = {
        default: 'bg-gradient-to-br from-slate-100 to-slate-200',
        dark: 'bg-gradient-to-br from-zinc-800 to-black',
        gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
        glassmorphism: 'bg-gradient-to-br from-slate-700 via-purple-800 to-slate-700',
        neon: 'bg-black border border-cyan-500/50',
        minimal: 'bg-white border border-black',
        sunset: 'bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600',
        ocean: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
    }
    return classes[themeId] || classes.default
}

export default function CreateBioPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <CreateBioContent />
        </Suspense>
    )
}
