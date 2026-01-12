'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, BarChart3, Copy, Check, Plus, Trash2, Edit, Link as LinkIcon, Repeat, Clock, LayoutDashboard, Menu, X, Lock, Zap, FolderOpen, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import AuthButton from '@/components/AuthButton'
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


interface CardData {
    id: string
    created_at: string
    user_id: string
    slug: string
    title: string
    description: string
    image_url: string
    original_url: string
    image_width: number
    image_height: number
}

interface RotatorData {
    id: string
    created_at: string
    user_id: string
    slug: string
    title: string
}

interface ExpiringLinkData {
    id: string
    created_at: string
    user_id: string
    slug: string
    title: string
    original_url: string
    expires_at: string
    is_active: boolean
}

interface ProtectedLinkData {
    id: string
    created_at: string
    user_id: string
    slug: string
    title: string
    original_url: string
    is_active: boolean
}

interface CustomAliasData {
    id: string
    created_at: string
    user_id: string
    alias: string
    title: string
    original_url: string
    is_active: boolean
    is_locked: boolean
    click_count: number
    expires_at: string | null
}

// Sidebar navigation items
const sidebarItems = [
    {
        title: 'Link Render',
        value: 'links',
        icon: LinkIcon,
        description: 'Custom social previews',
        href: '/create/preview'
    },
    {
        title: 'URL Rotator',
        value: 'rotators',
        icon: Repeat,
        description: 'A/B test destinations',
        href: '/create/rotator'
    },
    {
        title: 'Link Expiration',
        value: 'expiring',
        icon: Clock,
        description: 'Time-limited links',
        href: '/create/expiring'
    },
    {
        title: 'Password Protection',
        value: 'protected',
        icon: Lock,
        description: 'Secure links',
        href: '/create/protected'
    },
    {
        title: 'Custom Alias',
        value: 'aliases',
        icon: Zap,
        description: 'Branded short links',
        href: '/create/alias'
    },
]

