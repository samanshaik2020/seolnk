'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FolderPlus, FolderOpen, Check, Loader2, X, ChevronDown } from 'lucide-react'

interface Campaign {
    id: string
    name: string
    color: string
    link_count: number
}

interface CampaignSelectorProps {
    userId: string | null
    selectedCampaignId: string | null
    onCampaignChange: (campaignId: string | null) => void
    className?: string
}

const CAMPAIGN_COLORS = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ef4444', // Red
    '#06b6d4', // Cyan
]

export function CampaignSelector({ userId, selectedCampaignId, onCampaignChange, className }: CampaignSelectorProps) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createMode, setCreateMode] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newCampaignName, setNewCampaignName] = useState('')
    const [selectedColor, setSelectedColor] = useState(CAMPAIGN_COLORS[0])

    const fetchCampaigns = useCallback(async () => {
        if (!userId) return

        setLoading(true)
        try {
            const res = await fetch(`/api/campaigns?user_id=${userId}`)
            if (res.ok) {
                const { campaigns: data } = await res.json()
                setCampaigns(data || [])
            }
        } catch (err) {
            console.error('Failed to fetch campaigns:', err)
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchCampaigns()
    }, [fetchCampaigns])

    const handleCreateCampaign = async () => {
        if (!newCampaignName.trim() || !userId) return

        setCreating(true)
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCampaignName.trim(),
                    color: selectedColor,
                    user_id: userId
                })
            })

            if (res.ok) {
                const { campaign } = await res.json()
                setCampaigns([campaign, ...campaigns])
                onCampaignChange(campaign.id)
                setNewCampaignName('')
                setCreateMode(false)
                setDialogOpen(false)
            }
        } catch (err) {
            console.error('Failed to create campaign:', err)
        } finally {
            setCreating(false)
        }
    }

    const handleSelectCampaign = (campaignId: string) => {
        onCampaignChange(campaignId === 'none' ? null : campaignId)
        setDialogOpen(false)
    }

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId)

    return (
        <div className={className}>
            <Label className="text-sm font-medium mb-2 block">
                Add to Campaign (Optional)
            </Label>

            <Button
                type="button"
                variant="outline"
                className="w-full justify-between h-10"
                onClick={() => {
                    setDialogOpen(true)
                    setCreateMode(false)
                }}
            >
                <div className="flex items-center gap-2">
                    {selectedCampaign ? (
                        <>
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: selectedCampaign.color }}
                            />
                            <span className="truncate">{selectedCampaign.name}</span>
                        </>
                    ) : (
                        <>
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">No campaign selected</span>
                        </>
                    )}
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </Button>

            {selectedCampaign && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onCampaignChange(null)}
                >
                    <X className="h-3 w-3 mr-1" />
                    Remove from campaign
                </Button>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {createMode ? 'Create New Campaign' : 'Add to Campaign'}
                        </DialogTitle>
                        <DialogDescription>
                            {createMode
                                ? 'Create a new folder to organize your links.'
                                : 'Select an existing campaign or create a new one.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {createMode ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaignName">Campaign Name</Label>
                                <Input
                                    id="campaignName"
                                    value={newCampaignName}
                                    onChange={(e) => setNewCampaignName(e.target.value)}
                                    placeholder="e.g., Summer Sale, Product Launch"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <div className="flex gap-2">
                                    {CAMPAIGN_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full transition-all ${selectedColor === color
                                                    ? 'ring-2 ring-offset-2 ring-primary scale-110'
                                                    : 'hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : campaigns.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No campaigns yet</p>
                                    <p className="text-sm">Create your first campaign to organize links</p>
                                </div>
                            ) : (
                                <>
                                    {/* No Campaign Option */}
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCampaign('none')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${!selectedCampaignId
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">No Campaign</p>
                                            <p className="text-xs text-muted-foreground">Don't add to any campaign</p>
                                        </div>
                                        {!selectedCampaignId && (
                                            <Check className="h-5 w-5 text-primary" />
                                        )}
                                    </button>

                                    {/* Campaign List */}
                                    {campaigns.map((campaign) => (
                                        <button
                                            key={campaign.id}
                                            type="button"
                                            onClick={() => handleSelectCampaign(campaign.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedCampaignId === campaign.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: campaign.color + '20' }}
                                            >
                                                <FolderOpen
                                                    className="h-4 w-4"
                                                    style={{ color: campaign.color }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{campaign.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {campaign.link_count} {campaign.link_count === 1 ? 'link' : 'links'}
                                                </p>
                                            </div>
                                            {selectedCampaignId === campaign.id && (
                                                <Check className="h-5 w-5 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        {createMode ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreateMode(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCreateCampaign}
                                    disabled={!newCampaignName.trim() || creating}
                                    className="w-full sm:w-auto"
                                >
                                    {creating ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</>
                                    ) : (
                                        <><Check className="h-4 w-4 mr-2" /> Create & Select</>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setCreateMode(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <FolderPlus className="h-4 w-4 mr-2" />
                                    Create New Campaign
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
