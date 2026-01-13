import { Metadata } from 'next';
import { Link2, Sparkles, TrendingUp, Users, Search } from 'lucide-react';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogSection, FeatureCard, BestPractices, ExampleBox } from '@/components/BlogComponents';

export const metadata: Metadata = {
    title: 'Alias Links Guide - Create Memorable Branded Short Links | SEOLnk',
    description: 'Learn how to create custom branded short URLs that are memorable, shareable, and SEO-friendly with Alias Links.',
};

export default function AliasLinksPage() {
    return (
        <BlogLayout
            title="Create Memorable, Branded Short Links"
            subtitle="Turn random URLs into branded, memorable links your audience will trust"
            badgeText="Alias Links"
            badgeIcon={<Link2 className="h-4 w-4 text-purple-600" />}
            gradientFrom="from-purple-600"
            gradientTo="to-pink-600"
            ctaText="Create Your Alias Link"
            ctaLink="/create/alias"
        >
            {/* What are Alias Links */}
            <BlogSection title="What are Alias Links?">
                <p className="text-lg leading-relaxed">
                    Alias Links are custom short links that let you create <strong>memorable, branded URLs</strong> instead of random strings.
                    Turn <code className="px-2 py-1 bg-muted rounded text-purple-600">seolnk.com/x7k9mq2</code> into{' '}
                    <code className="px-2 py-1 bg-muted rounded text-purple-600">seolnk.com/summer-sale</code> or{' '}
                    <code className="px-2 py-1 bg-muted rounded text-purple-600">seolnk.com/signup</code> -
                    making your links easier to remember, share, and trust.
                </p>
            </BlogSection>

            {/* Why Use */}
            <BlogSection title="Why Use Alias Links?">
                <div className="grid gap-6 sm:grid-cols-1">
                    <FeatureCard
                        icon={<Users className="h-6 w-6 text-purple-600" />}
                        title="Brand Recognition"
                        description="Use your brand name in every link. Create consistent naming conventions and build trust with recognizable URLs."
                        gradient="from-purple-500/10 to-pink-500/10"
                    />
                    <FeatureCard
                        icon={<Sparkles className="h-6 w-6 text-blue-600" />}
                        title="Memorable & Shareable"
                        description="Easy to remember and type manually. Perfect for verbal sharing in podcasts, videos, and presentations."
                        gradient="from-blue-500/10 to-cyan-500/10"
                    />
                    <FeatureCard
                        icon={<Search className="h-6 w-6 text-green-600" />}
                        title="SEO Benefits"
                        description="Descriptive URLs are better for SEO. Include keywords in your alias and improve click-through rates from search."
                        gradient="from-green-500/10 to-emerald-500/10"
                    />
                </div>
            </BlogSection>

            {/* Real-World Examples */}
            <BlogSection title="Real-World Examples">
                <div className="grid gap-4 sm:grid-cols-2">
                    <ExampleBox title="🎯 E-commerce" variant="success">
                        <code className="text-sm font-mono text-purple-600 block">seolnk.com/winter-collection</code>
                    </ExampleBox>
                    <ExampleBox title="📱 App Download" variant="info">
                        <code className="text-sm font-mono text-purple-600 block">seolnk.com/get-app</code>
                    </ExampleBox>
                    <ExampleBox title="📧 Newsletter" variant="warning">
                        <code className="text-sm font-mono text-purple-600 block">seolnk.com/subscribe</code>
                    </ExampleBox>
                    <ExampleBox title="🎓 Education" variant="default">
                        <code className="text-sm font-mono text-purple-600 block">seolnk.com/free-course</code>
                    </ExampleBox>
                </div>
            </BlogSection>

            {/* Best Practices */}
            <BlogSection title="Alias Naming Best Practices">
                <BestPractices
                    items={[
                        { type: 'do', text: 'Keep it short (5-20 characters)' },
                        { type: 'do', text: 'Use lowercase letters and hyphens' },
                        { type: 'do', text: 'Make it descriptive and relevant' },
                        { type: 'do', text: 'Consider SEO keywords' },
                        { type: 'dont', text: "Don't use trademarked terms" },
                        { type: 'dont', text: 'Avoid confusing characters (0 vs O, l vs 1)' }
                    ]}
                />
            </BlogSection>

            {/* Use Cases */}
            <BlogSection title="Common Use Cases">
                <div className="grid gap-4">
                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            Marketing Campaigns
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• <code className="text-foreground">/black-friday</code> - Seasonal sales</li>
                            <li>• <code className="text-foreground">/summer-sale</code> - Promotional events</li>
                            <li>• <code className="text-foreground">/promo2024</code> - Year-specific campaigns</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">Product Launches</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• <code className="text-foreground">/new-product</code> - Product announcements</li>
                            <li>• <code className="text-foreground">/launch</code> - Launch events</li>
                            <li>• <code className="text-foreground">/beta-access</code> - Early access programs</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">Resources & Links</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• <code className="text-foreground">/pricing</code> - Pricing pages</li>
                            <li>• <code className="text-foreground">/demo</code> - Demo requests</li>
                            <li>• <code className="text-foreground">/download</code> - Resource downloads</li>
                        </ul>
                    </div>
                </div>
            </BlogSection>

            {/* Advanced Features */}
            <BlogSection title="Advanced Features">
                <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <h4 className="font-bold text-lg mb-2">✨ Case-Insensitive Matching</h4>
                        <p className="text-muted-foreground">
                            Your aliases work regardless of capitalization - <code>/Summer-Sale</code> and <code>/summer-sale</code> both work!
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <h4 className="font-bold text-lg mb-2">🔒 Conflict Prevention</h4>
                        <p className="text-muted-foreground">
                            Our system checks for availability in real-time, preventing duplicate aliases and suggesting alternatives.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <h4 className="font-bold text-lg mb-2">📊 Analytics Included</h4>
                        <p className="text-muted-foreground">
                            Track performance of your branded links with detailed analytics: clicks, sources, geographic data, and more.
                        </p>
                    </div>
                </div>
            </BlogSection>
        </BlogLayout>
    );
}
