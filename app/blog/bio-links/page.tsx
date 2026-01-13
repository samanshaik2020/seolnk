import { Metadata } from 'next';
import { User, Instagram, Link, Palette, BarChart, DollarSign } from 'lucide-react';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogSection, FeatureCard, BestPractices, ExampleBox } from '@/components/BlogComponents';

export const metadata: Metadata = {
    title: 'Bio Links Guide - Your Personal Link-in-Bio Page | SEOLnk',
    description: 'Create your professional link-in-bio page. All your important links in one beautiful, customizable landing page.',
};

export default function BioLinksPage() {
    return (
        <BlogLayout
            title="Your Personal Link-in-Bio Page"
            subtitle="Turn one bio link into unlimited possibilities. Perfect for Instagram, TikTok, and more."
            badgeText="Bio Links"
            badgeIcon={<User className="h-4 w-4 text-pink-600" />}
            gradientFrom="from-pink-600"
            gradientTo="to-rose-600"
            ctaText="Create Your Bio Link"
            ctaLink="/bio-links"
        >
            {/* What are Bio Links */}
            <BlogSection title="What are Bio Links?">
                <p className="text-lg leading-relaxed">
                    Bio Links (Link-in-Bio pages) are customizable landing pages that consolidate all your important links
                    in one <strong>beautiful, shareable page</strong>. Perfect for your Instagram, TikTok, Twitter, or any platform that
                    limits you to a single link in your bio.
                </p>
            </BlogSection>

            {/* Why Use */}
            <BlogSection title="Why Use Bio Links?">
                <div className="grid gap-6">
                    <FeatureCard
                        icon={<Instagram className="h-6 w-6 text-pink-600" />}
                        title="Overcome Platform Limitations"
                        description="Turn one bio link into unlimited possibilities. Instagram and TikTok only allow one clickable link. Update your links without changing your bio."
                        gradient="from-pink-500/10 to-rose-500/10"
                    />
                    <FeatureCard
                        icon={<Palette className="h-6 w-6 text-purple-600" />}
                        title="Professional Branding"
                        description="Create a polished, branded landing page. Customize colors, fonts, and layout. Add profile picture and bio to match your brand identity."
                        gradient="from-purple-500/10 to-pink-500/10"
                    />
                    <FeatureCard
                        icon={<BarChart className="h-6 w-6 text-blue-600" />}
                        title="Track Performance"
                        description="See which links get the most clicks. Understand your audience better. Make data-driven content decisions and optimize your strategy."
                        gradient="from-blue-500/10 to-cyan-500/10"
                    />
                </div>
            </BlogSection>

            {/* Essential Features */}
            <BlogSection title="Essential Features">
                <div className="grid gap-4">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">🎨</span>
                            Full Customization
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Choose from multiple themes (light, dark, colorful, minimal)</li>
                            <li>• Custom brand colors and backgrounds</li>
                            <li>• Premium font library</li>
                            <li>• Profile picture and bio section</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">🔗</span>
                            Unlimited Links
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Add as many links as you need</li>
                            <li>• Organize by priority or category</li>
                            <li>• Featured links at the top</li>
                            <li>• Show/hide links temporarily</li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            Link Analytics
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Individual click tracking per link</li>
                            <li>• Total page views</li>
                            <li>• Click-through rates</li>
                            <li>• Geographic and device data</li>
                        </ul>
                    </div>
                </div>
            </BlogSection>

            {/* Use Cases by Profession */}
            <BlogSection title="Use Cases by Profession">
                <div className="grid gap-4">
                    <details className="group p-6 rounded-lg border border-border/50 bg-card/50 cursor-pointer hover:border-border transition-colors">
                        <summary className="font-bold text-lg flex items-center gap-2 cursor-pointer list-none">
                            <span className="text-2xl">🎨</span>
                            Content Creators
                            <span className="ml-auto text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                        </summary>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground ml-8">
                            <li>✓ Latest YouTube video</li>
                            <li>✓ Instagram highlights</li>
                            <li>✓ TikTok profile</li>
                            <li>✓ Merch store</li>
                            <li>✓ Patreon/membership</li>
                            <li>✓ Email newsletter signup</li>
                        </ul>
                    </details>

                    <details className="group p-6 rounded-lg border border-border/50 bg-card/50 cursor-pointer hover:border-border transition-colors">
                        <summary className="font-bold text-lg flex items-center gap-2 cursor-pointer list-none">
                            <span className="text-2xl">🎵</span>
                            Musicians & Artists
                            <span className="ml-auto text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                        </summary>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground ml-8">
                            <li>✓ Latest single/album</li>
                            <li>✓ Streaming platforms (Spotify, Apple Music)</li>
                            <li>✓ Tour dates & tickets</li>
                            <li>✓ Music videos</li>
                            <li>✓ Merch shop</li>
                            <li>✓ Fan club signup</li>
                        </ul>
                    </details>

                    <details className="group p-6 rounded-lg border border-border/50 bg-card/50 cursor-pointer hover:border-border transition-colors">
                        <summary className="font-bold text-lg flex items-center gap-2 cursor-pointer list-none">
                            <span className="text-2xl">💼</span>
                            Businesses & Brands
                            <span className="ml-auto text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                        </summary>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground ml-8">
                            <li>✓ Official website</li>
                            <li>✓ Online store/products</li>
                            <li>✓ Latest promotion</li>
                            <li>✓ Customer support</li>
                            <li>✓ Reviews & testimonials</li>
                            <li>✓ Contact form</li>
                        </ul>
                    </details>
                </div>
            </BlogSection>

            {/* Success Story */}
            <BlogSection title="Success Story">
                <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="mb-6">
                        <div className="text-sm text-muted-foreground mb-2">Fashion Blogger</div>
                        <div className="text-3xl font-bold mb-1">From 200 to 1,500 clicks per month</div>
                        <div className="text-lg text-green-600 font-semibold">650% increase in traffic</div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-background/50">
                            <div className="text-sm font-medium mb-2">Before</div>
                            <div className="text-sm text-muted-foreground">1 blog link in bio → 200 clicks/month</div>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <div className="text-sm font-medium mb-2">After</div>
                            <div className="text-sm text-muted-foreground">Bio link page with 8 links → 1,500 clicks/month</div>
                        </div>
                    </div>
                </div>
            </BlogSection>

            {/* Best Practices */}
            <BlogSection title="Best Practices">
                <BestPractices
                    items={[
                        { type: 'do', text: 'Prioritize important links at the top' },
                        { type: 'do', text: 'Use clear labels: "Shop Now" not "Click Here"' },
                        { type: 'do', text: 'Add emojis sparingly for visual interest (1-2 per link)' },
                        { type: 'do', text: 'Update regularly to keep content fresh' },
                        { type: 'do', text: 'Test all links before sharing' },
                        { type: 'do', text: 'Optimize for mobile (most traffic is mobile)' },
                        { type: 'dont', text: 'Too many links (5-8 is optimal)' },
                        { type: 'dont', text: 'Broken or outdated links' }
                    ]}
                />
            </BlogSection>

            {/* Monetization Ideas */}
            <BlogSection title="Monetization Ideas">
                <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-6">
                        <DollarSign className="h-8 w-8 text-purple-600" />
                        <h4 className="font-bold text-xl">Turn Your Bio Link into Revenue</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span>💰</span>
                            <span>Affiliate Links</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>📚</span>
                            <span>Digital Products</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🎓</span>
                            <span>Online Courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>👕</span>
                            <span>Merchandise</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🤝</span>
                            <span>Sponsored Content</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>💝</span>
                            <span>Donations/Tips</span>
                        </div>
                    </div>
                </div>
            </BlogSection>
        </BlogLayout>
    );
}
