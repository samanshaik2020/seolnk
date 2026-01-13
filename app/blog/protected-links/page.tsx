import { Metadata } from 'next';
import { Lock, Shield, Key, Users, FileText, Award } from 'lucide-react';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogSection, FeatureCard, BestPractices, ExampleBox } from '@/components/BlogComponents';

export const metadata: Metadata = {
    title: 'Protected Links Guide - Password-Protected URLs | SEOLnk',
    description: 'Secure your content with password-protected links. Share exclusive content and control access with Protected Links.',
};

export default function ProtectedLinksPage() {
    return (
        <BlogLayout
            title="Secure Your Content with Password Protection"
            subtitle="Control access to your content with simple yet effective password protection"
            badgeText="Protected Links"
            badgeIcon={<Lock className="h-4 w-4 text-green-600" />}
            gradientFrom="from-green-600"
            gradientTo="to-emerald-600"
            ctaText="Create Protected Link"
            ctaLink="/create/protected"
        >
            {/* What are Protected Links */}
            <BlogSection title="What are Protected Links?">
                <p className="text-lg leading-relaxed">
                    Protected Links are password-secured URLs that require authentication before granting access to the destination.
                    Share exclusive content, protect sensitive information, and control who can access your links -
                    all with a <strong>simple password layer</strong>.
                </p>
            </BlogSection>

            {/* Why Use */}
            <BlogSection title="Why Use Protected Links?">
                <div className="grid gap-6">
                    <FeatureCard
                        icon={<Shield className="h-6 w-6 text-blue-600" />}
                        title="Content Security"
                        description="Restrict access to authorized users only. Protect sensitive documents and files. Share private resources securely and control distribution."
                        gradient="from-blue-500/10 to-cyan-500/10"
                    />
                    <FeatureCard
                        icon={<Award className="h-6 w-6 text-purple-600" />}
                        title="Exclusivity & VIP Access"
                        description="Create members-only content. Provide early access to select groups. Build community with insider content and reward loyal customers."
                        gradient="from-purple-500/10 to-pink-500/10"
                    />
                    <FeatureCard
                        icon={<Key className="h-6 w-6 text-green-600" />}
                        title="Simple Access Control"
                        description="No complex login systems required. One password for easy sharing. Change or revoke access anytime with full tracking."
                        gradient="from-green-500/10 to-emerald-500/10"
                    />
                </div>
            </BlogSection>

            {/* Use Cases */}
            <BlogSection title="Use Cases">
                <div className="grid gap-4">
                    <ExampleBox title="💼 Business & Enterprise" variant="info">
                        <p className="text-sm text-muted-foreground">Internal documents, client deliverables, contracts, confidential reports</p>
                    </ExampleBox>

                    <ExampleBox title="🎨 Content Creators" variant="success">
                        <p className="text-sm text-muted-foreground">Premium content, early releases, bonus materials, member-only resources</p>
                    </ExampleBox>

                    <ExampleBox title="📚 Education" variant="warning">
                        <p className="text-sm text-muted-foreground">Student resources, exam materials, course content, research papers</p>
                    </ExampleBox>

                    <ExampleBox title="🎟️ Events & Webinars" variant="default">
                        <p className="text-sm text-muted-foreground">VIP event access, speaker resources, recording access, backstage passes</p>
                    </ExampleBox>
                </div>
            </BlogSection>

            {/* Password Protection Best Practices */}
            <BlogSection title="Password Security">
                <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-bold text-xl">Password Security Guidelines</h4>
                    </div>
                    <BestPractices
                        items={[
                            { type: 'do', text: 'Use strong, unique passwords' },
                            { type: 'do', text: 'Combine letters, numbers, symbols' },
                            { type: 'do', text: 'Minimum 8 characters recommended' },
                            { type: 'do', text: 'Change passwords periodically' },
                            { type: 'dont', text: 'Don\'t share publicly on social media' }
                        ]}
                    />
                </div>
            </BlogSection>

            {/* Distribution Strategy */}
            <BlogSection title="Distribution Strategies">
                <div className="grid gap-4">
                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">Two-Channel Method</h4>
                        <p className="text-sm text-muted-foreground mb-3">Send link and password through different channels for maximum security</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-mono bg-primary/10 px-2 py-1 rounded">1</span>
                                <span>Email: Send access link</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono bg-primary/10 px-2 py-1 rounded">2</span>
                                <span>SMS: Send password</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                        <h4 className="font-bold text-lg mb-3">Social + Email</h4>
                        <p className="text-sm text-muted-foreground mb-3">Public link, private password</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span>📱</span>
                                <span>Instagram/Twitter: Post public link</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>📧</span>
                                <span>Email Newsletter: Send password to subscribers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </BlogSection>

            {/* Real-World Example */}
            <BlogSection title="Real-World Example">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <h4 className="font-bold text-lg mb-4">Digital Product Sales</h4>
                    <div className="space-y-3 text-sm">
                        <div>
                            <div className="text-muted-foreground mb-1">Product</div>
                            <div className="font-mono">Premium Ebook</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground mb-1">Protected Link</div>
                            <div className="font-mono bg-background/50 px-3 py-2 rounded">seolnk.com/premium-ebook</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground mb-1">Password Distribution</div>
                            <div>Sent with purchase confirmation email</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground mb-1">Benefit</div>
                            <div className="font-medium text-green-600">✓ Prevents unauthorized sharing</div>
                        </div>
                    </div>
                </div>
            </BlogSection>
        </BlogLayout>
    );
}
