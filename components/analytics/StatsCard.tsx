import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: LucideIcon
    trend?: {
        value: number
        label: string
        positive?: boolean
    }
    iconColor?: string
    className?: string
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    iconColor = 'text-primary',
    className = ''
}: StatsCardProps) {
    return (
        <Card className={`relative overflow-hidden ${className}`}>
            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-primary/10 ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm mt-1 ${trend.positive ? 'text-green-500' : 'text-muted-foreground'
                        }`}>
                        {trend.positive && <span>↑</span>}
                        <span>{trend.value}</span>
                        <span className="text-muted-foreground">{trend.label}</span>
                    </div>
                )}
                {subtitle && !trend && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    )
}

interface MiniStatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    color?: string
}

export function MiniStatsCard({ title, value, icon: Icon, color = 'bg-primary/10' }: MiniStatsCardProps) {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${color}`}>
            <div className="p-2 bg-background/80 rounded-lg">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                <p className="text-xs text-muted-foreground">{title}</p>
            </div>
        </div>
    )
}
