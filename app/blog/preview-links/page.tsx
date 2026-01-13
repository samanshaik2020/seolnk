import { Metadata } from 'next';
import { Eye, Image, Share2, TrendingUp, Palette, Target } from 'lucide-react';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogSection, FeatureCard, BestPractices, ExampleBox } from '@/components/BlogComponents';

export const metadata: Metadata = {
    title: 'Preview Links Guide - SEOLnk',
    description: 'Learn how to create stunning social media previews with custom titles, descriptions, and images using Preview Links.',
};

export default function PreviewLinksPage() {
    return (
        <BlogLayout
            title="Control Your Social Media Presence"
            subtitle="Master social media optimization with custom preview links"
            badgeText="Preview Links"
            badgeIcon={<Eye className="h-4 w-4 text-blue-600" />}
            gradientFrom="from-blue-600"
            gradientTo="to-cyan-600"
            ctaText="Create Your First Preview Link"
            ctaLink="/create/preview"
        >
            {/* What are Preview Links */}
            <BlogSection title="What are Preview Links?">
                <p className="text-lg leading-relaxed">
                    Preview Links allow you to customize exactly how your links appear when shared on social media platforms like Facebook, Twitter, LinkedIn, and more. Instead of relying on what the destination website provides, you take <strong>full control</strong> of the title, description, and image that appears in the preview card.
                </p>
            </BlogSection>

            {/* Why Use */}
            <BlogSection title="Why Use Preview Links?">
                <div className="grid gap-6">
                    <FeatureCard
                        icon={<Palette className="h-6 w-6 text-blue-600" />}
                        title="Professional Branding"
                        description="Ensure consistent branding across all platforms. Use custom images that grab attention and write compelling descriptions that drive clicks."
                        gradient="from-blue-500/10 to-cyan-500/10"
                    />
                    <FeatureCard
                        icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                        title="Optimize for Engagement"
                        description="Create eye-catching previews that stand out in feeds. A/B test different titles and images to increase click-through rates by up to 300%."
                        gradient="from-purple-500/10 to-pink-500/10"
                    />
                    <FeatureCard
                        icon={<Target className="h-6 w-6 text-green-600" />}
                        title="Fix Broken Previews"
                        description="Some websites don't provide proper meta tags. Override missing or incorrect preview data to ensure your content always looks perfect."
                        gradient="from-green-500/10 to-emerald-500/10"
                    />
                </div>
            </BlogSection>

            {/* How to Create */}
            <BlogSection title="How to Create a Preview Link">
                <div className="grid gap-4">
                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold">1</div>
                            <h4 className="font-bold text-lg">Enter Your URL</h4>
                        </div>
                        <p className="text-muted-foreground">Paste the destination link you want to share</p>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold">2</div>
                            <h4 className="font-bold text-lg">Customize Metadata</h4>
                        </div>
                        <ul className="text-muted-foreground space-y-2">
                            <li>• Add a catchy title (max 60 characters recommended)</li>
                            <li>• Write an engaging description (max 160 characters)</li>
                            <li>• Upload or select a stunning preview image</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 font-bold">3</div>
                            <h4 className="font-bold text-lg">Generate & Share</h4>
                        </div>
                        <p className="text-muted-foreground">Get your short link and share it anywhere</p>
                    </div>
                </div>
            </BlogSection>

            {/* Use Cases */}
            <BlogSection title="Use Cases">
                <div className="grid sm:grid-cols-2 gap-4">
                    <ExampleBox title="📝 Content Creators" variant="info">
                        <p className="text-sm text-muted-foreground">Share blog posts with custom thumbnails and compelling titles</p>
                    </ExampleBox>
                    <ExampleBox title="📊 Marketers" variant="success">
                        <p className="text-sm text-muted-foreground">Create branded links for campaigns with consistent messaging</p>
                    </ExampleBox>
                    <ExampleBox title="🛍️ E-commerce" variant="warning">
                        <p className="text-sm text-muted-foreground">Showcase products with high-quality custom images</p>
                    </ExampleBox>
                    <ExampleBox title="🎫 Events" variant="default">
                        <p className="text-sm text-muted-foreground">Promote events with eye-catching event banners</p>
                    </ExampleBox>
                </div>
            </BlogSection>

            {/* Best Practices */}
            <BlogSection title="Best Practices">
                <BestPractices
                    items={[
                        { type: 'do', text: 'Use high-quality images (1200x630px recommended)' },
                        { type: 'do', text: 'Keep titles concise and compelling' },
                        { type: 'do', text: 'Write descriptions that create curiosity' },
                        { type: 'do', text: 'Test previews on different platforms' },
                        { type: 'do', text: 'Update seasonal content regularly' }
                    ]}
                />
            </BlogSection>

            {/* Analytics */}
            <BlogSection title="Analytics & Tracking">
                <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <h4 className="font-bold text-xl mb-4">Every Preview Link comes with built-in analytics:</h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600">📊</span>
                            <span>Total clicks and unique visitors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-purple-600">🌐</span>
                            <span>Click sources and referrers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600">🗺️</span>
                            <span>Geographic data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-orange-600">📱</span>
                            <span>Device and browser information</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-pink-600">📈</span>
                            <span>Time-based trends</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-cyan-600">⚡</span>
                            <span>Real-time updates</span>
                        </div>
                    </div>
                </div>
            </BlogSection>
        </BlogLayout>
    );
}
