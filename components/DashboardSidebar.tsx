'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link as LinkIcon, Repeat, Clock, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
    {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Link Previews',
        href: '/dashboard?tab=links',
        icon: LinkIcon,
        description: 'Custom social previews'
    },
    {
        title: 'URL Rotator',
        href: '/dashboard?tab=rotators',
        icon: Repeat,
        description: 'A/B test destinations'
    },
    {
        title: 'Link Expiration',
        href: '/dashboard?tab=expiring',
        icon: Clock,
        description: 'Time-limited links'
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-64 border-r bg-muted/20 min-h-[calc(100vh-64px)]">
            <div className="p-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                    Link Tools
                </h2>
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href.includes('?') && pathname === '/dashboard' &&
                                typeof window !== 'undefined' && window.location.search.includes(item.href.split('?')[1]))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <div className="flex-1">
                                    <div>{item.title}</div>
                                    {item.description && (
                                        <div className="text-xs text-muted-foreground/80 font-normal">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
