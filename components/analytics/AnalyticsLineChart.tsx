'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts'

interface DataPoint {
    date: string
    views: number
    label?: string
}

interface AnalyticsLineChartProps {
    data: DataPoint[]
    title?: string
    height?: number
    showGrid?: boolean
    gradientColor?: string
}

export function AnalyticsLineChart({
    data,
    height = 300,
    showGrid = true,
    gradientColor = '#8b5cf6'
}: AnalyticsLineChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center text-muted-foreground"
                style={{ height }}
            >
                <p>No data available yet</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                {showGrid && (
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        vertical={false}
                    />
                )}
                <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    itemStyle={{ color: gradientColor }}
                    formatter={(value: number | undefined) => [value ?? 0, 'Views']}
                    labelFormatter={(label) => label}
                />
                <Area
                    type="monotone"
                    dataKey="views"
                    stroke={gradientColor}
                    strokeWidth={2}
                    fill="url(#colorViews)"
                    dot={false}
                    activeDot={{ r: 6, fill: gradientColor, stroke: 'white', strokeWidth: 2 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

// Simple bar chart for comparison data
interface BarDataPoint {
    label: string
    value: number
    color?: string
}

interface AnalyticsBarChartProps {
    data: BarDataPoint[]
    height?: number
}

export function AnalyticsBarChart({ data, height = 200 }: AnalyticsBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center text-muted-foreground"
                style={{ height }}
            >
                <p>No data available yet</p>
            </div>
        )
    }

    const maxValue = Math.max(...data.map(d => d.value), 1)

    return (
        <div className="flex items-end justify-between gap-2" style={{ height }}>
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">{item.value}</span>
                    <div
                        className="w-full rounded-t-lg transition-all duration-500 ease-out"
                        style={{
                            height: `${Math.max(8, (item.value / maxValue) * 100)}%`,
                            backgroundColor: item.color || 'hsl(var(--primary))',
                            opacity: 0.8,
                        }}
                    />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
            ))}
        </div>
    )
}
