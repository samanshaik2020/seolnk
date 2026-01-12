'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    Loader2, Plus, Copy, Check, Trash2, Edit, BarChart3,
    ExternalLink, User, Eye, Link as LinkIcon,
    Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

interface BioPage {
    id: string
    username: string
    title: string
    description: string | null
    avatar_url: string | null
    theme: string
    views: number
    is_active: boolean
    created_at: string
}

export default function BioLinksPage() {
    const [loading, setLoading] = useState(true)
    const [bioPages, setBioPages] = useState<BioPage[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) {
                    router.push('/login')
                    return
                }
                setUserId(user.id)
                fetchBioPages(user.id)
            } catch (err) {
                console.error('Auth check failed:', err)
                router.push('/login')
            }
        }
        checkUser()
    }, [router])

    const fetchBioPages = async (uid: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/bio-pages?user_id=${uid}`)
            const { bioPages: pages } = await res.json()
            setBioPages(pages || [])
        } catch (err) {
            console.error('Failed to fetch bio pages:', err)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDelete = async () => {
        if (!deleteId || !userId) return

        try {
            await fetch(`/api/bio-pages?id=${deleteId}&user_id=${userId}`, {
                method: 'DELETE'
            })
            setBioPages(bioPages.filter(p => p.id !== deleteId))
        } catch (err) {
            console.error('Failed to delete:', err)
        }
        setDeleteId(null)
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
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
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

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bio Links</h1>
                            <p className="text-muted-foreground">Create your link-in-bio page</p>
                        </div>
                        <Button asChild>
                            <Link href="/create/bio">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Bio Page
                            </Link>
                        </Button>
                    </div>

                    {/* Bio Pages List */}
                    {bioPages.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No Bio Pages Yet</h3>
                                <p className="text-muted-foreground text-center max-w-sm mb-6">
                                    Create your first link-in-bio page to share all your links in one place.
                                </p>
                                <Button asChild>
                                    <Link href="/create/bio">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Bio Page
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {bioPages.map((page) => (
                                <Card key={page.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="shrink-0">
                                                {page.avatar_url ? (
                                                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-border">
                                                        <Image
                                                            src={page.avatar_url}
                                                            alt={page.title}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover w-full h-full"
                                                            unoptimized
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                                                        <User className="w-6 h-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg truncate">{page.title}</CardTitle>
                                                <CardDescription className="truncate">
                                                    seolnk.com/b/{page.username}
                                                </CardDescription>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${page.is_active
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-gray-500/10 text-gray-600'
                                                }`}>
                                                {page.is_active ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {page.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {page.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{page.views || 0} views</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                                                    {page.theme}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => copyToClipboard(`${window.location.origin}/b/${page.username}`, page.id)}
                                            >
                                                {copiedId === page.id ? (
                                                    <><Check className="mr-2 h-4 w-4" /> Copied</>
                                                ) : (
                                                    <><Copy className="mr-2 h-4 w-4" /> Copy</>
                                                )}
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <a href={`/b/${page.username}`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/create/bio?edit=${page.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/analytics/bio/${page.id}`}>
                                                    <BarChart3 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteId(page.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Quick Link Back */}
                    <div className="mt-8 text-center">
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard">← Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Bio Page?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your bio page, all its links, and analytics data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
