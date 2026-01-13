import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Link as LinkIcon, Repeat, Clock, Lock, Zap, User, Eye, BarChart3, Shield, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Features | SEOLnk - Advanced Link Management Platform',
    description: 'Discover all the powerful features of SEOLnk: custom previews, link rotation, password protection, analytics, and more.',
};

export default function FeaturesPage() {
    const features = [
        {
            icon: Eye,
            title: 'Custom Link Previews',
            description: 'Create stunning social media preview cards with custom titles, descriptions, and images. Control how your links appear on Facebook, Twitter, LinkedIn, and more.',
            color: 'from-blue-600 to-cyan-600',
            iconColor: 'text-blue-600'
        },
        {
            icon: Repeat,
            title: 'Smart Link Rotation',
            description: 'A/B test multiple destinations with a single link. Perfect for testing landing pages, comparing offers, or load balancing traffic across multiple URLs.',
            color: 'from-purple-600 to-pink-600',
            iconColor: 'text-purple-600'
        },
        {
            icon: Clock,
            title: 'Expiring Links',
            description: 'Set automatic expiration dates for time-sensitive content. Ideal for flash sales, limited offers, event registrations, and temporary access.',
            color: 'from-orange-600 to-red-600',
            iconColor: 'text-orange-600'
        },
        {
            icon: Lock,
            title: 'Password Protection',
            description: 'Secure your links with password protection. Share sensitive content safely with clients, team members, or exclusive communities.',
            color: 'from-green-600 to-emerald-600',
            iconColor: 'text-green-600'
        },
        {
            icon: Zap,
            title: 'Custom Branded Aliases',
            description: 'Create memorable, branded short links with custom aliases. Build trust and recognition with every link you share.',
            color: 'from-yellow-600 to-amber-600',
            iconColor: 'text-yellow-600'
        },
        {
            icon: User,
            title: 'Bio Link Pages',
            description: 'Build beautiful link-in-bio pages for Instagram, TikTok, and other social platforms. Showcase all your important links in one place.',
            color: 'from-indigo-600 to-violet-600',
            iconColor: 'text-indigo-600'
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Track clicks, geographic data, referral sources, and user behavior. Get detailed insights to optimize your marketing campaigns.',
            color: 'from-teal-600 to-cyan-600',
            iconColor: 'text-teal-600'
        },
        {
            icon: Globe,
            title: 'Campaign Management',
            description: 'Organize your links into campaigns and folders. Keep your link library structured and easy to manage at scale.',
            color: 'from-rose-600 to-pink-600',
            iconColor: 'text-rose-600'
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Built on secure infrastructure with encryption, authentication, and regular backups. Your data is safe with us.',
            color: 'from-slate-600 to-gray-600',
            iconColor: 'text-slate-600'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Button variant="ghost" asChild className="group">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/login">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary to-purple-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">Platform Features</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Everything You Need to Manage Links
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Powerful features designed to help you create, customize, protect, and track your links like never before.
                        </p>

                        <Button size="lg" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                            <Link href="/login" className="group">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                            fill="hsl(var(--background))"
                        />
                    </svg>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose SEOLnk */}
            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                            Why Choose SEOLnk?
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl bg-card border">
                                <h3 className="text-xl font-bold mb-2">🚀 Easy to Use</h3>
                                <p className="text-muted-foreground">
                                    Intuitive interface designed for both beginners and professionals. Create your first link in seconds.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border">
                                <h3 className="text-xl font-bold mb-2">⚡ Lightning Fast</h3>
                                <p className="text-muted-foreground">
                                    Built on modern infrastructure for instant link creation and blazing-fast redirects.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border">
                                <h3 className="text-xl font-bold mb-2">🔒 Secure & Reliable</h3>
                                <p className="text-muted-foreground">
                                    Enterprise-grade security with 99.9% uptime. Your links are always available.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border">
                                <h3 className="text-xl font-bold mb-2">📊 Data-Driven</h3>
                                <p className="text-muted-foreground">
                                    Comprehensive analytics help you understand your audience and optimize performance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                            Join thousands of creators and marketers managing their links with SEOLnk.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                                <Link href="/signup">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                                <Link href="/contact">
                                    Contact Sales
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