function DashboardContent() {

    const [loading, setLoading] = useState(true)
    const [cards, setCards] = useState<CardData[]>([])
    const [rotators, setRotators] = useState<RotatorData[]>([])
    const [expiringLinks, setExpiringLinks] = useState<ExpiringLinkData[]>([])
    const [protectedLinks, setProtectedLinks] = useState<ProtectedLinkData[]>([])
    const [customAliases, setCustomAliases] = useState<CustomAliasData[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const tab = searchParams.get('tab') || 'links'
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteType, setDeleteType] = useState<'card' | 'rotator' | 'expiring' | 'protected' | 'alias' | null>(null)

    const fetchData = async (userId: string) => {
        setLoading(true)

        // Fetch Cards
        const { data: cardsData } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (cardsData) setCards(cardsData)

        // Fetch Rotators
        const { data: rotatorsData } = await supabase
            .from('rotators')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (rotatorsData) setRotators(rotatorsData)

        // Fetch Expiring Links
        const { data: expiringData } = await supabase
            .from('expiring_links')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (expiringData) setExpiringLinks(expiringData)

        // Fetch Protected Links
        const { data: protectedData } = await supabase
            .from('password_protected_links')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (protectedData) setProtectedLinks(protectedData)

        // Fetch Custom Aliases
        const { data: aliasData } = await supabase
            .from('custom_aliases')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (aliasData) setCustomAliases(aliasData)

        setLoading(false)
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) {
                    router.push('/login')
                    return
                }

                fetchData(user.id)
            } catch (err) {
                console.error('Auth check failed:', err)
                router.push('/login')
            }
        }
        checkUser()
    }, [router])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const confirmDelete = (id: string, type: 'card' | 'rotator' | 'expiring' | 'protected' | 'alias') => {
        setDeleteId(id)
        setDeleteType(type)
    }

    const handleDelete = async () => {
        if (!deleteId || !deleteType) return

        if (deleteType === 'card') {
            await supabase.from('cards').delete().eq('id', deleteId)
            setCards(cards.filter(c => c.id !== deleteId))
        } else if (deleteType === 'rotator') {
            await supabase.from('rotators').delete().eq('id', deleteId)
            setRotators(rotators.filter(r => r.id !== deleteId))
        } else if (deleteType === 'expiring') {
            await supabase.from('expiring_links').delete().eq('id', deleteId)
            setExpiringLinks(expiringLinks.filter(e => e.id !== deleteId))
        } else if (deleteType === 'protected') {
            await supabase.from('password_protected_links').delete().eq('id', deleteId)
            setProtectedLinks(protectedLinks.filter(p => p.id !== deleteId))
        } else if (deleteType === 'alias') {
            await supabase.from('custom_aliases').delete().eq('id', deleteId)
            setCustomAliases(customAliases.filter(a => a.id !== deleteId))
        }
        setDeleteId(null)
        setDeleteType(null)
    }

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const currentTab = sidebarItems.find(item => item.value === tab) || sidebarItems[0]

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                                <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <span className="font-bold text-lg sm:text-xl tracking-tight font-serif">SEOLnk</span>
                        </Link>
                    </div>
                    <AuthButton />
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    fixed md:sticky top-14 sm:top-16 left-0 z-40
                    w-64 border-r bg-background md:bg-muted/20 
                    min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)]
                    transition-transform duration-200 ease-in-out
                `}>
                    <div className="p-4">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                            Link Tools
                        </h2>
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = tab === item.value

                                return (
                                    <Link
                                        key={item.value}
                                        href={`/dashboard?tab=${item.value}`}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                            ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            }
                                        `}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <div className="flex-1">
                                            <div>{item.title}</div>
                                            <div className="text-xs text-muted-foreground/80 font-normal">
                                                {item.description}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Campaigns Section */}
                        <div className="mt-6 pt-6 border-t">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                                Organization
                            </h2>
                            <Link
                                href="/campaigns"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            >
                                <FolderOpen className="h-4 w-4" />
                                <div className="flex-1">
                                    <div>Campaigns</div>
                                    <div className="text-xs text-muted-foreground/80 font-normal">
                                        Organize links into folders
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Bio Links Section */}
                        <div className="mt-6 pt-6 border-t">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                                Link-in-Bio
                            </h2>
                            <Link
                                href="/bio-links"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            >
                                <User className="h-4 w-4" />
                                <div className="flex-1">
                                    <div>Bio Links</div>
                                    <div className="text-xs text-muted-foreground/80 font-normal">
                                        Your link-in-bio pages
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentTab.title}</h1>
                                <p className="text-sm sm:text-base text-muted-foreground">{currentTab.description}</p>
                            </div>
                            <Button asChild className="w-full sm:w-auto">
                                <Link href={currentTab.href}>
                                    <Plus className="mr-2 h-4 w-4" /> New {currentTab.title.split(' ')[0]}
                                </Link>
                            </Button>
                        </div>

                        {/* Links Tab Content */}
                        {tab === 'links' && (
                            <div className="space-y-4">
                                {cards.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                                        <p className="text-muted-foreground mb-4">You haven&apos;t created any preview links yet.</p>
                                        <Button asChild>
                                            <Link href="/create/preview">Create Your First Link</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {cards.map(card => (
                                            <Card key={card.id} className="overflow-hidden flex flex-col h-full">
                                                <div className="relative aspect-[1.91/1] w-full bg-muted">
                                                    {card.image_url ? (
                                                        <Image
                                                            src={card.image_url}
                                                            alt={card.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/50">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <CardContent className="p-4 flex-1 flex flex-col gap-3">
                                                    <div className="space-y-1">
                                                        <div className="text-xs uppercase text-muted-foreground font-semibold truncate">
                                                            {new URL(card.original_url).hostname}
                                                        </div>
                                                        <h3 className="text-base font-bold leading-tight line-clamp-1" title={card.title}>
                                                            {card.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2" title={card.description}>
                                                            {card.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-auto">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => copyToClipboard(`${window.location.origin}/p/${card.slug}`, card.id)}
                                                        >
                                                            {copiedId === card.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                            {copiedId === card.id ? 'Copied' : 'Copy'}
                                                        </Button>
                                                        <Button variant="outline" size="icon" asChild>
                                                            <Link href={`/create/preview?edit=${card.id}`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="outline" size="icon" asChild>
                                                            <Link href={`/analytics/preview/${card.slug}`}>
                                                                <BarChart3 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(card.id, 'card')} className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Rotators Tab Content */}
                        {tab === 'rotators' && (
                            <div className="space-y-4">
                                {rotators.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                                        <p className="text-muted-foreground mb-4">You haven&apos;t created any rotator links yet.</p>
                                        <Button asChild>
                                            <Link href="/create/rotator">Create Your First Rotator</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {rotators.map(rotator => (
                                            <Card key={rotator.id}>
                                                <CardHeader>
                                                    <CardTitle className="truncate text-lg">{rotator.title || 'Untitled Rotator'}</CardTitle>
                                                    <CardDescription>Slug: {rotator.slug}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => copyToClipboard(`${window.location.origin}/r/${rotator.slug}`, rotator.id)}
                                                            >
                                                                {copiedId === rotator.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                                {copiedId === rotator.id ? 'Copied' : 'Copy'}
                                                            </Button>
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link href={`/create/rotator?edit=${rotator.id}`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link href={`/analytics/rotator/${rotator.slug}`}>
                                                                    <BarChart3 className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(rotator.id, 'rotator')} className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Expiring Links Tab Content */}
                        {tab === 'expiring' && (
                            <div className="space-y-4">
                                {expiringLinks.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                                        <p className="text-muted-foreground mb-4">You haven&apos;t created any expiring links yet.</p>
                                        <Button asChild>
                                            <Link href="/create/expiring">Create Your First Expiring Link</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {expiringLinks.map(link => (
                                            <Card key={link.id} className={isExpired(link.expires_at) ? 'opacity-60' : ''}>
                                                <CardHeader>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <CardTitle className="truncate text-lg">{link.title || 'Untitled Link'}</CardTitle>
                                                            <CardDescription className="truncate">
                                                                {new URL(link.original_url).hostname}
                                                            </CardDescription>
                                                        </div>
                                                        <div className={`
                                                            px-2 py-1 rounded-full text-xs font-medium shrink-0
                                                            ${isExpired(link.expires_at)
                                                                ? 'bg-destructive/10 text-destructive'
                                                                : 'bg-green-500/10 text-green-600'
                                                            }
                                                        `}>
                                                            {isExpired(link.expires_at) ? 'Expired' : 'Active'}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            <span>
                                                                {isExpired(link.expires_at) ? 'Expired' : 'Expires'}: {new Date(link.expires_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => copyToClipboard(`${window.location.origin}/e/${link.slug}`, link.id)}
                                                                disabled={isExpired(link.expires_at)}
                                                            >
                                                                {copiedId === link.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                                {copiedId === link.id ? 'Copied' : 'Copy'}
                                                            </Button>
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link href={`/create/expiring?edit=${link.id}`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(link.id, 'expiring')} className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Protected Links Tab Content */}
                        {tab === 'protected' && (
                            <div className="space-y-4">
                                {protectedLinks.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                                        <p className="text-muted-foreground mb-4">You haven&apos;t created any protected links yet.</p>
                                        <Button asChild>
                                            <Link href="/create/protected">Create Your First Protected Link</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {protectedLinks.map(link => (
                                            <Card key={link.id}>
                                                <CardHeader>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <CardTitle className="truncate text-lg flex items-center gap-2">
                                                                <Lock className="h-4 w-4 text-primary shrink-0" />
                                                                {link.title || 'Untitled Link'}
                                                            </CardTitle>
                                                            <CardDescription className="truncate">
                                                                {new URL(link.original_url).hostname}
                                                            </CardDescription>
                                                        </div>
                                                        <div className="px-2 py-1 rounded-full text-xs font-medium shrink-0 bg-blue-500/10 text-blue-600">
                                                            Protected
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => copyToClipboard(`${window.location.origin}/s/${link.slug}`, link.id)}
                                                            >
                                                                {copiedId === link.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                                {copiedId === link.id ? 'Copied' : 'Copy'}
                                                            </Button>
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link href={`/create/protected?edit=${link.id}`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link href={`/analytics/protected/${link.slug}`}>
                                                                    <BarChart3 className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(link.id, 'protected')} className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Custom Aliases Tab Content */}
                        {tab === 'aliases' && (
                            <div className="space-y-4">
                                {customAliases.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                                        <p className="text-muted-foreground mb-4">You haven&apos;t created any custom aliases yet.</p>
                                        <Button asChild>
                                            <Link href="/create/alias">Create Your First Alias</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {customAliases.map(alias => (
                                            <Card key={alias.id}>
                                                <CardHeader>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <CardTitle className="truncate text-lg flex items-center gap-2">
                                                                <Zap className="h-4 w-4 text-primary shrink-0" />
                                                                /{alias.alias}
                                                            </CardTitle>
                                                            <CardDescription className="truncate">
                                                                {alias.title || new URL(alias.original_url).hostname}
                                                            </CardDescription>
                                                        </div>
                                                        <div className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${alias.is_locked ? 'bg-yellow-500/10 text-yellow-600' : 'bg-green-500/10 text-green-600'
                                                            }`}>
                                                            {alias.is_locked ? '🔒 Locked' : 'Active'}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                            <span>Clicks</span>
                                                            <span className="font-bold text-foreground">{alias.click_count || 0}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => copyToClipboard(`${window.location.origin}/a/${alias.alias}`, alias.id)}
                                                            >
                                                                {copiedId === alias.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                                {copiedId === alias.id ? 'Copied' : 'Copy'}
                                                            </Button>
                                                            {!alias.is_locked && (
                                                                <Button variant="outline" size="icon" asChild>
                                                                    <Link href={`/create/alias?edit=${alias.id}`}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link href={`/analytics/alias/${alias.alias}`}>
                                                                    <BarChart3 className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(alias.id, 'alias')} className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>


            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            {deleteType === 'card' ? ' preview link' : deleteType === 'rotator' ? ' rotator link' : deleteType === 'expiring' ? ' expiring link' : deleteType === 'protected' ? ' protected link' : ' custom alias'} and remove it from our servers.
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
        </div >
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <DashboardContent />
        </Suspense>
    )
}
