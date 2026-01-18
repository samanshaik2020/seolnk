'use client'

import { Smartphone, Monitor, Tablet } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface DeviceBreakdownProps {
    mobile: number
    desktop: number
    tablet: number
}

const COLORS = {
    mobile: '#3b82f6',   // Blue
    desktop: '#22c55e', // Green
    tablet: '#a855f7',  // Purple
}

export function DeviceBreakdown({ mobile, desktop, tablet }: DeviceBreakdownProps) {
    const total = mobile + desktop + tablet

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>No device data yet</p>
            </div>
        )
    }

    const data = [
        { name: 'Mobile', value: mobile, color: COLORS.mobile },
        { name: 'Desktop', value: desktop, color: COLORS.desktop },
        { name: 'Tablet', value: tablet, color: COLORS.tablet },
    ].filter(d => d.value > 0)

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                            formatter={(value: number | undefined, name: string | undefined) => {
                                const numValue = value ?? 0
                                return [
                                    `${numValue} (${((numValue / total) * 100).toFixed(1)}%)`,
                                    name ?? ''
                                ]
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col justify-center space-y-4">
                <DeviceItem
                    icon={Smartphone}
                    label="Mobile"
                    value={mobile}
                    percentage={(mobile / total) * 100}
                    color={COLORS.mobile}
                />
                <DeviceItem
                    icon={Monitor}
                    label="Desktop"
                    value={desktop}
                    percentage={(desktop / total) * 100}
                    color={COLORS.desktop}
                />
                <DeviceItem
                    icon={Tablet}
                    label="Tablet"
                    value={tablet}
                    percentage={(tablet / total) * 100}
                    color={COLORS.tablet}
                />
            </div>
        </div>
    )
}

interface DeviceItemProps {
    icon: React.ElementType
    label: string
    value: number
    percentage: number
    color: string
}

function DeviceItem({ icon: Icon, label, value, percentage, color }: DeviceItemProps) {
    return (
        <div className="flex items-center gap-3">
            <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                </div>
            </div>
        </div>
    )
}

// Simpler version without pie chart
export function DeviceBreakdownSimple({ mobile, desktop, tablet }: DeviceBreakdownProps) {
    const total = mobile + desktop + tablet

    if (total === 0) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <p>No device data yet</p>
            </div>
        )
    }

    const devices = [
        { icon: Smartphone, label: 'Mobile', value: mobile, color: COLORS.mobile },
        { icon: Monitor, label: 'Desktop', value: desktop, color: COLORS.desktop },
        { icon: Tablet, label: 'Tablet', value: tablet, color: COLORS.tablet },
    ]

    return (
        <div className="space-y-4">
            {devices.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color }} />
                            <span className="font-medium">{label}</span>
                        </div>
                        <span className="text-muted-foreground">
                            {value} ({((value / total) * 100).toFixed(1)}%)
                        </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${(value / total) * 100}%`,
                                backgroundColor: color
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
