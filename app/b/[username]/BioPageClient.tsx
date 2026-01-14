'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, ExternalLink, Link as LinkIcon, Share2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BioLink {
    id: string
    title: string
    url: string
    icon: string | null
    icon_type: string
    thumbnail_url: string | null
    animation: string
    button_style: string
    is_active: boolean
    order_index: number
    clicks: number
}

interface BioPage {
    id: string
    username: string
    title: string
    description: string | null
    avatar_url: string | null
    theme: string
    theme_config: Record<string, string>
    social_links: Record<string, string>
    show_branding: boolean
    bio_links: BioLink[]
}

interface ThemeStyles {
    background: string
    cardBg: string
    textPrimary: string
    textSecondary: string
    buttonBg: string
    buttonText: string
    buttonBorder: string
    buttonHover: string
    accent: string
}

const themes: Record<string, ThemeStyles> = {
    default: {
        background: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
        cardBg: 'bg-white/80 dark:bg-slate-800/80',
        textPrimary: 'text-slate-900 dark:text-white',
        textSecondary: 'text-slate-600 dark:text-slate-300',
        buttonBg: 'bg-white dark:bg-slate-700',
        buttonText: 'text-slate-900 dark:text-white',
        buttonBorder: 'border-slate-200 dark:border-slate-600',
        buttonHover: 'hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-[1.02]',
        accent: 'bg-blue-500'
    },
    dark: {
        background: 'bg-gradient-to-br from-zinc-900 via-black to-zinc-900',
        cardBg: 'bg-zinc-900/50',
        textPrimary: 'text-white',
        textSecondary: 'text-zinc-400',
        buttonBg: 'bg-zinc-800',
        buttonText: 'text-white',
        buttonBorder: 'border-zinc-700',
        buttonHover: 'hover:bg-zinc-700 hover:scale-[1.02]',
        accent: 'bg-white'
    },
    minimal: {
        background: 'bg-white dark:bg-black',
        cardBg: 'bg-transparent',
        textPrimary: 'text-black dark:text-white',
        textSecondary: 'text-gray-500 dark:text-gray-400',
        buttonBg: 'bg-transparent',
        buttonText: 'text-black dark:text-white',
        buttonBorder: 'border-black dark:border-white',
        buttonHover: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-[1.02]',
        accent: 'bg-black dark:bg-white'
    },
    gradient: {
        background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
        cardBg: 'bg-white/10 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/20 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-white/30',
        buttonHover: 'hover:bg-white/30 hover:scale-[1.02]',
        accent: 'bg-white'
    },
    sunset: {
        background: 'bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600',
        cardBg: 'bg-white/10 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/20 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-white/30',
        buttonHover: 'hover:bg-white/30 hover:scale-[1.02]',
        accent: 'bg-white'
    },
    ocean: {
        background: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
        cardBg: 'bg-white/10 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/20 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-white/30',
        buttonHover: 'hover:bg-white/30 hover:scale-[1.02]',
        accent: 'bg-white'
    },
    forest: {
        background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
        cardBg: 'bg-white/10 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/20 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-white/30',
        buttonHover: 'hover:bg-white/30 hover:scale-[1.02]',
        accent: 'bg-emerald-300'
    },
    lavender: {
        background: 'bg-gradient-to-br from-purple-300 via-violet-400 to-purple-500',
        cardBg: 'bg-white/20 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/25 backdrop-blur-sm',
        buttonText: 'text-purple-900',
        buttonBorder: 'border-white/40',
        buttonHover: 'hover:bg-white/40 hover:scale-[1.02]',
        accent: 'bg-purple-200'
    },
    candy: {
        background: 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500',
        cardBg: 'bg-white/20 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/25 backdrop-blur-sm',
        buttonText: 'text-pink-900',
        buttonBorder: 'border-white/40',
        buttonHover: 'hover:bg-white/40 hover:scale-[1.02]',
        accent: 'bg-pink-200'
    },
    aurora: {
        background: 'bg-gradient-to-br from-green-400 via-cyan-500 to-purple-600',
        cardBg: 'bg-white/10 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-white/80',
        buttonBg: 'bg-white/15 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-white/30',
        buttonHover: 'hover:bg-white/25 hover:scale-[1.02]',
        accent: 'bg-cyan-300'
    },
    glassmorphism: {
        background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        cardBg: 'bg-white/5 backdrop-blur-xl border border-white/10',
        textPrimary: 'text-white',
        textSecondary: 'text-white/70',
        buttonBg: 'bg-white/10 backdrop-blur-md',
        buttonText: 'text-white',
        buttonBorder: 'border-white/20',
        buttonHover: 'hover:bg-white/20 hover:scale-[1.02] hover:border-white/40',
        accent: 'bg-gradient-to-r from-blue-400 to-purple-400'
    },
    neon: {
        background: 'bg-black',
        cardBg: 'bg-zinc-950',
        textPrimary: 'text-white',
        textSecondary: 'text-zinc-400',
        buttonBg: 'bg-zinc-900',
        buttonText: 'text-cyan-400',
        buttonBorder: 'border-cyan-500/50',
        buttonHover: 'hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02]',
        accent: 'bg-cyan-400'
    },
    midnight: {
        background: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
        cardBg: 'bg-blue-950/50 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-blue-200/80',
        buttonBg: 'bg-blue-800/50 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-blue-400/30',
        buttonHover: 'hover:bg-blue-700/50 hover:scale-[1.02]',
        accent: 'bg-blue-400'
    },
    emerald: {
        background: 'bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-800',
        cardBg: 'bg-white/10 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-emerald-100/80',
        buttonBg: 'bg-white/15 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-emerald-300/30',
        buttonHover: 'hover:bg-white/25 hover:scale-[1.02]',
        accent: 'bg-emerald-300'
    },
    coral: {
        background: 'bg-gradient-to-br from-orange-300 via-rose-400 to-pink-400',
        cardBg: 'bg-white/25 backdrop-blur-lg',
        textPrimary: 'text-rose-900',
        textSecondary: 'text-rose-800/80',
        buttonBg: 'bg-white/40 backdrop-blur-sm',
        buttonText: 'text-rose-900',
        buttonBorder: 'border-rose-300/50',
        buttonHover: 'hover:bg-white/60 hover:scale-[1.02]',
        accent: 'bg-rose-500'
    },
    arctic: {
        background: 'bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-300',
        cardBg: 'bg-white/60 backdrop-blur-lg',
        textPrimary: 'text-slate-800',
        textSecondary: 'text-slate-600',
        buttonBg: 'bg-white/80 backdrop-blur-sm',
        buttonText: 'text-slate-800',
        buttonBorder: 'border-blue-300/50',
        buttonHover: 'hover:bg-white hover:scale-[1.02]',
        accent: 'bg-blue-500'
    },
    autumn: {
        background: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
        cardBg: 'bg-white/15 backdrop-blur-lg',
        textPrimary: 'text-white',
        textSecondary: 'text-amber-100/80',
        buttonBg: 'bg-white/20 backdrop-blur-sm',
        buttonText: 'text-white',
        buttonBorder: 'border-amber-200/30',
        buttonHover: 'hover:bg-white/30 hover:scale-[1.02]',
        accent: 'bg-amber-300'
    },
}

