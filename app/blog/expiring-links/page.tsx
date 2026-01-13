import { Metadata } from 'next';
import { Clock, Zap, Calendar, TrendingDown, Flame } from 'lucide-react';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogSection, FeatureCard, BestPractices, ExampleBox } from '@/components/BlogComponents';

export const metadata: Metadata = {
    title: 'Expiring Links Guide - Time-Limited URLs for Maximum Impact | SEOLnk',
    description: 'Create urgency and drive action with time-limited Expiring Links. Perfect for flash sales, events, and limited offers.',
};

export default function ExpiringLinksPage() {
    return (
        <BlogLayout
            title="Time-Limited Links for Maximum Impact"
            subtitle="Create urgency and drive immediate action with automatically expiring URLs"
            badgeText="Expiring Links"
            badgeIcon={<Clock className="h-4 w-4 text-yellow-600" />}
            gradientFrom="from-yellow-600"
            gradientTo="to-orange-600"
            ctaText="Create Expiring Link"
            ctaLink="/create/expiring"
        >
            {/* What are Expiring Links */}
            <BlogSection title="What are Expiring Links?">
                <p className="text-lg leading-relaxed">
                    Expiring Links are temporary URLs that <strong>automatically stop working</strong> after a specified date and time.
                    Create urgency, run time-limited promotions, and maintain control over when your content is accessible -
                    all with a single expiring short link.
                </p>
            </BlogSection>

            {/* Why Use */}
            <BlogSection title="Why Use Expiring Links?">
                <div className="grid gap-6">
                    <FeatureCard
                        icon={<Flame className="h-6 w-6 text-red-600" />}
                        title="Create Urgency"
                        description="Drive immediate action with deadlines. Increase conversion rates through scarcity. Perfect for limited-time offers and encourage faster decision-making."
                        gradient="from-red-500/10 to-orange-500/10"
                    />
                    <FeatureCard
                        icon={<TrendingDown className="h-6 w-6 text-blue-600" />}
                        title="Maintain Security"
                        description="Share temporary access to sensitive content. Automatically revoke access after expiration. Control distribution of exclusive materials."
                        gradient="from-blue-500/10 to-cyan-500/10"
                    />
                    <FeatureCard
                        icon={<Calendar className="h-6 w-6 text-green-600" />}
                        title="Campaign Management"
                        description="End promotions automatically. No need to manually disable links. Clean campaign boundaries and prevent confusion after offers end."
                        gradient="from-green-500/10 to-emerald-500/10"
                    />
                </div>
            </BlogSection>

            {/* Use Cases */}
            <BlogSection title="Use Cases">
                <div className="grid gap-4">
                    <ExampleBox title="🛍️ Flash Sales" variant="warning">
                        <p className="text-sm mb-2">"24-hour sale ends at midnight!"</p>
                        <p className="text-xs text-muted-foreground">Automatic expiration when sale ends</p>
                    </ExampleBox>

                    <ExampleBox title="📅 Event Registration" variant="info">
                        <p className="text-sm mb-2">Close registration 1 hour before event start</p>
                        <p className="text-xs text-muted-foreground">No late signups, clean cutoff</p>
                    </ExampleBox>

                    <ExampleBox title="🎬 Exclusive Previews" variant="default">
                        <p className="text-sm mb-2">Limited-time early access to new content</p>
                        <p className="text-xs text-muted-foreground">Beta features, preview releases</p>
                    </ExampleBox>

                    <ExampleBox title="🔒 Document Sharing" variant="success">
                        <p className="text-sm mb-2">Temporary access to contracts or sensitive files</p>
                        <p className="text-xs text-muted-foreground">Expires after 24 hours for security</p>
                    </ExampleBox>
                </div>
            </BlogSection>

            {/* Expiration Options */}
            <BlogSection title="Expiration Options">
                <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <h4 className="font-bold text-lg mb-2">⏱️ Countdown Timer</h4>
                        <p className="text-muted-foreground text-sm">
                            Display a live countdown on the landing page: "This link expires in 5 hours, 32 minutes".
                            Builds urgency and FOMO with customizable design.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <h4 className="font-bold text-lg mb-2">💬 Custom Expiration Message</h4>
                        <p className="text-muted-foreground text-sm">
                            When the link expires, show a branded message with your logo, explanation,
                            call-to-action to current offerings, and contact information.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <h4 className="font-bold text-lg mb-2">🔄 Redirect After Expiration</h4>
                        <p className="text-muted-foreground text-sm">
                            Automatically send users to your homepage, a "sorry you missed it" page,
                            current promotions, or alternative offerings.
                        </p>
                    </div>
                </div>
            </BlogSection>

            {/* Psychology of FOMO */}
            <BlogSection title="Psychology of Expiring Links">
                <div className="p-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20">
                    <h4 className="font-bold text-xl mb-4">FOMO (Fear of Missing Out)</h4>
                    <p className="text-muted-foreground mb-4">
                        Deadlines trigger urgency and action. Studies show:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-1">33%</div>
                            <div className="text-sm text-muted-foreground">Higher click-through rates</div>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600 mb-1">47%</div>
                            <div className="text-sm text-muted-foreground">Faster decision-making</div>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-1">28%</div>
                            <div className="text-sm text-muted-foreground">Increase in conversions</div>
                        </div>
                    </div>
                </div>
            </BlogSection>

            {/* Best Practices */}
            <BlogSection title="Best Practices">
                <BestPractices
                    items={[
                        { type: 'do', text: 'Communicate clearly: Tell users when link expires' },
                        { type: 'do', text: 'Add buffer time: Don\'t expire too quickly' },
                        { type: 'do', text: 'Use countdown timers: Visual urgency works better' },
                        { type: 'do', text: 'Have a fallback: Always set expired redirect' },
                        { type: 'dont', text: 'Don\'t over-use: Too much urgency loses impact' },
                        { type: 'dont', text: 'Don\'t set unrealistic deadlines: Be fair to users' }
                    ]}
                />
            </BlogSection>
        </BlogLayout>
    );
}
