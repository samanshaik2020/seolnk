'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, BarChart3, Copy, Check, Plus, Trash2, Edit, Link as LinkIcon } from 'lucide-react'
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

function DashboardContent() {

    const [loading, setLoading] = useState(true)
    const [cards, setCards] = useState<CardData[]>([])
    const [rotators, setRotators] = useState<RotatorData[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const tab = searchParams.get('tab')
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteType, setDeleteType] = useState<'card' | 'rotator' | null>(null)

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

    const confirmDelete = (id: string, type: 'card' | 'rotator') => {
        setDeleteId(id)
        setDeleteType(type)
    }

    const handleDelete = async () => {
        if (!deleteId || !deleteType) return

        if (deleteType === 'card') {
            await supabase.from('cards').delete().eq('id', deleteId)
            setCards(cards.filter(c => c.id !== deleteId))
        } else {
            await supabase.from('rotators').delete().eq('id', deleteId)
            setRotators(rotators.filter(r => r.id !== deleteId))
        }
        setDeleteId(null)
        setDeleteType(null)
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
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-8 w-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                            <LinkIcon className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight font-serif">SEOLnk</span>
                    </Link>
                    <AuthButton />
                </div>
            </header>
            <div className="p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">Manage your links and view analytics.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href="/create/preview">
                                    <Plus className="mr-2 h-4 w-4" /> New Link
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/create/rotator">
                                    <Plus className="mr-2 h-4 w-4" /> New Rotator
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue={tab === 'rotators' ? 'rotators' : 'links'} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="links">Preview Links ({cards.length})</TabsTrigger>
                            <TabsTrigger value="rotators">Rotator Links ({rotators.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="links" className="space-y-4">
                            {cards.length === 0 ? (
                                <div className="text-center py-12 border rounded-lg bg-muted/10">
                                    <p className="text-muted-foreground mb-4">You haven&apos;t created any preview links yet.</p>
                                    <Button asChild>
                                        <Link href="/create/preview">Create Your First Link</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

                                                <div className="flex gap-2 mt-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => copyToClipboard(`${window.location.origin}/p/${card.slug}`, card.id)}
                                                    >
                                                        {copiedId === card.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                        {copiedId === card.id ? 'Copied' : 'Copy Link'}
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
                                                    <Button variant="ghost" size="sm" onClick={() => confirmDelete(card.id, 'card')} className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="rotators" className="space-y-4">
                            {rotators.length === 0 ? (
                                <div className="text-center py-12 border rounded-lg bg-muted/10">
                                    <p className="text-muted-foreground mb-4">You haven&apos;t created any rotator links yet.</p>
                                    <Button asChild>
                                        <Link href="/create/rotator">Create Your First Rotator</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {rotators.map(rotator => (
                                        <Card key={rotator.id}>
                                            <CardHeader>
                                                <CardTitle className="truncate text-lg">{rotator.title || 'Untitled Rotator'}</CardTitle>
                                                <CardDescription>Slug: {rotator.slug}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => copyToClipboard(`${window.location.origin}/r/${rotator.slug}`, rotator.id)}
                                                        >
                                                            {copiedId === rotator.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                            {copiedId === rotator.id ? 'Copied' : 'Copy Link'}
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
                                                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(rotator.id, 'rotator')} className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>


            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            {deleteType === 'card' ? ' preview link' : ' rotator link'} and remove it from our servers.
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