const animations: Record<string, string> = {
    none: '',
    pulse: 'animate-pulse',
    bounce: 'hover:animate-bounce',
    shake: 'hover:animate-[shake_0.5s_ease-in-out]',
    glow: 'hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-shadow duration-300',
    slide: 'hover:-translate-y-1 transition-transform duration-200',
    wiggle: 'hover:animate-[wiggle_0.3s_ease-in-out]',
    heartbeat: 'hover:animate-[heartbeat_0.5s_ease-in-out]',
}

export default function BioPageClient({ username }: { username: string }) {
    const [bioPage, setBioPage] = useState<BioPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchBioPage = async () => {
            try {
                const res = await fetch(`/api/bio-pages?username=${username}`)
                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Bio page not found')
                }
                const { bioPage } = await res.json()
                setBioPage(bioPage)

                // Track page view
                fetch('/api/bio-analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'page_view',
                        bio_page_id: bioPage.id,
                        referrer: document.referrer,
                        user_agent: navigator.userAgent
                    })
                }).catch(console.error)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load bio page')
            } finally {
                setLoading(false)
            }
        }

        fetchBioPage()
    }, [username])

    const handleLinkClick = async (link: BioLink) => {
        // Track click
        try {
            await fetch('/api/bio-analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'link_click',
                    link_id: link.id,
                    bio_page_id: bioPage?.id,
                    referrer: document.referrer,
                    user_agent: navigator.userAgent
                })
            })
        } catch (err) {
            console.error('Failed to track click:', err)
        }

        // Open link
        window.open(link.url, '_blank', 'noopener,noreferrer')
    }

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({
                    title: bioPage?.title,
                    url
                })
            } catch {
                // User cancelled share
            }
        } else {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !bioPage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
                    <p className="text-slate-600 mb-6">The bio page @{username} doesn&apos;t exist or has been removed.</p>
                    <Button asChild>
                        <a href="/">Create Your Own Bio Page</a>
                    </Button>
                </div>
            </div>
        )
    }

    const theme = themes[bioPage.theme] || themes.default

    return (
        <div className={`min-h-screen ${theme.background} py-8 px-4`}>
            <div className="max-w-lg mx-auto">
                {/* Share Button */}
                <div className="flex justify-end mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className={`${theme.textSecondary} hover:bg-white/10 rounded-full`}
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                    {copied && (
                        <span className={`absolute top-2 right-16 ${theme.textPrimary} text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm`}>
                            Link copied!
                        </span>
                    )}
                </div>

                {/* Profile Section */}
                <div className="text-center mb-8">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                        {bioPage.avatar_url ? (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
                                <Image
                                    src={bioPage.avatar_url}
                                    alt={bioPage.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className={`w-24 h-24 rounded-full ${theme.buttonBg} flex items-center justify-center ring-4 ring-white/20 shadow-xl`}>
                                <User className={`w-12 h-12 ${theme.textSecondary}`} />
                            </div>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <h1 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>
                        {bioPage.title}
                    </h1>
                    {bioPage.description && (
                        <p className={`${theme.textSecondary} max-w-sm mx-auto leading-relaxed`}>
                            {bioPage.description}
                        </p>
                    )}

                    {/* Social Links */}
                    {bioPage.social_links && Object.keys(bioPage.social_links).length > 0 && (
                        <div className="flex justify-center gap-3 mt-4">
                            {Object.entries(bioPage.social_links).map(([platform, url]) => (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-full ${theme.buttonBg} ${theme.buttonBorder} border flex items-center justify-center ${theme.buttonHover} transition-all`}
                                >
                                    <span className="text-lg">{getSocialIcon(platform)}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {bioPage.bio_links?.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleLinkClick(link)}
                            className={`
                                w-full p-4 rounded-xl border transition-all duration-200
                                ${theme.buttonBg} ${theme.buttonBorder} ${theme.buttonText} ${theme.buttonHover}
                                ${animations[link.animation] || ''}
                                flex items-center justify-between gap-3 group
                                shadow-sm hover:shadow-md
                            `}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {link.icon && (
                                    <span className="text-xl shrink-0">{link.icon}</span>
                                )}
                                {link.thumbnail_url && (
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                            src={link.thumbnail_url}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <span className="font-medium truncate">{link.title}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                {(!bioPage.bio_links || bioPage.bio_links.length === 0) && (
                    <div className={`text-center py-12 ${theme.textSecondary}`}>
                        <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No links added yet</p>
                    </div>
                )}

                {/* Branding */}
                {bioPage.show_branding && (
                    <div className="mt-12 text-center">
                        <a
                            href="/"
                            className={`inline-flex items-center gap-2 ${theme.textSecondary} opacity-60 hover:opacity-100 transition-opacity text-sm`}
                        >
                            <LinkIcon className="w-4 h-4" />
                            <span>Powered by SEOLnk</span>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

function getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
        instagram: '📸',
        youtube: '▶️',
        twitter: '🐦',
        x: '𝕏',
        facebook: '📘',
        linkedin: '💼',
        tiktok: '🎵',
        github: '💻',
        whatsapp: '💬',
        telegram: '✈️',
        email: '📧',
        website: '🌐',
        spotify: '🎧',
        discord: '🎮',
        twitch: '📺',
        pinterest: '📌',
        snapchat: '👻'
    }
    return icons[platform.toLowerCase()] || '🔗'
}
