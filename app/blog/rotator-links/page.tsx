import { Metadata } from 'next';
import { Repeat, TestTube, BarChart, Shuffle, TrendingUp } from 'lucide-react';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogSection, FeatureCard, BestPractices, ExampleBox } from '@/components/BlogComponents';

export const metadata: Metadata = {
    title: 'Rotator Links Guide - Smart A/B Testing & Link Distribution | SEOLnk',
    description: 'Master A/B testing and traffic distribution with intelligent Rotator Links. One link, multiple destinations.',
};

export default function RotatorLinksPage() {
    return (
        <BlogLayout
            title="Smart Link Distribution Made Easy"
            subtitle="One link, multiple destinations - Perfect for A/B testing and traffic distribution"
            badgeText="Rotator Links"
            badgeIcon={<Repeat className="h-4 w-4 text-orange-600" />}
            gradientFrom="from-orange-600"
            gradientTo="to-red-600"
            ctaText="Create Rotator Link"
            ctaLink="/create/rotator"
        >
            {/* What are Rotator Links */}
            <BlogSection title="What are Rotator Links?">
                <p className="text-lg leading-relaxed">
                    Rotator Links (also known as Link Rotators or Round-Robin Links) are intelligent URLs that automatically
                    distribute clicks across <strong>multiple destination URLs</strong>. One short link, multiple destinations -
                    perfect for A/B testing, load balancing, and maximizing conversions.
                </p>
            </BlogSection>

            {/* Why Use */}
            <BlogSection title="Why Use Rotator Links?">
                <div className="grid gap-6">
                    <FeatureCard
                        icon={<TestTube className="h-6 w-6 text-blue-600" />}
                        title="A/B Testing Made Simple"
                        description="Test multiple landing pages simultaneously. Compare performance without complex setups. Split traffic evenly or use weighted distribution."
                        gradient="from-blue-500/10 to-cyan-500/10"
                    />
                    <FeatureCard
                        icon={<Shuffle className="h-6 w-6 text-purple-600" />}
                        title="Load Distribution"
                        description="Prevent server overload during campaigns. Distribute affiliate traffic across multiple links. Balance traffic across stores or regions."
                        gradient="from-purple-500/10 to-pink-500/10"
                    />
                    <FeatureCard
                        icon={<TrendingUp className="h-6 w-6 text-green-600" />}
                        title="Maximize Conversions"
                        description="Automatically send traffic to best-performing destinations. Test different offers, copy, or designs. Optimize campaigns in real-time."
                        gradient="from-green-500/10 to-emerald-500/10"
                    />
                </div>
            </BlogSection>

            {/* Rotation Strategies */}
            <BlogSection title="Rotation Strategies">
                <div className="grid gap-4">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <h4 className="font-bold text-lg">Round Robin</h4>
                        </div>
                        <p className="text-muted-foreground mb-2">
                            Clicks distributed evenly: URL1 → URL2 → URL3 → URL1 → URL2...
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                            Best for: Equal testing, fair distribution
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <span className="text-2xl">🎲</span>
                            </div>
                            <h4 className="font-bold text-lg">Random</h4>
                        </div>
                        <p className="text-muted-foreground mb-2">
                            Random selection for each click, statistically even over time
                        </p>
                        <p className="text-sm font-medium text-purple-600">
                            Best for: Unbiased testing, simple setups
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <span className="text-2xl">⚖️</span>
                            </div>
                            <h4 className="font-bold text-lg">Weighted</h4>
                        </div>
                        <p className="text-muted-foreground mb-2">
                            Custom percentage: 60% URL1, 30% URL2, 10% URL3
                        </p>
                        <p className="text-sm font-medium text-orange-600">
                            Best for: Champion/challenger testing, gradual rollouts
                        </p>
                    </div>
                </div>
            </BlogSection>

            {/* Real-World Example */}
            <BlogSection title="Real-World Example">
                <ExampleBox title="E-learning Platform A/B Test" variant="success">
                    <div className="space-y-2 text-sm font-mono">
                        <div>seolnk.com/free-trial</div>
                        <div className="pl-4">├─ 50%: Landing Page A (Video-first)</div>
                        <div className="pl-4">├─ 30%: Landing Page B (Text-first)</div>
                        <div className="pl-4">└─ 20%: Landing Page C (Testimonial-first)</div>
                    </div>
                </ExampleBox>
            </BlogSection>

            {/* Best Practices */}
            <BlogSection title="Best Practices">
                <BestPractices
                    items={[
                        { type: 'do', text: 'Start with 2-3 URLs - don\'t overwhelm your testing' },
                        { type: 'do', text: 'Give it time - allow sufficient data before making decisions' },
                        { type: 'do', text: 'Test one variable - change only one element per test' },
                        { type: 'do', text: 'Monitor analytics - check performance regularly' },
                        { type: 'do', text: 'Set goals - define success metrics before testing' }
                    ]}
                />
            </BlogSection>

            {/* Use Cases */}
            <BlogSection title="Common Use Cases">
                <div className="grid gap-4">
                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">Marketing & Advertising</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li>• A/B Testing - Compare landing page designs</li>
                            <li>• Regional Targeting - Route to location-specific pages</li>
                            <li>• Campaign Optimization - Test different offers</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">Affiliate Marketing</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li>• Link Protection - Rotate affiliate links to prevent burnout</li>
                            <li>• Multi-Network - Distribute traffic across networks</li>
                            <li>• Backup Links - Automatic failover if one link breaks</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">E-commerce</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li>• Inventory Management - Route to stores with stock</li>
                            <li>• Regional Stores - Send users to nearest location</li>
                            <li>• Flash Sales - Distribute load during high traffic</li>
                        </ul>
                    </div>
                </div>
            </BlogSection>

            {/* Analytics */}
            <BlogSection title="Analytics & Reporting">
                <div className="p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
                    <h4 className="font-bold text-xl mb-4">Every Rotator Link provides detailed insights:</h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-600">📊</span>
                            <span>Overall performance & conversion rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-red-600">🔗</span>
                            <span>Per-URL breakdown & metrics</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-600">⏰</span>
                            <span>Time-based data & trends</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-pink-600">📈</span>
                            <span>Comparative analysis</span>
                        </div>
                    </div>
                </div>
            </BlogSection>
        </BlogLayout>
    );
}
